import { useEffect, useRef } from 'react'

function MessageList({ messages }) {
  const messagesEndRef = useRef(null)

  // 新しいメッセージが追加されたら自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // タイムスタンプをフォーマットする関数
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`message-item ${
            message.type === 'system'
              ? 'system-message'
              : message.isSelf
              ? 'self-message'
              : 'other-message'
          }`}
        >
          {message.type === 'system' ? (
            <div className="system-content">{message.content}</div>
          ) : (
            <>
              <div className="message-header">
                <span className="message-username">{message.username}</span>
                <span className="message-time">{formatTimestamp(message.timestamp)}</span>
              </div>
              <div className="message-content">{message.content}</div>
            </>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList