import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "~/database/client";
import { authenticator } from "~/features/Shared/Services/auth.server";
import { Google } from "~/features/Shared/Services/google.server";

export async function action({ request }: ActionFunctionArgs) {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/signin",
  });

  // Import User's Sites
  const sites = await new Google().fetchUserSites(session.id);

  for (const site of sites) {
    const row = await db.site.findFirst({
      where: {
        resource: site,
        user_id: session.id,
      },
    });

    if (!row) {
      await db.site.create({
        data: {
          resource: site,
          status: 0,
          user_id: session.id,
        },
      });
    }
  }

  return json({ message: "Refresh successful." });
}
