/*
  Warnings:

  - You are about to drop the column `roleId` on the `customer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `customer` DROP FOREIGN KEY `customer_roleId_fkey`;

-- DropIndex
DROP INDEX `customer_roleId_fkey` ON `customer`;

-- AlterTable
ALTER TABLE `customer` DROP COLUMN `roleId`;
