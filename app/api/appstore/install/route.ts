import { NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import fs from 'fs/promises';
import path from 'path';

// Import mock servers (in production, this would come from a database)
import { mockServers } from '../servers/route';

interface ServerConfig {
  settings: Record<string, any>;
  preferences: Record<string, any>;
}

interface UserConfig {
  userId: string;
  email: string;
  installedServers: {
    [key: string]: {
      installedAt: string;
      lastUsed: string;
      version: string;
      configData: ServerConfig;
    };
  };
  globalPreferences: {
    theme: string;
    language: string;
    notifications: {
      enabled: boolean;
      sound: boolean;
      desktop: boolean;
    };
    accessibility?: {
      highContrast: boolean;
      fontSize: string;
    };
  };
  lastSyncedAt: string;
  schemaVersion: string;
}

async function getUserConfig(userId: string): Promise<UserConfig> {
  try {
    const configPath = path.join(process.cwd(), 'data', 'users', userId, 'config.json');
    const configData = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(configData);
  } catch (error) {
    // If file doesn't exist, return default config
    return {
      userId,
      email: '', // Will be updated in the install process
      installedServers: {},
      globalPreferences: {
        theme: 'system',
        language: 'en',
        notifications: {
          enabled: true,
          sound: true,
          desktop: true
        }
      },
      lastSyncedAt: new Date().toISOString(),
      schemaVersion: '1.0'
    };
  }
}

async function saveUserConfig(userId: string, config: UserConfig): Promise<void> {
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

    const { serverId, configData } = await request.json();
    if (!serverId) {
      return NextResponse.json(
        { error: 'Server ID is required' },
        { status: 400 }
      );
    }

    // Find the server in our list
    const server = mockServers.find(s => s.id === serverId);
    if (!server) {
      return NextResponse.json(
        { error: 'Server not found' },
        { status: 404 }
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

    // Check if server is already installed
    if (userConfig.installedServers[serverId]) {
      return NextResponse.json(
        { error: 'Server already installed' },
        { status: 400 }
      );
    }

    // Add server to user's config
    const now = new Date().toISOString();
    userConfig.email = session.user.email || '';
    userConfig.installedServers[serverId] = {
      installedAt: now,
      lastUsed: now,
      version: server.version || '1.0.0',
      configData: {
        settings: {
          ...server.configData.settings,
          ...configData?.settings
        },
        preferences: {
          ...server.configData.preferences,
          ...configData?.preferences
        }
      }
    };
    userConfig.lastSyncedAt = now;

    // Save updated config
    await saveUserConfig(userId, userConfig);

    return NextResponse.json({ 
      success: true,
      message: 'Server installed successfully',
      installedServer: userConfig.installedServers[serverId]
    });
  } catch (error) {
    console.error('Error installing server:', error);
    return NextResponse.json(
      { error: 'Failed to install server' },
      { status: 500 }
    );
  }
} 