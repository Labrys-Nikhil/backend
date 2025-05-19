/*
  Warnings:

  - You are about to drop the column `organizationId` on the `networkmodel` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `networkmodel` DROP FOREIGN KEY `networkmodel_organizationId_fkey`;

-- DropIndex
DROP INDEX `networkmodel_organizationId_fkey` ON `networkmodel`;

-- AlterTable
ALTER TABLE `networkmodel` DROP COLUMN `organizationId`;
