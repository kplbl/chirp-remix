import {
  Links,
  Link,
  LiveReload,
  Outlet,
  useCatch,
  Scripts,
  LoaderFunction,
  ActionFunction,
  useLoaderData,
  redirect,
} from "remix";
import { getUser } from "./utils/session.server";
import { User } from "@prisma/client";
import type { LinksFunction } from "remix";
import styles from "./styles/app.css";
import {
  HomeIcon,
  PencilIcon,
  LogoutIcon,
  LoginIcon,
  ChatIcon,
  UserIcon,
  DocumentTextIcon,
} from "@heroicons/react/outline";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

type LoaderData = {
  user: User | null;
};

export const action: ActionFunction = async ({ request }) => {
  return redirect("/");
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  const data: LoaderData = {
    user,
  };
  return data;
};

function Document({
  children,
  title = "OffbrandChirp",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const data = useLoaderData<LoaderData>();

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <Links />
      </head>
      <body className="flex">
        <aside className="md:ml-16 h-screen top-0 sticky">
          <nav className=" px-2 py-2 flex flex-col justify-between h-full">
            <div className="flex flex-col gap-2">
              <Link to="/" className="flex gap-3">
                <div className="p-1">
                  <HomeIcon className="h-9 w-9" />
                </div>

                <div className="text-xl hidden md:flex items-center">Home</div>
              </Link>

              <Link to="/comments" className="flex gap-3">
                <div className="p-1">
                  <ChatIcon className="h-9 w-9" />
                </div>

                <div className="text-xl hidden md:flex items-center">
                  Comments
                </div>
              </Link>
              <Link to="/posts/user" className="flex gap-3">
                <div className="p-1">
                  <DocumentTextIcon className="h-9 w-9" />
                </div>

                <div className="text-xl hidden md:flex items-center">Posts</div>
              </Link>
              <Link to="/profile" className="flex gap-3">
                <div className="p-1">
                  {data.user?.avatarSVG ? (
                    <div
                      className=" h-9 w-9 bg-slate-200 rounded-full overflow-clip"
                      dangerouslySetInnerHTML={{
                        __html: data.user.avatarSVG || "",
                      }}
                    ></div>
                  ) : (
                    <div className="bg-blue-400 rounded-full">
                      <UserIcon className="h-9 w-9 text-blue-100" />
                    </div>
                  )}
                </div>

                <div className="text-xl hidden md:flex items-center">
                  Profile
                </div>
              </Link>
              <Link to="/posts/new" className="flex gap-3">
                <div className="bg-blue-400 rounded-full p-1">
                  <PencilIcon className="h-9 w-9 text-blue-100" />
                </div>

                <div className="text-xl hidden md:flex items-center">Chirp</div>
              </Link>
            </div>
            <div>
              <div>
                {data.user ? (
                  <form action="/logout" method="post" className="flex gap-2">
                    <button type="submit" className="button">
                      <LogoutIcon className="w-10 h-10" />
                    </button>
                    <div className="text-xl hidden md:flex items-center">
                      Logout
                    </div>
                  </form>
                ) : (
                  <Link to="/login" className="flex gap-3">
                    <LoginIcon className="w-10 h-10" />
                    <div className="text-xl hidden md:flex items-center">
                      Login
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </aside>
        {children}
        <Scripts />
        {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <div className="error-container">
        <h1>
          {caught.status} {caught.statusText}
        </h1>
      </div>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Uh-oh">
      <div className="error-container">
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  );
}
