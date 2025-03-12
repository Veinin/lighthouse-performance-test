# Lighthouse 需要登录的网页性能测试框架

这个框架允许你使用Lighthouse测试需要登录的网页性能。它使用Puppeteer进行登录并维持会话状态，然后在已登录的状态下运行Lighthouse测试。

## 目录结构

```
lighthouse-test/
├── config/             # 配置文件目录
│   └── config.js       # 主配置文件
├── src/                # 源代码目录
│   ├── utils/          # 工具函数目录
│   │   ├── login.js    # 登录处理
│   │   └── report.js   # 报告生成
│   └── index.js        # 主入口文件
├── reports/            # 生成的报告目录(自动创建)
├── package.json        # 项目依赖
└── README.md           # 项目说明
```

## 功能

- 自动登录到需要认证的网站
- 对多个页面进行性能测试
- 保存HTML格式的测试报告
- 生成测试摘要

## 安装

```bash
npm install
```

## 配置

编辑`config/config.js`文件以配置您的测试站点、登录信息和报告格式。

## 使用方法

测试默认站点的所有页面：

```bash
npm start
```

测试特定站点：

```bash
npm start -- --site "Test_Github"
```

测试特定页面：

```bash
npm start -- --pages "/dashboard,/profile"
```

## 报告

测试报告将保存在`./reports`目录下，按站点名称和日期时间组织。
