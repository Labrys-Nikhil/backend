-- CreateTable
CREATE TABLE `alerts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `deviceId` INTEGER NOT NULL,
    `operator` VARCHAR(191) NOT NULL,
    `value` INTEGER NOT NULL,
    `bitwiseOperator` VARCHAR(191) NOT NULL,
    `readingBeforeAlerts` INTEGER NOT NULL,

    INDEX `Alerts_deviceId_idx`(`deviceId`),
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
    INDEX `AutoDownlink_alertId_idx`(`alertId`),
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
    `role` VARCHAR(191) NOT NULL DEFAULT 'customer',
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

    INDEX `DeviceAttribute_deviceId_fkey`(`deviceId`),
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

    INDEX `DownlinkDevice_deviceId_fkey`(`deviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hardware` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `organizationId` INTEGER NOT NULL DEFAULT 0,
    `imageKey` VARCHAR(191) NULL,
    `imageLocation` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `modelNo` VARCHAR(191) NOT NULL,
    `manufacturerId` INTEGER NOT NULL,
    `tagId` INTEGER NOT NULL,
    `gpsSupported` BOOLEAN NOT NULL DEFAULT true,
    `configured` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `decoderName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hardwareattributes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `hardwareId` INTEGER NOT NULL,

    INDEX `HardwareAttributes_hardwareId_fkey`(`hardwareId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hardwareoutput` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hardwareId` INTEGER NOT NULL,
    `outputId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `HardwareOutput_hardwareId_fkey`(`hardwareId`),
    INDEX `HardwareOutput_outputId_fkey`(`outputId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message` VARCHAR(191) NOT NULL,
    `deviceId` INTEGER NOT NULL,
    `alertId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Notification_alertId_fkey`(`alertId`),
    INDEX `Notification_deviceId_idx`(`deviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organization` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `customerId` INTEGER NOT NULL,

    INDEX `Organization_customerId_idx`(`customerId`),
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

    INDEX `Projects_customerId_idx`(`customerId`),
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
    `deviceLocation` VARCHAR(191) NOT NULL,
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
    INDEX `Device_hardwareId_fkey`(`hardwareId`),
    INDEX `Device_organizationId_idx`(`organizationId`),
    INDEX `Device_projectId_idx`(`projectId`),
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

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pageName` VARCHAR(191) NOT NULL,
    `projectId` INTEGER NOT NULL,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tokenblacklist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(512) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tokenblacklist_token_key`(`token`),
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

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `networkdata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `networkId` INTEGER NOT NULL,
    `urlString` VARCHAR(191) NULL,
    `hostname` VARCHAR(191) NULL,
    `token` VARCHAR(191) NULL,
    `customerId` INTEGER NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `alerts` ADD CONSTRAINT `Alerts_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `device`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `autodownlink` ADD CONSTRAINT `AutoDownlink_alertId_fkey` FOREIGN KEY (`alertId`) REFERENCES `alerts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deviceattribute` ADD CONSTRAINT `DeviceAttribute_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `device`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `downlinkdevice` ADD CONSTRAINT `DownlinkDevice_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `device`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hardwareattributes` ADD CONSTRAINT `HardwareAttributes_hardwareId_fkey` FOREIGN KEY (`hardwareId`) REFERENCES `hardware`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hardwareoutput` ADD CONSTRAINT `HardwareOutput_hardwareId_fkey` FOREIGN KEY (`hardwareId`) REFERENCES `hardware`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hardwareoutput` ADD CONSTRAINT `HardwareOutput_outputId_fkey` FOREIGN KEY (`outputId`) REFERENCES `output`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `Notification_alertId_fkey` FOREIGN KEY (`alertId`) REFERENCES `alerts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `Notification_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `device`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organization` ADD CONSTRAINT `Organization_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `output` ADD CONSTRAINT `output_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `device`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `Projects_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `device` ADD CONSTRAINT `Device_hardwareId_fkey` FOREIGN KEY (`hardwareId`) REFERENCES `hardware`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `device` ADD CONSTRAINT `Device_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `device` ADD CONSTRAINT `Device_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `addwidget` ADD CONSTRAINT `addwidget_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `networkdata` ADD CONSTRAINT `networkdata_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `networkdata` ADD CONSTRAINT `networkdata_networkId_fkey` FOREIGN KEY (`networkId`) REFERENCES `networkmodel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
