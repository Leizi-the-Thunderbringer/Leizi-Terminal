import React, { useState } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Tab,
    Tabs,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    Menu as MenuIcon,
    Close as CloseIcon,
    Settings as SettingsIcon,
    Terminal as TerminalIcon,
    Folder as FolderIcon
} from '@mui/icons-material';
import Terminal from './Terminal';

interface Session {
    id: string;
    title: string;
    type: 'ssh' | 'telnet' | 'serial';
    config: {
        host?: string;
        port?: number;
        username?: string;
        password?: string;
        pkey?: string;
    };
}

const MainLayout: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [activeTab, setActiveTab] = useState<string>('');
    const [isNewSessionDialogOpen, setNewSessionDialogOpen] = useState(false);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [newSessionData, setNewSessionData] = useState({
        type: 'ssh',
        host: '',
        port: '',
        username: '',
        password: '',
    });

    const handleNewSession = () => {
        const session: Session = {
            id: Date.now().toString(),
            title: `${newSessionData.type}://${newSessionData.host}`,
            type: newSessionData.type as 'ssh' | 'telnet' | 'serial',
            config: {
                host: newSessionData.host,
                port: parseInt(newSessionData.port),
                username: newSessionData.username,
                password: newSessionData.password,
            },
        };

        setSessions([...sessions, session]);
        setActiveTab(session.id);
        setNewSessionDialogOpen(false);
    };

    const handleCloseTab = (sessionId: string) => {
        const newSessions = sessions.filter(session => session.id !== sessionId);
        setSessions(newSessions);
        if (activeTab === sessionId && newSessions.length > 0) {
            setActiveTab(newSessions[0].id);
        }
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={() => setDrawerOpen(!isDrawerOpen)}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Leizi Terminal
                    </Typography>
                    <IconButton color="inherit" onClick={() => setNewSessionDialogOpen(true)}>
                        <AddIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                open={isDrawerOpen}
                sx={{
                    width: isDrawerOpen ? 240 : 64,
                    transition: theme => theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    '& .MuiDrawer-paper': {
                        width: isDrawerOpen ? 240 : 64,
                        transition: theme => theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    },
                }}
            >
                <Toolbar />
                <List>
                    <ListItem button>
                        <ListItemIcon>
                            <TerminalIcon />
                        </ListItemIcon>
                        <ListItemText primary="Sessions" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <FolderIcon />
                        </ListItemIcon>
                        <ListItemText primary="SFTP" />
                    </ListItem>
                    <Divider />
                    <ListItem button>
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItem>
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 0, mt: 8 }}>
                {sessions.length > 0 ? (
                    <>
                        <Tabs
                            value={activeTab}
                            onChange={(_, value) => setActiveTab(value)}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{ borderBottom: 1, borderColor: 'divider' }}
                        >
                            {sessions.map(session => (
                                <Tab
                                    key={session.id}
                                    value={session.id}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {session.title}
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCloseTab(session.id);
                                                }}
                                            >
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    }
                                />
                            ))}
                        </Tabs>
                        <Box sx={{ height: 'calc(100vh - 120px)' }}>
                            {sessions.map(session => (
                                <Box
                                    key={session.id}
                                    sx={{
                                        display: activeTab === session.id ? 'block' : 'none',
                                        height: '100%',
                                    }}
                                >
                                    <Terminal
                                        sessionId={session.id}
                                        type={session.type}
                                        config={session.config}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                        }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => setNewSessionDialogOpen(true)}
                        >
                            新建会话
                        </Button>
                    </Box>
                )}
            </Box>

            <Dialog
                open={isNewSessionDialogOpen}
                onClose={() => setNewSessionDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>新建会话</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>连接类型</InputLabel>
                        <Select
                            value={newSessionData.type}
                            onChange={(e) => setNewSessionData({
                                ...newSessionData,
                                type: e.target.value,
                            })}
                        >
                            <MenuItem value="ssh">SSH</MenuItem>
                            <MenuItem value="telnet">Telnet</MenuItem>
                            <MenuItem value="serial">串口</MenuItem>
                        </Select>
                    </FormControl>
                    {newSessionData.type !== 'serial' && (
                        <>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="主机"
                                value={newSessionData.host}
                                onChange={(e) => setNewSessionData({
                                    ...newSessionData,
                                    host: e.target.value,
                                })}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="端口"
                                value={newSessionData.port}
                                onChange={(e) => setNewSessionData({
                                    ...newSessionData,
                                    port: e.target.value,
                                })}
                            />
                        </>
                    )}
                    {newSessionData.type === 'ssh' && (
                        <>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="用户名"
                                value={newSessionData.username}
                                onChange={(e) => setNewSessionData({
                                    ...newSessionData,
                                    username: e.target.value,
                                })}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="密码"
                                type="password"
                                value={newSessionData.password}
                                onChange={(e) => setNewSessionData({
                                    ...newSessionData,
                                    password: e.target.value,
                                })}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNewSessionDialogOpen(false)}>取消</Button>
                    <Button onClick={handleNewSession} variant="contained">
                        连接
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MainLayout;
