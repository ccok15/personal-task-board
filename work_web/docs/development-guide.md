# 开发维护文档

这份文档只服务于后续维护和改动，不讲产品背景，重点记录：

- 当前网站是怎么组织的
- 改某个功能时应该先看哪些文件
- 每次小改动后最低限度要验证什么

版本记录单独维护在：

- `/Users/lsl/new_gpt/web_lsl/work_web/docs/version-history.md:1`

## 1. 项目根目录

项目真实根目录：

```bash
/Users/lsl/new_gpt/web_lsl/work_web
```

以后所有本地开发、构建、调试、部署脚本，都以这个目录为准。

## 2. 当前网站结构

当前网站核心只围绕 **任务**，没有计划模块。

### 前台

- `/`：首页，展示未完成任务
- `/tasks`：游客只读任务管理
- `/login`：管理员登录

### 后台

- `/admin`：重定向到 `/admin/tasks`
- `/admin/tasks`：管理员任务管理页
- `/admin/tasks/[id]`：管理员编辑任务页

### 兼容保留路由

这些路由还在，但属于兼容或过渡用途：

- `/submit`
- `/plans`
- `/admin/plans`

如果后面做清理，可以统一删掉或继续保留重定向逻辑，但改之前先确认线上没有依赖。

## 3. 核心数据模型

数据模型在：

- `/Users/lsl/new_gpt/web_lsl/work_web/prisma/schema.prisma`

当前只需要重点理解两个模型：

### `User`

- 只支持管理员
- 当前登录方式是账号密码

### `Task`

关键字段：

- `title`
- `description`
- `submitterName`
- `priority`
- `status`
- `dueDate`
- `completedAt`
- `adminNote`
- `isPublic`
- `createdAt`
- `updatedAt`

## 4. 任务状态和权限

状态定义在：

- `/Users/lsl/new_gpt/web_lsl/work_web/lib/constants.ts`

当前状态：

- `PENDING`：待处理
- `IN_PROGRESS`：进行中
- `BLOCKED`：阻塞
- `DONE`：已完成
- `PAUSED`：搁置

权限规则：

- 游客只能看到公开任务
- 游客只能把公开未完成任务改成 `PAUSED`
- 管理员可以修改全部状态和字段

权限和登录逻辑在：

- `/Users/lsl/new_gpt/web_lsl/work_web/lib/auth.ts`
- `/Users/lsl/new_gpt/web_lsl/work_web/proxy.ts`

## 5. 页面数据来源

查询逻辑集中在：

- `/Users/lsl/new_gpt/web_lsl/work_web/lib/data.ts`

这里决定：

- 首页任务怎么筛选
- 任务管理页怎么搜索
- 管理员列表怎么排序

如果出现“列表顺序不对”“筛选不对”“搜索范围不对”，先看这个文件。

## 6. 写操作入口

任务写操作集中在：

- `/Users/lsl/new_gpt/web_lsl/work_web/lib/actions/task-actions.ts`

这里负责：

- 首页新建任务
- 后台新建任务
- 后台编辑任务
- 快速修改任务状态
- 删除任务

如果改动涉及“提交后怎么写库”“改状态后怎么刷新页面”“权限限制”，先看这个文件。

## 7. 首页相关文件

首页主入口：

- `/Users/lsl/new_gpt/web_lsl/work_web/app/page.tsx`

首页任务卡：

- `/Users/lsl/new_gpt/web_lsl/work_web/components/task/task-list-item.tsx`
- `/Users/lsl/new_gpt/web_lsl/work_web/components/task/expandable-task-card.tsx`

首页状态按钮：

- `/Users/lsl/new_gpt/web_lsl/work_web/components/task/task-status-actions.tsx`

首页新建任务表单：

- `/Users/lsl/new_gpt/web_lsl/work_web/components/task/home-task-form.tsx`

### 首页改动定位

如果需求是下面这些，优先看对应文件：

- 改首页任务卡样式：`task-list-item.tsx`
- 改首页卡片展开动画：`expandable-task-card.tsx`
- 改首页状态按钮：`task-status-actions.tsx`
- 改首页新建任务字段：`home-task-form.tsx`
- 改首页筛选逻辑：`app/page.tsx` + `lib/data.ts`

## 8. 任务管理页相关文件

游客任务管理页：

- `/Users/lsl/new_gpt/web_lsl/work_web/app/tasks/page.tsx`

管理员任务管理页：

- `/Users/lsl/new_gpt/web_lsl/work_web/app/admin/tasks/page.tsx`

筛选表单：

- `/Users/lsl/new_gpt/web_lsl/work_web/components/task/task-filter-form.tsx`

移动端卡片：

- `/Users/lsl/new_gpt/web_lsl/work_web/components/task/task-management-card.tsx`

## 9. 登录相关文件

登录页：

- `/Users/lsl/new_gpt/web_lsl/work_web/app/login/page.tsx`

登录表单：

- `/Users/lsl/new_gpt/web_lsl/work_web/components/auth/login-form.tsx`

退出按钮：

- `/Users/lsl/new_gpt/web_lsl/work_web/components/auth/sign-out-button.tsx`

如果出现这些问题，先看这里：

- 登录成功后跳错地址
- 登录后被拒绝访问
- 退出后没有回前台

## 10. 主题和全局 UI

全局样式：

- `/Users/lsl/new_gpt/web_lsl/work_web/app/globals.css`

主题切换：

- `/Users/lsl/new_gpt/web_lsl/work_web/components/theme/theme-toggle.tsx`
- `/Users/lsl/new_gpt/web_lsl/work_web/lib/theme.ts`
- `/Users/lsl/new_gpt/web_lsl/work_web/app/layout.tsx`

头部布局：

- `/Users/lsl/new_gpt/web_lsl/work_web/components/layout/site-header.tsx`
- `/Users/lsl/new_gpt/web_lsl/work_web/components/layout/admin-shell.tsx`

如果改动涉及“浅色模式”“导航布局”“手机端头部”，先看这些文件。

## 11. 表单校验

校验集中在：

- `/Users/lsl/new_gpt/web_lsl/work_web/lib/validators.ts`

现在关键规则：

- 标题必填
- 提交人名称必填

如果以后改字段必填/可选规则，优先改这里，再同步表单 UI。

## 12. 本地开发基线

常用命令：

```bash
cd /Users/lsl/new_gpt/web_lsl/work_web
pnpm lint
pnpm build
pnpm dev
```

当前本地预览通常使用：

```bash
http://127.0.0.1:3011
```

如果本地登录跳错端口，优先检查：

- `/Users/lsl/new_gpt/web_lsl/work_web/.env`
- `NEXTAUTH_URL`

## 13. 每次小改动后的最低验证

不要每次都做全量测试。  
小改动只执行极简冒烟测试：

- `/Users/lsl/new_gpt/web_lsl/work_web/docs/simple-smoke-test.md`

执行标准：

- 游客：首页、任务管理能打开
- 管理员：登录、任务管理、退出能走通

只有你明确要求“大版本全量测试”时，才扩大量级。

## 14. 修改时的优先原则

以后维护这个站点，优先遵守下面几条：

1. 先改最小范围，不要顺手大改
2. 样式改动优先落在组件层，不要到页面里散改
3. 列表排序、搜索、筛选，优先统一改 `lib/data.ts`
4. 写库和权限逻辑，优先统一改 `lib/actions/task-actions.ts`
5. 小改动后只跑极简冒烟测试
6. 没有明确要求时，不提交 GitHub，不同步服务器

## 15. 当前维护注意点

目前有几个点后续改动时要特别注意：

- 项目里仍保留部分旧路由（如 `/plans`），属于兼容逻辑
- 本地开发和线上生产的环境变量不同，尤其是 `NEXTAUTH_URL`
- 首页任务卡现在是“默认压缩，点击展开”，如果再改布局，不要破坏展开交互
- 游客和管理员看到的内容不完全一样，改前台列表时要同时看两种身份
