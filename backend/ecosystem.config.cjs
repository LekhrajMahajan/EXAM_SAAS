module.exports = {
  apps: [
    {
      name: "examguard-backend",
      script: "./dist/server.js",
      instances: "max", // Use all available CPUs
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
