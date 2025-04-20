import { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import ChatRoom from './components/ChatRoom'
import socket from './socket'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [activeUsers, setActiveUsers] = useState([])
  const [messages, setMessages] = useState([])

  // Socket.IOイベントリスナーの設定
  useEffect(() => {
    // ユーザー入室イベント
    socket.on('user_joined', (data) => {
      const systemMessage = {
        type: 'system',
        content: `${data.username}さんが入室しました`,
        timestamp: data.timestamp
      }
      setMessages(prevMessages => [...prevMessages, systemMessage])
    })

    // ユーザー退室イベント
    socket.on('user_left', (data) => {
      const systemMessage = {
        type: 'system',
        content: `${data.username}さんが退室しました`,
        timestamp: data.timestamp
      }
      setMessages(prevMessages => [...prevMessages, systemMessage])
    })

    // メッセージ受信イベント
    socket.on('chat_message', (data) => {
      const chatMessage = {
        type: 'chat',
        username: data.username,
        content: data.message,
        timestamp: data.timestamp,
        isSelf: data.isSelf
      }
      setMessages(prevMessages => [...prevMessages, chatMessage])
    })

    // アクティブユーザーリスト更新イベント
    socket.on('active_users', (users) => {
      setActiveUsers(users)
    })

    // コンポーネントのアンマウント時にイベントリスナーを削除
    return () => {
      socket.off('user_joined')
      socket.off('user_left')
      socket.off('chat_message')
      socket.off('active_users')
    }
  }, [])

  // ログイン処理
  const handleLogin = (username) => {
    if (username.trim()) {
      setUsername(username)
      setIsLoggedIn(true)
      
      // Socket.IO接続を開始
      socket.connect()
      
      // サーバーに入室イベントを送信
      socket.emit('join', { username })
    }
  }

  // メッセージ送信処理
  const handleSendMessage = (message) => {
    if (message.trim()) {
      socket.emit('send_message', { message })
    }
  }

  return (
    <div className="app-container">
      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <ChatRoom
          username={username}
          activeUsers={activeUsers}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  )
}

export default App