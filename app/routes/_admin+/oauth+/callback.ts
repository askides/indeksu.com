import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { db } from "~/database/client";
import { authenticator } from "~/features/Shared/Services/auth.server";
import { Google } from "~/features/Shared/Services/google.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/signin",
  });

  const user = await db.user.findUniqueOrThrow({
    where: {
      id: session.id,
    },
  });

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const scope = url.searchParams.get("scope");

  if (!code || !scope) {
    return json({ message: "Invalid code or scope" }, { status: 400 });
  }

  // Obtain User's Google Token
  const { tokens } = await Google.tokens(code);

  // Upsert Access Token
  await db.oAuthToken.upsert({
    where: {
      user_id: user.id,
    },
    create: {
      access_token: tokens.access_token!,
      refresh_token: tokens.refresh_token!,
      scopes: tokens.scope!,
      expires_at: new Date(tokens.expiry_date!),
      User: {
        connect: {
          id: user.id,
        },
      },
    },
    update: {
      access_token: tokens.access_token!,
      refresh_token: tokens.refresh_token!,
      scopes: tokens.scope!,
      expires_at: new Date(tokens.expiry_date!),
    },
  });

  // Import User's Sites
  const client = await new Google().asUser(session.id);
  const sites = await client.fetchSites();

  for (const site of sites) {
    const row = await db.site.findFirst({
      where: {
        resource: site,
        user_id: user.id,
      },
    });

    if (!row) {
      await db.site.create({
        data: {
          resource: site,
          status: 0,
          user_id: user.id,
        },
      });
    }
  }

  return redirect("/sites");
}
