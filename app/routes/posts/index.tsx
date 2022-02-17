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
import Post from "../../components/Post";
import Chirp from "../../components/Chirp";

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
      <Chirp />
      {data.postListItems.map((post) => (
        <Post key={post.id} post={post} user={data.user} />
      ))}
    </main>
  );
}
