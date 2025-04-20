import { io } from 'socket.io-client';

// Socket.IOクライアントのインスタンスを作成
const socket = io('http://localhost:8000', {
  autoConnect: false, // 手動で接続を開始するため
  reconnection: true, // 接続が切れた場合に再接続を試みる
  reconnectionAttempts: 5, // 再接続の試行回数
  reconnectionDelay: 1000, // 再接続の間隔（ミリ秒）
  transports: ['websocket'], // WebSocketのみを使用（ポーリングなし）
});

// デバッグ用のイベントリスナー
socket.on('connect', () => {
  console.log('Socket.IO接続確立');
});

socket.on('disconnect', () => {
  console.log('Socket.IO接続切断');
});

socket.on('connect_error', (error) => {
  console.error('Socket.IO接続エラー:', error);
});

export default socket;