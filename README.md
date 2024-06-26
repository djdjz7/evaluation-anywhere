# Evaluation Anywhere

新测评的在线实现。

[Demo](http://ea.djdjz7.top)

> [!NOTE]
> 一些浏览器似乎会将 HTTP 访问重定向至 HTTPS。
> 解决方案：在浏览器设置中允许 ea.djdjz7.top 访问不安全的内容，即可
> 在 HTTPS 协议下正常使用。
>
> **对于移动端或者某些无法调整该设置的浏览器：** 在设置中更改 BaseURL
> 至 Astrack Proxy（thx [@Kom3ng](https://github.com/Kom3ng)）

> [!WARNING]
> 本项目的所有实现均为基于事实的猜测，不保证与新测评的实现完全一致。  
> 请自行承担使用后果。

## 浏览器兼容性

理论上能够运行在任何发布时间晚于 2021 年的浏览器上。桌面端建议
Google Chrome 或 Microsoft Edge，移动端建议使用 Android 设备。
iOS/iPadOS 15 及以上的设备应当兼容大部分功能，但可能与新测评行为不一致。

> [!NOTE]
> 开发环境：  
> Microsoft Edge 121  
> Apple Safari on iOS 17

为与新测评行为对齐，图片的上传格式应为 WEBP。在 Google Chrome，
Microsoft Edge 及 Mozilla Firefox 中，画板及上传的图片能够转换为
WEBP；然而，Safari 并不支持 Canvas 到 WEBP 的转换，故 Safari
上使用 PNG 格式上传。

## 目前实现的功能

- 登录与登出
- 搜索
- 无题干组卷（单选、多选、填空、解答题）的提交
- 有题干作业的提交（未经完全测试）
- 大题说明、试卷说明
- 试卷详情（大致完成）

## 实现中

## 搁置中
- 订正

## 未计划
- 自批