import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
// import type { FieldApi } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import api from "@/lib/api";
export const Route = createFileRoute("/_authenticated/create-expense")({
  component: CreateExpense,
});

function CreateExpense() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      title: "",
      amount: 0,
    },
    onSubmit: async ({ value }) => {
      console.log(value);

      const res = await api.expenses.$post({ json: value });

      if (!res.ok) {
        throw new Error("Error in creating expense");
      }

      navigate({ to: "/expenses" });
    },
  });
  return (
    <div className="p-2">
      <form
        className="max-w-xl m-auto"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <h2>Create Expense</h2>

        <form.Field name="title">
          {(field) => {
            return (
              <>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  id="title"
                  placeholder="Title"
                  name="title"
                  onBlur={field.handleBlur}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error as unknown as string}>{error}</p>
                ))}
              </>
            );
          }}
        </form.Field>
        <form.Field name="amount">
          {(field) => {
            return (
              <>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  type="number"
                  id="amount"
                  placeholder="Amount"
                  name="amount"
                  onBlur={field.handleBlur}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error as unknown as string}>{error}</p>
                ))}
              </>
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
              className="mt-4"
            >
              {isSubmitting ? "...." : "Create Expense"}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
