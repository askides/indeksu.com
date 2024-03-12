-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_urls" (
    "url" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "next_run_at" DATETIME NOT NULL,
    "notified_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,

    PRIMARY KEY ("url", "site_id"),
    CONSTRAINT "urls_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_urls" ("created_at", "next_run_at", "notified_at", "site_id", "updated_at", "url") SELECT "created_at", "next_run_at", "notified_at", "site_id", "updated_at", "url" FROM "urls";
DROP TABLE "urls";
ALTER TABLE "new_urls" RENAME TO "urls";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
