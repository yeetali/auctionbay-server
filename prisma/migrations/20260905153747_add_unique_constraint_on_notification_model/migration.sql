/*
  Warnings:

  - A unique constraint covering the columns `[userId,auctionId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Notification_auctionId_key";

-- DropIndex
DROP INDEX "Notification_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Notification_userId_auctionId_key" ON "Notification"("userId", "auctionId");
