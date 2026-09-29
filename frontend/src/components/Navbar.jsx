import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Plan Your Trip home">
        <span className="brand-mark" aria-hidden="true">P</span>
        <span>plan your trip</span>
      </Link>
      <nav aria-label="Main navigation">
        <NavLink to="/" end>Explore</NavLink>
        <Link to="/#saved-plan">My trip</Link>
      </nav>
    </header>
  );
}