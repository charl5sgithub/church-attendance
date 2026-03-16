-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Member',
    "dob" DATETIME,
    "phone" TEXT,
    "email" TEXT,
    "family" TEXT,
    "joinDate" DATETIME NOT NULL
);
INSERT INTO "new_Member" ("email", "family", "id", "joinDate", "name", "phone") SELECT "email", "family", "id", "joinDate", "name", "phone" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
