import type { ActionFunction } from "remix";
import { Link, useSearchParams, json, useActionData } from "remix";
import { db } from "~/utils/db.server";
import { createUserSession, login, register } from "~/utils/session.server";

function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at lest 6 characters long`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
  };
  fields?: {
    username: string;
    password: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const username = form.get("username");
  const password = form.get("password");
  const redirectTo = form.get("redirectTo") || "/";
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { username, password };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  const user = await login({ username, password });

  if (!user) {
    return { fields, formError: "Not implemented" };
  }
  return createUserSession(user.id, redirectTo);
  // if there is a user, create their session and redirect to /posts
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<ActionData>();

  return (
    <main className="pt-5">
      <h1 className="text-center mb-5 text-2xl">Login</h1>
      <form
        className="flex flex-col justify-center gap-y-5"
        method="post"
        aria-describedby={
          actionData?.formError ? "form-error-message" : undefined
        }
      >
        <input
          type="hidden"
          name="redirectTo"
          value={searchParams.get("redirectTo") ?? undefined}
        />

        <div className="flex justify-center gap-5 ">
          <label className="p-1 w-24 " htmlFor="username-input">
            Username
          </label>
          <input
            className="border border-gray-300 p-1"
            type="text"
            id="username-input"
            name="username"
            defaultValue={actionData?.fields?.username}
            aria-invalid={Boolean(actionData?.fieldErrors?.username)}
            aria-describedby={
              actionData?.fieldErrors?.username ? "username-error" : undefined
            }
          />
          {actionData?.fieldErrors?.username ? (
            <p
              className="form-validation-error"
              role="alert"
              id="username-error"
            >
              {actionData?.fieldErrors.username}
            </p>
          ) : null}
        </div>
        <div className="flex justify-center gap-5">
          <label className="p-1 w-24" htmlFor="password-input">
            Password
          </label>
          <input
            className="border border-gray-300 p-1"
            id="password-input"
            name="password"
            defaultValue={actionData?.fields?.password}
            type="password"
            aria-invalid={
              Boolean(actionData?.fieldErrors?.password) || undefined
            }
            aria-describedby={
              actionData?.fieldErrors?.password ? "password-error" : undefined
            }
          />
          {actionData?.fieldErrors?.password ? (
            <p
              className="form-validation-error"
              role="alert"
              id="password-error"
            >
              {actionData?.fieldErrors.password}
            </p>
          ) : null}
        </div>
        <div id="form-error-message">
          {actionData?.formError ? (
            <p className="form-validation-error" role="alert">
              {actionData?.formError}
            </p>
          ) : null}
        </div>
        <div className="flex justify-evenly">
          <button
            type="submit"
            className="py-2 px-4 border  rounded shadow-sm  border-blue-200 hover:shadow hover:bg-blue-200"
          >
            Submit
          </button>
          <Link to={"/register"}>
            <button className="py-2 px-4 border  rounded shadow-sm  border-blue-200 hover:shadow hover:bg-blue-200">
              Register?
            </button>
          </Link>
        </div>
      </form>
    </main>
  );
}
