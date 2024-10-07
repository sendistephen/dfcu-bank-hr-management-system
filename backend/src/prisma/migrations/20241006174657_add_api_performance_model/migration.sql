-- CreateTable
CREATE TABLE "ApiPerformance" (
    "id" SERIAL NOT NULL,
    "requestPath" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiPerformance_pkey" PRIMARY KEY ("id")
);
