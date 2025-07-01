/*
  Warnings:

  - You are about to drop the `_ReportsToProjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_ReportsToProjects` DROP FOREIGN KEY `_ReportsToProjects_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ReportsToProjects` DROP FOREIGN KEY `_ReportsToProjects_B_fkey`;

-- DropTable
DROP TABLE `_ReportsToProjects`;

-- CreateTable
CREATE TABLE `_addreportToprojects` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_addreportToprojects_AB_unique`(`A`, `B`),
    INDEX `_addreportToprojects_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_addreportToprojects` ADD CONSTRAINT `_addreportToprojects_A_fkey` FOREIGN KEY (`A`) REFERENCES `addreport`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_addreportToprojects` ADD CONSTRAINT `_addreportToprojects_B_fkey` FOREIGN KEY (`B`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
