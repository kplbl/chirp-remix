import { ActionFunction, LoaderFunction, redirect } from "remix";
import { getUser } from "~/utils/session.server";

import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request);

  if (!user) return redirect("/");

  const form = await request.formData();

  const id = String(form.get("id"));

  const likes = await db.post.findUnique({
    where: { id: id },
    select: { likedBy: true },
  });

  if (likes?.likedBy.find((like) => like.id === user?.id)) {
    await db.post.update({
      where: { id: id },
      data: {
        likedBy: { disconnect: { id: user?.id } },
      },
    });
  } else {
    await db.post.update({
      where: { id: id },
      data: {
        likedBy: { connect: { id: user?.id } },
      },
    });
  }

  return redirect("/");
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};

function LikesRoute() {
  return <div></div>;
}

export default LikesRoute;
