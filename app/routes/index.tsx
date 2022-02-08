import { Link, LoaderFunction, useLoaderData, Outlet } from "remix";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import { User } from "@prisma/client";
import { ChatIcon, HeartIcon, ShareIcon } from "@heroicons/react/outline";
import * as timeago from "timeago.js";

type LoaderData = {
  user: User | null;
  postListItems: Array<{
    id: string;
    title: string;
    content: string;
    poster: User;
    createdAt: Date;
    likedBy: User[];
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
      likedBy: true,
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
        <article
          key={post.id}
          className="p-5 border border-gray-200 last-of-type:border-b border-b-0 flex gap-5"
        >
          <div
            className=" h-16 w-16 bg-slate-200 rounded-full overflow-clip"
            dangerouslySetInnerHTML={{
              __html: post.poster.avatarSVG || "",
            }}
          ></div>

          <div className="flex flex-col flex-1">
            <Link to={`/posts/${post.id}`}>
              {post.title}{" "}
              <span className="text-slate-600  text-sm">
                @{post.poster.username} {timeago.format(post.createdAt)}
              </span>
            </Link>
            <div>{post.content}</div>
            <div className="flex justify-between mt-5 px-8">
              <ChatIcon className="h-6 w-6" />

              <form action="/likes" method="post">
                <input type="text" name="id" value={post.id} readOnly hidden />
                <button type="submit" className="flex gap-2">
                  <HeartIcon className="h-6 w-6" />
                  {post.likedBy.length > 0 && post.likedBy.length}
                </button>
              </form>

              <ShareIcon className="h-6 w-6" />
            </div>
          </div>
        </article>
      ))}
    </main>
  );
}
