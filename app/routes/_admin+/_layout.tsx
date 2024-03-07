import { json, redirect, type DataFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/database/client";
import { SideNav } from "~/features/Admin/Blocks/SideNav";
import { authenticator } from "~/features/Shared/Services/auth.server";
import {
  commitSession,
  getSession,
} from "~/features/Shared/Services/session.server";

export async function loader({ request }: DataFunctionArgs) {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/signin",
  });

  const user = await db.user.findUniqueOrThrow({
    where: {
      id: session.id,
    },
  });

  const isVerificationEnabled = Boolean(Number(process.env.EMAIL_CONFIRMATION));

  // If Email is not verified, then redirect to the email verification page
  if (isVerificationEnabled && user.is_verified === false) {
    return redirect("/auth/email");
  }

  const cookies = await getSession(request.headers.get("Cookie"));
  const message = cookies.get("message") || null;

  return json(
    { session: user, message },
    {
      headers: {
        "Set-Cookie": await commitSession(cookies),
      },
    }
  );
}

export default function Page() {
  const { session, message } = useLoaderData<typeof loader>();

  return (
    <div className="bg-snow-100 flex min-h-screen">
      <SideNav />

      <div className="ml-52 flex w-full flex-col">
        <Outlet />
      </div>
    </div>
  );
}
