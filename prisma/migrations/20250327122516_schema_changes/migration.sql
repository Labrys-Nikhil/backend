-- DropForeignKey
ALTER TABLE `alerts` DROP FOREIGN KEY `Alerts_deviceId_fkey`;

-- DropForeignKey
ALTER TABLE `autodownlink` DROP FOREIGN KEY `AutoDownlink_alertId_fkey`;

-- DropForeignKey
ALTER TABLE `device` DROP FOREIGN KEY `Device_hardwareId_fkey`;

-- DropForeignKey
ALTER TABLE `device` DROP FOREIGN KEY `Device_organizationId_fkey`;

-- DropForeignKey
ALTER TABLE `device` DROP FOREIGN KEY `Device_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `deviceattribute` DROP FOREIGN KEY `DeviceAttribute_deviceId_fkey`;

-- DropForeignKey
ALTER TABLE `downlinkdevice` DROP FOREIGN KEY `DownlinkDevice_deviceId_fkey`;

-- DropForeignKey
ALTER TABLE `hardwareattributes` DROP FOREIGN KEY `HardwareAttributes_hardwareId_fkey`;

-- DropForeignKey
ALTER TABLE `hardwareoutput` DROP FOREIGN KEY `HardwareOutput_hardwareId_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_alertId_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_deviceId_fkey`;

-- DropForeignKey
ALTER TABLE `organization` DROP FOREIGN KEY `Organization_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `projects` DROP FOREIGN KEY `Projects_customerId_fkey`;

-- AddForeignKey
ALTER TABLE `alerts` ADD CONSTRAINT `alerts_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `device`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `autodownlink` ADD CONSTRAINT `autodownlink_alertId_fkey` FOREIGN KEY (`alertId`) REFERENCES `alerts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deviceattribute` ADD CONSTRAINT `deviceattribute_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `device`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `downlinkdevice` ADD CONSTRAINT `downlinkdevice_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `device`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE `projects` ADD CONSTRAINT `projects_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `device` ADD CONSTRAINT `device_hardwareId_fkey` FOREIGN KEY (`hardwareId`) REFERENCES `hardware`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `device` ADD CONSTRAINT `device_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `device` ADD CONSTRAINT `device_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `HardwareController` RENAME INDEX `HardwareController_hardwareId_fkey` TO `HardwareController_hardwareId_idx`;

-- RenameIndex
ALTER TABLE `License` RENAME INDEX `License_organizationId_fkey` TO `License_organizationId_idx`;

-- RenameIndex
ALTER TABLE `License` RENAME INDEX `License_subscriptionId_fkey` TO `License_subscriptionId_idx`;

-- RenameIndex
ALTER TABLE `PaymentData` RENAME INDEX `PaymentData_licenseId_fkey` TO `PaymentData_licenseId_idx`;

-- RenameIndex
ALTER TABLE `SubModule` RENAME INDEX `SubModule_moduleId_fkey` TO `SubModule_moduleId_idx`;

-- RenameIndex
ALTER TABLE `Subscription` RENAME INDEX `Subscription_customerId_fkey` TO `Subscription_customerId_idx`;

-- RenameIndex
ALTER TABLE `Subscription` RENAME INDEX `Subscription_organizationId_fkey` TO `Subscription_organizationId_idx`;

-- RenameIndex
ALTER TABLE `Subscription` RENAME INDEX `Subscription_planId_fkey` TO `Subscription_planId_idx`;

-- RenameIndex
ALTER TABLE `UserPermission` RENAME INDEX `UserPermission_subModuleId_fkey` TO `UserPermission_subModuleId_idx`;

-- RenameIndex
ALTER TABLE `UserPermission` RENAME INDEX `UserPermission_userId_fkey` TO `UserPermission_userId_idx`;

-- RenameIndex
ALTER TABLE `addwidget` RENAME INDEX `addwidget_projectId_fkey` TO `addwidget_projectId_idx`;

-- RenameIndex
ALTER TABLE `alerts` RENAME INDEX `Alerts_deviceId_idx` TO `alerts_deviceId_idx`;

-- RenameIndex
ALTER TABLE `autodownlink` RENAME INDEX `AutoDownlink_alertId_idx` TO `autodownlink_alertId_idx`;

-- RenameIndex
ALTER TABLE `card` RENAME INDEX `card_deviceId_fkey` TO `card_deviceId_idx`;

-- RenameIndex
ALTER TABLE `card` RENAME INDEX `card_projectId_fkey` TO `card_projectId_idx`;

-- RenameIndex
ALTER TABLE `device` RENAME INDEX `Device_hardwareId_fkey` TO `device_hardwareId_idx`;

-- RenameIndex
ALTER TABLE `device` RENAME INDEX `Device_organizationId_idx` TO `device_organizationId_idx`;

-- RenameIndex
ALTER TABLE `device` RENAME INDEX `Device_projectId_idx` TO `device_projectId_idx`;

-- RenameIndex
ALTER TABLE `deviceattribute` RENAME INDEX `DeviceAttribute_deviceId_fkey` TO `deviceattribute_deviceId_idx`;

-- RenameIndex
ALTER TABLE `downlinkdevice` RENAME INDEX `DownlinkDevice_deviceId_fkey` TO `downlinkdevice_deviceId_idx`;

-- RenameIndex
ALTER TABLE `hardwareattributes` RENAME INDEX `HardwareAttributes_hardwareId_fkey` TO `hardwareattributes_hardwareId_idx`;

-- RenameIndex
ALTER TABLE `hardwareoutput` RENAME INDEX `HardwareOutput_hardwareId_fkey` TO `hardwareoutput_hardwareId_idx`;

-- RenameIndex
ALTER TABLE `networkdata` RENAME INDEX `networkdata_customerId_fkey` TO `networkdata_customerId_idx`;

-- RenameIndex
ALTER TABLE `networkdata` RENAME INDEX `networkdata_networkId_fkey` TO `networkdata_networkId_idx`;

-- RenameIndex
ALTER TABLE `networkdata` RENAME INDEX `networkdata_organizationId_fkey` TO `networkdata_organizationId_idx`;

-- RenameIndex
ALTER TABLE `notification` RENAME INDEX `Notification_alertId_fkey` TO `notification_alertId_idx`;

-- RenameIndex
ALTER TABLE `notification` RENAME INDEX `Notification_deviceId_idx` TO `notification_deviceId_idx`;

-- RenameIndex
ALTER TABLE `organization` RENAME INDEX `Organization_customerId_idx` TO `organization_customerId_idx`;

-- RenameIndex
ALTER TABLE `output` RENAME INDEX `output_deviceId_fkey` TO `output_deviceId_idx`;

-- RenameIndex
ALTER TABLE `projects` RENAME INDEX `Projects_customerId_idx` TO `projects_customerId_idx`;

-- RenameIndex
ALTER TABLE `projects` RENAME INDEX `projects_organizationId_fkey` TO `projects_organizationId_idx`;
