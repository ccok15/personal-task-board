# 单域名多站点接入

推荐结构：

- `example.com`：个人站主域名
- `www.example.com`：个人站别名
- `work.example.com`：当前工作站

不要把工作站挂到 `example.com/work`。当前项目和后续更多站点都更适合按主机名拆分。

## DNS 记录建议

在阿里云 DNS 中显式添加记录：

- `@` → 个人站服务器 IP
- `www` → 个人站服务器 IP
- `work` → 工作站服务器 IP

后续新增站点继续按子域名扩展，例如：

- `blog.example.com`
- `demo.example.com`
- `lab.example.com`

初期不建议使用 `*` 泛解析作为主方案，避免不同站点被错误转发到同一套服务。

## 当前工作站部署模式

当前项目支持两种正式部署模式：

- `PROXY_MODE=external`
  - 推荐
  - 复用服务器上已有的反向代理
  - 工作站容器对外暴露到主机 `3000` 端口
  - 由外部反向代理把 `work.example.com` 转发到工作站容器

- `PROXY_MODE=standalone`
  - 适合没有现成反向代理的独立服务器
  - 项目自带 `Caddy`
  - 直接接管 `80/443`

## 当前项目的生产环境变量

工作站正式启用域名时，至少要改这两个值：

- `APP_DOMAIN=work.example.com`
- `NEXTAUTH_URL=https://work.example.com`

后台路径保持不变：

- `https://work.example.com/login`
- `https://work.example.com/admin/tasks`

## Nginx Proxy Manager 配置

如果服务器上已经有 `Nginx Proxy Manager`，为工作站新建一个 `Proxy Host`：

- Domain Names：`work.example.com`
- Scheme：`http`
- Forward Hostname / IP：
  - 如果 `Nginx Proxy Manager` 运行在 Docker 容器里，填 `172.17.0.1`
  - 如果反向代理直接运行在宿主机上，填 `127.0.0.1`
- Forward Port：`3000`
- Websockets Support：开启
- Block Common Exploits：开启
- Cache Assets：关闭

SSL 建议：

- 申请 `Let's Encrypt`
- 开启 `Force SSL`
- 开启 `HTTP/2 Support`

## 验收

满足以下条件即为接入完成：

- `nslookup work.example.com` 返回工作站服务器公网 IP
- 访问 `https://work.example.com` 可打开首页
- 访问 `https://work.example.com/login` 可正常登录后台
- 个人站和工作站之间 Cookie 不串站
