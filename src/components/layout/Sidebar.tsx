import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/bookings", label: "Reservas" },
  { to: "/sync-jobs", label: "Sync Queue" },
  { to: "/providers", label: "Provedores" },
  { to: "/reports", label: "Reports" },
  { to: "/alerts", label: "Alerts" },
  { to: "/settings", label: "Settings" },
] as const;

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo">TS</span>
        <div>
          <strong>TripSync</strong>
          <small>Operations</small>
        </div>
      </div>
      <nav className="sidebar__nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={"end" in link ? link.end : false}
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar__footer">
        <div className="sidebar__user">
          <span className="sidebar__avatar">OP</span>
          <div>
            <strong>Ops User</strong>
            <small>operator@tripsync.com</small>
          </div>
        </div>
        <span className="sidebar__status">Online</span>
      </div>
    </aside>
  );
}
