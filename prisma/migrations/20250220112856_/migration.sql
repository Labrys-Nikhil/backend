/*
  Warnings:

  - You are about to drop the column `outputId` on the `hardwareoutput` table. All the data in the column will be lost.
  - You are about to drop the column `urlString` on the `networkdata` table. All the data in the column will be lost.
  - Added the required column `name` to the `hardwareoutput` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `hardwareoutput` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `hardwareoutput` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hardwareOutputId` to the `output` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `hardwareoutput` DROP FOREIGN KEY `HardwareOutput_outputId_fkey`;

-- DropIndex
DROP INDEX `HardwareOutput_outputId_fkey` ON `hardwareoutput`;

-- AlterTable
ALTER TABLE `deviceserverdata` MODIFY `deviceId` INTEGER NULL;

-- AlterTable
ALTER TABLE `hardwareoutput` DROP COLUMN `outputId`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL,
    ADD COLUMN `unit` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `networkdata` DROP COLUMN `urlString`;

-- AlterTable
ALTER TABLE `networkmodel` ADD COLUMN `urlString` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `output` ADD COLUMN `hardwareOutputId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `output` ADD CONSTRAINT `output_hardwareOutputId_fkey` FOREIGN KEY (`hardwareOutputId`) REFERENCES `hardwareoutput`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
