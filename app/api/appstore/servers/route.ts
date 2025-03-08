import { NextResponse } from 'next/server';

interface ServerConfig {
  settings: Record<string, any>;
  preferences: Record<string, any>;
}

interface Server {
  id: string;
  name: string;
  title: string;
  description: string;
  stars: number;
  tags: string[];
  icon: string;
  iconUrl: string;
  categories: string[];
  configData: ServerConfig;
  version: string;
}

// Mock servers data (in production, this would come from a database)
export const mockServers: Server[] = [
  {
    id: '1',
    name: 'Basic Chat Server',
    title: 'Basic Chat',
    description: 'A simple chat server for basic conversations',
    stars: 245,
    tags: ['communication', 'simple', 'beginner-friendly'],
    icon: '/icons/chat.png',
    iconUrl: '/icons/chat.png',
    categories: ['chat'],
    version: '1.0.0',
    configData: {
      settings: {
        maxMessages: 1000,
        retentionDays: 30
      },
      preferences: {
        theme: 'light',
        notifications: true
      }
    }
  },
  {
    id: '2',
    name: 'Advanced AI Assistant',
    title: 'AI Assistant Pro',
    description: 'An advanced AI assistant with enhanced capabilities',
    stars: 1892,
    tags: ['artificial intelligence', 'productivity', 'automation'],
    icon: '/icons/ai.png',
    iconUrl: '/icons/ai.png',
    categories: ['ai', 'chat'],
    version: '2.1.0',
    configData: {
      settings: {
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000
      },
      preferences: {
        autoComplete: true,
        suggestions: true
      }
    }
  },
  {
    id: '3',
    name: 'Productivity Tools',
    title: 'Productivity Suite',
    description: 'A collection of productivity enhancement tools',
    stars: 763,
    tags: ['productivity', 'organization', 'time-management'],
    icon: '/icons/tools.png',
    iconUrl: '/icons/tools.png',
    categories: ['productivity', 'tools'],
    version: '1.2.0',
    configData: {
      settings: {
        autoSave: true,
        syncInterval: 5
      },
      preferences: {
        darkMode: true,
        compactView: false
      }
    }
  }
];

export async function GET() {
  try {
    // TODO: Add authentication check
    // TODO: Add database query
    return NextResponse.json({ servers: mockServers });
  } catch (error) {
    console.error('Error fetching servers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch servers' },
      { status: 500 }
    );
  }
} 