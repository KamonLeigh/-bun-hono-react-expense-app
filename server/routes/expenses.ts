import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const expenses = new Hono();

const expenseSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
});

type Expense = z.infer<typeof expenseSchema>;

const createExpenseSchema = expenseSchema.omit({ id: true });

const fakeData: Expense[] = [
  {
    id: 1,
    title: "Groceries",
    amount: 85.75,
  },
  {
    id: 2,
    title: "Electricity Bill",
    amount: 120.5,
  },
  {
    id: 3,
    title: "Dinner",
    amount: 45.25,
  },
  {
    id: 4,
    title: "Movie Tickets",
    amount: 32.0,
  },
  {
    id: 5,
    title: "Gas",
    amount: 38.6,
  },
];
expenses
  .get("/", (c) => {
    return c.json({
      expenses: fakeData,
    });
  })
  .post("/", zValidator("json", createExpenseSchema), (c) => {
    const expense = c.req.valid("json");

    fakeData.push({ ...expense, id: fakeData.length + 1 });

    console.log({ expense });

    return c.json(expense);
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    console.log(id);

    const expense = fakeData.find((data) => data.id === id);

    if (!expense) {
      c.notFound();
    }

    return c.json({ expense });
  })
  .get("/total-spent", (c) => {
    const total = fakeData.reduce((sum, expense) => sum + expense.amount, 0);

    return c.json({
      total,
    });
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    console.log(id);

    const index = fakeData.findIndex((data) => data.id === id);

    if (index === -1) {
      c.notFound();
    }

    const deleteExpense = fakeData.splice(index, 1)[0];

    return c.json({
      expense: deleteExpense,
    });
  });

export default expenses;
