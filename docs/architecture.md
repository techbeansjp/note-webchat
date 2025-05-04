# アーキテクチャ

このドキュメントでは、note-webchatアプリケーションのアーキテクチャについて説明します。

## システム概要

note-webchatは、Socket.IOを使用したリアルタイムWebチャットアプリケーションです。フロントエンドはReact（Vite）で構築され、バックエンドはPython（Flask）で実装されています。

### システム構成図

```mermaid
graph TB
    Client1[ブラウザ1] <--> |Socket.IO| Server
    Client2[ブラウザ2] <--> |Socket.IO| Server
    Client3[ブラウザ3] <--> |Socket.IO| Server
    
    subgraph "フロントエンド（React + Vite）"
    Client1
    Client2
    Client3
    end
    
    subgraph "バックエンド（Python + Flask）"
    Server[Socket.IOサーバー]
    Memory[(メモリ内ストレージ)]
    end
    
    Server <--> Memory
```

## データフロー

### ユーザー認証とチャットのデータフロー

```mermaid
sequenceDiagram
    participant Client as ブラウザ
    participant Server as Socket.IOサーバー
    
    Client->>Server: 接続（connect）
    Server-->>Client: 接続確立
    
    Client->>Server: 入室（join）{username}
    Server-->>Client: 全クライアントに入室通知（user_joined）
    Server-->>Client: 全クライアントにアクティブユーザーリスト更新（active_users）
    
    Client->>Server: メッセージ送信（send_message）{message}
    Server-->>Client: 送信者にメッセージ（chat_message）{isSelf: true}
    Server-->>Client: 他のクライアントにメッセージ（chat_message）{isSelf: false}
    
    Client->>Server: 切断（disconnect）
    Server-->>Client: 全クライアントに退室通知（user_left）
    Server-->>Client: 全クライアントにアクティブユーザーリスト更新（active_users）
```

## コンポーネント構造

### フロントエンドのコンポーネント構造

```mermaid
graph TD
    App[App.jsx] --> LoginForm[LoginForm.jsx]
    App --> ChatRoom[ChatRoom.jsx]
    ChatRoom --> MessageList[MessageList.jsx]
    ChatRoom --> MessageInput[MessageInput.jsx]
    
    style App fill:#f9f,stroke:#333,stroke-width:2px
    style LoginForm fill:#bbf,stroke:#333,stroke-width:2px
    style ChatRoom fill:#bbf,stroke:#333,stroke-width:2px
    style MessageList fill:#bbf,stroke:#333,stroke-width:2px
    style MessageInput fill:#bbf,stroke:#333,stroke-width:2px
```

### Socket.IO通信フロー

```mermaid
flowchart TD
    Frontend[フロントエンド] <--> |WebSocket| Backend[バックエンド]
    
    subgraph "フロントエンド（React）"
    direction TB
    socket.js[socket.js] <--> App[App.jsx]
    App <--> ChatRoom[ChatRoom.jsx]
    end
    
    subgraph "バックエンド（Python）"
    direction TB
    Flask[Flask] <--> SocketIO[Socket.IO Server]
    SocketIO <--> EventHandlers[イベントハンドラー]
    EventHandlers <--> Storage[メモリ内ストレージ]
    end
    
    Frontend <--> Backend
```

### 状態管理

note-webchatアプリケーションでは、次の状態が管理されています：

- フロントエンド（React）
  - ユーザー認証状態（isLoggedIn）
  - ユーザー名（username）
  - アクティブユーザーリスト（activeUsers）
  - メッセージリスト（messages）

- バックエンド（Python）
  - 接続されたユーザー情報（connected_users）

これらの状態は、Socket.IOイベントを通じて同期されます。
