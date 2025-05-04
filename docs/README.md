# note-webchat ドキュメント

このディレクトリには、note-webchatプロジェクトに関するドキュメントが含まれています。

## 目次

1. [プロジェクト概要](./README.md)
2. [アーキテクチャ](./architecture.md)
3. [バックエンド仕様](./backend.md)
4. [フロントエンド仕様](./frontend.md)

## プロジェクト概要

note-webchatは、Reactフロントエンドとpythonバックエンドを使用した簡単なチャットアプリケーションです。
Socket.IOを使用してリアルタイム通信を実現しています。

### 主な機能

- 名前を入力して入室する機能
- 入室したことが部屋のメンバー全員に共有される
- 別のブラウザなどから名前を入力して入室すると別のユーザーとして入室される
- コメントは自分のコメントは右よりに、自分以外のコメントは左側に寄せて表示される
- 退室すると退室したことが部屋のメンバー全員に共有される
- 会話を送信するとリアルタイムに全員の画面に表示される

### 技術スタック

- フロントエンド: React + Vite
- バックエンド: Python + Flask
- 通信: Socket.IO
- データ保存: メモリ内（DBなし）

## プロジェクト構造

```
/
├── backend/                  # Pythonバックエンド
│   ├── server.py             # Socket.IOサーバー
│   └── requirements.txt      # Pythonパッケージ依存関係
│
├── frontend/                 # Reactフロントエンド
│   ├── public/               # 静的ファイル
│   ├── src/
│   │   ├── components/       # Reactコンポーネント
│   │   │   ├── ChatRoom.jsx  # チャットルームコンポーネント
│   │   │   ├── LoginForm.jsx # ログインフォームコンポーネント
│   │   │   ├── MessageList.jsx # メッセージリストコンポーネント
│   │   │   └── MessageInput.jsx # メッセージ入力コンポーネント
│   │   ├── App.jsx           # メインアプリケーションコンポーネント
│   │   ├── main.jsx          # エントリーポイント
│   │   └── socket.js         # Socket.IOクライアント設定
│   ├── package.json          # npm設定
│   ├── vite.config.js        # Vite設定
│   └── index.html            # HTMLテンプレート
```
