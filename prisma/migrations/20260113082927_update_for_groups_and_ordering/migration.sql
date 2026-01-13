-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LinkGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "icon" TEXT,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_LinkGroup" ("createdAt", "icon", "id", "name") SELECT "createdAt", "icon", "id", "name" FROM "LinkGroup";
DROP TABLE "LinkGroup";
ALTER TABLE "new_LinkGroup" RENAME TO "LinkGroup";
CREATE TABLE "new_NormalLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "icon" TEXT,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "linkGroupId" TEXT,
    CONSTRAINT "NormalLink_linkGroupId_fkey" FOREIGN KEY ("linkGroupId") REFERENCES "LinkGroup" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_NormalLink" ("createdAt", "icon", "id", "linkGroupId", "title", "url") SELECT "createdAt", "icon", "id", "linkGroupId", "title", "url" FROM "NormalLink";
DROP TABLE "NormalLink";
ALTER TABLE "new_NormalLink" RENAME TO "NormalLink";
CREATE TABLE "new_TopLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "icon" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_TopLink" ("createdAt", "icon", "id", "url") SELECT "createdAt", "icon", "id", "url" FROM "TopLink";
DROP TABLE "TopLink";
ALTER TABLE "new_TopLink" RENAME TO "TopLink";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
