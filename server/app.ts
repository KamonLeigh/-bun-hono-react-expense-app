import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import expenses from "./routes/expenses";
const app = new Hono();

app.use("/*", logger());

const apiRoutes = app.basePath("/api").route("/expenses", expenses);
app.get("*", serveStatic({ root: "./frontend/dist" }));
// app.use("/favicon.ico", serveStatic({ path: "./favicon.ico" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

export type ApiRoutes = typeof apiRoutes;

export default app;
