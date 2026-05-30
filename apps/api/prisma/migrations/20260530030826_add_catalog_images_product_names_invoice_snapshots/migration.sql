-- AlterTable
ALTER TABLE "invoice_items" ADD COLUMN     "itemCode" TEXT,
ADD COLUMN     "itemNameEn" TEXT,
ADD COLUMN     "itemNameKh" TEXT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "aliases" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "nameEn" TEXT,
ADD COLUMN     "nameKh" TEXT;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "imageUrl" TEXT;
