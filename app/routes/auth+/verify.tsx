import { render } from "@react-email/render";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import JWT from "jsonwebtoken";
import { db } from "~/database/client";
import { UserConfirm } from "~/features/Admin/Emails/UserConfirm";
import { authenticator } from "~/features/Shared/Services/auth.server";
import { send } from "~/features/Shared/Services/email.server";
import {
  commitSession,
  getSession,
} from "~/features/Shared/Services/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/signin",
  });

  if (session.is_verified === true) {
    return json({ message: "Email already verified!" }, { status: 200 });
  }

  const createdToken = JWT.sign({ id: session.id }, process.env.APP_KEY!, {
    expiresIn: "1h",
  });

  // Build the verification link
  const url = `${process.env.APP_URL}/auth/verify?token=${createdToken}`;

  await send(
    session.email,
    "Email Verification",
    render(<UserConfirm url={url} />)
  );

  return json(
    { message: "Email verification link has been sent to your email." },
    { status: 200 }
  );
}

export function isTokenValid(token: string) {
  try {
    JWT.verify(token, process.env.APP_KEY!);
    return true;
  } catch {
    return false;
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const session = await getSession(request.headers.get("Cookie"));

  if (!token || !isTokenValid(token)) {
    session.flash("message", "Invalid token. Please try again.");
  } else {
    const decoded = JWT.decode(token) as { id: string };

    // Update user's email verification status
    const user = await db.user.update({
      where: { id: decoded.id },
      data: {
        is_verified: true,
      },
    });

    // Update auth session
    session.set("user", user);
    session.flash("message", "Email verified successfully!");
  }

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
