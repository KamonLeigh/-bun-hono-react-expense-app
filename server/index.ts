import app from "./app";

const server = Bun.serve({
  fetch: app.fetch,
});

console.log("Server running!", server.port);
