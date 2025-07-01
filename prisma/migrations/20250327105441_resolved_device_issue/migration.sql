/*
  Warnings:

  - You are about to drop the column `deviceLocation` on the `device` table. All the data in the column will be lost.
  - Added the required column `mainOutput` to the `device` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `device` DROP COLUMN `deviceLocation`,
    ADD COLUMN `mainOutput` JSON NOT NULL;
