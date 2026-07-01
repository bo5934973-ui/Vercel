# Vercel 部署说明

这版项目已经切到 Vercel 结构：

- 网站由 Vercel 托管 Next.js。
- 后台内容接口是 `/api/content`。
- 图片上传接口是 `/api/media`。
- 内容和上传图片保存到 Vercel Blob。

## 1. 上传代码到 GitHub

把整个项目上传到 GitHub 仓库。Vercel 会从 GitHub 自动拉取并部署。

## 2. 在 Vercel 导入项目

在 Vercel 新建项目，选择这个 GitHub 仓库。

构建设置保持默认：

```text
Framework Preset: Next.js
Build Command: npm run build
Output Directory: 留空
Install Command: npm install
```

## 3. 创建 Blob 存储

在项目的 Storage 里创建 Blob。

创建后，把 Blob 连接到这个项目。Vercel 会自动提供 Blob 访问所需的环境变量。

## 4. 配置后台密码

在 Vercel 项目环境变量里添加：

```text
ADMIN_PASSWORD=你的后台密码
```

然后重新部署一次。

## 5. 迁移当前后台内容

如果 Netlify 里还有最新内容：

1. 进入旧后台，导出 JSON。
2. 部署 Vercel 后，进入新后台 `/admin`。
3. 导入 JSON。
4. 输入后台密码，点击保存到线上。

## 6. 检查

- 首页能打开。
- `/admin` 能打开。
- 后台能保存文字。
- 后台能上传图片。
- 刷新首页不会闪旧内容。
