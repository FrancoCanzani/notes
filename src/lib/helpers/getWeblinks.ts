import connectToDatabase from '../db/connect-to-db';
import { Weblink } from '../db/schemas/weblink-schema';

export default async function getWeblinks(userId: string | undefined) {
  if (!userId) {
    throw new Error('Missing user id for getWeblinks');
  }

  try {
    await connectToDatabase();
    const weblinks = await Weblink.find({ userId });
    return weblinks;
  } catch (error) {
    throw error;
  }
}
