-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."AdmissionStatus" AS ENUM ('APPLIED', 'WAITING', 'REGISTERED', 'SELECTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."DocumentStage" AS ENUM ('APPLIED', 'VERIFIED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'SUBADMIN', 'STUDENT');

-- CreateTable
CREATE TABLE "public"."Program" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "programType" VARCHAR(20) NOT NULL,
    "durationYears" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProgramSeat" (
    "id" SERIAL NOT NULL,
    "totalSeats" INTEGER NOT NULL,
    "reservedSeats" INTEGER NOT NULL,
    "openSeats" INTEGER NOT NULL,
    "programId" TEXT NOT NULL,

    CONSTRAINT "ProgramSeat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FeeStructure" (
    "id" SERIAL NOT NULL,
    "totalFee" DECIMAL(10,3) NOT NULL,
    "optionalScholarshipFee" DECIMAL(10,3),
    "scholarshipAmount" DECIMAL(10,3),
    "netFee" DECIMAL(10,3) NOT NULL,
    "programId" TEXT NOT NULL,

    CONSTRAINT "FeeStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EligibilityCriteria" (
    "id" SERIAL NOT NULL,
    "minQualification" VARCHAR(100) NOT NULL,
    "minPercentage" DECIMAL(7,3) NOT NULL,
    "entranceExamName" VARCHAR(100) NOT NULL,
    "programId" TEXT NOT NULL,

    CONSTRAINT "EligibilityCriteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Student" (
    "id" SERIAL NOT NULL,
    "fullName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "address" TEXT,
    "admissionYear" INTEGER NOT NULL,
    "admissionStatus" "public"."AdmissionStatus" NOT NULL,
    "admissionNumber" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "seatId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdmissionTracking" (
    "id" SERIAL NOT NULL,
    "stage" "public"."DocumentStage" NOT NULL,
    "documentName" VARCHAR(50) NOT NULL,
    "remarks" TEXT,
    "updatedBy" VARCHAR(100) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "AdmissionTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubAdmin" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "department" VARCHAR(50),
    "password" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CampusActivity" (
    "id" SERIAL NOT NULL,
    "eventName" VARCHAR(100) NOT NULL,
    "eventType" VARCHAR(50) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "organizedBy" VARCHAR(100) NOT NULL,
    "department" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampusActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Collaboration" (
    "id" SERIAL NOT NULL,
    "industryName" VARCHAR(100) NOT NULL,
    "programId" TEXT NOT NULL,
    "companyName" VARCHAR(100) NOT NULL,
    "internshipMOU" VARCHAR(100),
    "type" VARCHAR(50),
    "yearOfSetup" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collaboration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlacementRecord" (
    "id" SERIAL NOT NULL,
    "programId" TEXT NOT NULL,
    "placementYear" INTEGER NOT NULL,
    "totalStudents" INTEGER NOT NULL,
    "eligibleStudents" INTEGER NOT NULL,
    "studentsPlaced" INTEGER NOT NULL,
    "highestPackage" DECIMAL(15,3) NOT NULL,
    "averagePackage" DECIMAL(15,3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlacementRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserLogin" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "public"."UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLogin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "public"."Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_admissionNumber_key" ON "public"."Student"("admissionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SubAdmin_email_key" ON "public"."SubAdmin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserLogin_email_key" ON "public"."UserLogin"("email");

-- AddForeignKey
ALTER TABLE "public"."ProgramSeat" ADD CONSTRAINT "ProgramSeat_programId_fkey" FOREIGN KEY ("programId") REFERENCES "public"."Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FeeStructure" ADD CONSTRAINT "FeeStructure_programId_fkey" FOREIGN KEY ("programId") REFERENCES "public"."Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EligibilityCriteria" ADD CONSTRAINT "EligibilityCriteria_programId_fkey" FOREIGN KEY ("programId") REFERENCES "public"."Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_programId_fkey" FOREIGN KEY ("programId") REFERENCES "public"."Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "public"."ProgramSeat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdmissionTracking" ADD CONSTRAINT "AdmissionTracking_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Collaboration" ADD CONSTRAINT "Collaboration_programId_fkey" FOREIGN KEY ("programId") REFERENCES "public"."Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlacementRecord" ADD CONSTRAINT "PlacementRecord_programId_fkey" FOREIGN KEY ("programId") REFERENCES "public"."Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
