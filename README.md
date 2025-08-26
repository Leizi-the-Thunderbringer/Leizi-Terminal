# Leizi Terminal

一个基于 Electron 和 Python 的现代化终端工具，支持 SSH、Telnet 和串口连接。

## 特性

- 支持多种协议：SSH、Telnet、串口
- Material Design 3 风格界面
- 多标签页管理
- SSH 密钥登录支持
- SFTP 文件管理
- 配置保存和快捷方式
- 跨平台支持（Windows、macOS、Linux）

## 技术栈

- 后端：Python (FastAPI)
  - SSH: paramiko
  - Telnet: telnetlib3
  - 串口: pyserial
  - WebSocket 实时通信

- 前端：Electron + React
  - Material UI (MUI v5)
  - xterm.js
  - TypeScript
  - Vite

## 开发环境要求

- Python 3.8+
- Node.js 16+
- npm 或 yarn

## 安装

1. 克隆仓库：
```bash
git clone https://github.com/yourusername/leizi-terminal.git
cd leizi-terminal
```

2. 安装后端依赖：
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. 安装前端依赖：
```bash
cd frontend
npm install
```

## 开发

1. 启动后端服务：
```bash
python -m uvicorn main:app --reload
```

2. 启动前端开发环境：
```bash
cd frontend
npm run electron:dev
```

## 构建

```bash
cd frontend
npm run electron:build
```

构建后的应用将在 `frontend/release` 目录下。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
