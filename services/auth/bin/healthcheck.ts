#!/usr/bin/env node

const http = require("http");

const port = process.env.PORT || "3000";
const options = {
  host: "localhost",
  port: port,
  timeout: 2000,
  path: "/health",
};

const request = http.request(options, (res) => {
  if (res.statusCode == 200) {
    console.log("Healthcheck passed");
    process.exit(0);
  } else {
    console.log("Healthcheck failed: status code", res.statusCode);
    process.exit(1);
  }
});

request.on("error", function (err) {
  console.log("Healthcheck failed: error", err);
  process.exit(1);
});

request.end();
