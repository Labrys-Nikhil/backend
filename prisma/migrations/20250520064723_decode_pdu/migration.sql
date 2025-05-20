-- CreateTable
CREATE TABLE `alerts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `deviceId` INTEGER NOT NULL,
    `operator` VARCHAR(191) NOT NULL,
    `value` INTEGER NOT NULL,
    `bitwiseOperator` VARCHAR(191) NOT NULL,
    `readingBeforeAlerts` INTEGER NOT NULL,

    INDEX `alerts_deviceId_idx`(`deviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `autodownlink` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `alertId` INTEGER NOT NULL,
    `timeout` INTEGER NULL,
    `schedule` INTEGER NULL,
    `port` INTEGER NOT NULL,
    `downlinkController` VARCHAR(191) NOT NULL,
    `classType` VARCHAR(191) NOT NULL,
    `devEui` VARCHAR(191) NOT NULL,
    `pdu` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AutoDownlink_alertId_key`(`alertId`),
    INDEX `autodownlink_alertId_idx`(`alertId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(50) NOT NULL,
    `lastName` VARCHAR(50) NOT NULL,
    `image` VARCHAR(255) NULL,
    `companyName` VARCHAR(100) NULL,
    `password` VARCHAR(255) NOT NULL,
    `countryCode` VARCHAR(10) NOT NULL,
    `phoneNumber` VARCHAR(20) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `isOrgnizationCreated` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Customer_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deviceattribute` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `deviceId` INTEGER NOT NULL,

    INDEX `deviceattribute_deviceId_idx`(`deviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `devicedecodedata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `devEui` VARCHAR(191) NOT NULL,
    `attributesName` VARCHAR(191) NOT NULL,
    `attributesValue` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deviceId` INTEGER NULL,
    `attributesUnits` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deviceserverdata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `devEui` VARCHAR(191) NOT NULL,
    `seqno` INTEGER NOT NULL,
    `port` INTEGER NOT NULL,
    `ack` BOOLEAN NOT NULL,
    `pdu` VARCHAR(191) NOT NULL,
    `txtime` DATETIME(3) NOT NULL,
    `serverName` VARCHAR(191) NOT NULL DEFAULT 'null',
    `joinId` INTEGER NULL,
    `gwEui` VARCHAR(191) NULL,
    `rssi` INTEGER NULL,
    `snr` DOUBLE NULL,
    `freq` DOUBLE NULL,
    `channel` INTEGER NULL,
    `datarate` INTEGER NULL,
    `dup` BOOLEAN NULL,
    `estLat` DOUBLE NULL,
    `estLng` DOUBLE NULL,
    `cfgLat` DOUBLE NULL,
    `cfgLng` DOUBLE NULL,
    `devClass` VARCHAR(191) NULL,
    `devType` VARCHAR(191) NULL,
    `devProfile` VARCHAR(191) NULL,
    `metadata` VARCHAR(191) NULL,
    `ackDnMsgId` INTEGER NULL,
    `ackDnSeqNo` INTEGER NULL,
    `bat` INTEGER NULL,
    `fcnt` INTEGER NULL,
    `offline` BOOLEAN NULL,
    `decodedData` JSON NULL,
    `deviceId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `downlinkdevice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `devEui` VARCHAR(191) NOT NULL,
    `downlinkController` VARCHAR(191) NOT NULL,
    `classType` VARCHAR(191) NOT NULL,
    `pdu` VARCHAR(191) NOT NULL,
    `confirmed` BOOLEAN NOT NULL DEFAULT false,
    `timeoutMinutes` INTEGER NOT NULL,
    `port` VARCHAR(191) NOT NULL,
    `payload` VARCHAR(191) NOT NULL,
    `deviceId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `downlinkdevice_deviceId_idx`(`deviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hardware` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `organizationId` INTEGER NOT NULL DEFAULT 0,
    `imageKey` VARCHAR(191) NULL,
    `imageLocation` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('hybrid', 'controller', 'sensor') NOT NULL,
    `description` VARCHAR(191) NULL,
    `modelNo` VARCHAR(191) NOT NULL,
    `manufacturerId` INTEGER NOT NULL,
    `tagId` INTEGER NOT NULL,
    `gpsSupported` BOOLEAN NOT NULL DEFAULT true,
    `configured` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `decoderName` VARCHAR(191) NOT NULL,
    `decoderPDU` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hardwareattributes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `hardwareId` INTEGER NOT NULL,

    INDEX `hardwareattributes_hardwareId_idx`(`hardwareId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hardwareoutput` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hardwareId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `unit` VARCHAR(191) NOT NULL,

    INDEX `hardwareoutput_hardwareId_idx`(`hardwareId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message` VARCHAR(191) NOT NULL,
    `deviceId` INTEGER NOT NULL,
    `alertId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notification_alertId_idx`(`alertId`),
    INDEX `notification_deviceId_idx`(`deviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organization` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `customerId` INTEGER NOT NULL,

    INDEX `organization_customerId_idx`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `output` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deviceId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `unit` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `linkedTo` VARCHAR(191) NOT NULL,

    INDEX `output_deviceId_idx`(`deviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `solutions` VARCHAR(255) NOT NULL,
    `area` VARCHAR(100) NOT NULL,
    `setLimit` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `customerId` INTEGER NOT NULL,
    `estLat` DOUBLE NOT NULL,
    `estLng` DOUBLE NOT NULL,
    `enabled` BOOLEAN NULL DEFAULT true,
    `organizationId` INTEGER NOT NULL DEFAULT 0,

    INDEX `projects_customerId_idx`(`customerId`),
    INDEX `projects_organizationId_idx`(`organizationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `timezone` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `offset` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `device` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `manufacture` VARCHAR(191) NOT NULL,
    `mainOutput` JSON NOT NULL,
    `currentLocation` VARCHAR(191) NOT NULL,
    `hardwareId` INTEGER NOT NULL,
    `networkId` INTEGER NOT NULL,
    `organizationId` INTEGER NOT NULL,
    `projectId` INTEGER NOT NULL,
    `hardwareOutputId` INTEGER NULL,
    `deviceId` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `hardwareType` VARCHAR(191) NOT NULL DEFAULT 'LoraWan',
    `network` VARCHAR(191) NOT NULL DEFAULT 'SENRA',
    `deviceLocationName` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `device_deviceId_key`(`deviceId`),
    INDEX `device_hardwareId_idx`(`hardwareId`),
    INDEX `device_organizationId_idx`(`organizationId`),
    INDEX `device_projectId_idx`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `autodownlinkwithdelay` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `downlinkController` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL,
    `timeoutMinutes` INTEGER NOT NULL,
    `classType` VARCHAR(191) NOT NULL,
    `port` INTEGER NOT NULL,
    `deviceId` INTEGER NOT NULL,
    `devEui` VARCHAR(191) NOT NULL,
    `pdu` VARCHAR(191) NOT NULL,
    `isProcessing` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `addwidget` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pageName` VARCHAR(191) NOT NULL,
    `stepOneData` JSON NOT NULL,
    `stepTwoData` JSON NOT NULL,
    `stepThreeData` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `projectId` INTEGER NOT NULL,

    INDEX `addwidget_projectId_idx`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pageName` VARCHAR(191) NOT NULL,
    `projectId` INTEGER NOT NULL,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `refershInterval` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tokenblacklist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` TEXT NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `label` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `color` VARCHAR(191) NOT NULL,
    `projectId` INTEGER NOT NULL,
    `deviceId` INTEGER NOT NULL,
    `outputId` INTEGER NOT NULL,
    `outputName` VARCHAR(191) NOT NULL,
    `conditionValue` INTEGER NOT NULL,
    `conditionOperator` ENUM('EQ', 'GTE', 'LTE', 'GT', 'LT') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `loriotuplinkmessage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cmd` VARCHAR(191) NOT NULL,
    `seqno` INTEGER NOT NULL,
    `EUI` VARCHAR(191) NOT NULL,
    `ts` BIGINT NOT NULL,
    `ack` BOOLEAN NOT NULL,
    `bat` DOUBLE NOT NULL,
    `fcnt` BIGINT NOT NULL,
    `port` INTEGER NOT NULL,
    `offline` BOOLEAN NOT NULL,
    `encdata` VARCHAR(191) NULL,
    `data` VARCHAR(191) NULL,
    `decoded` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `networkmodel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `urlString` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `method` VARCHAR(191) NULL,
    `server` VARCHAR(255) NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `networkdata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `networkId` INTEGER NOT NULL,
    `hostname` VARCHAR(191) NULL,
    `token` VARCHAR(191) NULL,
    `customerId` INTEGER NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `appid` VARCHAR(191) NULL,
    `organizationId` INTEGER NOT NULL DEFAULT 0,
    `urlString` VARCHAR(191) NULL,

    INDEX `networkdata_customerId_idx`(`customerId`),
    INDEX `networkdata_networkId_idx`(`networkId`),
    INDEX `networkdata_organizationId_idx`(`organizationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `addreport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reportName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `duration` VARCHAR(191) NOT NULL,
    `hardwareId` JSON NOT NULL,
    `deviceId` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `projectId` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `displayFormulaSecondary` VARCHAR(191) NULL,
    `displayUnitSecondary` VARCHAR(191) NULL,

    INDEX `card_deviceId_idx`(`deviceId`),
    INDEX `card_projectId_idx`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HardwareController` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `urlString` VARCHAR(191) NULL,
    `hardwareId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `HardwareController_hardwareId_idx`(`hardwareId`),
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
    INDEX `SubModule_moduleId_idx`(`moduleId`),
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

    INDEX `UserPermission_subModuleId_idx`(`subModuleId`),
    INDEX `UserPermission_userId_idx`(`userId`),
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
    INDEX `License_organizationId_idx`(`organizationId`),
    INDEX `License_subscriptionId_idx`(`subscriptionId`),
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

    INDEX `Subscription_customerId_idx`(`customerId`),
    INDEX `Subscription_organizationId_idx`(`organizationId`),
    INDEX `Subscription_planId_idx`(`planId`),
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
    INDEX `PaymentData_licenseId_idx`(`licenseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `manufacturer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `manufacturer_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_addreportToprojects` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_addreportToprojects_AB_unique`(`A`, `B`),
    INDEX `_addreportToprojects_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `alerts` ADD CONSTRAINT `alerts_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `device`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `autodownlink` ADD CONSTRAINT `autodownlink_alertId_fkey` FOREIGN KEY (`alertId`) REFERENCES `alerts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deviceattribute` ADD CONSTRAINT `deviceattribute_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `device`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `downlinkdevice` ADD CONSTRAINT `downlinkdevice_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `device`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hardware` ADD CONSTRAINT `hardware_manufacturerId_fkey` FOREIGN KEY (`manufacturerId`) REFERENCES `manufacturer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hardwareattributes` ADD CONSTRAINT `hardwareattributes_hardwareId_fkey` FOREIGN KEY (`hardwareId`) REFERENCES `hardware`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hardwareoutput` ADD CONSTRAINT `hardwareoutput_hardwareId_fkey` FOREIGN KEY (`hardwareId`) REFERENCES `hardware`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_alertId_fkey` FOREIGN KEY (`alertId`) REFERENCES `alerts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `device`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organization` ADD CONSTRAINT `organization_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `output` ADD CONSTRAINT `output_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `device`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `device` ADD CONSTRAINT `device_hardwareId_fkey` FOREIGN KEY (`hardwareId`) REFERENCES `hardware`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `device` ADD CONSTRAINT `device_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `device` ADD CONSTRAINT `device_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `addwidget` ADD CONSTRAINT `addwidget_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `networkdata` ADD CONSTRAINT `networkdata_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `networkdata` ADD CONSTRAINT `networkdata_networkId_fkey` FOREIGN KEY (`networkId`) REFERENCES `networkmodel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `networkdata` ADD CONSTRAINT `networkdata_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `card` ADD CONSTRAINT `card_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `device`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `card` ADD CONSTRAINT `card_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HardwareController` ADD CONSTRAINT `HardwareController_hardwareId_fkey` FOREIGN KEY (`hardwareId`) REFERENCES `hardware`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubModule` ADD CONSTRAINT `SubModule_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `Module`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPermission` ADD CONSTRAINT `UserPermission_subModuleId_fkey` FOREIGN KEY (`subModuleId`) REFERENCES `SubModule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPermission` ADD CONSTRAINT `UserPermission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `License` ADD CONSTRAINT `License_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `License` ADD CONSTRAINT `License_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `Plan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentData` ADD CONSTRAINT `PaymentData_licenseId_fkey` FOREIGN KEY (`licenseId`) REFERENCES `License`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentData` ADD CONSTRAINT `PaymentData_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_addreportToprojects` ADD CONSTRAINT `_addreportToprojects_A_fkey` FOREIGN KEY (`A`) REFERENCES `addreport`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_addreportToprojects` ADD CONSTRAINT `_addreportToprojects_B_fkey` FOREIGN KEY (`B`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
