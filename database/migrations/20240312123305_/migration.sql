/*
  Warnings:

  - The primary key for the `pages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[resource,user_id]` on the table `sites` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `pages` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_pages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "notified_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "pages_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_pages" ("created_at", "notified_at", "site_id", "updated_at", "url") SELECT "created_at", "notified_at", "site_id", "updated_at", "url" FROM "pages";
DROP TABLE "pages";
ALTER TABLE "new_pages" RENAME TO "pages";
CREATE UNIQUE INDEX "pages_url_site_id_key" ON "pages"("url", "site_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "sites_resource_user_id_key" ON "sites"("resource", "user_id");
