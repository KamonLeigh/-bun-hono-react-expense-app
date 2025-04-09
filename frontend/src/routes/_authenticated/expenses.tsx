import { createFileRoute } from "@tanstack/react-router";
import {
  getAllExpenseQueryOptions,
  loadingCreateExpenseQueryOptions,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
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

// <Skeleton className="h-4 w-[200px]" />

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
    <div className="p-2 max-w-3xl m-auto">
      <Table>
        <TableCaption>A list of your Expense.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Date</TableHead>
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
                  </TableRow>
                ))
            : data?.expenses.map(({ id, title, amount, date }) => (
                <TableRow key={id}>
                  <TableCell className="font-medium">{id}</TableCell>
                  <TableCell>{title}</TableCell>
                  <TableCell>{amount}</TableCell>
                  <TableCell>{date.split("T")[0]}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
