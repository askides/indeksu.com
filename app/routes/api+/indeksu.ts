import { ActionFunctionArgs, json } from "@remix-run/node";
import { object, parse, string } from "valibot";
import { db } from "~/database/client";
import { authenticator } from "~/features/Shared/Services/auth.server";
import { Google } from "~/features/Shared/Services/google.server";
import { fetchSiteUrls } from "~/features/Shared/Services/sitemap.server";

export async function action({ request }: ActionFunctionArgs) {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/signin",
  });

  const data = await request.json();
  const valid = parse(object({ id: string() }), data);

  const client = await new Google().asUser(session.id);
  const sitemaps = await client.fetchSitemaps(valid.id);

  const urls = await Promise.all(
    sitemaps.map((element) => fetchSiteUrls(element.path as string))
  )
    .then((res) => [...new Set(res.flat())])
    .catch(() => []);

  for (const url of urls) {
    try {
      const { urlNotificationMetadata: data } = await client.index(url);

      if (!data?.url || !data?.latestUpdate?.notifyTime) {
        continue;
      }

      await db.page.create({
        data: {
          url: data.url,
          notified_at: data.latestUpdate.notifyTime,
          site_id: valid.id,
        },
      });

      console.log("Indexed:", data.url);
    } catch (err) {
      console.log("Errore", err);
    }
  }

  return json([]);
}
