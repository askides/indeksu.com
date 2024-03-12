import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "~/database/client";
import { urlsQueue } from "~/features/Admin/Queues/UrlsQueue";
import { authenticator } from "~/features/Shared/Services/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/signin",
  });

  // Get all urls that needs to be indexed.
  const urls = await db.url.findMany({
    where: {
      next_run_at: {
        lte: new Date(),
      },
    },
    include: {
      Site: {
        include: {
          User: true,
        },
      },
    },
  });

  console.log("Urls to be indexed:", urls.length);

  const enqueued = await urlsQueue.dispatch({
    urls: urls.slice(0, 10),
  });

  return json(enqueued);
}
