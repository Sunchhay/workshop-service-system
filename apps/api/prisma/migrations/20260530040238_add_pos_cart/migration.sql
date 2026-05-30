-- CreateEnum
CREATE TYPE "PosCartStatus" AS ENUM ('ACTIVE', 'CLOSED');

-- CreateTable
CREATE TABLE "pos_carts" (
    "id" TEXT NOT NULL,
    "cartCode" TEXT NOT NULL,
    "cartName" TEXT NOT NULL DEFAULT 'New Cart',
    "customerId" TEXT,
    "customerName" TEXT NOT NULL DEFAULT 'Walk-in Customer',
    "customerPhone" TEXT NOT NULL DEFAULT '',
    "note" TEXT,
    "items" JSONB NOT NULL DEFAULT '[]',
    "discountAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH',
    "status" "PosCartStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pos_carts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pos_carts_cartCode_key" ON "pos_carts"("cartCode");

-- CreateIndex
CREATE INDEX "pos_carts_createdById_idx" ON "pos_carts"("createdById");

-- CreateIndex
CREATE INDEX "pos_carts_status_idx" ON "pos_carts"("status");

-- AddForeignKey
ALTER TABLE "pos_carts" ADD CONSTRAINT "pos_carts_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
