/*
  Warnings:

  - You are about to drop the column `photoId` on the `Staff` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "photoId",
ADD COLUMN     "photoUrl" TEXT;
