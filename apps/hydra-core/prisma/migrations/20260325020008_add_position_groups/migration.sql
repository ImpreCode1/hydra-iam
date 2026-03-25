/*
  Warnings:

  - You are about to drop the column `createdAt` on the `service_clients` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "cargo_rol" DROP CONSTRAINT "cargo_rol_cargo_id_fkey";

-- DropForeignKey
ALTER TABLE "cargo_rol" DROP CONSTRAINT "cargo_rol_rol_id_fkey";

-- DropForeignKey
ALTER TABLE "plataforma_rol" DROP CONSTRAINT "plataforma_rol_plataforma_id_fkey";

-- DropForeignKey
ALTER TABLE "plataforma_rol" DROP CONSTRAINT "plataforma_rol_rol_id_fkey";

-- DropForeignKey
ALTER TABLE "usuario_rol" DROP CONSTRAINT "usuario_rol_rol_id_fkey";

-- DropForeignKey
ALTER TABLE "usuario_rol" DROP CONSTRAINT "usuario_rol_usuario_id_fkey";

-- AlterTable
ALTER TABLE "positions" ADD COLUMN     "group_id" TEXT;

-- AlterTable
ALTER TABLE "service_clients" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "position_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "position_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "position_group_role" (
    "group_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,

    CONSTRAINT "position_group_role_pkey" PRIMARY KEY ("group_id","role_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "position_groups_name_key" ON "position_groups"("name");

-- CreateIndex
CREATE INDEX "position_group_role_role_id_idx" ON "position_group_role"("role_id");

-- CreateIndex
CREATE INDEX "positions_group_id_idx" ON "positions"("group_id");

-- AddForeignKey
ALTER TABLE "positions" ADD CONSTRAINT "positions_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "position_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "position_group_role" ADD CONSTRAINT "position_group_role_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "position_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "position_group_role" ADD CONSTRAINT "position_group_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plataforma_rol" ADD CONSTRAINT "plataforma_rol_plataforma_id_fkey" FOREIGN KEY ("plataforma_id") REFERENCES "platforms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plataforma_rol" ADD CONSTRAINT "plataforma_rol_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_rol" ADD CONSTRAINT "usuario_rol_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_rol" ADD CONSTRAINT "usuario_rol_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cargo_rol" ADD CONSTRAINT "cargo_rol_cargo_id_fkey" FOREIGN KEY ("cargo_id") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cargo_rol" ADD CONSTRAINT "cargo_rol_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
