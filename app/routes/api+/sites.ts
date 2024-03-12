import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "~/database/client";
import { sitesQueue } from "~/features/Admin/Queues/SitesQueue";
import { authenticator } from "~/features/Shared/Services/auth.server";
import { Google } from "~/features/Shared/Services/google.server";

export async function action({ request }: ActionFunctionArgs) {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/signin",
  });

  // Import User's Sites
  const client = await new Google().asUser(session.id);
  const sites = await client.fetchSites();

  for (const site of sites) {
    const _site = await db.site.upsert({
      where: {
        resource_user_id: {
          resource: site,
          user_id: session.id,
        },
      },
      create: {
        resource: site,
        status: 0,
        user_id: session.id,
      },
      update: {},
    });

    // Enqueue Site Indexing
    const enqueued = await sitesQueue.dispatch({
      uid: session.id,
      sid: _site.id,
    });

    console.log("Site Enqueued:", _site.id, "Job ID:", enqueued.id);
  }

  return json({ message: "Refresh successful." });
}
