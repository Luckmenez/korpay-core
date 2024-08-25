/*
  Warnings:

  - A unique constraint covering the columns `[capitual_id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `capitual_id` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "capitual_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_capitual_id_key" ON "Order"("capitual_id");
