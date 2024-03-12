/*
  Warnings:

  - The primary key for the `pages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `pages` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_pages" (
    "url" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
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
