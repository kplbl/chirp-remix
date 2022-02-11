import {
  Link,
  LoaderFunction,
  useLoaderData,
  ActionFunction,
  useActionData,
  Form,
} from "remix";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import { User, Comment } from "@prisma/client";
import { ChatIcon, HeartIcon, ShareIcon } from "@heroicons/react/outline";
import * as timeago from "timeago.js";
import { useState } from "react";

type LoaderData = {
  user: User | null;
  postListItems: Array<{
    id: string;
    title: string;
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

  const user = await getUser(request);

  const data: LoaderData = {
    postListItems,
    user,
  };
  return data;
};

export default function IndexRoute() {
  const [commentsOpen, setCommentsOpen] = useState("");

  const data = useLoaderData<LoaderData>();
  return (
    <main className="max-w-2xl">
      {data.postListItems.map((post) => (
        <article
          key={post.id}
          className="p-5 pl-1 md:p-5 border border-gray-200 last-of-type:border-b border-b-0   gap-5"
        >
          <div className="flex gap-5">
            <div
              className=" h-16 w-16 bg-slate-200 rounded-full overflow-clip"
              dangerouslySetInnerHTML={{
                __html: post.poster.avatarSVG || "",
              }}
            ></div>

            <div className="flex flex-1 flex-col">
              <Link to={`/posts/${post.id}`}>
                {post.title && post.title}{" "}
                <span className="text-slate-600  text-sm">
                  @{post.poster.username} {timeago.format(post.createdAt)}
                </span>
              </Link>
              <div>{post.content}</div>
              <div className="flex justify-between mt-5 px-8">
                <button type="button" className="flex gap-2">
                  <ChatIcon
                    className="h-6 w-6"
                    onClick={() =>
                      setCommentsOpen((prevState) =>
                        prevState === post.id ? "" : post.id
                      )
                    }
                  />
                  {post.comments.length > 0 && post.comments.length}
                </button>

                <form action="/likes" method="post">
                  <input
                    type="text"
                    name="id"
                    value={post.id}
                    readOnly
                    hidden
                  />
                  <button type="submit" className="flex gap-2">
                    <HeartIcon className="h-6 w-6" />
                    {post.likedBy.length > 0 && post.likedBy.length}
                  </button>
                </form>

                <ShareIcon className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className={` ${commentsOpen !== post.id && "hidden"} ml-20 `}>
            <form
              method="post"
              action="/comments/new"
              className="flex gap-3 my-2"
            >
              <input type="text" name="id" value={post.id} readOnly hidden />
              <textarea
                name="content"
                className="border border-gray-300 p-1 flex-1"
              />
              <div className="flex flex-col justify-end">
                <button
                  type="submit"
                  className="py-2 px-4 border object-bottom  rounded shadow-sm  border-blue-200 hover:bg-blue-500 bg-blue-400 text-blue-50"
                >
                  Comment
                </button>
              </div>
            </form>
          </div>
          <div className="ml-5">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex my-3 gap-4">
                <div
                  className=" h-12 w-12 bg-slate-200 rounded-full overflow-clip"
                  dangerouslySetInnerHTML={{
                    __html: comment.poster.avatarSVG || "",
                  }}
                ></div>
                <div>
                  <div className="text-sm font-light">
                    @{comment.poster.username}{" "}
                    {timeago.format(comment.createdAt)}
                  </div>
                  <div>{comment.content}</div>
                </div>
              </div>
            ))}
          </div>
        </article>
      ))}
    </main>
  );
}
