import { app, BrowserWindow } from 'electron';
import * as path from 'path';

// 开启调试日志
const DEBUG = process.env.DEBUG === 'true';
function log(...args: unknown[]): void {
    if (DEBUG) {
        console.log('[Electron]', ...args);
    }
}

function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
}

function createWindow(): Electron.BrowserWindow {
    log('Creating main window...');
    log('Environment:', process.env.NODE_ENV);

    const mainWindow = new BrowserWindow({
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
        mainWindow.loadURL(devUrl).catch((err: Error) => {
            log('Failed to load dev URL:', err);
            log('Make sure the Vite dev server is running on port 5173');
        });
        mainWindow.webContents.openDevTools();
    } else {
        log('Loading production build...');
        const indexPath = path.join(__dirname, '../../dist/index.html');
        log('Index path:', indexPath);
        mainWindow.loadFile(indexPath).catch((err: Error) => {
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

    mainWindow.webContents.on('did-fail-load', (_event: Electron.Event, errorCode: number, errorDescription: string) => {
        log('Page failed to load:', errorCode, errorDescription);
    });

    return mainWindow;
}

let mainWindow: Electron.BrowserWindow | null = null;

app.on('ready', () => {
    log('App is ready');
    mainWindow = createWindow();
});

app.on('window-all-closed', () => {
    log('All windows closed');
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    log('App activated');
    if (mainWindow === null) {
        mainWindow = createWindow();
    }
});

process.on('uncaughtException', (error: Error) => {
    log('Uncaught exception:', error);
});
