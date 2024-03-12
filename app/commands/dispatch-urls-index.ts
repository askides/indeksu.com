import { db } from "~/database/client";
import { urlsQueue } from "~/features/Admin/Queues/UrlsQueue";

(async () => {
  console.log("INFO: Starting Cron Dispatch URLs Index...");

  // Get all urls that needs to be indexed.
  const urls = await db.url.findMany({
    where: {
      next_run_at: {
        lte: new Date(),
      },
      Site: {
        status: 1,
      },
    },
    include: {
      Site: {
        include: {
          User: true,
        },
      },
    },
    take: 300,
  });

  console.log("INFO: Urls to be indexed:", urls.length);

  if (urls.length > 0) {
    await urlsQueue.dispatch({
      urls: urls,
    });
  }

  console.log("INFO: URLs Enqueued Successfully!");
  console.log("#################################");
})();
