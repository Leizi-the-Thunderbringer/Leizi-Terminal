"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
// 开启调试日志
const DEBUG = process.env.DEBUG === 'true';
function log(...args) {
    if (DEBUG) {
        console.log('[Electron]', ...args);
    }
}
function isDev() {
    return process.env.NODE_ENV === 'development';
}
function createWindow() {
    log('Creating main window...');
    log('Environment:', process.env.NODE_ENV);
    const mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        }
    });
    if (isDev()) {
        log('Loading development URL...');
        const devUrl = 'http://localhost:5173';
        mainWindow.loadURL(devUrl).catch((err) => {
            log('Failed to load dev URL:', err);
            log('Make sure the Vite dev server is running on port 5173');
        });
        mainWindow.webContents.openDevTools();
    }
    else {
        log('Loading production build...');
        const indexPath = path.join(__dirname, '../../dist/index.html');
        log('Index path:', indexPath);
        mainWindow.loadFile(indexPath).catch((err) => {
            log('Failed to load production build:', err);
        });
    }
    mainWindow.on('closed', () => {
        log('Main window closed');
        mainWindow.destroy();
    });
    mainWindow.webContents.on('did-finish-load', () => {
        log('Page finished loading');
    });
    mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
        log('Page failed to load:', errorCode, errorDescription);
    });
    return mainWindow;
}
let mainWindow = null;
electron_1.app.on('ready', () => {
    log('App is ready');
    mainWindow = createWindow();
});
electron_1.app.on('window-all-closed', () => {
    log('All windows closed');
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    log('App activated');
    if (mainWindow === null) {
        mainWindow = createWindow();
    }
});
process.on('uncaughtException', (error) => {
    log('Uncaught exception:', error);
});
