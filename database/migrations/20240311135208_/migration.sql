/*
  Warnings:

  - You are about to drop the column `expires_at` on the `sites` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_sites" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "resource" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "sites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_sites" ("created_at", "id", "resource", "status", "updated_at", "user_id") SELECT "created_at", "id", "resource", "status", "updated_at", "user_id" FROM "sites";
DROP TABLE "sites";
ALTER TABLE "new_sites" RENAME TO "sites";
CREATE UNIQUE INDEX "sites_user_id_key" ON "sites"("user_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
