-- AlterTable
ALTER TABLE "public"."Student" ADD COLUMN     "salesId" INTEGER;

-- CreateTable
CREATE TABLE "public"."SalesPerson" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "region" VARCHAR(100) NOT NULL,
    "assignedProgram" VARCHAR(10) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesPerson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SalesPerson_email_key" ON "public"."SalesPerson"("email");

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_salesId_fkey" FOREIGN KEY ("salesId") REFERENCES "public"."SalesPerson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
