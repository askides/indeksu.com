/*
  Warnings:

  - Added the required column `next_run_at` to the `pages` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_pages" (
    "url" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "next_run_at" DATETIME NOT NULL,
    "notified_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,

    PRIMARY KEY ("url", "site_id"),
    CONSTRAINT "pages_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_pages" ("created_at", "notified_at", "site_id", "updated_at", "url") SELECT "created_at", "notified_at", "site_id", "updated_at", "url" FROM "pages";
DROP TABLE "pages";
ALTER TABLE "new_pages" RENAME TO "pages";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
