"""
Leizi Terminal Backend Server

这是 Leizi Terminal 的后端服务器，提供以下功能：
1. SSH 连接支持（含密钥认证）
2. Telnet 连接支持
3. 串口连接支持
4. SFTP 文件管理
5. 配置和快捷方式管理

使用方法：
    uvicorn main:app --reload

依赖：
    - fastapi
    - paramiko (SSH/SFTP)
    - telnetlib3 (Telnet)
    - pyserial (串口)
"""
# pylint: disable=missing-function-docstring,missing-class-docstring,too-many-arguments,too-many-locals,unused-argument

import asyncio
import json
import os
from typing import Dict, Any, List, Optional

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import paramiko
import telnetlib3
import serial
import serial.tools.list_ports

app = FastAPI(
    title="Leizi Terminal Backend",
    description="现代化终端工具的后端服务",
    version="0.1.0"
)

# 允许跨域，便于前端开发
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== SSH WebSocket ==========
@app.websocket("/ws/ssh")
async def websocket_ssh(websocket: WebSocket) -> None:
    """
    处理 SSH WebSocket 连接

    支持密码和密钥两种认证方式，通过 WebSocket 实现实时数据传输。

    参数格式：
    {
        "host": str,
        "port": int = 22,
        "username": str,
        "password": Optional[str],
        "pkey": Optional[str]  # 私钥文件路径
    }
    """
    await websocket.accept()
    try:
        data = await websocket.receive_json()
        host = data.get("host")
        port = data.get("port", 22)
        username = data.get("username")
        password = data.get("password")
        pkey = data.get("pkey")  # 私钥内容
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        try:
            if pkey:
                key = paramiko.RSAKey.from_private_key_file(pkey)
                client.connect(host, port, username, pkey=key)
            else:
                client.connect(host, port, username, password)
            chan = client.invoke_shell()
            await websocket.send_text("[SSH] Connected.\n")
            async def recv():
                while True:
                    data = chan.recv(1024)
                    if not data:
                        break
                    await websocket.send_bytes(data)
            loop = asyncio.get_event_loop()
            recv_task = loop.create_task(recv())
            while True:
                msg = await websocket.receive_text()
                chan.send(msg)
        except Exception as e:
            await websocket.send_text(f"[SSH] Error: {e}\n")
        finally:
            client.close()
    except WebSocketDisconnect:
        pass

# ========== Telnet WebSocket ==========
@app.websocket("/ws/telnet")
async def websocket_telnet(websocket: WebSocket):
    await websocket.accept()
    try:
        data = await websocket.receive_json()
        host = data.get("host")
        port = data.get("port", 23)
        username = data.get("username")
        password = data.get("password")
        reader, writer = await telnetlib3.open_connection(host, port=port, shell=None, encoding='utf8')
        await websocket.send_text("[Telnet] Connected.\n")
        async def recv():
            while True:
                data = await reader.read(1024)
                if not data:
                    break
                await websocket.send_text(data)
        loop = asyncio.get_event_loop()
        recv_task = loop.create_task(recv())
        while True:
            msg = await websocket.receive_text()
            writer.write(msg)
    except Exception as e:
        await websocket.send_text(f"[Telnet] Error: {e}\n")

# ========== Serial WebSocket ==========
@app.websocket("/ws/serial")
async def websocket_serial(websocket: WebSocket):
    await websocket.accept()
    try:
        data = await websocket.receive_json()
        port = data.get("port")
        baudrate = data.get("baudrate", 9600)
        ser = serial.Serial(port, baudrate, timeout=0.1)
        await websocket.send_text("[Serial] Connected.\n")
        async def recv():
            while True:
                data = ser.read(1024)
                if data:
                    await websocket.send_bytes(data)
        loop = asyncio.get_event_loop()
        recv_task = loop.create_task(recv())
        while True:
            msg = await websocket.receive_text()
            ser.write(msg.encode())
    except Exception as e:
        await websocket.send_text(f"[Serial] Error: {e}\n")

# ========== SFTP 文件管理（示例API） ==========
@app.post("/api/sftp/list")
async def sftp_list(data: Dict[str, Any]) -> Dict[str, List[str]]:
    """
    列出 SFTP 目录内容

    参数:
        data: 包含连接信息的字典
            - host: 主机地址
            - port: 端口号（默认22）
            - username: 用户名
            - password: 密码
            - pkey: 私钥路径
            - path: 要列出的目录路径（默认为"."）

    返回:
        包含文件列表的字典
    """
    host = data.get("host")
    port = data.get("port", 22)
    username = data.get("username")
    password = data.get("password")
    pkey = data.get("pkey")
    path = data.get("path", ".")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        if pkey:
            key = paramiko.RSAKey.from_private_key_file(pkey)
            client.connect(host, port, username, pkey=key)
        else:
            client.connect(host, port, username, password)
        sftp = client.open_sftp()
        files = sftp.listdir(path)
        sftp.close()
        client.close()
        return JSONResponse({"files": files})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

# ========== 配置/快捷方式API（本地JSON存储，示例） ==========
CONFIG_PATH = "config.json"
SHORTCUT_PATH = "shortcut.json"

@app.get("/api/config")
def get_config():
    if not os.path.exists(CONFIG_PATH):
        return {}
    with open(CONFIG_PATH, "r") as f:
        return json.load(f)

@app.post("/api/config")
def save_config(data: Dict[str, Any]):
    with open(CONFIG_PATH, "w") as f:
        json.dump(data, f)
    return {"status": "ok"}

@app.get("/api/shortcut")
def get_shortcut():
    if not os.path.exists(SHORTCUT_PATH):
        return {}
    with open(SHORTCUT_PATH, "r") as f:
        return json.load(f)

@app.post("/api/shortcut")
def save_shortcut(data: Dict[str, Any]):
    with open(SHORTCUT_PATH, "w") as f:
        json.dump(data, f)
    return {"status": "ok"}

# ========== 串口可用端口列表 ==========
@app.get("/api/serial/ports")
def list_serial_ports() -> Dict[str, List[str]]:
    """
    获取系统可用的串口列表

    返回:
        包含可用串口设备路径的字典
    """
    ports = [port.device for port in serial.tools.list_ports.comports()]
    return {"ports": ports}

# 启动命令：uvicorn main:app --reload
