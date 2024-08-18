-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'Manager', 'Subscriber');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'Subscriber';
