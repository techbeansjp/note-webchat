#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import time

from gevent import monkey

monkey.patch_all()  # geventのmonkey patchingを適用

import socketio
from flask import Flask
from flask_cors import CORS

# Flaskアプリケーションとソケットサーバーの設定
app = Flask(__name__)
CORS(app)  # CORSを有効化
sio = socketio.Server(cors_allowed_origins='*', async_mode='gevent')
app = socketio.WSGIApp(sio, app)

# サーバーメモリ内のデータ構造
connected_users = {}  # sid -> {"username": username}
# 初期値は空のディクショナリ

@sio.event
def connect(sid, environ):
    """クライアント接続時のハンドラ"""
    print(f'クライアント接続: {sid}')

@sio.event
def disconnect(sid):
    """クライアント切断時のハンドラ"""
    if sid in connected_users:
        username = connected_users[sid]['username']
        # ユーザー情報を削除
        del connected_users[sid]
        
        # 他のユーザーに退室を通知
        timestamp = int(time.time() * 1000)  # ミリ秒単位のタイムスタンプ
        sio.emit('user_left', {
            'username': username,
            'timestamp': timestamp
        })
        
        # アクティブユーザーリストを更新して送信
        active_users = [{'username': user_data['username']} for user_data in connected_users.values()]
        sio.emit('active_users', active_users)
        
        print(f'ユーザー退室: {username}')

@sio.event
def join(sid, data):
    """ユーザー入室時のハンドラ"""
    username = data.get('username')
    
    if not username:
        return
    
    # ユーザー情報を保存
    connected_users[sid] = {'username': username}
    
    # 他のユーザーに入室を通知
    timestamp = int(time.time() * 1000)  # ミリ秒単位のタイムスタンプ
    sio.emit('user_joined', {
        'username': username,
        'timestamp': timestamp
    })
    
    # アクティブユーザーリストを更新して送信
    active_users = [{'username': user_data['username']} for user_data in connected_users.values()]
    sio.emit('active_users', active_users)
    
    print(f'ユーザー入室: {username}')

@sio.event
def send_message(sid, data):
    """メッセージ送信時のハンドラ"""
    if sid not in connected_users:
        return
    
    username = connected_users[sid]['username']
    message = data.get('message', '')
    
    if not message:
        return
    
    timestamp = int(time.time() * 1000)  # ミリ秒単位のタイムスタンプ
    
    # 送信者自身にはisSelf=Trueで送信
    sio.emit('chat_message', {
        'username': username,
        'message': message,
        'timestamp': timestamp,
        'isSelf': True
    }, room=sid)
    
    # 他のユーザーにはisSelf=Falseで送信
    for other_sid in connected_users:
        if other_sid != sid:
            sio.emit('chat_message', {
                'username': username,
                'message': message,
                'timestamp': timestamp,
                'isSelf': False
            }, room=other_sid)
    
    print(f'メッセージ: {username}: {message}')

if __name__ == '__main__':
    # サーバーの起動
    port = 8000
    print(f'サーバーを起動しています... ポート: {port}')
    # geventサーバーを使用
    from gevent import pywsgi
    server = pywsgi.WSGIServer(('0.0.0.0', port), app)
    server.serve_forever()