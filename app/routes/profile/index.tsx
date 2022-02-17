import { LoaderFunction, Outlet, redirect } from "remix";
import { useLoaderData, Link, useCatch } from "remix";
import type { User } from "@prisma/client";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

import * as timeago from "timeago.js";

type LoaderData = {
  user: User | null;
  postCount: Number | null;
  commentCount: Number | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (!user) {
    throw new Response("Not logged in", { status: 401 });
  }
  const postCount = await db.post.count({
    where: { posterId: user?.id },
  });

  const commentCount = await db.post.count({
    where: { posterId: user?.id },
  });

  const data: LoaderData = {
    user,
    postCount,
    commentCount,
  };
  return data;
};

export default function ProfileRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <main className="flex flex-col p-5 gap-5 max-w-2xl">
      <div className="flex gap-5">
        <div
          className=" h-16 w-16 bg-slate-200 rounded-full overflow-clip"
          dangerouslySetInnerHTML={{
            __html: data.user?.avatarSVG || "",
          }}
        ></div>
        <div className="text-xl my-auto">@{data.user?.username}</div>
      </div>

      <div>Profile created {timeago.format(data.user?.createdAt as Date)}</div>
      <div className="flex justify-between">
        <Link to="/posts/user">{data.postCount} posts</Link>
        <Link to="/comments">{data.commentCount} comments</Link>
      </div>
      <Outlet />
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
