/*
  Warnings:

  - You are about to drop the `_messageFrom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_messageTo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `recipientId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_messageFrom" DROP CONSTRAINT "_messageFrom_A_fkey";

-- DropForeignKey
ALTER TABLE "_messageFrom" DROP CONSTRAINT "_messageFrom_B_fkey";

-- DropForeignKey
ALTER TABLE "_messageTo" DROP CONSTRAINT "_messageTo_A_fkey";

-- DropForeignKey
ALTER TABLE "_messageTo" DROP CONSTRAINT "_messageTo_B_fkey";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "recipientId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_messageFrom";

-- DropTable
DROP TABLE "_messageTo";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
