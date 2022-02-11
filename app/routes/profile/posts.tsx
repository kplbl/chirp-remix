import { LoaderFunction, redirect } from "remix";
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

export default function ProfilePostsRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <main className="">
      {data.postListItems ? (
        <div className="flex flex-col">
          {data.postListItems.map((post) => (
            <div
              key={post.id}
              className="flex p-5 pl-1 md:p-5 border border-gray-200 last-of-type:border-b border-b-0   gap-5"
            >
              <div className="flex-1">
                <div className="border-b border-gray-200 font-bold">
                  {post.title}
                </div>
                <div>{post.content}</div>
                <div className="mt-3 font-light">
                  created {timeago.format(post.createdAt)}
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <form action="/posts/delete" method="post">
                  <button type="submit">
                    <input
                      type="text"
                      name="id"
                      value={post.id}
                      hidden
                      readOnly
                    />
                    <TrashIcon className="w-10 h-10 hover:text-red-600 mx-4" />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>User has no posts</div>
      )}
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
