import { Form, Link } from "@remix-run/react";
import { IconDashboard, IconDoorExit } from "@tabler/icons-react";

export function SideNav() {
  const items = [{ label: "Dashboard", to: "/dashboard", icon: IconDashboard }];

  return (
    <aside className="flex fixed top-0 left-0 flex-col w-52 h-screen px-5 py-6 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l">
      <Link to="/dashboard">
        <img
          className="w-auto h-7"
          src="https://merakiui.com/images/logo.svg"
          alt=""
        />
      </Link>

      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav className="-mx-3 space-y-6 ">
          <div className="space-y-3">
            <label className="px-3 text-xs text-snow-200 uppercase">Menu</label>

            {items.map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                className="flex items-center px-3 py-2 text-snow-700 transition-colors duration-150 transform rounded-lg hover:bg-gray-100 hover:text-gray-700"
              >
                <item.icon className="h-5 w-5" />
                <span className="mx-3 text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <div className="flex flex-col justify-between -mb-3 mt-6">
        <nav className="-mx-3">
          <div className="space-y-1">
            <label className="px-3 text-xs text-snow-200 uppercase">
              Account
            </label>

            <Form method="POST" action="/auth/signout">
              <button className="flex items-center w-full px-3 py-2 text-snow-700 transition-colors duration-150 transform rounded-lg hover:bg-gray-100 hover:text-gray-700">
                <IconDoorExit className="h-5 w-5" />
                <span className="mx-3 text-sm font-medium">Sign Out</span>
              </button>
            </Form>
          </div>
        </nav>
      </div>
    </aside>
  );
}
