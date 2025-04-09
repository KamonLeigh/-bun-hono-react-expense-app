import { createFileRoute } from "@tanstack/react-router";
import { userQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
  head: () => ({
    meta: [
      {
        title: "Profile -- Expence app",
      },
    ],
  }),
});

function Profile() {
  const { data, isPending, error } = useQuery(userQueryOptions);

  if (isPending) return "loading";

  if (error) return "not logged in";
  return (
    <div className="p-2">
      <div className="flex flex-col items-center gap-2">
        <Avatar>
          {data.user.picture && (
            <AvatarImage src={data.user.picture} alt={data.user.given_name} />
          )}
          <AvatarFallback>{data.user.given_name}</AvatarFallback>
        </Avatar>
        <p>
          Hello {data.user.given_name} {data.user.family_name}
        </p>
        <Button asChild className="my-4">
          <a href="/api/logout">Logout</a>
        </Button>
      </div>
    </div>
  );
}
