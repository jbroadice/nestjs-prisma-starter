/*
  Warnings:

  - You are about to drop the `_BookingToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BookingToUser" DROP CONSTRAINT "_BookingToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_BookingToUser" DROP CONSTRAINT "_BookingToUser_B_fkey";

-- DropTable
DROP TABLE "_BookingToUser";

-- CreateTable
CREATE TABLE "ParticipantsOnBookings" (
    "participantId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedById" TEXT,

    CONSTRAINT "ParticipantsOnBookings_pkey" PRIMARY KEY ("participantId","bookingId")
);

-- AddForeignKey
ALTER TABLE "ParticipantsOnBookings" ADD CONSTRAINT "ParticipantsOnBookings_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantsOnBookings" ADD CONSTRAINT "ParticipantsOnBookings_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipantsOnBookings" ADD CONSTRAINT "ParticipantsOnBookings_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
