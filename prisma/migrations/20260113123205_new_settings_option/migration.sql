-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Setting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "source" BOOLEAN NOT NULL DEFAULT true,
    "shareBar" BOOLEAN NOT NULL DEFAULT true,
    "density" TEXT NOT NULL DEFAULT 'COMFORTABLE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Setting" ("createdAt", "id", "shareBar", "source") SELECT "createdAt", "id", "shareBar", "source" FROM "Setting";
DROP TABLE "Setting";
ALTER TABLE "new_Setting" RENAME TO "Setting";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
