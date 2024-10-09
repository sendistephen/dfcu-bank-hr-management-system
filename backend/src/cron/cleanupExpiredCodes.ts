import cron from 'node-cron';
import prisma from '../utils/prisma';

export const cleanupExpiredCodes = () => {
  // Run the cron job every 2 minutes
  cron.schedule('*/2 * * * *', async () => {
    try {
      console.log('Running cron job: Cleaning up expired or used codes...');

      // Delete StaffCodes that are either used or have expired
      const codesToDelete = await prisma.staffCode.findMany({
        where: {
          OR: [{ used: true }, { expiresAt: { lte: new Date() } }],
        },
        take: 10 as number, // limit to 10 codes to delete
      });

      // Delete each found code
      for (const code of codesToDelete) {
        await prisma.staffCode.delete({
          where: { id: code.id },
        });
      }

      console.log(`Deleted ${codesToDelete.length} expired or used codes.`);
    } catch (error) {
      console.error('Error during cron job execution:', error);
    }
  });
};
