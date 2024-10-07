/*
  Warnings:

  - You are about to drop the column `requestPath` on the `ApiPerformance` table. All the data in the column will be lost.
  - Added the required column `endpoint` to the `ApiPerformance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `method` to the `ApiPerformance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responseTime` to the `ApiPerformance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApiPerformance" DROP COLUMN "requestPath",
ADD COLUMN     "endpoint" TEXT NOT NULL,
ADD COLUMN     "method" TEXT NOT NULL,
ADD COLUMN     "responseTime" INTEGER NOT NULL;
