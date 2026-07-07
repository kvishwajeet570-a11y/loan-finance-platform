// src/metrics/metrics.ts

import client from "prom-client";

const register = new client.Registry();

client.collectDefaultMetrics({
  register,
});

export const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP Requests",
  labelNames: ["method", "route", "statusCode"],
});

export const loanApplicationCounter = new client.Counter({
  name: "loan_applications_total",
  help: "Total Loan Applications",
  labelNames: ["loanType"],
});

export const activeUsersGauge = new client.Gauge({
  name: "active_users",
  help: "Current Active Users",
});

register.registerMetric(httpRequestCounter);
register.registerMetric(loanApplicationCounter);
register.registerMetric(activeUsersGauge);

export { register };