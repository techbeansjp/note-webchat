# バックエンド仕様

このドキュメントでは、note-webchatのバックエンド実装について説明します。

## 技術スタック

- Python 3
- Flask: Webアプリケーションフレームワーク
- Socket.IO: WebSocketベースのリアルタイム通信
- Gevent: 非同期I/Oライブラリ

## サーバー構成

バックエンドは、Flask + Socket.IOを使用したWebSocketサーバーとして実装されています。
サーバーはGeventを使用して非同期I/Oを実現しています。

```mermaid
graph TD
    A[クライアント] <-->|Socket.IO| B[Flask + Socket.IOサーバー]
    B <--> C[(メモリ内ストレージ)]
```

## データモデル

### メモリ内データ構造

サーバーは、以下のデータをメモリ内に保持します：

- `connected_users`: 接続されているユーザー情報
  - キー: セッションID（sid）
  - 値: ユーザー情報（username）

```python
connected_users = {}  # sid -> {"username": username}
```

## イベントハンドラー

### 接続イベント

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant Server as サーバー
    
    Client->>Server: 接続（connect）
    Server-->>Server: 接続を記録
```

### 入室イベント

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant Server as サーバー
    
    Client->>Server: 入室（join）{username}
    Server-->>Server: ユーザー情報を保存
    Server-->>Client: 入室通知（user_joined）
    Server-->>Client: アクティブユーザーリスト更新（active_users）
```

### メッセージ送信イベント

```mermaid
sequenceDiagram
    participant Sender as 送信者
    participant Server as サーバー
    participant Others as 他のクライアント
    
    Sender->>Server: メッセージ送信（send_message）{message}
    Server-->>Sender: メッセージ（chat_message）{isSelf: true}
    Server-->>Others: メッセージ（chat_message）{isSelf: false}
```

### 切断イベント

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant Server as サーバー
    participant Others as 他のクライアント
    
    Client->>Server: 切断（disconnect）
    Server-->>Server: ユーザー情報を削除
    Server-->>Others: 退室通知（user_left）
    Server-->>Others: アクティブユーザーリスト更新（active_users）
```

## 実行方法

1. 必要なパッケージをインストール:
   ```
   cd backend
   pip install -r requirements.txt
   ```

2. サーバーを起動:
   ```
   python server.py
   ```

3. デフォルトでは、サーバーはポート8000で起動します:
   ```
   http://localhost:8000
   ```
