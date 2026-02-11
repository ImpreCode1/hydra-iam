/*
  Warnings:

  - A unique constraint covering the columns `[azure_oid]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_cargo_id_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "azure_oid" TEXT,
ALTER COLUMN "password_hash" DROP NOT NULL,
ALTER COLUMN "cargo_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_azure_oid_key" ON "users"("azure_oid");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_cargo_id_fkey" FOREIGN KEY ("cargo_id") REFERENCES "positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
