import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/tests", label: "Tests" },
  { to: "/study-plan", label: "Study Plan" },
];

function Layout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Exam Mistake Analyzer</p>
          <h1 className="topbar-title">Track mistakes. Study smarter.</h1>
          <p className="topbar-text">
            Welcome back, {currentUser?.displayName || currentUser?.email}
          </p>
        </div>

        <nav className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "nav-link nav-link-active" : "nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button className="secondary-button" onClick={handleLogout}>
          Log out
        </button>
      </header>

      <main className="page-shell">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
