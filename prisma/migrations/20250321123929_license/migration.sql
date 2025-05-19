/*
  Warnings:

  - You are about to drop the column `name` on the `hardwareoutput` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `hardwareoutput` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `hardwareoutput` table. All the data in the column will be lost.
  - You are about to drop the column `hardwareOutputId` on the `output` table. All the data in the column will be lost.
  - Added the required column `outputId` to the `hardwareoutput` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `output` DROP FOREIGN KEY `output_hardwareOutputId_fkey`;

-- DropIndex
DROP INDEX `output_hardwareOutputId_fkey` ON `output`;

-- AlterTable
ALTER TABLE `hardwareoutput` DROP COLUMN `name`,
    DROP COLUMN `type`,
    DROP COLUMN `unit`,
    ADD COLUMN `outputId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `output` DROP COLUMN `hardwareOutputId`;

-- AlterTable
ALTER TABLE `pages` ADD COLUMN `refershInterval` INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `card` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `deviceId` INTEGER NOT NULL,
    `projectId` INTEGER NOT NULL,
    `devEUI` VARCHAR(191) NOT NULL,
    `pageName` VARCHAR(191) NOT NULL,
    `output` VARCHAR(191) NOT NULL,
    `displayFormula` VARCHAR(191) NULL,
    `displayUnit` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `card_deviceId_fkey`(`deviceId`),
    INDEX `card_projectId_fkey`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `HardwareOutput_outputId_fkey` ON `hardwareoutput`(`outputId`);

-- AddForeignKey
ALTER TABLE `hardwareoutput` ADD CONSTRAINT `HardwareOutput_outputId_fkey` FOREIGN KEY (`outputId`) REFERENCES `output`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `card` ADD CONSTRAINT `card_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `device`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `card` ADD CONSTRAINT `card_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
