import type { LoaderFunction } from "remix";
import { useLoaderData, Link, useCatch } from "remix";
import type { User } from "@prisma/client";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

type LoaderData = {
  user: User | null;
  postListItems: Array<{
    id: string;
    title: string;
    content: string;
    poster: User;
    createdAt: Date;
  }>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }
  const postListItems = await db.post.findMany({
    where: { id: user?.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      content: true,
      poster: true,
      createdAt: true,
    },
  });

  const data: LoaderData = {
    postListItems,
    user,
  };
  return data;
};

export default function ProfileRoute() {
  const data = useLoaderData();
  return (
    <main>
      <h1>{data.user.username}</h1>
    </main>
  );
}

export function ErrorBoundary() {
  return (
    <div className="error-container">
      Something unexpected went wrong. Sorry about that.
    </div>
  );
}
