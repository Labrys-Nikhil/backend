-- AlterTable
ALTER TABLE `projects` ADD COLUMN `enabled` BOOLEAN NULL DEFAULT true;

-- CreateTable
CREATE TABLE `manufacturer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `manufacturer_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `hardware` ADD CONSTRAINT `hardware_manufacturerId_fkey` FOREIGN KEY (`manufacturerId`) REFERENCES `manufacturer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
