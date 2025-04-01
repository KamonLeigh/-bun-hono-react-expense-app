import type { ApiRoutes } from "@server/app";
import { hc } from "hono/client";

const client = hc<ApiRoutes>("/");

const api = client.api;

export default api;
