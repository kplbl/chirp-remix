import {
  Links,
  Link,
  LiveReload,
  Outlet,
  useCatch,
  Scripts,
  LoaderFunction,
  useLoaderData,
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
} from "@heroicons/react/outline";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

type LoaderData = {
  user: User | null;
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
  //const data = { user: { name: "test" } };

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <Links />
      </head>
      <body className="flex">
        <aside className="ml-16 h-screen top-0 sticky">
          <nav className=" px-5 py-2 flex flex-col justify-between h-full">
            <div className="">
              <Link to="/" className="flex gap-3">
                <div className="p-1">
                  <HomeIcon className="h-9 w-9" />
                </div>

                <div className="text-xl hidden md:flex items-center">Home</div>
              </Link>
              <Link to="/new" className="flex gap-3">
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
