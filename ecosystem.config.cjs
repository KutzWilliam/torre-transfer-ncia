module.exports = {
  apps: [
    {
      name: "transferencia",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        PORT: 3001,
      },
    },
  ],
};