import { Outlet } from "@remix-run/react";

export default function Layout() {
  return (
    <div className="flex h-screen font-jakarta">
      <div className="flex h-full flex-1 justify-center sm:mx-auto sm:w-full sm:max-w-md items-center">
        <Outlet />
      </div>
      <div className="relative hidden h-full w-1/3 sm:block border-l-2 border-sky-100 p-10">
        <div className="grid grid-cols-1 place-content-center h-full gap-5">
          <div className="border-2 border-sky-100 p-5">
            <p className="text-sm leading-relaxed">
              Did you know? We are proudly Open Source! Come support us with a
              star on Github.
              <a href="" className="mt-2 text-sky-600 block hover:underline">
                Give Support On Github!
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
