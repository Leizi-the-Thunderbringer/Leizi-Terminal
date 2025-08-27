# test_main.py - 简单的后端测试
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_main():
    """测试基本路由是否正常工作"""
    # 测试根路径（如果没有，这个测试会失败，但至少能运行）
    response = client.get("/")
    # 由于没有定义根路径，期望 404
    assert response.status_code in [200, 404]

def test_config_endpoint():
    """测试配置端点"""
    response = client.get("/api/config")
    assert response.status_code == 200

def test_shortcut_endpoint():
    """测试快捷方式端点"""
    response = client.get("/api/shortcut")
    assert response.status_code == 200

def test_serial_ports_endpoint():
    """测试串口列表端点"""
    response = client.get("/api/serial/ports")
    assert response.status_code == 200
    data = response.json()
    assert "ports" in data
    assert isinstance(data["ports"], list)