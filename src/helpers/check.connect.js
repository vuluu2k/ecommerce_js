"use strict";

const mongoose = require("mongoose");
const os = require("os");
const _SECONDS = 50000;

const countConnect = () => {
  const numConnection = mongoose.connections.length;

  console.log(`Number of connections: ${numConnection}`);
};

const checkOverloadConnect = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss / 1024 / 1024;
    const maxConnections = numCores * 5;

    console.log("Active number of connections: ", numConnection);
    console.log("Memory usage: ", memoryUsage, "MB");

    if (numConnection > maxConnections) {
      console.log(
        `Connection overload. Number of connections: ${numConnection}. Max connections: ${maxConnections}. Memory usage: ${memoryUsage}MB`
      );
    }
  }, _SECONDS);
};

module.exports = {
  countConnect,
  checkOverloadConnect,
};
