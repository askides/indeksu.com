import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { authenticator } from "~/features/Shared/Services/auth.server";
import { Google } from "~/features/Shared/Services/google.server";

export async function action({ request }: ActionFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/signin",
  });

  const url = await Google.redirect();

  return redirect(url);
}
