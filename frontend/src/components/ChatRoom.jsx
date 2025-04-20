import MessageList from './MessageList'
import MessageInput from './MessageInput'

function ChatRoom({ username, activeUsers, messages, onSendMessage }) {
  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-title">チャットルーム</div>
        <div className="chat-user-count">
          参加者: {activeUsers.length}人
        </div>
      </div>
      
      <div className="chat-content">
        <div className="chat-main">
          <MessageList messages={messages} />
          <MessageInput onSendMessage={onSendMessage} />
        </div>
        
        <div className="chat-sidebar">
          <div className="sidebar-title">参加者一覧</div>
          <ul className="user-list">
            {activeUsers.map((user, index) => (
              <li key={index} className="user-item">
                {user.username} {user.username === username ? '(あなた)' : ''}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ChatRoom