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
CREATE TABLE `_ReportsToProjects` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ReportsToProjects_AB_unique`(`A`, `B`),
    INDEX `_ReportsToProjects_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ReportsToProjects` ADD CONSTRAINT `_ReportsToProjects_A_fkey` FOREIGN KEY (`A`) REFERENCES `addreport`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ReportsToProjects` ADD CONSTRAINT `_ReportsToProjects_B_fkey` FOREIGN KEY (`B`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
