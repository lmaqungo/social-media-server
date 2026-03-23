/*
  Warnings:

  - You are about to drop the column `chatId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_chatId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "chatId",
ALTER COLUMN "displayPictureUrl" DROP NOT NULL;

-- DropTable
DROP TABLE "Chat";

-- DropTable
DROP TABLE "Message";
