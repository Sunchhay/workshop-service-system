-- Add machine model context to the simplified Cart -> Checkout -> Sale History flow.
ALTER TABLE "pos_carts" ADD COLUMN "machineModelId" TEXT;
ALTER TABLE "pos_carts" ADD COLUMN "modelNameSnapshot" TEXT;

ALTER TABLE "cart_items" ADD COLUMN "machineModelId" TEXT;
ALTER TABLE "cart_items" ADD COLUMN "modelNameSnapshot" TEXT;

ALTER TABLE "sales" ADD COLUMN "machineModelId" TEXT;
ALTER TABLE "sales" ADD COLUMN "modelNameSnapshot" TEXT;

ALTER TABLE "sale_items" ADD COLUMN "machineModelId" TEXT;
ALTER TABLE "sale_items" ADD COLUMN "modelNameSnapshot" TEXT;

ALTER TABLE "invoice_items" ADD COLUMN "machineModelId" TEXT;
ALTER TABLE "invoice_items" ADD COLUMN "modelNameSnapshot" TEXT;

CREATE INDEX "pos_carts_machineModelId_idx" ON "pos_carts"("machineModelId");
CREATE INDEX "cart_items_machineModelId_idx" ON "cart_items"("machineModelId");
CREATE INDEX "sales_machineModelId_idx" ON "sales"("machineModelId");
CREATE INDEX "sale_items_machineModelId_idx" ON "sale_items"("machineModelId");
CREATE INDEX "invoice_items_machineModelId_idx" ON "invoice_items"("machineModelId");

ALTER TABLE "pos_carts" ADD CONSTRAINT "pos_carts_machineModelId_fkey" FOREIGN KEY ("machineModelId") REFERENCES "machine_models"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_machineModelId_fkey" FOREIGN KEY ("machineModelId") REFERENCES "machine_models"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "sales" ADD CONSTRAINT "sales_machineModelId_fkey" FOREIGN KEY ("machineModelId") REFERENCES "machine_models"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_machineModelId_fkey" FOREIGN KEY ("machineModelId") REFERENCES "machine_models"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_machineModelId_fkey" FOREIGN KEY ("machineModelId") REFERENCES "machine_models"("id") ON DELETE SET NULL ON UPDATE CASCADE;
