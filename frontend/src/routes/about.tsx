import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      {
        name: "description",
        content: "My App is a web application",
      },
      {
        title: "About -- Expense app",
      },
    ],
  }),
});

function About() {
  return <div className="p-2">Hello from About!</div>;
}
