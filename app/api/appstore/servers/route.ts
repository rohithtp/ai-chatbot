import { NextResponse } from 'next/server';

// Mock servers data (in production, this would come from a database)
export const mockServers = [
  {
    id: '1',
    name: 'Basic Chat Server',
    description: 'A simple chat server for basic conversations',
    iconUrl: '/icons/chat.png',
    category: 'chat',
    configData: {
      // Server-specific configuration
    },
  },
  {
    id: '2',
    name: 'Advanced AI Assistant',
    description: 'An advanced AI assistant with enhanced capabilities',
    iconUrl: '/icons/ai.png',
    category: 'ai',
    configData: {
      // Server-specific configuration
    },
  },
  {
    id: '3',
    name: 'Productivity Tools',
    description: 'A collection of productivity enhancement tools',
    iconUrl: '/icons/tools.png',
    category: 'productivity',
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