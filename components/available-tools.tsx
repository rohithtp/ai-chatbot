'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';

interface Tool {
  name: string;
  description: string;
  type: string;
  parameters?: Record<string, unknown>;
}

export function AvailableTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const eventSource = new EventSource('/api/suggestions/tools');

    eventSource.onmessage = (event) => {
      console.log('Received SSE message:', event.data);
      try {
        const data = JSON.parse(event.data);
        console.log('Parsed tools data:', data);
        
        if (!Array.isArray(data)) {
          throw new Error('Tools data is not an array');
        }

        if (mounted) {
          setTools(data);
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        console.error('Error parsing tools data:', err);
        if (mounted) {
          setError('Failed to load tools');
          setLoading(false);
        }
      } finally {
        eventSource.close();
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      if (mounted) {
        setError('Failed to connect to tools service');
        setLoading(false);
      }
      eventSource.close();
    };

    return () => {
      mounted = false;
      eventSource.close();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-4 text-red-500">
        {error}
      </div>
    );
  }

  if (!tools.length) {
    return (
      <div className="flex items-center justify-center p-4 text-muted-foreground">
        No tools available
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4 w-full p-4">
      {tools.map((tool, index) => (
        <motion.div
          key={tool.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
        >
          <Button
            variant="ghost"
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{tool.name}</span>
            <span className="text-muted-foreground">{tool.description}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
} 