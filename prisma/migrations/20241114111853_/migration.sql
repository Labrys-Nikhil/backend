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
    `ack` BOOLEAN NOT NULL,
    `appEui` VARCHAR(191) NOT NULL,
    `channel` INTEGER NOT NULL,
    `datarate` INTEGER NOT NULL,
    `devClass` VARCHAR(191) NOT NULL,
    `devProfile` VARCHAR(191) NOT NULL,
    `devType` VARCHAR(191) NOT NULL,
    `dup` BOOLEAN NOT NULL,
    `estLat` DOUBLE NOT NULL,
    `estLng` DOUBLE NOT NULL,
    `freq` DOUBLE NOT NULL,
    `gwEui` VARCHAR(191) NOT NULL,
    `gwRxTime` DATETIME(3) NOT NULL,
    `ismBand` VARCHAR(191) NOT NULL,
    `joinId` INTEGER NOT NULL,
    `maxPayload` INTEGER NOT NULL,
    `pdu` VARCHAR(191) NOT NULL,
    `port` INTEGER NOT NULL,
    `rssi` INTEGER NOT NULL,
    `seqno` INTEGER NOT NULL,
    `snr` DOUBLE NOT NULL,
    `txtime` DATETIME(3) NOT NULL,
    `deviceId` INTEGER NULL,
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
    `timeoutMinutes` INTEGER NOT NULL DEFAULT 5,
    `port` VARCHAR(191) NOT NULL,
    `payload` VARCHAR(191) NOT NULL,
    `relayStateId` INTEGER NULL,
    `deviceId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DownlinkDevice_deviceId_fkey`(`deviceId`),
    INDEX `DownlinkDevice_relayStateId_fkey`(`relayStateId`),
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
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL DEFAULT 'function(packet, deviceAttributes, nonLoRaWANDeviceConfig) { return; }',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

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
    `deviceHardwaretypeId` INTEGER NOT NULL,

    INDEX `Device_hardwareId_fkey`(`hardwareId`),
    INDEX `Device_organizationId_idx`(`organizationId`),
    INDEX `Device_projectId_idx`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deviceHardwareType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `manufacturerId` INTEGER NOT NULL,
    `manufacturer` VARCHAR(100) NOT NULL,
    `output` VARCHAR(255) NULL,

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
ALTER TABLE `projects` ADD CONSTRAINT `Projects_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `device` ADD CONSTRAINT `Device_hardwareId_fkey` FOREIGN KEY (`hardwareId`) REFERENCES `hardware`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `device` ADD CONSTRAINT `Device_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `device` ADD CONSTRAINT `Device_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `device` ADD CONSTRAINT `Device_deviceHardwareTypeId_fkey` FOREIGN KEY (`deviceHardwaretypeId`) REFERENCES `deviceHardwareType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
