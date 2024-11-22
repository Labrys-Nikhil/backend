-- CreateTable
CREATE TABLE `AutoDownlinkWithDelay` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `downlinkController` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL,
    `timeoutMinutes` INTEGER NOT NULL,
    `classType` VARCHAR(191) NOT NULL,
    `port` INTEGER NOT NULL,
    `deviceId` INTEGER NOT NULL,
    `devEui` VARCHAR(191) NOT NULL,
    `pdu` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
