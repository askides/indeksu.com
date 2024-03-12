module.exports = {
  apps: [
    {
      name: "Remix App",
      script: "npm run start",
      out_file: "./.logs/remix.access.log",
      error_file: "./.logs/remix.error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: false,
    },
    {
      name: "Sites Queue Worker",
      script: "npm run start:worker:sites",
      out_file: "./.logs/sites.access.log",
      error_file: "./.logs/sites.error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: false,
    },
    {
      name: "Sites Urls Worker",
      script: "npm run start:worker:urls",
      out_file: "./.logs/urls.access.log",
      error_file: "./.logs/urls.error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: false,
    },
  ],
};
