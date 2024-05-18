import { User } from '../db/schemas/user-schema';
import connectToDatabase from '../db/connect-to-db';

export async function getUnifiedId(userId: string): Promise<string> {
  await connectToDatabase();
  try {
    const userData = await User.findOne({ linkedProviders: userId });
    if (!userData) {
      throw new Error('User not found');
    }
    return userData.unifiedId;
  } catch (error) {
    throw error;
  }
}
