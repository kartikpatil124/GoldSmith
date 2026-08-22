import { io } from 'socket.io-client';

// Resolve the backend URL for Socket.IO (same host as API, without /api path)
const getSocketUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl.replace(/\/api\/?$/, '');
  }
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }
  return 'https://goldsmiths-api.onrender.com';
};

const SOCKET_URL = getSocketUrl();

// Singleton Socket.IO client — auto-connects on import
export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  transports: ['websocket', 'polling'],
});

socket.on('connect', () => {
  console.log('[Socket.IO] Connected:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('[Socket.IO] Disconnected:', reason);
});

socket.on('connect_error', (err) => {
  console.warn('[Socket.IO] Connection error:', err.message);
});

// Join the admin broadcast room (called from admin pages)
export const joinAdminRoom = () => {
  socket.emit('join:admin');
};

// Join a user-specific room (called from customer pages)
export const joinUserRoom = (userId) => {
  if (userId) {
    socket.emit('join:user', userId);
  }
};

export default socket;
