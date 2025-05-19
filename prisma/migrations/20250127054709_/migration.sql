/*
  Warnings:

  - Added the required column `deviceId` to the `deviceserverdata` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `deviceserverdata` ADD COLUMN `deviceId` INTEGER NOT NULL;
