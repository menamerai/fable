import { useEffect, useRef } from 'react';

interface UseWebSocketProps {
  onMessage: (message: string) => void;
}

export const useWebSocket = ({ onMessage }: UseWebSocketProps) => {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `ws://${import.meta.env.VITE_BACKEND_URL.replace('http://', '')}/ws`
    );

    ws.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.onmessage = (event) => {
      onMessage(event.data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [onMessage]);

  return wsRef.current;
};
