import { Link } from "remix";

export default function IndexRoute() {
  return (
    <div className="container">
      <div className="content">
        <h1 className="text-red-400">Personal blog</h1>
        <nav>
          <ul>
            <li>
              <Link to="posts" className="text-red">
                Read Posts
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
