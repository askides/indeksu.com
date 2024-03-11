import { json, redirect, type DataFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/database/client";
import { SideNav } from "~/features/Admin/Blocks/SideNav";
import { Button } from "~/features/Admin/UI/Button";
import { Card } from "~/features/Admin/UI/Card";
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

  // Check if Search Console is connected
  const oAuthToken = await db.oAuthToken.findFirst({
    where: {
      user_id: session.id,
    },
  });

  return json(
    {
      session: user,
      message: message,
      searchConsole: oAuthToken ? true : false,
    },
    {
      headers: {
        "Set-Cookie": await commitSession(cookies),
      },
    }
  );
}

export default function Page() {
  const { searchConsole } = useLoaderData<typeof loader>();

  if (!searchConsole) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-lg">
          <Card.Header>
            <Card.Title>Welcome aboard Indeksu!</Card.Title>
            <Card.Subtitle>
              Connect your Google Search Console account.
            </Card.Subtitle>
          </Card.Header>
          <Card.Body className="pt-0">
            <form method="post" action="/oauth/redirect" className="space-y-4">
              <p className="text-sm leading-relaxed text-slate-800">
                By connecting your Google Search Console account, you will be
                able to import your sites and sitemaps into Indeksu. Click the
                button below to proceed.
              </p>

              <div
                role="alert"
                className="text-red-500 text-sm bg-red-500 bg-opacity-10 p-5 leading-relaxed rounded-xl"
              >
                <p>
                  This is not yet ready for production. Because Google needs to
                  accept the integration.
                </p>
              </div>

              <Button>Connect Search Console</Button>
            </form>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-snow-100 flex min-h-screen">
      <SideNav />

      <div className="ml-52 flex w-full flex-col">
        <Outlet />
      </div>
    </div>
  );
}
