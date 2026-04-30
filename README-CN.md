<div align="center">

<img src="src/assets/logo.png" alt="Off Grid Logo" width="120" />

# Off Grid

### 设备端 AI 的瑞士军刀

**聊天。生成图像。使用工具。看。听。全部在手机或 Mac 上完成。完全离线。零数据离开你的设备。**

[![GitHub stars](https://img.shields.io/github/stars/alichherawalla/off-grid-mobile?style=social)](https://github.com/alichherawalla/off-grid-mobile)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Google Play](https://img.shields.io/badge/Google%20Play-下载-brightgreen?logo=google-play)](https://play.google.com/store/apps/details?id=ai.offgridmobile)
[![App Store](https://img.shields.io/badge/App%20Store-下载-blue?logo=apple)](https://apps.apple.com/us/app/off-grid-local-ai/id6759299882)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20macOS-green.svg)](#安装)
[![codecov](https://codecov.io/gh/alichherawalla/off-grid-mobile/graph/badge.svg)](https://codecov.io/gh/alichherawalla/off-grid-mobile)
[![Slack](https://img.shields.io/badge/Slack-加入社区-4A154B?logo=slack)](https://join.slack.com/t/off-grid-mobile/shared_invite/zt-3q7kj5gr6-rVzx5gl5LKPQh4mUE2CCvA)

</div>

---

## 不只是又一个聊天应用

大多数"本地大模型"应用只给你一个文本聊天机器人就完事了。Off Grid 是一个**完整的离线 AI 套件**——文本生成、图像生成、视觉 AI、语音转录、工具调用和文档分析，全部在您的手机或 Mac 硬件上原生运行。

---

## 它能做什么？

<div align="center">
<table>
  <tr>
    <td align="center"><img src="demo-gifs/onboarding.gif" width="200" /><br /><b>新手引导</b></td>
    <td align="center"><img src="demo-gifs/text-gen.gif" width="200" /><br /><b>文本生成</b></td>
    <td align="center"><img src="demo-gifs/image-gen.gif" width="200" /><br /><b>图像生成</b></td>
  </tr>
  <tr>
    <td align="center"><img src="demo-gifs/vision.gif" width="200" /><br /><b>视觉 AI</b></td>
    <td align="center"><img src="demo-gifs/attachments.gif" width="200" /><br /><b>附件</b></td>
    <td align="center"><img src="demo-gifs/tool-calling.gif" width="200" /><br /><b>工具调用</b></td>
</tr>
</table>
</div>

**文本生成** — 运行 Qwen 3、Llama 3.2、Gemma 3、Phi-4 和任何 GGUF 模型。流式响应、思考模式、Markdown 渲染，在旗舰设备上达到 15-30 tok/s。也可以加载你自己的 `.gguf` 文件。

**远程 LLM 服务器** — 连接到本地网络上的任何 OpenAI 兼容服务器（Ollama、LM Studio、LocalAI）。自动发现模型，通过 SSE 流式传输响应，将 API 密钥安全存储在系统钥匙串中。在本地和远程模型之间无缝切换。

**工具调用** — 支持函数调用的模型可以使用内置工具：网络搜索、计算器、日期/时间、设备信息和知识库搜索。自动工具循环，带 runaway 防护。搜索结果中的可点击链接。

**项目知识库** — 上传 PDF 和文本文档到项目知识库。文档在设备上进行分块、嵌入（使用捆绑的 MiniLM 模型），并通过余弦相似度检索——全部存储在本地 SQLite 中。`search_knowledge_base` 工具在项目对话中自动可用。

**图像生成** — 设备端 Stable Diffusion，实时预览。在 Snapdragon 上 NPU 加速（每张图像 5-10 秒），iOS 上 Core ML 加速。20+ 模型，包括 Absolute Reality、DreamShaper、Anything V5。

**视觉 AI** — 用相机指向任何东西并提问。SmolVLM、Qwen3-VL、Gemma 3n — 分析文档、描述场景、读取收据。在旗舰设备上约 7 秒。

**语音输入** — 设备端 Whisper 语音转文本。按住录音，自动转录。音频永远不会离开您的手机。

**文档分析** — 将 PDF、代码文件、CSV 等附加到您的对话中。两个平台都支持原生 PDF 文本提取。

**AI 提示增强** — 简单提示进，详细的 Stable Diffusion 提示出。您的文本模型会自动增强图像生成提示。

---

## 性能

| 任务 | 旗舰设备 | 中端设备 |
|------|----------|-----------|
| 文本生成 | 15-30 tok/s | 5-15 tok/s |
| 图像生成 (NPU) | 5-10s | — |
| 图像生成 (CPU) | ~15s | ~30s |
| 视觉推理 | ~7s | ~15s |
| 语音转录 | 实时 | 实时 |

在 Snapdragon 8 Gen 2/3、Apple A17 Pro 上测试。结果因模型大小和量化而异。

---

<a name="安装"></a>
## 安装

<div align="center">
<table><tr>
<td align="center"><a href="https://apps.apple.com/us/app/off-grid-local-ai/id6759299882"><img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="在 App Store 下载" width="180" /></a></td>
<td align="center"><a href="https://play.google.com/store/apps/details?id=ai.offgridmobile"><img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="在 Google Play 获取" width="220" /></a></td>
</tr></table>
</div>

或从 [**GitHub Releases**](https://github.com/alichherawalla/off-grid-mobile/releases/latest) 获取最新 APK。

> **macOS**：iOS App Store 版本通过 Mac Catalyst / iPad 兼容性在 Apple Silicon Mac 上原生运行。

### 从源码构建

```bash
git clone https://github.com/alichherawalla/off-grid-mobile.git
cd off-grid-mobile
npm install

# Android
cd android && ./gradlew clean && cd ..
npm run android

# iOS
cd ios && pod install && cd ..
npm run ios
```

> 需要 Node.js 20+、JDK 17 / Android SDK 36（Android）、Xcode 15+（iOS）。参见[完整构建指南](docs/ARCHITECTURE.md#building-from-source)。

---

## 测试

[![CI](https://github.com/alichherawalla/off-grid-mobile/actions/workflows/ci.yml/badge.svg)](https://github.com/alichherawalla/off-grid-mobile/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/alichherawalla/off-grid-mobile/graph/badge.svg)](https://codecov.io/gh/alichherawalla/off-grid-mobile)

每次 PR 都会在三个平台上运行测试：

| 平台 | 框架 | 覆盖内容 |
|----------|-----------|----------------|
| React Native | Jest + RNTL | 存储、服务、组件、屏幕、合约 |
| Android | JUnit | LocalDream、DownloadManager、BroadcastReceiver |
| iOS | XCTest | PDFExtractor、CoreMLDiffusion、DownloadManager |
| E2E | Maestro | 关键路径流程（启动、聊天、模型、下载） |

```bash
npm test              # 运行所有测试 (Jest + Android + iOS)
npm run test:e2e      # 运行 Maestro E2E 流程 (需要运行中的应用)
```

---

## 文档

| 文档 | 描述 |
|----------|-------------|
| [架构与技术参考](docs/ARCHITECTURE.md) | 系统架构、设计模式、原生模块、性能调优 |
| [代码库指南](docs/standards/CODEBASE_GUIDE.md) | 全面的代码演练 |
| [设计系统](docs/design/DESIGN_PHILOSOPHY_SYSTEM.md) | 极简主义设计哲学、主题系统、令牌 |
| [视觉层次标准](docs/design/VISUAL_HIERARCHY_STANDARD.md) | 视觉层次和布局标准 |

---

## 社区

加入 [**Slack** 上的对话](https://join.slack.com/t/off-grid-mobile/shared_invite/zt-3q7kj5gr6-rVzx5gl5LKPQh4mUE2CCvA) — 提问、分享反馈，与其他 Off Grid 用户和贡献者联系。

---

## 贡献

欢迎贡献！Fork、branch、PR。代码风格参见[开发指南](docs/ARCHITECTURE.md#contributing)，模式参见[代码库指南](docs/standards/CODEBASE_GUIDE.md)。

---

## 致谢

站在巨人的肩膀上构建：
[llama.cpp](https://github.com/ggerganov/llama.cpp) | [whisper.cpp](https://github.com/ggerganov/whisper.cpp) | [llama.rn](https://github.com/mybigday/llama.rn) | [whisper.rn](https://github.com/mybigday/whisper.rn) | [local-dream](https://github.com/xororz/local-dream) | [ml-stable-diffusion](https://github.com/apple/ml-stable-diffusion) | [MNN](https://github.com/alibaba/MNN) | [Hugging Face](https://huggingface.co)

---

## 星标历史

[![Star History Chart](https://api.star-history.com/svg?repos=alichherawalla/off-grid-mobile&type=date&legend=top-left)](https://www.star-history.com/#alichherawalla/off-grid-mobile&type=date&legend=top-left)

<div align="center">

**Off Grid** — 您的 AI，您的设备，您的数据。

*没有云。没有数据收集。只有能在任何地方工作的 AI。*

[加入 Slack 社区](https://join.slack.com/t/off-grid-mobile/shared_invite/zt-3q7kj5gr6-rVzx5gl5LKPQh4mUE2CCvA)

</div>