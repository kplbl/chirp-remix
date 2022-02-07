import type { ActionFunction, LoaderFunction } from "remix";
import { redirect, useActionData, json, useCatch, Link, Form } from "remix";
import { db } from "~/utils/db.server";
import { getUserId, requireUserId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }

  return {};
};

function validatePostContent(content: string) {
  if (content.length < 10) {
    return `That post is too short`;
  }
}

function validatePostTitle(title: string) {
  if (title.length < 2) {
    return `That posts's title is too short`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    title: string | undefined;
    content: string | undefined;
  };
  fields?: {
    title: string;
    content: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const title = form.get("title");
  const content = form.get("content");

  if (typeof title !== "string" || typeof content !== "string") {
    return badRequest({ formError: `Form not submitted correctly.` });
  }

  const fieldErrors = {
    title: validatePostTitle(title),
    content: validatePostContent(content),
  };

  const fields = { title, content };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const post = await db.post.create({
    data: { ...fields, posterId: userId },
  });
  return redirect(`/posts/${post.id}`);
};

export default function NewPostRoute() {
  const actionData = useActionData<ActionData>();

  return (
    <main className="pt-5">
      <h1 className="text-center mb-5 text-2xl">Add Post</h1>
      <Form method="post" className="flex flex-col justify-center gap-y-5">
        <div className="flex justify-center gap-5 ">
          <label htmlFor="title" className="flex justify-center gap-5 ">
            <div className="flex items-center w-24">Title:</div>

            <input
              className="border border-gray-300 p-1 px-2"
              type="text"
              name="title"
              defaultValue={actionData?.fields?.title}
              aria-invalid={
                Boolean(actionData?.fieldErrors?.title) || undefined
              }
              aria-describedby={
                actionData?.fieldErrors?.title ? "title-error" : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.title ? (
            <p className="form-validation-error" role="alert" id="title-error">
              {actionData.fieldErrors.title}
            </p>
          ) : null}
        </div>
        <div className="flex justify-center gap-5">
          <label htmlFor="content" className="flex justify-center gap-5">
            <div className="flex items-center w-24">Content:</div>

            <textarea
              className="border border-gray-300 p-1"
              defaultValue={actionData?.fields?.content}
              name="content"
              aria-invalid={
                Boolean(actionData?.fieldErrors?.content) || undefined
              }
              aria-describedby={
                actionData?.fieldErrors?.content ? "content-error" : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p className="" role="alert" id="content-error">
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>
        <div>
          <button
            type="submit"
            className="py-2 px-4 border mx-auto rounded shadow-sm  border-blue-200 hover:shadow hover:bg-blue-200"
          >
            Submit
          </button>
        </div>
      </Form>
    </main>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  if (caught.status === 401) {
    return (
      <div className="error-container">
        <p>You must be logged in to create a post.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }
}

export function ErrorBoundary() {
  return (
    <div className="error-container">
      Something unexpected went wrong. Sorry about that.
    </div>
  );
}
