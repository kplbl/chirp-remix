import * as timeago from "timeago.js";
import { User, Comment } from "@prisma/client";

type CommentProps = {
  comment: {
    id: string;
    content: string;
    poster: User;
    createdAt: Date;
  };
};

function Comment({ comment }: CommentProps) {
  return (
    <div key={comment.id} className="flex my-3 gap-4">
      <div
        className=" h-12 w-12 bg-slate-200 rounded-full overflow-clip"
        dangerouslySetInnerHTML={{
          __html: comment.poster.avatarSVG || "",
        }}
      ></div>
      <div>
        <div className="text-sm font-light">
          @{comment.poster.username} {timeago.format(comment.createdAt)}
        </div>
        <div>{comment.content}</div>
      </div>
    </div>
  );
}

export default Comment;
