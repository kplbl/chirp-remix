import { Link, LinksFunction } from "remix";
import stylesUrl from "../styles/index.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function IndexRoute() {
  return (
    <div className="container">
      <div className="content">
        <h1>Personal blog</h1>
        <nav>
          <ul>
            <li>
              <Link to="posts">Read Posts</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
