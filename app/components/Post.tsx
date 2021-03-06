import React from "react";
import {
  ChatIcon,
  HeartIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import * as timeago from "timeago.js";
import { useState } from "react";
import { User } from "@prisma/client";
import { Link } from "remix";
import Comment from "./Comment";

type PostProps = {
  post: {
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
  };
  user: User | null;
};

function Post({ post, user }: PostProps) {
  const [commentsOpen, setCommentsOpen] = useState("");
  return (
    <article
      key={post.id}
      className="p-5 pl-1 md:p-5 border border-gray-200 last-of-type:border-b border-b-0 gap-5"
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
            <span className="text-slate-600  text-sm">
              @{post.poster.username} {timeago.format(post.createdAt)}
            </span>
          </Link>
          <div>{post.content}</div>
          <div className="flex justify-between mt-5 px-8 py-2 border-b border-b-gray-200 border-t border-t-gray-200">
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
              <input type="text" name="id" value={post.id} readOnly hidden />
              <button type="submit" className="flex gap-2">
                <HeartIcon
                  className={`h-6 w-6 ${
                    post.likedBy.find((like) => like.id === user?.id) &&
                    "text-red-500"
                  }`}
                />
                {post.likedBy.length > 0 && post.likedBy.length}
              </button>
            </form>

            <ShareIcon className="h-6 w-6" />
            {post.poster.id === user?.id && (
              <form action="/posts/delete" method="post">
                <input type="text" name="id" value={post.id} readOnly hidden />
                <button type="submit" className="flex gap-2">
                  <TrashIcon className="h-6 w-6 hover:text-red-500" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className={` ${commentsOpen !== post.id && "hidden"} ml-20 `}>
        <form method="post" action="/comments/new" className="flex gap-3 my-2">
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
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </article>
  );
}

export default Post;
