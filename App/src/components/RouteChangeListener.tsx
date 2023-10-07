import { useEffect } from 'react';
import { useMatch } from 'react-router-dom';
import { GameSocket } from './GameSocket';

export const RouteChangeListener = () => {
  const isPongMatch = useMatch('/pong');

  useEffect(() => {
    if (isPongMatch) {
      GameSocket.emit('enterGamePage');
    } else {
      GameSocket.emit('leaveGamePage');
    }
  }, [isPongMatch]);

  return null;
}
