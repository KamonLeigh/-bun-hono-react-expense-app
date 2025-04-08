import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, sum } from "drizzle-orm";
import { getUser } from "../kind";
import { db } from "../db";
import {
  expenses as expensesTable,
  insertExpenseSchema,
} from "../db/schemas/expenses";

import { type Expense, createExpenseSchema } from "../types";

const expenses = new Hono()
  .get("/", getUser, async (c) => {
    const user = c.var.user;

    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .orderBy(desc(expensesTable.created_at))
      .limit(100);
    return c.json({
      expenses,
    });
  })
  .post("/", getUser, zValidator("json", createExpenseSchema), async (c) => {
    const data = c.req.valid("json");
    const user = c.var.user;
    const expense = { ...data, userId: user.id };

    const validatedExpense = insertExpenseSchema.parse(expense);
    const result = await db
      .insert(expensesTable)
      .values(validatedExpense)
      .returning()
      .then((res) => res[0]);

    c.status(201);
    return c.json(result);
  })
  .get("/total-spent", getUser, async (c) => {
    const user = c.var.user;

    const total = await db
      .select({ total: sum(expensesTable.amount) })
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .limit(1)
      .then((res) => res[0]?.total ?? "0.00");

    return c.json({
      total: total.toString(),
    });
  })
  .get("/:id", getUser, async (c) => {
    const id = c.req.param("id");
    const user = c.var.user;

    const expense = await db
      .select()
      .from(expensesTable)
      .where(and(eq(expensesTable.id, id), eq(expensesTable.userId, user.id)))
      .then((res) => res[0]);

    if (!expense) {
      c.notFound();
    }

    return c.json({
      expense,
    });
  })
  .delete(":/id", getUser, async (c) => {
    const id = c.req.param("id");
    const user = c.var.user;

    const expense = await db
      .delete(expensesTable)
      .where(
        and(eq(expensesTable.id, id as any), eq(expensesTable.userId, user.id)),
      )
      .returning()
      .then((res) => res[0]);

    if (!expense) {
      c.notFound();
    }

    return c.json({
      expense,
    });
  });

export default expenses;
