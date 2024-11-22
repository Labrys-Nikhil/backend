/*
  Warnings:

  - Added the required column `updatedAt` to the `AutoDownlinkWithDelay` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `autodownlinkwithdelay` ADD COLUMN `isProcessing` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
