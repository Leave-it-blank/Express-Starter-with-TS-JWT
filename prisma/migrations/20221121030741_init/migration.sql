/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `name`,
    ADD COLUMN `api_key` VARCHAR(191) NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `password` VARCHAR(191) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    ADD COLUMN `username` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_username_key` ON `User`(`username`);
