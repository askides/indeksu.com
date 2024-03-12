/*
  Warnings:

  - You are about to drop the `pages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "pages";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "urls" (
    "url" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "next_run_at" DATETIME NOT NULL,
    "notified_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,

    PRIMARY KEY ("url", "site_id"),
    CONSTRAINT "urls_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
