import "./App.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getTotalSpent() {
  const res = await api.expenses["total-spent"].$get();

  if (!res.ok) {
    throw new Error("Server not ok");
  }

  return res.json();
}
function App() {
  const { data, isPending, error } = useQuery({
    queryKey: ["get-total-spent"],
    queryFn: getTotalSpent,
  });

  if (error) {
    return "An error has occured " + error.message;
  }

  return (
    <>
      <Card className="w-[350px] m-auto">
        <CardHeader>
          <CardTitle>Total Spend</CardTitle>
          <CardDescription>The total amount you've spent</CardDescription>
        </CardHeader>
        <CardContent> {isPending ? "...." : data.total}</CardContent>
      </Card>
    </>
  );
}

export default App;
