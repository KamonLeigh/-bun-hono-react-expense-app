import {
  createRootRouteWithContext,
  Link,
  Outlet,
  HeadContent,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";

import { type QueryClient } from "@tanstack/react-query";

interface myRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<myRouterContext>()({
  component: Root,
  head: () => ({
    meta: [
      {
        name: "description",
        content: "My App is a web application",
      },
      {
        title: "Home -- Expense app",
      },
    ],
  }),
});

function NavBar() {
  return (
    <div className="p-2 flex justify-between m-auto max-w-2xl items-baseline">
      <Link to="/" className="[&.active]:font-bold">
        <h1 className="text-2xl font-bold">Expense Traker</h1>{" "}
      </Link>
      <nav className="flex gap-2">
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        <Link to="/expenses" className="[&.active]:font-bold">
          Expenses
        </Link>
        <Link to="/create-expense" className="[&.active]:font-bold">
          Create
        </Link>
        <Link to="/profile" className="[&.active]:font-bold">
          Profile
        </Link>
      </nav>
    </div>
  );
}

function Root() {
  return (
    <>
      <HeadContent />
      <NavBar />
      <hr />

      <div className="p-2 gap-2 max-w-5xl m-auto">
        <Outlet />
      </div>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
      <TanStackRouterDevtools />
    </>
  );
}
