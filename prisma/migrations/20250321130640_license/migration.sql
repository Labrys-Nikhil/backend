/*
  Warnings:

  - You are about to drop the column `role` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `outputId` on the `hardwareoutput` table. All the data in the column will be lost.
  - Added the required column `name` to the `hardwareoutput` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `hardwareoutput` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `hardwareoutput` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `hardwareoutput` DROP FOREIGN KEY `HardwareOutput_outputId_fkey`;

-- DropIndex
DROP INDEX `HardwareOutput_outputId_fkey` ON `hardwareoutput`;

-- DropIndex
DROP INDEX `tokenblacklist_token_key` ON `tokenblacklist`;

-- AlterTable
ALTER TABLE `card` ADD COLUMN `displayFormulaSecondary` VARCHAR(191) NULL,
    ADD COLUMN `displayUnitSecondary` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `customer` DROP COLUMN `role`,
    ADD COLUMN `roleId` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `hardwareoutput` DROP COLUMN `outputId`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL,
    ADD COLUMN `unit` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `networkdata` ADD COLUMN `organizationId` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `urlString` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `networkmodel` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `method` VARCHAR(191) NULL,
    ADD COLUMN `organizationId` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `server` VARCHAR(255) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `projects` ADD COLUMN `organizationId` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `tokenblacklist` MODIFY `token` TEXT NOT NULL;

-- CreateTable
CREATE TABLE `HardwareController` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `urlString` VARCHAR(191) NULL,
    `hardwareId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Module` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Module_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubModule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `moduleId` INTEGER NOT NULL,

    UNIQUE INDEX `SubModule_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserPermission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `subModuleId` INTEGER NOT NULL,
    `canCreate` BOOLEAN NOT NULL DEFAULT false,
    `canRead` BOOLEAN NOT NULL DEFAULT true,
    `canUpdate` BOOLEAN NOT NULL DEFAULT false,
    `canDelete` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `License` (
    `id` VARCHAR(191) NOT NULL,
    `organizationId` INTEGER NOT NULL,
    `licenseKey` VARCHAR(512) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `isExpired` BOOLEAN NOT NULL DEFAULT false,
    `subscriptionId` VARCHAR(191) NULL,
    `currentUsers` INTEGER NOT NULL DEFAULT 0,
    `currentDevices` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `License_licenseKey_key`(`licenseKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subscription` (
    `id` VARCHAR(191) NOT NULL,
    `organizationId` INTEGER NOT NULL,
    `planId` INTEGER NOT NULL,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endDate` DATETIME(3) NULL,
    `isTrial` BOOLEAN NOT NULL DEFAULT true,
    `customerId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Plan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `deviceLimit` INTEGER NOT NULL,
    `userLimit` INTEGER NOT NULL,
    `analytics` BOOLEAN NULL,
    `emailSupport` BOOLEAN NULL,
    `notifications` BOOLEAN NULL,
    `price` DOUBLE NOT NULL,

    UNIQUE INDEX `Plan_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentData` (
    `id` VARCHAR(191) NOT NULL,
    `subscriptionId` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'Rupees',
    `method` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `transactionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `licenseId` VARCHAR(191) NULL,

    UNIQUE INDEX `PaymentData_subscriptionId_key`(`subscriptionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `customer` ADD CONSTRAINT `customer_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `networkmodel` ADD CONSTRAINT `networkmodel_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `networkdata` ADD CONSTRAINT `networkdata_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HardwareController` ADD CONSTRAINT `HardwareController_hardwareId_fkey` FOREIGN KEY (`hardwareId`) REFERENCES `hardware`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubModule` ADD CONSTRAINT `SubModule_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `Module`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPermission` ADD CONSTRAINT `UserPermission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPermission` ADD CONSTRAINT `UserPermission_subModuleId_fkey` FOREIGN KEY (`subModuleId`) REFERENCES `SubModule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `License` ADD CONSTRAINT `License_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `License` ADD CONSTRAINT `License_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `Plan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentData` ADD CONSTRAINT `PaymentData_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentData` ADD CONSTRAINT `PaymentData_licenseId_fkey` FOREIGN KEY (`licenseId`) REFERENCES `License`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
