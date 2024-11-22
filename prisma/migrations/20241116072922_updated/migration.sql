/*
  Warnings:

  - You are about to drop the column `relayStateId` on the `downlinkdevice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[deviceId]` on the table `device` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `DownlinkDevice_relayStateId_fkey` ON `downlinkdevice`;

-- AlterTable
ALTER TABLE `downlinkdevice` DROP COLUMN `relayStateId`;

-- CreateIndex
CREATE UNIQUE INDEX `device_deviceId_key` ON `device`(`deviceId`);
