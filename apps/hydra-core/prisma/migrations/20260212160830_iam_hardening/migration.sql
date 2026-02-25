/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `platforms` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "platforms" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "positions" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "platforms_code_key" ON "platforms"("code");

-- CreateIndex
CREATE INDEX "platforms_code_idx" ON "platforms"("code");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_azure_oid_idx" ON "users"("azure_oid");

-- CreateIndex
CREATE INDEX "users_cargo_id_idx" ON "users"("cargo_id");
