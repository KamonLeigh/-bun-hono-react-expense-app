import { createFileRoute } from "@tanstack/react-router";
import {
  getAllExpenseQueryOptions,
  loadingCreateExpenseQueryOptions,
  deleteExpense,
} from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/expenses")({
  component: Expenses,
  head: () => ({
    meta: [
      {
        title: "List Expenses -- Expense app",
      },
    ],
  }),
});

function Expenses() {
  const { data, isPending, error } = useQuery(getAllExpenseQueryOptions);
  const { data: loadingExpense } = useQuery(loadingCreateExpenseQueryOptions);

  if (error) {
    return "An error has occured " + error.message;
  }
  return (
    <div className="p-2 max-w-7xl m-auto">
      <Table>
        <TableCaption>A list of your Expense.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loadingExpense?.expense && (
            <TableRow>
              <TableCell className="font-medium">
                {" "}
                <Skeleton className="h-4 w-[200px]" />
              </TableCell>
              <TableCell>{loadingExpense?.expense?.title}</TableCell>
              <TableCell>{loadingExpense?.expense?.amount}</TableCell>
              <TableCell>
                {loadingExpense?.expense?.date.split("T")[0]}
              </TableCell>
              <TableCell className="font-medium">
                {" "}
                <Skeleton className="h-4 w-[200px]" />
              </TableCell>
            </TableRow>
          )}
          {isPending
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      <Skeleton className="h-4 w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[200px]" />
                    </TableCell>
                  </TableRow>
                ))
            : data?.expenses.map(({ id, title, amount, date }) => (
                <TableRow key={id}>
                  <TableCell className="font-medium">{id}</TableCell>
                  <TableCell>{title}</TableCell>
                  <TableCell>{amount}</TableCell>
                  <TableCell>{date.split("T")[0]}</TableCell>
                  <TableCell>
                    <ExpenseButtonDelete id={id} />
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ExpenseButtonDelete({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      toast("Expense deleted", {
        description: `The expense has been successfully deleted. ${id}`,
      });

      queryClient.setQueryData(
        getAllExpenseQueryOptions.queryKey,
        (oldData) => {
          if (!oldData) return oldData;

          const expenses = oldData.expenses.filter((list) => list.id !== id);

          return {
            ...oldData,
            expenses,
          };
        },
      );
    },
    onError: () => {
      toast("Error", {
        description: `Error deleting expense. ${id}`,
      });
    },
  });

  return (
    <Button
      disabled={mutation.isPending}
      onClick={() => mutation.mutate({ id })}
      variant="outline"
      size="icon"
    >
      {mutation.isPending ? "...." : <Trash className="h-4 w-4" />}
    </Button>
  );
}
