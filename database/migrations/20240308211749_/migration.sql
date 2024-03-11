/*
  Warnings:

  - Added the required column `refresh_token` to the `oauth_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_oauth_tokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "scopes" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "oauth_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_oauth_tokens" ("access_token", "created_at", "expires_at", "id", "scopes", "updated_at", "user_id") SELECT "access_token", "created_at", "expires_at", "id", "scopes", "updated_at", "user_id" FROM "oauth_tokens";
DROP TABLE "oauth_tokens";
ALTER TABLE "new_oauth_tokens" RENAME TO "oauth_tokens";
CREATE UNIQUE INDEX "oauth_tokens_user_id_key" ON "oauth_tokens"("user_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
