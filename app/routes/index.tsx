import { Link, LoaderFunction, useLoaderData, Outlet } from "remix";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import { User } from "@prisma/client";

type LoaderData = {
  user: User | null;
  postListItems: Array<{ id: string; title: string; content: string }>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const postListItems = await db.post.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, content: true },
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
    <div className="mx-auto md:w-2/3">
      <nav className="mt-5 border rounded-sm border-black flex justify-between shadow-lg px-3 py-2">
        <div className="flex gap-2">
          <Link to="posts" className="">
            More posts
          </Link>
        </div>
        <div>
          {data.user ? (
            <div className="user-info">
              <span>{`Hi ${data.user.username}`}</span>
              <form action="/logout" method="post">
                <button type="submit" className="button">
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </nav>
      <div className="mt-5 border border-black rounded-sm shadow-lg px-3 py-2">
        {data.postListItems.map((post) => (
          <div className="my-5" key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
            <div>{post.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
