/*
  Warnings:

  - A unique constraint covering the columns `[userId,url]` on the table `website` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "website_userId_url_key" ON "website"("userId", "url");
