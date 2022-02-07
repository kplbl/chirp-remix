import { useState } from "react";
import { User } from "@prisma/client";
import * as timeago from "timeago.js";
import { Link } from "remix";
import { ChatIcon, HeartIcon, ShareIcon } from "@heroicons/react/outline";

interface CommentProps {
  id: string;
  title: string;
  content: string;
  poster: User;
  createdAt: Date;
}

function Comment({ comment }: { comment: CommentProps }) {
  return (
    <article className="p-5 border border-gray-200 last-of-type:border-b border-b-0 flex gap-5">
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
          <HeartIcon className="h-6 w-6" />
          <ShareIcon className="h-6 w-6" />
        </div>
      </div>
    </article>
  );
}

export default Post;
