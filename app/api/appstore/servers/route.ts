import { NextResponse } from 'next/server';

// Mock servers data (in production, this would come from a database)
export const mockServers = [
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
    configData: {
      // Server-specific configuration
    },
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
    configData: {
      // Server-specific configuration
    },
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
    configData: {
      // Server-specific configuration
    },
  },
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