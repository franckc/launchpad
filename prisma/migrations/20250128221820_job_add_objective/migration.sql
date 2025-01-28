/*
  Warnings:

  - Added the required column `objective` to the `job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "job" ADD COLUMN     "objective" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
