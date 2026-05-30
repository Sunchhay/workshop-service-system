-- Price Catalog now stores suggested service prices by machine/model.
-- Existing rows did not have model context, so they are assigned to a fallback model.
INSERT INTO "machine_models" ("id", "brand", "model", "category", "description", "isActive", "createdAt", "updatedAt")
SELECT 'machine-model-generic-unknown', 'Generic', 'Unknown', 'General', 'Fallback model for old price catalog rows without model context.', true, NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "machine_models" WHERE "brand" = 'Generic' AND "model" = 'Unknown'
);

ALTER TABLE "price_catalogs" ADD COLUMN "machineModelId" TEXT;

UPDATE "price_catalogs"
SET "machineModelId" = (
  SELECT "id" FROM "machine_models" WHERE "brand" = 'Generic' AND "model" = 'Unknown' LIMIT 1
)
WHERE "machineModelId" IS NULL;

ALTER TABLE "price_catalogs" ALTER COLUMN "machineModelId" SET NOT NULL;

ALTER TABLE "price_catalogs" DROP COLUMN "sizeFrom";
ALTER TABLE "price_catalogs" DROP COLUMN "sizeTo";
ALTER TABLE "price_catalogs" DROP COLUMN "unit";
ALTER TABLE "price_catalogs" DROP COLUMN "difficultyLevel";
ALTER TABLE "price_catalogs" DROP COLUMN "customerType";

DROP TYPE "DifficultyLevel";

CREATE INDEX "price_catalogs_machineModelId_idx" ON "price_catalogs"("machineModelId");
CREATE INDEX "price_catalogs_serviceId_machineModelId_idx" ON "price_catalogs"("serviceId", "machineModelId");

ALTER TABLE "price_catalogs" ADD CONSTRAINT "price_catalogs_machineModelId_fkey" FOREIGN KEY ("machineModelId") REFERENCES "machine_models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
