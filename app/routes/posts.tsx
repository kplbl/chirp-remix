import { Outlet, LoaderFunction, useLoaderData, Link } from "remix";
import type { Post } from "@prisma/client";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import { User } from "@prisma/client";

type LoaderData = {
  user: User | null;
  postListItems: Array<{ id: string; title: string }>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const postListItems = await db.post.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true },
  });
  const user = await getUser(request);

  const data: LoaderData = {
    postListItems,
    user,
  };
  return data;
};

export default function PostsRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <div className="">
      
    </div>
  );
}
