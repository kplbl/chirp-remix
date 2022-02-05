import {
  LoaderFunction,
  ActionFunction,
  useLoaderData,
  Link,
  useParams,
  useCatch,
  Form,
} from "remix";
import { requireUserId, getUserId } from "~/utils/session.server";
import type { Post } from "@prisma/client";
import { db } from "~/utils/db.server";

type LoaderData = { post: Post; isOwner: boolean };

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await getUserId(request);
  const post = await db.post.findUnique({
    where: { id: params.postId },
  });
  if (!post) throw new Response("Post not found", { status: 404 });
  const data: LoaderData = { post, isOwner: userId === post.posterId };
  return data;
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  if (form.get("_method") === "delete") {
    const userId = await requireUserId(request);
    const post = await db.post.findUnique({
      where: { id: params.postId },
    });
    if (!post) {
      throw new Response("Can't delete what does not exist", { status: 404 });
    }
    if (post.posterId !== userId) {
      throw new Response("Not your post", {
        status: 401,
      });
    }
    await db.post.delete({ where: { id: params.postId } });
  }
};

export default function PostRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Here is a post:</p>
      <p>{data.post.content}</p>
      <Link to=".">{data.post.title} Permalink</Link>
      {data.isOwner ? (
        <Form method="post">
          <input type="hidden" name="_method" value="delete" />
          <button type="submit" className="button">
            Delete
          </button>
        </Form>
      ) : null}
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();
  switch (caught.status) {
    case 404: {
      return (
        <div className="error-container">
          Huh? What the heck is {params.postId}?
        </div>
      );
    }
    case 401: {
      return (
        <div className="error-container">
          Sorry, but {params.postId} is not your post.
        </div>
      );
    }
    default: {
      throw new Error(`Unhandled error: ${caught.status}`);
    }
  }
}

export function ErrorBoundary() {
  const { postId } = useParams();
  return (
    <div className="error-container">{`There was an error loading post by the id ${postId}. Sorry.`}</div>
  );
}
