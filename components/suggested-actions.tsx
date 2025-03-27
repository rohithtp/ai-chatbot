'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { memo } from 'react';
import { UseChatHelpers } from '@ai-sdk/react';
import { tool } from 'ai';
import { z } from 'zod';

// Use environment variables for server configuration
const MCP_ORIGIN = process.env.MCP_ORIGIN || 'http://localhost:3000';
const MCP_SSE_URL = new URL('/sse', MCP_ORIGIN).toString();

interface SuggestedActionsProps {
  chatId: string;
  append: UseChatHelpers['append'];
}

const listMCPTools = tool({
  description: 'List all available MCP tools and their capabilities',
  parameters: z.object({
    chatId: z.string().describe('The chat ID to associate with the tools request'),
  }),
  execute: async ({ chatId }, { toolCallId, messages, abortSignal }) => {
    try {
      const response = await fetch('/api/suggestions/tools', { signal: abortSignal });
      const tools = await response.json();
      return {
        tools,
        chatId,
        toolCallId,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to fetch MCP tools:', error);
      throw error;
    }
  },
});

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  console.log('Rendering SuggestedActions with:', { chatId, MCP_SSE_URL });

  const handleMCPAction = async (action: string) => {
    try {
      console.log('Button clicked - Starting handleMCPAction');
      console.log('Action received:', action);

      const result = await listMCPTools.execute({ chatId }, { toolCallId: 'mcp-tools', messages: [], abortSignal: undefined });
      console.log('MCP Tools Response:', result);

    } catch (error) {
      console.error('MCP Error:', {
        error,
        timestamp: new Date().toISOString(),
        chatId
      });
    }

    // Proceed with the chat append
    window.history.replaceState({}, '', `/chat/${chatId}`);
    append({
      role: 'user',
      content: action,
    });
  };

  // Uncomment other suggested actions for testing
  const suggestedActions = [
    {
      title: 'Show me available',
      label: 'tools and capabilities',
      action: 'List all available tools and their capabilities',
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-2 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
        >
          <Button
            variant="ghost"
            onClick={() => handleMCPAction(suggestedAction.action)}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
