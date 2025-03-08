import { NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import fs from 'fs/promises';
import path from 'path';

async function getUserConfig(userId: string) {
  const configPath = path.join(process.cwd(), 'data', 'users', userId, 'config.json');
  const configData = await fs.readFile(configPath, 'utf-8');
  return JSON.parse(configData);
}

async function saveUserConfig(userId: string, config: any): Promise<void> {
  const userDir = path.join(process.cwd(), 'data', 'users', userId);
  await fs.mkdir(userDir, { recursive: true });
  const configPath = path.join(userDir, 'config.json');
  await fs.writeFile(configPath, JSON.stringify(config, null, 2));
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { serverId } = await request.json();
    if (!serverId) {
      return NextResponse.json(
        { error: 'Server ID is required' },
        { status: 400 }
      );
    }

    // Get user's current config
    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found' },
        { status: 400 }
      );
    }

    const userConfig = await getUserConfig(userId);

    // Check if server is installed
    if (!userConfig.installedServers[serverId]) {
      return NextResponse.json(
        { error: 'Server is not installed' },
        { status: 400 }
      );
    }

    // Remove server from user's config
    delete userConfig.installedServers[serverId];
    userConfig.lastSyncedAt = new Date().toISOString();

    // Save updated config
    await saveUserConfig(userId, userConfig);

    return NextResponse.json({ 
      success: true,
      message: 'Server uninstalled successfully'
    });
  } catch (error) {
    console.error('Error uninstalling server:', error);
    return NextResponse.json(
      { error: 'Failed to uninstall server' },
      { status: 500 }
    );
  }
} 