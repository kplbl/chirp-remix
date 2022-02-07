import { Link, LoaderFunction, useLoaderData, Outlet } from "remix";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import { User } from "@prisma/client";

type LoaderData = {
  user: User | null;
  postListItems: Array<{
    id: string;
    title: string;
    content: string;
    poster: User;
  }>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const postListItems = await db.post.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, content: true, poster: true },
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
    <>
      <main className="max-w-2xl">
        {data.postListItems.map((post) => (
          <div
            className="p-5 border border-gray-200 last-of-type:border-b border-b-0"
            key={post.id}
          >
            <Link to={`/posts/${post.id}`}>
              {post.title} @{post.poster.username}
            </Link>
            <div>{post.content}</div>
            <div className="flex justify-evenly mt-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </div>
          </div>
        ))}
      </main>
    </>
  );
}
