import { createFileRoute } from "@tanstack/react-router";
import api from "@/lib/api";
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

export const Route = createFileRoute("/expenses")({
  component: Expenses,
});

async function getExpenseList() {
  const res = await api.expenses.$get();

  if (!res.ok) {
    throw new Error("Server not ok");
  }

  return res.json();
}

function Expenses() {
  const { data, isPending, error } = useQuery({
    queryKey: ["get-expense-list"],
    queryFn: getExpenseList,
  });

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
          </TableRow>
        </TableHeader>
        <TableBody>
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
                  </TableRow>
                ))
            : data?.expenses.map(({ id, title, amount }) => (
                <TableRow>
                  <TableCell className="font-medium">{id}</TableCell>
                  <TableCell>{title}</TableCell>
                  <TableCell>{amount}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
