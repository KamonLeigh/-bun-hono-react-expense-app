import type { ApiRoutes } from "@server/app";
import { Expense } from "@server/types";
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

export async function createExpense(value: Expense) {
  const res = await api.expenses.$post({ json: value });

  if (!res.ok) {
    throw new Error("Error in creating expense");
  }

  const expense = await res.json();

  return expense;
}

export const loadingCreateExpenseQueryOptions = queryOptions<{
  expense?: Expense;
}>({
  queryKey: ["loading-create-expense"],
  queryFn: async () => {
    return {};
  },
  staleTime: Infinity,
});

export async function deleteExpense({ id }: { id: string }) {
  const res = await api.expenses[":id"].$delete({
    param: {
      id,
    },
  });

  if (!res.ok) {
    throw new Error("Error in deleting expense");
  }

  const result = await res.json();

  return result;
}

export default api;
