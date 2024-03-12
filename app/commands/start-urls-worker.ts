import { Worker } from "bullmq";
import { addHours } from "date-fns/addHours";
import { db } from "~/database/client";
import { Google } from "~/features/Shared/Services/google.server";

(async () => {
  const service = new Worker(
    "urls",
    async ({ id, data }) => {
      console.log("######################################");
      console.log("## Starting Job With ID:", id);
      console.log("######################################");

      const { urls } = data;

      // Loop through each Url from database
      for (const url of urls) {
        try {
          // Build Client
          const client = await new Google().asUser(url.Site.User.id);

          const { urlNotificationMetadata: meta } = await client.index(url.url);

          if (!meta?.url || !meta?.latestUpdate?.notifyTime) {
            continue;
          }

          const nextRunAt = addHours(
            new Date(meta.latestUpdate.notifyTime),
            48
          );

          await db.url.update({
            where: {
              url_site_id: {
                url: meta.url,
                site_id: url.site_id,
              },
            },
            data: {
              next_run_at: nextRunAt,
              notified_at: meta.latestUpdate.notifyTime,
            },
          });

          console.log("INFO: URL Indexed:", meta.url);
        } catch (err) {
          if (err instanceof Error) {
            console.log("ERROR:", err.message);
          }
        }
      }
    },
    {
      connection: {
        host: process.env.REDIS_HOST!,
        port: Number(process.env.REDIS_PORT!),
      },
    }
  );

  service.on("ready", () => {
    console.log("Worker is connected and ready to process jobs.");
  });

  service.on("completed", (job) => {
    console.log("Job completed", job.id);
  });

  service.on("failed", (job, err) => {
    console.log("Job failed", job?.id ?? "No ID", err);
  });
})();
