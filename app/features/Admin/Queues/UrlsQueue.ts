import { Url } from "@prisma/client";
import { Queue } from "bullmq";

class UrlsQueue {
  private queue: Queue;

  constructor() {
    this.queue = new Queue("urls", {
      connection: {
        host: process.env.REDIS_HOST!,
        port: Number(process.env.REDIS_PORT!),
      },
    });
  }

  async dispatch({ urls }: { urls: Url[] }) {
    return this.queue.add("index-urls", { urls });
  }
}

export const urlsQueue = new UrlsQueue();
