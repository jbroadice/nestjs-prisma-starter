/*
  Warnings:

  - Added the required column `participantRole` to the `ParticipantsOnBookings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ParticipantRole" AS ENUM ('ORGANISER', 'TRAINER', 'CLIENT', 'GUEST');

-- AlterTable
ALTER TABLE "ParticipantsOnBookings" ADD COLUMN     "participantRole" "ParticipantRole" NOT NULL;
