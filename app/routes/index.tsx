import { Link, LoaderFunction, useLoaderData, Outlet } from "remix";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import { User, Like } from "@prisma/client";
import Post from "../components/Post";

type LoaderData = {
  user: User | null;
  postListItems: Array<{
    id: string;
    title: string;
    content: string;
    poster: User;
    createdAt: Date;
    likes: Like[];
  }>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const postListItems = await db.post.findMany({
    take: 15,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      content: true,
      poster: true,
      createdAt: true,
      likes: true,
    },
  });

  const user = await getUser(request);

  const data: LoaderData = {
    postListItems,
    user,
  };
  return data;
};

export default function IndexRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <main className="max-w-2xl">
      {data.postListItems.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </main>
  );
}
