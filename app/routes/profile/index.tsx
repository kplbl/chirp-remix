import { LoaderFunction, Outlet, redirect } from "remix";
import { useLoaderData, Link, useCatch } from "remix";
import type { User } from "@prisma/client";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import { TrashIcon } from "@heroicons/react/outline";
import * as timeago from "timeago.js";

type LoaderData = {
  user: User | null;
  postListItems: Array<{
    id: string;
    title: string;
    content: string;
    createdAt: Date;
  }> | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (!user) {
    throw new Response("Not logged in", { status: 401 });
  }
  const postListItems = await db.post.findMany({
    where: { posterId: user?.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      content: true,

      createdAt: true,
    },
  });

  const data: LoaderData = {
    user,
    postListItems,
  };
  return data;
};

export default function ProfileRoute() {
  const data = useLoaderData<LoaderData>();

  return <></>;
}

export function ErrorBoundary() {
  return (
    <div className="error-container">
      Something unexpected went wrong. Sorry about that.
    </div>
  );
}
