import {
  numeric,
  pgTable,
  text,
  index,
  uuid,
  timestamp,
  date,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const expenses = pgTable(
  "expenses",
  {
    id: uuid("id")
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    amount: numeric("amount", {
      precision: 12,
      scale: 2,
    }).notNull(),
    date: date("date").notNull(),
    created_at: timestamp().defaultNow().notNull(),
  },
  (expense) => [index("name_inx").on(expense.userId)],
);

export const createExpenseSchema = createSelectSchema(expenses);
export const insertExpenseSchema = createInsertSchema(expenses, {
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  amount: z.string().regex(/^[0-9]+(\.[0-9]{1,2})?$/, {
    message: "Amount must be a valid monetary value",
  }),
  date: z.string(),
});
