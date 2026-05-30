-- Service is master data only. Existing price values in services will be dropped.
ALTER TABLE "services" DROP COLUMN "defaultPrice";
ALTER TABLE "services" DROP COLUMN "priceType";

DROP TYPE "PriceType";
