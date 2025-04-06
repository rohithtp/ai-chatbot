import { useEffect, useState } from 'react';

interface MCPMessage {
  type: 'request';
  action: 'execute' | 'get';
  tool?: string;
  resource?: string;
  data: Record<string, any>;
}

interface MCPResponse {
  data: any;
}

export function useMCP() {
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    // Connect to SSE stream
    const es = new EventSource('http://localhost:8000/mcp/sse');
    setEventSource(es);

    es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    es.onerror = (error) => {
      console.error('SSE Error:', error);
    };

    return () => {
      es.close();
    };
  }, []);

  const sendMessage = async (message: MCPMessage): Promise<MCPResponse> => {
    const response = await fetch('http://localhost:8000/mcp/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    return response.json();
  };

  const getMetrics = async (question: string): Promise<any> => {
    const response = await sendMessage({
      type: 'request',
      action: 'execute',
      tool: 'get_metrics',
      data: { question },
    });
    return response.data;
  };

  return {
    messages,
    getMetrics,
    sendMessage,
  };
} 