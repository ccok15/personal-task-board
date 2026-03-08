# 个人测试任务看板网站

一个面向芯片硬件测试协作场景的任务终端。

核心能力：
- 首页集中展示当前任务
- 首页直接新建任务
- 首页直接推进任务状态
- `/tasks` 作为游客只读的任务管理页
- 管理员维护公开 / 私人任务与详细字段
- GitHub + Docker Compose 的生产部署基线

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
- `SEED_SAMPLE_DATA`

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
如果将 `SEED_SAMPLE_DATA="false"`，则只创建管理员，不写入示例任务。

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

## 版本控制

当前项目已经是独立 Git 仓库，远端为：

```bash
git@github.com:ccok15/personal-task-board.git
```

日常提交流程：

```bash
git add .
git commit -m "你的修改说明"
git push
```

推荐做法：
- `main` 作为生产分支
- 每次正式上线前打一个 tag，便于回滚
- 服务器只做部署副本，不直接改代码

## Prisma 迁移

仓库已经补了基线迁移，生产环境不要再用 `prisma db push`。

开发环境：

```bash
pnpm prisma:migrate:dev --name 你的迁移名
pnpm prisma:generate
```

生产环境：

```bash
pnpm prisma:migrate:deploy
```

## 生产部署基线

仓库内已包含：

- `/Users/lsl/new_gpt/web_lsl/Dockerfile:1`
- `/Users/lsl/new_gpt/web_lsl/docker-compose.prod.yml:1`
- `/Users/lsl/new_gpt/web_lsl/Caddyfile:1`
- `/Users/lsl/new_gpt/web_lsl/.env.production.example:1`
- `/Users/lsl/new_gpt/web_lsl/scripts/deploy-prod.sh:1`
- `/Users/lsl/new_gpt/web_lsl/scripts/rollback-prod.sh:1`

首次部署前，服务器上执行：

```bash
cp .env.production.example .env.production
```

然后填写：
- `APP_DOMAIN`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

首次上线：

```bash
bash scripts/deploy-prod.sh
```

后续发布：

```bash
git pull --ff-only origin main
bash scripts/deploy-prod.sh
```

回滚到某个 tag 或 commit：

```bash
bash scripts/rollback-prod.sh <git-ref-or-tag>
```

部署逻辑：
- `db` 使用 `PostgreSQL 16`
- `app` 使用项目内 `Dockerfile`
- `proxy` 使用 `Caddy`
- 每次部署都会执行 `prisma migrate deploy`
- 每次部署都会执行 `prisma:seed`，用于确保管理员账号存在
- 生产环境默认 `SEED_SAMPLE_DATA="false"`，不会写入示例任务

## 需求基线
- 现行需求说明见 `/Users/lsl/new_gpt/web_lsl/PRD_v1.md:1`
- 原始参考文档见 `/Users/lsl/new_gpt/web_lsl/个人工作计划与任务发布网站_产品需求文档_V1.docx:1`
