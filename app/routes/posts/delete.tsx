import { ActionFunction, LoaderFunction, redirect } from "remix";
import { getUser } from "~/utils/session.server";

import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request);

  if (!user) return redirect("/");

  const form = await request.formData();

  const id = String(form.get("id"));

  const post = await db.post.findUnique({
    where: {
      id: id,
    },
  });

  if (post?.posterId === user.id) {
    await db.post.delete({
      where: {
        id: id,
      },
    });
  }

  return redirect("/");
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};

function PostsDeleteRoute() {
  return <div></div>;
}

export default PostsDeleteRoute;
