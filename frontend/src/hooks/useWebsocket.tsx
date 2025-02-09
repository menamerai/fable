import { useEffect, useRef } from 'react';

interface UseWebSocketProps {
  onMessage: (message: string) => void;
}

export const useWebSocket = ({ onMessage }: UseWebSocketProps) => {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Only create connection if none exists
    if (!wsRef.current) {
      console.log('creating websocket');
      const ws = new WebSocket(
        `ws://${import.meta.env.VITE_BACKEND_URL.replace('http://', '')}/ws`
      );

      ws.onopen = () => console.log('WebSocket Connected');
      ws.onmessage = (event) => onMessage(event.data);
      ws.onerror = console.error;
      ws.onclose = () => console.log('WebSocket Disconnected');

      wsRef.current = ws;
    }

    return () => {
      // Close only when component unmounts (not in dev StrictMode)
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [onMessage]); // Ensure onMessage is memoized

  return wsRef.current;
};
