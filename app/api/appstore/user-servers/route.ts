import { NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found' },
        { status: 400 }
      );
    }

    // Read user's config file
    const configPath = path.join(process.cwd(), 'data', 'users', userId, 'config.json');
    try {
      const configData = await fs.readFile(configPath, 'utf-8');
      const config = JSON.parse(configData);
      
      return NextResponse.json({
        userId: config.userId,
        installedServers: config.installedServers || {},
        globalPreferences: config.globalPreferences
      });
    } catch (error) {
      // If file doesn't exist or can't be read, return empty config
      return NextResponse.json({
        userId,
        installedServers: {},
        globalPreferences: {
          theme: 'system',
          language: 'en',
          notifications: {
            enabled: true,
            sound: true,
            desktop: true
          }
        }
      });
    }
  } catch (error) {
    console.error('Error fetching user servers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user servers' },
      { status: 500 }
    );
  }
} 