import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="not-found page-shell">
      <span className="eyebrow">404 / WRONG TURN</span>
      <h1>This page<br /><em>isn't on the map.</em></h1>
      <Link className="button button-green" to="/">Back to exploring</Link>
    </main>
  );
}