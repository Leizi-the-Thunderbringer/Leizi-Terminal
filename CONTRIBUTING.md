# Contributing to Leizi Terminal

感谢您对 Leizi Terminal 的贡献兴趣！

## 开发流程

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 提交规范

请遵循以下提交消息格式：

- `feat`: 新功能
- `fix`: 修复问题
- `docs`: 文档修改
- `style`: 代码格式修改
- `refactor`: 代码重构
- `test`: 测试用例修改
- `chore`: 其他修改

示例：`feat: 添加SSH密钥管理功能`

## 开发指南

1. Python 后端开发
- 遵循 PEP 8 代码规范
- 添加适当的类型注解
- 添加必要的文档字符串
- 确保代码通过 pylint 检查

2. React 前端开发
- 遵循 TypeScript 规范
- 使用函数式组件和 Hooks
- 确保代码通过 ESLint 检查
- 保持组件的单一职责

## 测试

- 后端：添加单元测试
- 前端：添加组件测试
- 运行测试：
  ```bash
  # 后端测试
  python -m pytest

  # 前端测试
  npm test
  ```

## 文档

- 代码变更时更新相关文档
- 添加新功能时补充 README.md
- 保持文档的及时性和准确性

## 问题反馈

- 使用 GitHub Issues 提交问题
- 清晰描述问题现象
- 提供复现步骤
- 附上相关日志和截图

感谢您的贡献！
