/*
  Warnings:

  - The values [USER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Trainer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ClientToSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ClientToTrainer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SessionToTrainer` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'TRAINER', 'CLIENT');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "_ClientToSession" DROP CONSTRAINT "_ClientToSession_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClientToSession" DROP CONSTRAINT "_ClientToSession_B_fkey";

-- DropForeignKey
ALTER TABLE "_ClientToTrainer" DROP CONSTRAINT "_ClientToTrainer_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClientToTrainer" DROP CONSTRAINT "_ClientToTrainer_B_fkey";

-- DropForeignKey
ALTER TABLE "_SessionToTrainer" DROP CONSTRAINT "_SessionToTrainer_A_fkey";

-- DropForeignKey
ALTER TABLE "_SessionToTrainer" DROP CONSTRAINT "_SessionToTrainer_B_fkey";

-- DropTable
DROP TABLE "Client";

-- DropTable
DROP TABLE "Trainer";

-- DropTable
DROP TABLE "_ClientToSession";

-- DropTable
DROP TABLE "_ClientToTrainer";

-- DropTable
DROP TABLE "_SessionToTrainer";

-- CreateTable
CREATE TABLE "_SessionToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SessionToUser_AB_unique" ON "_SessionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SessionToUser_B_index" ON "_SessionToUser"("B");

-- AddForeignKey
ALTER TABLE "_SessionToUser" ADD FOREIGN KEY ("A") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SessionToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
