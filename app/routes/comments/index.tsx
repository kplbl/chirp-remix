import { LoaderFunction, ActionFunction, redirect } from "remix";
import { useLoaderData, Link, useCatch, Form } from "remix";
import type { Comment, User } from "@prisma/client";
import { db } from "~/utils/db.server";
import { getUser, requireUserId } from "~/utils/session.server";
import * as timeago from "timeago.js";
import { TrashIcon } from "@heroicons/react/outline";

type LoaderData = {
  comments: Array<Comment>;
  user: User | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (!user) {
    throw new Response("Not logged in", { status: 401 });
  }
  const comments = await db.comment.findMany({
    where: {
      posterId: user.id,
    },
  });

  if (comments.length < 1) {
    throw new Response("You made no comments", { status: 404 });
  }
  const data: LoaderData = { comments, user };
  return data;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  if (form.get("_method") === "delete") {
    const id = String(form.get("id"));
    const userId = await requireUserId(request);
    const comment = await db.comment.findUnique({
      where: { id: id },
    });
    if (!comment) {
      throw new Response("Can't delete what does not exist", { status: 404 });
    }
    if (comment.posterId !== userId) {
      throw new Response("Pssh, nice try. That's not your comment.", {
        status: 401,
      });
    }
    await db.comment.delete({ where: { id: id } });
  }

  return redirect("comments");
};

export default function CommentsIndexRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <main className="max-w-2xl ">
      {data.comments ? (
        <>
          {data.comments.map((comment) => (
            <div
              key={comment.id}
              className="flex p-5 pl-1 md:p-5 border border-gray-200 last-of-type:border-b border-b-0 gap-5 "
            >
              <div className="w-screen">
                <div>{comment.content}</div>
                <div className="mt-3 font-light">
                  created {timeago.format(comment.createdAt)}
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <Form method="post">
                  <input type="hidden" name="_method" value="delete" />
                  <button type="submit">
                    <input
                      type="text"
                      name="id"
                      value={comment.id}
                      hidden
                      readOnly
                    />
                    <TrashIcon className="w-10 h-10 hover:text-red-600 mx-4" />
                  </button>
                </Form>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div>User has no posts</div>
      )}
    </main>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  if (caught.status === 404) {
    return (
      <main className="error-container">There are no comments to display.</main>
    );
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

export function ErrorBoundary() {
  return <main className="error-container">Something went wrong.</main>;
}
