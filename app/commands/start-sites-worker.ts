import { Worker } from "bullmq";
import { db } from "~/database/client";
import { Google } from "~/features/Shared/Services/google.server";
import { fetchSiteUrls } from "~/features/Shared/Services/sitemap.server";

(async () => {
  const service = new Worker(
    "sites",
    async ({ id, data }) => {
      console.log("######################################");
      console.log("## Starting Sites Job With ID:", id);
      console.log("######################################");

      const { uid, sid } = data;

      // Build Client
      const client = await new Google().asUser(uid);

      // Extract Sitemaps
      const sitemaps = await client
        .fetchSitemaps(sid)
        .then((res) => {
          return res
            .filter((element) => element.path)
            .map((element) => element.path as string);
        })
        .catch((err) => {
          console.log("ERROR:", err.message);
          return [] as string[];
        });

      // Get all URLs from sitemaps
      const urls = await Promise.all(
        sitemaps.map((element) => fetchSiteUrls(element))
      )
        .then((res) => [...new Set(res.flat())])
        .catch(() => []);

      for (const url of urls) {
        const _url = await db.url.upsert({
          where: {
            url_site_id: {
              url: url,
              site_id: sid,
            },
          },
          create: {
            url: url,
            site_id: sid,
            next_run_at: new Date(),
          },
          update: {},
        });

        console.log("INFO: URL inserted:", _url.url);
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
    console.log("INFO: Sites Worker is connected and ready to process jobs.");
  });

  service.on("completed", (job) => {
    console.log("INFO: Sites Job completed:", job.id, "\n");
  });

  service.on("failed", (job, err) => {
    console.log("INFO: Sites Job failed:", job?.id ?? "No ID", err);
  });
})();
