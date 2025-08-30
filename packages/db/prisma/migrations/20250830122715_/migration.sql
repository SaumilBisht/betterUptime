/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `region` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "region_name_key" ON "region"("name");
