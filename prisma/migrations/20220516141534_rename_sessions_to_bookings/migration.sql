/*
  Warnings:

  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SessionToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_SessionToUser" DROP CONSTRAINT "_SessionToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_SessionToUser" DROP CONSTRAINT "_SessionToUser_B_fkey";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "_SessionToUser";

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "timeStart" TIMESTAMP(3) NOT NULL,
    "timeEnd" TIMESTAMP(3) NOT NULL,
    "title" TEXT,
    "description" TEXT,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BookingToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BookingToUser_AB_unique" ON "_BookingToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_BookingToUser_B_index" ON "_BookingToUser"("B");

-- AddForeignKey
ALTER TABLE "_BookingToUser" ADD FOREIGN KEY ("A") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookingToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
