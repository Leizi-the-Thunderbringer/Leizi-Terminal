/**
 * Terminal 组件
 *
 * 基于 xterm.js 实现的终端组件，支持 SSH、Telnet 和串口连接。
 * 提供实时数据传输和自适应窗口大小功能。
 *
 * @example
 * ```tsx
 * <Terminal
 *   sessionId="ssh-1"
 *   type="ssh"
 *   config={{
 *     host: "example.com",
 *     port: 22,
 *     username: "user",
 *     password: "pass"
 *   }}
 * />
 * ```
 */

import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import '@xterm/xterm/css/xterm.css';

interface TerminalProps {
    sessionId: string;
    type: 'ssh' | 'telnet' | 'serial';
    config: {
        host?: string;
        port?: number;
        username?: string;
        password?: string;
        pkey?: string;
    };
}

const Terminal: React.FC<TerminalProps> = ({ sessionId, type, config }) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<XTerm | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!terminalRef.current) return;

        const term = new XTerm({
            cursorBlink: true,
            theme: {
                background: '#1e1e1e',
                foreground: '#ffffff'
            }
        });

        const fitAddon = new FitAddon();
        const webLinksAddon = new WebLinksAddon();

        term.loadAddon(fitAddon);
        term.loadAddon(webLinksAddon);

        term.open(terminalRef.current);
        fitAddon.fit();

        xtermRef.current = term;

        // 连接WebSocket
        const ws = new WebSocket(`ws://localhost:8000/ws/${type}`);
        wsRef.current = ws;

        ws.onopen = () => {
            ws.send(JSON.stringify(config));
        };

        ws.onmessage = (event) => {
            if (event.data instanceof Blob) {
                const reader = new FileReader();
                reader.onload = () => {
                    term.write(new Uint8Array(reader.result as ArrayBuffer));
                };
                reader.readAsArrayBuffer(event.data);
            } else {
                term.write(event.data);
            }
        };

        term.onData((data) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(data);
            }
        });

        const handleResize = () => {
            fitAddon.fit();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            term.dispose();
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [sessionId, type, config]);

    return <div ref={terminalRef} style={{ width: '100%', height: '100%' }} />;
};

export default Terminal;
