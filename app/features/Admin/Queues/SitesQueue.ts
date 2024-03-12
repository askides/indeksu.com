import { Queue } from "bullmq";

class SitesQueue {
  private queue: Queue;

  constructor() {
    this.queue = new Queue("sites", {
      connection: {
        host: process.env.REDIS_HOST!,
        port: Number(process.env.REDIS_PORT!),
      },
    });
  }

  async dispatch({ uid, sid }: { uid: string; sid: string }) {
    return this.queue.add("collect-site-urls", { uid, sid });
  }
}

export const sitesQueue = new SitesQueue();
