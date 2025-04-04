import { useEffect, useRef, useState } from 'react';

interface MCPMessage {
  type: string;
  data: any;
}

interface MCPRequest {
  type: 'request';
  action: 'execute' | 'get';
  tool?: string;
  resource?: string;
  data: any;
}

// Use environment variable for MCP base URL
const MCP_BASE_URL = process.env.NEXT_PUBLIC_MCP_ORIGIN || 'http://localhost:8000';
const MCP_SSE_ENDPOINT = `${MCP_BASE_URL}/mcp/sse`;
const MCP_MESSAGES_ENDPOINT = `${MCP_BASE_URL}/mcp/messages`;

function logMCPEvent(direction: 'SEND' | 'RECEIVE', type: string, data: any) {
  console.log(`[MCP ${direction}] ${type}:`, {
    timestamp: new Date().toISOString(),
    endpoint: direction === 'SEND' ? MCP_MESSAGES_ENDPOINT : MCP_SSE_ENDPOINT,
    type,
    data
  });
}

export function useMCP() {
  const eventSourceRef = useRef<EventSource | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<MCPMessage | null>(null);

  useEffect(() => {
    // Initialize EventSource connection
    console.log('[MCP] Initializing EventSource connection to:', MCP_SSE_ENDPOINT);
    const eventSource = new EventSource(MCP_SSE_ENDPOINT);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
      console.log('[MCP] Connected to EventSource at:', MCP_SSE_ENDPOINT);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        logMCPEvent('RECEIVE', 'SSE Message', data);
        setLastMessage(data);
      } catch (error) {
        console.error('[MCP] Error parsing SSE message:', error);
        console.error('[MCP] Raw message data:', event.data);
      }
    };

    eventSource.onerror = (error) => {
      console.error('[MCP] EventSource error:', error);
      setIsConnected(false);
      
      // Attempt to reconnect after a delay
      console.log('[MCP] Attempting to reconnect in 5 seconds...');
      setTimeout(() => {
        if (eventSourceRef.current) {
          console.log('[MCP] Closing existing connection');
          eventSourceRef.current.close();
        }
        console.log('[MCP] Establishing new connection');
        const newEventSource = new EventSource(MCP_SSE_ENDPOINT);
        eventSourceRef.current = newEventSource;
      }, 5000);
    };

    return () => {
      console.log('[MCP] Cleaning up EventSource connection');
      eventSource.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    };
  }, []);

  const sendMessage = async (request: MCPRequest) => {
    try {
      logMCPEvent('SEND', request.type, request);
      
      const response = await fetch(MCP_MESSAGES_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[MCP] Request failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`MCP request failed with status ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      logMCPEvent('RECEIVE', 'Response', result);
      return result.data;
    } catch (error) {
      console.error('[MCP] Error sending message:', error);
      throw error;
    }
  };

  const getMetrics = async (question: string) => {
    console.log('[MCP] Getting metrics for question:', question);
    return sendMessage({
      type: 'request',
      action: 'execute',
      tool: 'get_metrics',
      data: { question }
    });
  };

  return {
    isConnected,
    lastMessage,
    sendMessage,
    getMetrics
  };
} 