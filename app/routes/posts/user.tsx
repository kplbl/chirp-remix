import { LoaderFunction, redirect } from "remix";
import { useLoaderData, Link, useCatch } from "remix";
import type { User } from "@prisma/client";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import Post from "../../components/Post";

type LoaderData = {
  user: User | null;
  postListItems: Array<{
    id: string;
    content: string;
    poster: User;
    createdAt: Date;
    likedBy: User[];

    comments: Array<{
      id: string;
      content: string;
      poster: User;
      createdAt: Date;
    }>;
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
      content: true,
      poster: true,
      createdAt: true,
      likedBy: true,
      comments: {
        select: {
          id: true,
          content: true,
          poster: true,
          createdAt: true,
        },
      },
    },
  });

  const data: LoaderData = {
    user,
    postListItems,
  };
  return data;
};

export default function PostsUserRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <main className="max-w-2xl flex-grow">
      {data?.postListItems?.map((post) => (
        <Post key={post.id} post={post} user={data.user} />
      ))}
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
