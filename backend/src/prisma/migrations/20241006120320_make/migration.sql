-- DropForeignKey
ALTER TABLE "StaffCode" DROP CONSTRAINT "StaffCode_staffId_fkey";

-- AlterTable
ALTER TABLE "StaffCode" ALTER COLUMN "staffId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "StaffCode" ADD CONSTRAINT "StaffCode_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
