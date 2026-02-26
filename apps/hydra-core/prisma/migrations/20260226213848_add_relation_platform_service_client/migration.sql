/*
  Warnings:

  - A unique constraint covering the columns `[platformId]` on the table `service_clients` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "service_clients" ADD COLUMN     "platformId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "service_clients_platformId_key" ON "service_clients"("platformId");

-- AddForeignKey
ALTER TABLE "service_clients" ADD CONSTRAINT "service_clients_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "platforms"("id") ON DELETE SET NULL ON UPDATE CASCADE;
