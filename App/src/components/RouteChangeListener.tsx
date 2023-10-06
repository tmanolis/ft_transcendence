import { useEffect } from 'react';
import { useMatch } from 'react-router-dom';
import { GameSocket } from './GameSocket';

export const RouteChangeListener = () => {
  const isPongMatch = useMatch('/pong');
  const isRetroPongMatch = useMatch('/retropong');

  useEffect(() => {
    if (isPongMatch) {
      GameSocket.emit('enterGamePage');
    } else {
      GameSocket.emit('leaveGamePage');
    }

    if (isRetroPongMatch) {
      GameSocket.emit('enterRetroGamePage');
    } else {
      GameSocket.emit('leaveRetroGamePage');
    }

    GameSocket.on('disconnect',  () => {
      GameSocket.emit('leaveGamePage');
    });
    return () => {
      GameSocket.off('disconnect');
    }
  }, [isPongMatch]);

  return null;
}
