# Leizi Terminal

[![CI](https://github.com/Leizi-the-Thunderbringer/Leizi-Terminal/actions/workflows/ci.yml/badge.svg)](https://github.com/Leizi-the-Thunderbringer/Leizi-Terminal/actions/workflows/ci.yml)
[![Release](https://github.com/Leizi-the-Thunderbringer/Leizi-Terminal/actions/workflows/release.yml/badge.svg)](https://github.com/Leizi-the-Thunderbringer/Leizi-Terminal/actions/workflows/release.yml)
[![GitHub license](https://img.shields.io/github/license/Leizi-the-Thunderbringer/Leizi-Terminal)](https://github.com/Leizi-the-Thunderbringer/Leizi-Terminal/blob/main/LICENSE)

一个现代化的终端工具，支持 SSH/Telnet/串口协议，使用 Electron 和 React 实现 Material Design 3 风格的界面。

## 特性

- 🚀 支持 SSH/Telnet/串口协议
- 🎨 Material Design 3 风格界面
- 📑 多标签页管理
- 🔑 SSH 密钥登录
- 💾 配置保存
- ⚡ 快捷方式
- 📁 SFTP 文件管理

## 安装

从 [releases](https://github.com/Leizi-the-Thunderbringer/Leizi-Terminal/releases) 页面下载最新版本：

- Windows: `.exe` 安装包
- macOS: `.dmg` 安装包
- Linux: `.AppImage` 可执行文件

## 开发

### 环境要求

- Python 3.10+
- Node.js 18+
- npm 8+

### 本地开发

1. 克隆仓库
```bash
git clone https://github.com/Leizi-the-Thunderbringer/Leizi-Terminal.git
cd Leizi-Terminal
```

2. 安装依赖
```bash
# 安装 Python 依赖
pip install -r requirements.txt

# 安装前��依赖
cd frontend
npm install
```

3. 启动开发服务器
```bash
npm run electron:dev
```

### 构建

```bash
cd frontend
npm run electron:build
```

构建完成后，可在 `frontend/dist` 目录下找到相应平台的安装包。

## 贡献

欢迎提交 Pull Request！请确保在提交前：

1. 更新测试用例
2. 更新文档
3. 遵循现有的代码风格

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件
