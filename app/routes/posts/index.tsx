import { LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import { User } from "@prisma/client";
import Post from "../../components/Post";
import Chirp from "../../components/Chirp";

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
  }>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const postListItems = await db.post.findMany({
    take: 15,
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
      {data.user && <Chirp avatarSVG={data?.user?.avatarSVG} />}

      {data.postListItems.map((post) => (
        <Post key={post.id} post={post} user={data.user} />
      ))}
    </main>
  );
}
