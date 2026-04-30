-- CreateTable
CREATE TABLE "external_sites" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "logo_url" TEXT,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "external_sites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "external_sites_isActive_idx" ON "external_sites"("isActive");

-- CreateIndex
CREATE INDEX "external_sites_sort_order_idx" ON "external_sites"("sort_order");
