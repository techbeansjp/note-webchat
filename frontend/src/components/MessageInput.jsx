import { useState } from 'react'

function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage('') // 送信後にフォームをクリア
    }
  }

  return (
    <div className="message-input-container">
      <form className="message-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="message-input"
          placeholder="メッセージを入力してください"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          autoFocus
        />
        <button type="submit" className="send-button">
          送信
        </button>
      </form>
    </div>
  )
}

export default MessageInput