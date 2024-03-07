import { Link, Outlet } from "@remix-run/react";
import { Fragment } from "react";

export default function Layout() {
  return (
    <Fragment>
      <header className="border-b border-b-slate-100 font-jakarta">
        <nav className="px-5 py-5 max-w-5xl mx-auto flex items-center justify-between">
          <div className="font-bold text-2xl tracking-tight">
            <Link to="/">Indeksu</Link>
          </div>
          <ul className="flex items-center gap-5 tracking-tight font-medium">
            <li className="md:block hidden">
              <Link to="/auth/signin">Sign In</Link>
            </li>
            <li>
              <Link to="/auth/signup">
                <div className="border-2 rounded-sm border-black py-2 px-3">
                  Sign Up For Free
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <Outlet />

      <footer className="border-t border-b-slate-100 font-jakarta">
        <div className="px-5 py-12 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            <div className="space-y-7">
              <div className="font-bold text-xl tracking-tight">
                <Link to="/">Indeksu</Link>
              </div>
              <ul className="space-y-5 tracking-tight font-medium underline">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/auth/signin">Sign In</Link>
                </li>
                <li>
                  <Link to="/auth/signup">Sign Up</Link>
                </li>
              </ul>
            </div>
            <div className="space-y-7">
              <div className="font-bold text-xl tracking-tight">Resources</div>
              <ul className="space-y-5 tracking-tight font-medium underline">
                <li>
                  <Link to="/faq">Open Source</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </Fragment>
  );
}
