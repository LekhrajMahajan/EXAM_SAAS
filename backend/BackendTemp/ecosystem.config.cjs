module.exports = {
  apps: [
    {
      name: "examguard-backend",
      script: "./dist/server.js",
      instances: 1, // Use 1 instance to avoid OOM on Render
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
