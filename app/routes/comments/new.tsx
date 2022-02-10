import type { ActionFunction, LoaderFunction } from "remix";
import { redirect, useActionData, json, useCatch, Link, Form } from "remix";
import { db } from "~/utils/db.server";
import { getUserId, requireUserId, getUser } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }

  return {};
};

function validateCommentContent(content: string) {
  if (content.length < 1) {
    return `At least put something in there.`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    content: string | undefined;
  };
  fields?: {
    content: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request);
  if (!user) return redirect("/");

  const form = await request.formData();

  const postId = String(form.get("id"));
  const content = form.get("content");

  if (typeof content !== "string") {
    return badRequest({ formError: `Form not submitted correctly.` });
  }

  const fieldErrors = {
    content: validateCommentContent(content),
  };

  const fields = { content };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  await db.comment.create({
    data: {
      ...fields,
      posterId: user.id,
      postId: postId,
    },
  });

  return redirect("/");
};

export default function NewCommentRoute() {
  return redirect("/");
}

export function CatchBoundary() {
  const caught = useCatch();
  if (caught.status === 401) {
    return (
      <div className="error-container">
        <p>You must be logged in to create a comment.</p>
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
