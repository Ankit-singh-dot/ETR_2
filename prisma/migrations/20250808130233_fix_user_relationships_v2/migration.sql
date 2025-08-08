/*
  Warnings:

  - You are about to drop the column `email` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `SubAdmin` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `SubAdmin` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userLoginId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userLoginId]` on the table `SubAdmin` will be added. If there are existing duplicate values, this will fail.

*/

-- Step 1: Add new columns as nullable first
ALTER TABLE "public"."Student" ADD COLUMN "userLoginId" INTEGER;
ALTER TABLE "public"."SubAdmin" ADD COLUMN "userLoginId" INTEGER;

-- Step 2: Create UserLogin records for existing Student records
INSERT INTO "public"."UserLogin" ("email", "password", "role", "createdAt", "updatedAt")
SELECT 
  CONCAT('student_', s."id", '@temp.com') as email,
  '$2b$10$temp.password.hash.for.migration' as password,
  'STUDENT' as role,
  s."createdAt",
  s."updatedAt"
FROM "public"."Student" s;

-- Step 3: Update Student records with the new UserLogin IDs
UPDATE "public"."Student" 
SET "userLoginId" = ul."id"
FROM "public"."UserLogin" ul
WHERE ul."email" = CONCAT('student_', "public"."Student"."id", '@temp.com');

-- Step 4: Create UserLogin records for existing SubAdmin records
INSERT INTO "public"."UserLogin" ("email", "password", "role", "createdAt", "updatedAt")
SELECT 
  CONCAT('subadmin_', sa."id", '@temp.com') as email,
  '$2b$10$temp.password.hash.for.migration' as password,
  'SUBADMIN' as role,
  sa."createdAt",
  sa."updatedAt"
FROM "public"."SubAdmin" sa;

-- Step 5: Update SubAdmin records with the new UserLogin IDs
UPDATE "public"."SubAdmin" 
SET "userLoginId" = ul."id"
FROM "public"."UserLogin" ul
WHERE ul."email" = CONCAT('subadmin_', "public"."SubAdmin"."id", '@temp.com');

-- Step 6: Make the columns required
ALTER TABLE "public"."Student" ALTER COLUMN "userLoginId" SET NOT NULL;
ALTER TABLE "public"."SubAdmin" ALTER COLUMN "userLoginId" SET NOT NULL;

-- Step 7: Drop old columns
ALTER TABLE "public"."Student" DROP COLUMN "email";
ALTER TABLE "public"."SubAdmin" DROP COLUMN "email";
ALTER TABLE "public"."SubAdmin" DROP COLUMN "password";

-- Step 8: Safely drop old indexes if they exist
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'Student_email_key') THEN
        DROP INDEX "public"."Student_email_key";
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'SubAdmin_email_key') THEN
        DROP INDEX "public"."SubAdmin_email_key";
    END IF;
END $$;

-- Step 9: Create new indexes
CREATE UNIQUE INDEX "Student_userLoginId_key" ON "public"."Student"("userLoginId");
CREATE UNIQUE INDEX "SubAdmin_userLoginId_key" ON "public"."SubAdmin"("userLoginId");

-- Step 10: Add foreign key constraints
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_userLoginId_fkey" FOREIGN KEY ("userLoginId") REFERENCES "public"."UserLogin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."SubAdmin" ADD CONSTRAINT "SubAdmin_userLoginId_fkey" FOREIGN KEY ("userLoginId") REFERENCES "public"."UserLogin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
