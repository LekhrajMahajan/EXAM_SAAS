import express from "express";
import app from "./backend/src/app";
import fs from "fs";

function extractRoutes(appInstance: express.Express) {
  const routes: any[] = [];

  function processMiddleware(middleware: any, prefix = "") {
    if (middleware.route) {
      // It's a route
      const methods = Object.keys(middleware.route.methods)
        .filter((m) => m !== "_all")
        .map((m) => m.toUpperCase());
      routes.push({
        path: prefix + middleware.route.path,
        methods,
      });
    } else if (middleware.name === "router" && middleware.handle.stack) {
      // It's a router
      let routerPrefix = prefix;
      if (middleware.regexp) {
        // Try to extract the prefix from regexp
        // e.g. /^\/api\/v1\/auth\/?(?=\/|$)/i
        let match = middleware.regexp
          .toString()
          .match(/^\/\^\\(.*?)\\\/\?\(\?\=\\\/\|\$\)\/i/);
        if (match) {
          routerPrefix = prefix + "/" + match[1].replace(/\\/g, "");
        } else {
          // Fallback for fast_slash etc
          let str = middleware.regexp.toString();
          // Try to un-escape the regexp
          str = str
            .replace(/^\/\^/, "")
            .replace(/\\\/\?\(\?\=\\\/\|\$\)\/i$/, "")
            .replace(/\\/g, "");
          if (str && str !== "/") {
            if (str.startsWith("/")) {
              routerPrefix = prefix + str;
            } else {
              routerPrefix = prefix + "/" + str;
            }
          }
        }
      }

      middleware.handle.stack.forEach((handler: any) => {
        processMiddleware(handler, routerPrefix);
      });
    }
  }

  const actualApp = (appInstance as any).default || appInstance;
  const router = actualApp._router || actualApp.router;

  if (router && router.stack) {
    router.stack.forEach((middleware: any) => {
      processMiddleware(middleware, "");
    });
  } else {
    console.error("Could not find express router stack.");
  }

  return routes;
}

const routes = extractRoutes(app);

const swaggerDoc = {
  openapi: "3.0.0",
  info: {
    title: "Exam SaaS API",
    version: "1.0.0",
  },
  paths: {} as any,
};

routes.forEach((route) => {
  // Fix double slashes and trailing slashes
  let formattedPath = route.path.replace(/\/\//g, "/");
  if (formattedPath.endsWith("/") && formattedPath.length > 1) {
    formattedPath = formattedPath.slice(0, -1);
  }

  // Convert express params :id to swagger {id}
  formattedPath = formattedPath.replace(/:([a-zA-Z0-9_]+)/g, "{$1}");

  if (!swaggerDoc.paths[formattedPath]) {
    swaggerDoc.paths[formattedPath] = {};
  }

  route.methods.forEach((method: string) => {
    const m = method.toLowerCase();

    // Default structure for each endpoint
    swaggerDoc.paths[formattedPath][m] = {
      summary: `${method} ${formattedPath}`,
      tags: [formattedPath.split("/")[3] || "general"],
      parameters: [],
      responses: {
        "200": {
          description: "Success",
        },
      },
    };

    // Add path parameters
    const matches = formattedPath.match(/\{([a-zA-Z0-9_]+)\}/g);
    if (matches) {
      matches.forEach((match) => {
        const paramName = match.replace(/[{}]/g, "");
        swaggerDoc.paths[formattedPath][m].parameters.push({
          name: paramName,
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        });
      });
    }

    // Add generic body for POST/PUT/PATCH
    if (["post", "put", "patch"].includes(m)) {
      swaggerDoc.paths[formattedPath][m].requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              additionalProperties: true,
              example: {
                // Generic example data
                key: "value",
              },
            },
          },
        },
      };
    }
  });
});

fs.writeFileSync("swagger-output.json", JSON.stringify(swaggerDoc, null, 2));
console.log("Swagger output generated at swagger-output.json");
