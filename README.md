# 个人测试任务看板网站

一个面向芯片硬件测试协作场景的任务终端。

核心能力：
- 首页集中展示当前任务
- 首页直接新建任务
- 首页直接推进任务状态
- `/tasks` 作为游客只读的任务管理页
- 管理员维护公开 / 私人任务与详细字段

## 技术栈
- `Next.js 16` + `TypeScript`
- `Tailwind CSS 4`
- `NextAuth.js` 凭证登录
- `Prisma` + `PostgreSQL`
- `Motion`
- 自定义 `shadcn/ui` 风格组件

## 本地启动

### 1. 准备环境变量
```bash
cp .env.example .env
```

至少需要修改：
- `NEXTAUTH_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

### 2. 启动 PostgreSQL
如果本机没有现成 PostgreSQL，可直接使用 Docker：

```bash
docker compose up -d
```

### 3. 老数据升级（已有本地库时执行）
如果你之前跑过旧版本，先执行：

```bash
pnpm db:prepare-task-first
pnpm prisma db push --accept-data-loss
```

全新数据库可直接跳过这一步。

### 4. 生成 Prisma Client
```bash
pnpm prisma:generate
```

### 5. 推送数据库结构并写入初始数据
```bash
pnpm prisma:push
pnpm prisma:seed
```

### 6. 启动开发服务器
```bash
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 默认管理员账号
- 用户名：读取 `.env` 中的 `ADMIN_USERNAME`
- 邮箱：读取 `.env` 中的 `ADMIN_EMAIL`
- 密码：读取 `.env` 中的 `ADMIN_PASSWORD`

默认种子会自动创建管理员和示例任务数据。

## 主要页面
- `/`：当前任务首页
- `/tasks`：游客只读任务管理
- `/login`：后台登录
- `/admin`：重定向到任务管理
- `/admin/tasks`：任务管理
- `/submit`：重定向到首页新建任务
- `/plans`：重定向到首页
- 管理员访问 `/tasks` 时会直接跳转到 `/admin/tasks`

## 重要约束
- 首页创建任务时标题和提交人名称必填，其余字段可空
- 游客只能看到公开任务
- 游客只能把公开未完成任务改为“搁置”
- 管理员能看到公开 + 私人任务，并可修改全部状态和字段
- `adminNote` 永远不在前台显示
- 当前版本不做验证码、限流、文件上传、第三方登录

## 需求基线
- 现行需求说明见 `/Users/lsl/new_gpt/web_lsl/PRD_v1.md:1`
- 原始参考文档见 `/Users/lsl/new_gpt/web_lsl/个人工作计划与任务发布网站_产品需求文档_V1.docx:1`
