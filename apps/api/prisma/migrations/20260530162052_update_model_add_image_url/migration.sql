/*
  Warnings:

  - The values [NORMAL,VIP,WHOLESALE,PARTNER] on the enum `CustomerType` will be removed. If these variants are still used in the database, this will fail.
  - The values [CUSTOM] on the enum `ItemType` will be removed. If these variants are still used in the database, this will fail.
  - The values [BANK_TRANSFER,CARD] on the enum `PaymentMethod` will be removed. If these variants are still used in the database, this will fail.
  - The values [DRAFT,CANCELLED] on the enum `SaleStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [TECHNICIAN,CASHIER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `address` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `customerType` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `expenseDate` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `expenseNumber` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `method` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `referenceNo` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `expenses` table. All the data in the column will be lost.
  - The `category` column on the `expenses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `amount` on the `expenses` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(10,2)`.
  - You are about to drop the column `category` on the `machine_models` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `machine_models` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `machine_models` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `machine_models` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `machine_models` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `machine_models` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `method` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `paidAt` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `paymentNumber` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `referenceNo` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `payments` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(10,2)`.
  - You are about to drop the column `brand` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `componentPartType` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `costPrice` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `linkedReferenceBookId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `reorderLevel` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `sellingPrice` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `stockQuantity` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `supplier` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `componentType` on the `reference_books` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `reference_books` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `reference_books` table. All the data in the column will be lost.
  - You are about to drop the column `machineModelId` on the `reference_books` table. All the data in the column will be lost.
  - You are about to drop the column `measurementDetails` on the `reference_books` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `reference_books` table. All the data in the column will be lost.
  - You are about to drop the column `partCode` on the `reference_books` table. All the data in the column will be lost.
  - You are about to drop the column `partName` on the `reference_books` table. All the data in the column will be lost.
  - You are about to drop the column `serviceLimit` on the `reference_books` table. All the data in the column will be lost.
  - You are about to drop the column `sourceType` on the `reference_books` table. All the data in the column will be lost.
  - You are about to drop the column `standardSize` on the `reference_books` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `reference_books` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `reference_books` table. All the data in the column will be lost.
  - You are about to drop the column `verificationStatus` on the `reference_books` table. All the data in the column will be lost.
  - You are about to drop the column `wearLimit` on the `reference_books` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `sale_items` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `sale_items` table. All the data in the column will be lost.
  - You are about to drop the column `discountAmount` on the `sale_items` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `sale_items` table. All the data in the column will be lost.
  - You are about to drop the column `saleId` on the `sale_items` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `sale_items` table. All the data in the column will be lost.
  - You are about to drop the column `unitPrice` on the `sale_items` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `sale_items` table. All the data in the column will be lost.
  - You are about to alter the column `quantity` on the `sale_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(10,2)`.
  - You are about to drop the column `createdAt` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the column `discountAmount` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the column `saleNumber` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the column `soldAt` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `sales` table. All the data in the column will be lost.
  - You are about to alter the column `subtotal` on the `sales` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(10,2)`.
  - You are about to drop the column `createdAt` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `defaultPrice` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `nameEn` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `nameKh` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `priceType` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `relatedComponent` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `invoice_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `invoices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `price_catalogs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_job_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_jobs` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[expense_no]` on the table `expenses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `machine_models` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[invoice_no]` on the table `sales` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_id` to the `expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expense_date` to the `expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expense_no` to the `expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `machine_models` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model_name` to the `machine_models` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `machine_models` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paid_at` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_method` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sale_id` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_id` to the `reference_books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `reference_books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `reference_books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_type` to the `sale_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_snapshot` to the `sale_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sale_id` to the `sale_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `sale_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_price` to the `sale_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_id` to the `sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grand_total` to the `sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoice_no` to the `sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RecordStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "CartStatus" AS ENUM ('ACTIVE', 'CHECKED_OUT');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'UNPAID', 'PARTIAL');

-- CreateEnum
CREATE TYPE "CommissionStatus" AS ENUM ('NONE', 'UNPAID', 'PAID');

-- CreateEnum
CREATE TYPE "ExpenseStatus" AS ENUM ('PAID', 'UNPAID', 'VOIDED');

-- AlterEnum
BEGIN;
CREATE TYPE "CustomerType_new" AS ENUM ('OWNER', 'MECHANIC');
ALTER TABLE "public"."customers" ALTER COLUMN "customerType" DROP DEFAULT;
ALTER TABLE "customers" ALTER COLUMN "customer_type" TYPE "CustomerType_new" USING ("customer_type"::text::"CustomerType_new");
ALTER TYPE "CustomerType" RENAME TO "CustomerType_old";
ALTER TYPE "CustomerType_new" RENAME TO "CustomerType";
DROP TYPE "public"."CustomerType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ItemType_new" AS ENUM ('SERVICE', 'PRODUCT');
ALTER TABLE "public"."invoice_items" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "public"."service_job_items" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "cart_items" ALTER COLUMN "item_type" TYPE "ItemType_new" USING ("item_type"::text::"ItemType_new");
ALTER TABLE "sale_items" ALTER COLUMN "item_type" TYPE "ItemType_new" USING ("item_type"::text::"ItemType_new");
ALTER TYPE "ItemType" RENAME TO "ItemType_old";
ALTER TYPE "ItemType_new" RENAME TO "ItemType";
DROP TYPE "public"."ItemType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethod_new" AS ENUM ('CASH', 'ACLEDA', 'ABA', 'BAKONG', 'OTHER');
ALTER TABLE "public"."expenses" ALTER COLUMN "method" DROP DEFAULT;
ALTER TABLE "public"."payments" ALTER COLUMN "method" DROP DEFAULT;
ALTER TABLE "payments" ALTER COLUMN "payment_method" TYPE "PaymentMethod_new" USING ("payment_method"::text::"PaymentMethod_new");
ALTER TABLE "expenses" ALTER COLUMN "payment_method" TYPE "PaymentMethod_new" USING ("payment_method"::text::"PaymentMethod_new");
ALTER TYPE "PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "public"."PaymentMethod_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "SaleStatus_new" AS ENUM ('COMPLETED', 'VOIDED');
ALTER TABLE "public"."sales" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "sales" ALTER COLUMN "sale_status" TYPE "SaleStatus_new" USING ("sale_status"::text::"SaleStatus_new");
ALTER TYPE "SaleStatus" RENAME TO "SaleStatus_old";
ALTER TYPE "SaleStatus_new" RENAME TO "SaleStatus";
DROP TYPE "public"."SaleStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'STAFF', 'VIEWER');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'STAFF';
COMMIT;

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "expenses" DROP CONSTRAINT "expenses_createdById_fkey";

-- DropForeignKey
ALTER TABLE "invoice_items" DROP CONSTRAINT "invoice_items_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "invoice_items" DROP CONSTRAINT "invoice_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "invoice_items" DROP CONSTRAINT "invoice_items_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_createdById_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_customerId_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_saleId_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_serviceJobId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_createdById_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_customerId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "price_catalogs" DROP CONSTRAINT "price_catalogs_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_linkedReferenceBookId_fkey";

-- DropForeignKey
ALTER TABLE "reference_books" DROP CONSTRAINT "reference_books_machineModelId_fkey";

-- DropForeignKey
ALTER TABLE "sale_items" DROP CONSTRAINT "sale_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "sale_items" DROP CONSTRAINT "sale_items_saleId_fkey";

-- DropForeignKey
ALTER TABLE "sales" DROP CONSTRAINT "sales_createdById_fkey";

-- DropForeignKey
ALTER TABLE "sales" DROP CONSTRAINT "sales_customerId_fkey";

-- DropForeignKey
ALTER TABLE "service_job_items" DROP CONSTRAINT "service_job_items_priceCatalogId_fkey";

-- DropForeignKey
ALTER TABLE "service_job_items" DROP CONSTRAINT "service_job_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "service_job_items" DROP CONSTRAINT "service_job_items_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "service_job_items" DROP CONSTRAINT "service_job_items_serviceJobId_fkey";

-- DropForeignKey
ALTER TABLE "service_jobs" DROP CONSTRAINT "service_jobs_assignedToId_fkey";

-- DropForeignKey
ALTER TABLE "service_jobs" DROP CONSTRAINT "service_jobs_createdById_fkey";

-- DropForeignKey
ALTER TABLE "service_jobs" DROP CONSTRAINT "service_jobs_customerId_fkey";

-- DropForeignKey
ALTER TABLE "service_jobs" DROP CONSTRAINT "service_jobs_machineModelId_fkey";

-- DropIndex
DROP INDEX "customers_code_key";

-- DropIndex
DROP INDEX "expenses_expenseDate_idx";

-- DropIndex
DROP INDEX "expenses_expenseNumber_key";

-- DropIndex
DROP INDEX "machine_models_brand_model_key";

-- DropIndex
DROP INDEX "payments_customerId_idx";

-- DropIndex
DROP INDEX "payments_invoiceId_idx";

-- DropIndex
DROP INDEX "payments_paymentNumber_key";

-- DropIndex
DROP INDEX "products_componentPartType_idx";

-- DropIndex
DROP INDEX "reference_books_componentType_idx";

-- DropIndex
DROP INDEX "reference_books_machineModelId_idx";

-- DropIndex
DROP INDEX "sale_items_saleId_idx";

-- DropIndex
DROP INDEX "sales_customerId_idx";

-- DropIndex
DROP INDEX "sales_saleNumber_key";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "address",
DROP COLUMN "code",
DROP COLUMN "createdAt",
DROP COLUMN "customerType",
DROP COLUMN "deletedAt",
DROP COLUMN "email",
DROP COLUMN "isActive",
DROP COLUMN "notes",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "customer_type" "CustomerType" NOT NULL DEFAULT 'OWNER',
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "last_purchased_at" TIMESTAMP(3),
ADD COLUMN     "note" TEXT,
ADD COLUMN     "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "expenses" DROP COLUMN "createdAt",
DROP COLUMN "createdById",
DROP COLUMN "deletedAt",
DROP COLUMN "description",
DROP COLUMN "expenseDate",
DROP COLUMN "expenseNumber",
DROP COLUMN "method",
DROP COLUMN "notes",
DROP COLUMN "referenceNo",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by_id" TEXT NOT NULL,
ADD COLUMN     "expense_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "expense_no" TEXT NOT NULL,
ADD COLUMN     "expense_status" "ExpenseStatus" NOT NULL DEFAULT 'PAID',
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "mechanic_id" TEXT,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "payment_method" "PaymentMethod",
ADD COLUMN     "reference_no" TEXT,
ADD COLUMN     "supplier_id" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "void_reason" TEXT,
ADD COLUMN     "voided_at" TIMESTAMP(3),
ADD COLUMN     "voided_by_id" TEXT,
DROP COLUMN "category",
ADD COLUMN     "category" TEXT,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "machine_models" DROP COLUMN "category",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "isActive",
DROP COLUMN "model",
DROP COLUMN "updatedAt",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "machine_type" TEXT,
ADD COLUMN     "model_name" TEXT NOT NULL,
ADD COLUMN     "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "year" TEXT,
ALTER COLUMN "brand" DROP NOT NULL;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "createdAt",
DROP COLUMN "createdById",
DROP COLUMN "customerId",
DROP COLUMN "invoiceId",
DROP COLUMN "method",
DROP COLUMN "notes",
DROP COLUMN "paidAt",
DROP COLUMN "paymentNumber",
DROP COLUMN "referenceNo",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "paid_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "payment_method" "PaymentMethod" NOT NULL,
ADD COLUMN     "reference_no" TEXT,
ADD COLUMN     "sale_id" TEXT NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "products" DROP COLUMN "brand",
DROP COLUMN "componentPartType",
DROP COLUMN "costPrice",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "isActive",
DROP COLUMN "linkedReferenceBookId",
DROP COLUMN "reorderLevel",
DROP COLUMN "sellingPrice",
DROP COLUMN "size",
DROP COLUMN "stockQuantity",
DROP COLUMN "supplier",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name_en" TEXT,
ADD COLUMN     "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "unit" DROP NOT NULL,
ALTER COLUMN "unit" DROP DEFAULT;

-- AlterTable
ALTER TABLE "reference_books" DROP COLUMN "componentType",
DROP COLUMN "createdAt",
DROP COLUMN "isActive",
DROP COLUMN "machineModelId",
DROP COLUMN "measurementDetails",
DROP COLUMN "notes",
DROP COLUMN "partCode",
DROP COLUMN "partName",
DROP COLUMN "serviceLimit",
DROP COLUMN "sourceType",
DROP COLUMN "standardSize",
DROP COLUMN "unit",
DROP COLUMN "updatedAt",
DROP COLUMN "verificationStatus",
DROP COLUMN "wearLimit",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by_id" TEXT NOT NULL,
ADD COLUMN     "file_url" TEXT,
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "machine_model_id" TEXT,
ADD COLUMN     "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "sale_items" DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "discountAmount",
DROP COLUMN "productId",
DROP COLUMN "saleId",
DROP COLUMN "totalPrice",
DROP COLUMN "unitPrice",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "item_type" "ItemType" NOT NULL,
ADD COLUMN     "machine_model_id" TEXT,
ADD COLUMN     "name_snapshot" TEXT NOT NULL,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "product_id" TEXT,
ADD COLUMN     "sale_id" TEXT NOT NULL,
ADD COLUMN     "service_id" TEXT,
ADD COLUMN     "total" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "unit_price" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "sales" DROP COLUMN "createdAt",
DROP COLUMN "createdById",
DROP COLUMN "customerId",
DROP COLUMN "deletedAt",
DROP COLUMN "discountAmount",
DROP COLUMN "notes",
DROP COLUMN "saleNumber",
DROP COLUMN "soldAt",
DROP COLUMN "status",
DROP COLUMN "totalAmount",
DROP COLUMN "updatedAt",
ADD COLUMN     "balance_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "commission_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "commission_note" TEXT,
ADD COLUMN     "commission_paid_at" TIMESTAMP(3),
ADD COLUMN     "commission_status" "CommissionStatus" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by_id" TEXT NOT NULL,
ADD COLUMN     "customer_id" TEXT,
ADD COLUMN     "grand_total" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "invoice_no" TEXT NOT NULL,
ADD COLUMN     "mechanic_id" TEXT,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "paid_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "payment_status" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
ADD COLUMN     "sale_status" "SaleStatus" NOT NULL DEFAULT 'COMPLETED',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "void_reason" TEXT,
ADD COLUMN     "voided_at" TIMESTAMP(3),
ADD COLUMN     "voided_by_id" TEXT,
ALTER COLUMN "subtotal" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "services" DROP COLUMN "createdAt",
DROP COLUMN "defaultPrice",
DROP COLUMN "deletedAt",
DROP COLUMN "isActive",
DROP COLUMN "nameEn",
DROP COLUMN "nameKh",
DROP COLUMN "priceType",
DROP COLUMN "relatedComponent",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "name_en" TEXT NOT NULL,
ADD COLUMN     "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatarUrl",
DROP COLUMN "createdAt",
DROP COLUMN "isActive",
DROP COLUMN "password",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "audit_logs";

-- DropTable
DROP TABLE "invoice_items";

-- DropTable
DROP TABLE "invoices";

-- DropTable
DROP TABLE "price_catalogs";

-- DropTable
DROP TABLE "service_job_items";

-- DropTable
DROP TABLE "service_jobs";

-- DropEnum
DROP TYPE "AuditAction";

-- DropEnum
DROP TYPE "DifficultyLevel";

-- DropEnum
DROP TYPE "ExpenseCategory";

-- DropEnum
DROP TYPE "InvoiceStatus";

-- DropEnum
DROP TYPE "JobStatus";

-- DropEnum
DROP TYPE "PriceType";

-- DropEnum
DROP TYPE "Priority";

-- DropEnum
DROP TYPE "ReferenceSourceType";

-- DropEnum
DROP TYPE "VerificationStatus";

-- CreateTable
CREATE TABLE "service_prices" (
    "id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "machine_model_id" TEXT NOT NULL,
    "owner_price" DECIMAL(10,2),
    "mechanic_price" DECIMAL(10,2),
    "note" TEXT,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_prices" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "machine_model_id" TEXT NOT NULL,
    "image_url" TEXT,
    "owner_price" DECIMAL(10,2),
    "mechanic_price" DECIMAL(10,2),
    "note" TEXT,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "image_url" TEXT,
    "note" TEXT,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_supplier_prices" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "buying_price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "last_updated_at" TIMESTAMP(3),
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_supplier_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT,
    "mechanic_id" TEXT,
    "created_by_id" TEXT NOT NULL,
    "commission_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "commission_note" TEXT,
    "status" "CartStatus" NOT NULL DEFAULT 'ACTIVE',
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" TEXT NOT NULL,
    "cart_id" TEXT NOT NULL,
    "item_type" "ItemType" NOT NULL,
    "service_id" TEXT,
    "product_id" TEXT,
    "machine_model_id" TEXT,
    "name_snapshot" TEXT NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "total" DECIMAL(10,2) NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reference_book_sections" (
    "id" TEXT NOT NULL,
    "reference_book_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reference_book_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reference_book_items" (
    "id" TEXT NOT NULL,
    "reference_book_section_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT,
    "unit" TEXT,
    "note" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reference_book_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,
    "type" TEXT NOT NULL DEFAULT 'text',
    "group" TEXT NOT NULL DEFAULT 'general',
    "description" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "service_prices_service_id_idx" ON "service_prices"("service_id");

-- CreateIndex
CREATE INDEX "service_prices_machine_model_id_idx" ON "service_prices"("machine_model_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_prices_service_id_machine_model_id_key" ON "service_prices"("service_id", "machine_model_id");

-- CreateIndex
CREATE INDEX "product_prices_product_id_idx" ON "product_prices"("product_id");

-- CreateIndex
CREATE INDEX "product_prices_machine_model_id_idx" ON "product_prices"("machine_model_id");

-- CreateIndex
CREATE INDEX "product_prices_status_idx" ON "product_prices"("status");

-- CreateIndex
CREATE UNIQUE INDEX "product_prices_product_id_machine_model_id_key" ON "product_prices"("product_id", "machine_model_id");

-- CreateIndex
CREATE INDEX "suppliers_name_idx" ON "suppliers"("name");

-- CreateIndex
CREATE INDEX "suppliers_phone_idx" ON "suppliers"("phone");

-- CreateIndex
CREATE INDEX "product_supplier_prices_product_id_idx" ON "product_supplier_prices"("product_id");

-- CreateIndex
CREATE INDEX "product_supplier_prices_supplier_id_idx" ON "product_supplier_prices"("supplier_id");

-- CreateIndex
CREATE INDEX "carts_customer_id_idx" ON "carts"("customer_id");

-- CreateIndex
CREATE INDEX "carts_mechanic_id_idx" ON "carts"("mechanic_id");

-- CreateIndex
CREATE INDEX "carts_created_by_id_idx" ON "carts"("created_by_id");

-- CreateIndex
CREATE INDEX "carts_status_idx" ON "carts"("status");

-- CreateIndex
CREATE INDEX "cart_items_cart_id_idx" ON "cart_items"("cart_id");

-- CreateIndex
CREATE INDEX "cart_items_item_type_idx" ON "cart_items"("item_type");

-- CreateIndex
CREATE INDEX "cart_items_service_id_idx" ON "cart_items"("service_id");

-- CreateIndex
CREATE INDEX "cart_items_product_id_idx" ON "cart_items"("product_id");

-- CreateIndex
CREATE INDEX "cart_items_machine_model_id_idx" ON "cart_items"("machine_model_id");

-- CreateIndex
CREATE INDEX "reference_book_sections_reference_book_id_idx" ON "reference_book_sections"("reference_book_id");

-- CreateIndex
CREATE INDEX "reference_book_sections_name_idx" ON "reference_book_sections"("name");

-- CreateIndex
CREATE INDEX "reference_book_sections_sort_order_idx" ON "reference_book_sections"("sort_order");

-- CreateIndex
CREATE INDEX "reference_book_items_reference_book_section_id_idx" ON "reference_book_items"("reference_book_section_id");

-- CreateIndex
CREATE INDEX "reference_book_items_label_idx" ON "reference_book_items"("label");

-- CreateIndex
CREATE INDEX "reference_book_items_sort_order_idx" ON "reference_book_items"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");

-- CreateIndex
CREATE INDEX "settings_key_idx" ON "settings"("key");

-- CreateIndex
CREATE INDEX "settings_group_idx" ON "settings"("group");

-- CreateIndex
CREATE INDEX "customers_name_idx" ON "customers"("name");

-- CreateIndex
CREATE INDEX "customers_customer_type_idx" ON "customers"("customer_type");

-- CreateIndex
CREATE INDEX "customers_last_purchased_at_idx" ON "customers"("last_purchased_at");

-- CreateIndex
CREATE INDEX "customers_status_idx" ON "customers"("status");

-- CreateIndex
CREATE UNIQUE INDEX "expenses_expense_no_key" ON "expenses"("expense_no");

-- CreateIndex
CREATE INDEX "expenses_expense_no_idx" ON "expenses"("expense_no");

-- CreateIndex
CREATE INDEX "expenses_title_idx" ON "expenses"("title");

-- CreateIndex
CREATE INDEX "expenses_category_idx" ON "expenses"("category");

-- CreateIndex
CREATE INDEX "expenses_supplier_id_idx" ON "expenses"("supplier_id");

-- CreateIndex
CREATE INDEX "expenses_mechanic_id_idx" ON "expenses"("mechanic_id");

-- CreateIndex
CREATE INDEX "expenses_expense_status_idx" ON "expenses"("expense_status");

-- CreateIndex
CREATE INDEX "expenses_expense_date_idx" ON "expenses"("expense_date");

-- CreateIndex
CREATE INDEX "expenses_created_by_id_idx" ON "expenses"("created_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "machine_models_code_key" ON "machine_models"("code");

-- CreateIndex
CREATE INDEX "machine_models_code_idx" ON "machine_models"("code");

-- CreateIndex
CREATE INDEX "machine_models_model_name_idx" ON "machine_models"("model_name");

-- CreateIndex
CREATE INDEX "machine_models_machine_type_idx" ON "machine_models"("machine_type");

-- CreateIndex
CREATE INDEX "payments_sale_id_idx" ON "payments"("sale_id");

-- CreateIndex
CREATE INDEX "payments_payment_method_idx" ON "payments"("payment_method");

-- CreateIndex
CREATE INDEX "payments_paid_at_idx" ON "payments"("paid_at");

-- CreateIndex
CREATE INDEX "products_code_idx" ON "products"("code");

-- CreateIndex
CREATE INDEX "products_name_idx" ON "products"("name");

-- CreateIndex
CREATE INDEX "products_name_en_idx" ON "products"("name_en");

-- CreateIndex
CREATE INDEX "products_category_idx" ON "products"("category");

-- CreateIndex
CREATE INDEX "products_status_idx" ON "products"("status");

-- CreateIndex
CREATE INDEX "reference_books_title_idx" ON "reference_books"("title");

-- CreateIndex
CREATE INDEX "reference_books_category_idx" ON "reference_books"("category");

-- CreateIndex
CREATE INDEX "reference_books_machine_model_id_idx" ON "reference_books"("machine_model_id");

-- CreateIndex
CREATE INDEX "reference_books_status_idx" ON "reference_books"("status");

-- CreateIndex
CREATE INDEX "reference_books_created_by_id_idx" ON "reference_books"("created_by_id");

-- CreateIndex
CREATE INDEX "sale_items_sale_id_idx" ON "sale_items"("sale_id");

-- CreateIndex
CREATE INDEX "sale_items_item_type_idx" ON "sale_items"("item_type");

-- CreateIndex
CREATE INDEX "sale_items_service_id_idx" ON "sale_items"("service_id");

-- CreateIndex
CREATE INDEX "sale_items_product_id_idx" ON "sale_items"("product_id");

-- CreateIndex
CREATE INDEX "sale_items_machine_model_id_idx" ON "sale_items"("machine_model_id");

-- CreateIndex
CREATE UNIQUE INDEX "sales_invoice_no_key" ON "sales"("invoice_no");

-- CreateIndex
CREATE INDEX "sales_invoice_no_idx" ON "sales"("invoice_no");

-- CreateIndex
CREATE INDEX "sales_customer_id_idx" ON "sales"("customer_id");

-- CreateIndex
CREATE INDEX "sales_mechanic_id_idx" ON "sales"("mechanic_id");

-- CreateIndex
CREATE INDEX "sales_created_by_id_idx" ON "sales"("created_by_id");

-- CreateIndex
CREATE INDEX "sales_payment_status_idx" ON "sales"("payment_status");

-- CreateIndex
CREATE INDEX "sales_sale_status_idx" ON "sales"("sale_status");

-- CreateIndex
CREATE INDEX "sales_created_at_idx" ON "sales"("created_at");

-- CreateIndex
CREATE INDEX "services_code_idx" ON "services"("code");

-- CreateIndex
CREATE INDEX "services_name_idx" ON "services"("name");

-- CreateIndex
CREATE INDEX "services_name_en_idx" ON "services"("name_en");

-- CreateIndex
CREATE INDEX "services_category_idx" ON "services"("category");

-- AddForeignKey
ALTER TABLE "service_prices" ADD CONSTRAINT "service_prices_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_prices" ADD CONSTRAINT "service_prices_machine_model_id_fkey" FOREIGN KEY ("machine_model_id") REFERENCES "machine_models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_machine_model_id_fkey" FOREIGN KEY ("machine_model_id") REFERENCES "machine_models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_supplier_prices" ADD CONSTRAINT "product_supplier_prices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_supplier_prices" ADD CONSTRAINT "product_supplier_prices_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_mechanic_id_fkey" FOREIGN KEY ("mechanic_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_machine_model_id_fkey" FOREIGN KEY ("machine_model_id") REFERENCES "machine_models"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_mechanic_id_fkey" FOREIGN KEY ("mechanic_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_voided_by_id_fkey" FOREIGN KEY ("voided_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_machine_model_id_fkey" FOREIGN KEY ("machine_model_id") REFERENCES "machine_models"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_mechanic_id_fkey" FOREIGN KEY ("mechanic_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_voided_by_id_fkey" FOREIGN KEY ("voided_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reference_books" ADD CONSTRAINT "reference_books_machine_model_id_fkey" FOREIGN KEY ("machine_model_id") REFERENCES "machine_models"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reference_books" ADD CONSTRAINT "reference_books_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reference_book_sections" ADD CONSTRAINT "reference_book_sections_reference_book_id_fkey" FOREIGN KEY ("reference_book_id") REFERENCES "reference_books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reference_book_items" ADD CONSTRAINT "reference_book_items_reference_book_section_id_fkey" FOREIGN KEY ("reference_book_section_id") REFERENCES "reference_book_sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
