import { z } from "zod";
import { insertExpenseSchema } from "./db/schemas/expenses";

export const createExpenseSchema = insertExpenseSchema.omit({
  id: true,
  userId: true,
  created_at: true,
});
export type Expense = z.infer<typeof createExpenseSchema>;
