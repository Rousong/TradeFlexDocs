# 部署说明

## GitHub Pages 部署步骤

### 1. 推送代码到 GitHub

```bash
git add .
git commit -m "Initial commit: Setup TradeFlex documentation site"
git push origin main
```

### 2. 启用 GitHub Pages

1. 进入 GitHub 仓库设置页面
2. 滚动到 "Pages" 部分
3. 在 "Source" 下选择 "Deploy from a branch"
4. 选择 "main" 分支和 "/ (root)" 文件夹
5. 点击 "Save"

### 3. 配置自定义域名

如果您有自定义域名：

1. 在您的域名提供商处添加以下 DNS 记录：
   ```
   Type: CNAME
   Name: docs (或您想要的子域名)
   Value: rousong.github.io
   ```

2. 更新 `CNAME` 文件中的域名

3. 在 GitHub Pages 设置中添加自定义域名

### 4. 更新应用中的 URL

将应用代码中的以下占位符替换为实际域名：

- `https://rousong.github.io/TradeFlexDocs/` 
- 替换为: `https://docs.tradeflex.app/` （如果使用自定义域名）

需要更新的文件：
- `TradeFlex/lib/core/constants/app_info.dart`
- `TradeFlex/lib/core/controllers/settings/about_page_controller.dart`
- `TradeFlex/lib/mobile/settings/pages/subscription/mobile_subscription_screen.dart`
- `TradeFlex/lib/desktop/settings/pages/subscription/desktop_subscription_screen.dart`

## 维护文档

### 更新版本历史

当发布新版本时，更新 `changelog.html` 文件：

1. 在时间线顶部添加新版本
2. 更新当前版本信息
3. 添加新功能和改进列表
4. 提交并推送更改

### 更新法律文档

当需要更新隐私政策、服务条款或免责声明时：

1. 编辑相应的 HTML 文件
2. 更新文档顶部的"最后更新"日期
3. 提交并推送更改
4. 考虑在应用中通知用户文档已更新

## 性能优化

- 所有页面都使用 CDN 加载的 Bootstrap 和 Font Awesome
- 图片应该压缩并使用适当的格式
- 考虑启用 GitHub Pages 的 HTTPS（默认启用）

## SEO 优化

- 每个页面都有适当的 meta 标签
- 使用语义化的 HTML 结构
- 包含 sitemap.xml（可以通过 Jekyll 插件自动生成）