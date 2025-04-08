import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useQueryClient } from "@tanstack/react-query";
import api, { getAllExpenseQueryOptions } from "@/lib/api";

import { createExpenseSchema } from "@server/types";

export const Route = createFileRoute("/_authenticated/create-expense")({
  component: CreateExpense,
});

function CreateExpense() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      title: "",
      amount: "0",
      date: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      const res = await api.expenses.$post({ json: value });

      if (!res.ok) {
        throw new Error("Error in creating expense");
      }

      const newExpense = await res.json();

      queryClient.setQueryData(
        getAllExpenseQueryOptions.queryKey,
        (oldData) => {
          if (!oldData) {
            queryClient.fetchQuery(getAllExpenseQueryOptions).catch((error) => {
              console.error("Failed to fetch expenses:", error);
            });

            return { expenses: [newExpense] };
          }

          return {
            ...oldData,
            expenses: [newExpense, ...oldData.expenses],
          };
        },
      );

      navigate({ to: "/expenses" });
    },
  });
  return (
    <div className="p-2">
      <form
        className="flex flex-col max-w-xl m-auto"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <h2 className="mb-4">Create Expense</h2>
        <form.Field
          name="title"
          validators={{
            onChange: createExpenseSchema.shape.title,
          }}
        >
          {(field) => {
            return (
              <div className="mb-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  className="mt-2"
                  type="text"
                  id="title"
                  placeholder="Title"
                  name="title"
                  onBlur={field.handleBlur}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error as unknown as string}>{error?.message}</p>
                ))}
              </div>
            );
          }}
        </form.Field>
        <form.Field
          name="amount"
          validators={{
            onChange: createExpenseSchema.shape.amount,
          }}
        >
          {(field) => {
            return (
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  className="mt-2"
                  type="number"
                  id="amount"
                  placeholder="Amount"
                  name="amount"
                  onBlur={field.handleBlur}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error as unknown as string}>{error?.message}</p>
                ))}
              </div>
            );
          }}
        </form.Field>
        <form.Field
          name="date"
          validators={{
            onChange: createExpenseSchema.shape.date,
          }}
        >
          {(field) => {
            return (
              <div className="mt-4 self-center">
                <Calendar
                  mode="single"
                  selected={new Date(field.state.value)}
                  onSelect={(date) =>
                    field.handleChange((date ?? new Date()).toISOString())
                  }
                  className="rounded-md border"
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error as unknown as string}>{error?.message}</p>
                ))}
              </div>
            );
          }}
        </form.Field>
        <form.Subscribe
          selector={(state) => [
            state.canSubmit,
            state.isValidating,
            state.isSubmitting,
          ]}
          children={([canSubmit, isValidating, isSubmitting]) => (
            <Button
              onClick={form.handleSubmit}
              disabled={!canSubmit || isValidating}
              className="mt-4 self-start "
            >
              {isSubmitting ? "...." : "Create Expense"}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
