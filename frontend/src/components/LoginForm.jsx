import { useState } from 'react'

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username.trim()) {
      onLogin(username)
    }
  }

  return (
    <div className="login-container">
      <h1 className="login-title">シンプルチャットアプリ</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="login-input"
          placeholder="ユーザー名を入力してください"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoFocus
        />
        <button type="submit" className="login-button">
          入室する
        </button>
      </form>
    </div>
  )
}

export default LoginForm