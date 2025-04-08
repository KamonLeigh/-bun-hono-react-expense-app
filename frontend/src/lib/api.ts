import type { ApiRoutes } from "@server/app";
import { queryOptions } from "@tanstack/react-query";
import { hc } from "hono/client";
const client = hc<ApiRoutes>("/");

const api = client.api;

async function getUser() {
  const res = await api.me.$get();

  if (!res.ok) {
    throw new Error("Server not ok");
  }

  return res.json();
}

export const userQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getUser,
  staleTime: Infinity,
});

export async function getExpenseList() {
  const res = await api.expenses.$get();

  if (!res.ok) {
    throw new Error("Server not ok");
  }

  return res.json();
}

export const getAllExpenseQueryOptions = queryOptions({
  queryKey: ["get-expense-list"],
  queryFn: getExpenseList,
  staleTime: 1000 * 60 * 3,
});

export default api;
