import { Outlet, LinksFunction } from "remix";
import stylesUrl from "../styles/jokes.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function JokesRoute() {
  return (
    <div>
      <h1>Jokes</h1>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
