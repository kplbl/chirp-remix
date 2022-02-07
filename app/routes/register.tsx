import type { ActionFunction } from "remix";
import { Link, useSearchParams, json, useActionData } from "remix";
import { db } from "~/utils/db.server";
import { createUserSession, login, register } from "~/utils/session.server";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/miniavs";
import { useState, useEffect } from "react";

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
    avatarSVG: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const username = form.get("username");

  const password = form.get("password");
  const redirectTo = form.get("redirectTo") || "/";
  const avatarSVG = form.get("avatarSVG") as string;
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { username, password, avatarSVG };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  const userExists = await db.user.findFirst({ where: { username } });
  if (userExists) {
    return badRequest({
      fields,
      formError: `User with username ${username} already exists`,
    });
  }

  const user = await register({ username, password, avatarSVG });
  if (!user) {
    return badRequest({
      fields,
      formError: `Something went wrong trying to create a new user`,
    });
  }
  return createUserSession(user.id, redirectTo);
};

export default function Register() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<ActionData>();

  const [avatar, setAvatar] = useState("");

  const makeAvatar = () => {
    const random = String(Math.random().toString());
    const svg = createAvatar(style, {
      seed: random,
      // ... and other options
    });
    setAvatar(svg);
  };

  useEffect(() => {
    makeAvatar();
  }, []);

  return (
    <main className="pt-5">
      <h1 className="text-center mb-5 text-2xl">Register</h1>
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
          <label className="w-24 flex items-center" htmlFor="username-input">
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
          <label className="flex items-center w-24" htmlFor="password-input">
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
        <div className="flex align-middle gap-28">
          <div className="flex items-center text-lg">Avatar:</div>
          <div
            className="w-16 h-16 bg-slate-200 rounded-full overflow-clip"
            dangerouslySetInnerHTML={{ __html: avatar }}
            onClick={() => makeAvatar()}
          ></div>
          <input type="hidden" name="avatarSVG" defaultValue={avatar} />
        </div>
        <div className="mt-5 flex">
          <button
            type="submit"
            className="py-2 px-4 border  rounded shadow-sm  border-blue-200 hover:shadow hover:bg-blue-200"
          >
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}
