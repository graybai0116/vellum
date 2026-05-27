# VELLUM — 改动记录

## 已完成的修改

### 1. 删除 Tokens tab
**文件：** `components/workspace/ResultsScreen.tsx`、`components/workspace/StyleModal.tsx`

Tokens tab 是 fake 功能，直接删掉。
- 移除了 `Tag`、`Plus`、`useMemo` 等不再用的 import
- 移除了 `flagsText` state 和 `chips` useMemo
- 移除了 TABS 数组里的 `"tokens"` 条目和对应的渲染 block

---

### 2. 编辑模式传播修复
**文件：** `components/workspace/ResultsScreen.tsx`、`components/workspace/StyleModal.tsx`

问题：用户在 prompt tab 里编辑文本后，切换到 Midjourney/FLUX 等其他 tab，formatter 还是读旧的 `item.promptText`，不读编辑后的内容。

修复方案：用 `effectiveItem` 模式，用编辑后的 body 覆盖 promptText：
```tsx
const effectiveItem = { ...item, promptText: body };
// 所有 formatter 改成用 effectiveItem
fmtMidjourney(effectiveItem, mode)
fmtFLUX(effectiveItem, mode)
// ...
```

---

### 3. 静默失败修复（Issue 1）
**文件：** `components/workspace/WorkspaceApp.tsx`、`components/workspace/AnalyzingScreen.tsx`

问题：API 分析失败时，AnalyzingScreen 动画一直转，用户不知道出了什么问题。

修复：
- WorkspaceApp 新增 `analysisError` state，fetch `.catch()` 里设为 true
- AnalyzingScreen 新增 `error?: boolean` 和 `onBack?: () => void` props
- 动画结束且 error 为 true 时，显示红色错误提示 + "← Go back" 按钮

---

### 4. Library/History → ResultsScreen（Issue 2）
**文件：** `components/workspace/StyleModal.tsx`、`components/workspace/WorkspaceApp.tsx`

问题：从 Library 或 History 点击一个分析记录，只能在 StyleModal 里看摘要，无法进入完整的 ResultsScreen。

修复：
- StyleModal 新增 `onOpenResults?` prop，header 右侧加了"Full analysis →"按钮
- WorkspaceApp 的 `navigate("results", id)` 现在会在 analysisHistory + savedUploads + LIBRARY 里搜索，找到 item 后设置正确的 mode（`item.subjects ? "realism" : "style"`）
- `currentItem` 的查找顺序改为先查 `allLibraryItems`（包含 history 和 uploads）

---

### 5. History 页面文案修正（Issue 3）
**文件：** `components/workspace/HistoryScreen.tsx`

问题：写的是 "saved this session"，实际数据存在 localStorage，刷新不会丢。

修复：改成 "saved locally"。

---

### 6. Landing 页 Library 链接修复
**文件：** `app/page.tsx`

问题：点击导航栏 Library 跳到 `/workspace`，显示的是上传图片的 landing 界面，不是 library。

修复：
- 链接改为 `/workspace?screen=library`
- `app/workspace/page.tsx` 改成 async server component，读取 searchParams Promise，传 `initialScreen` prop 给 WorkspaceApp
- WorkspaceApp 接收 `initialScreen = "landing"` prop，初始化 screen state 用它

---

### 7. 修复废弃图标
**文件：** `app/page.tsx`

`ArrowRight` 在 @phosphor-icons/react 里已废弃，改成 `ArrowRightIcon`。

---

## 待办 / 下一步

- **Landing page 改进**（用户已说"最后再改"）
  - `#manifesto` section 缺失：footer 和 nav 里有锚点链接，但页面上没有对应的 section
  - "2,847 analyses today" 是硬编码假数据，考虑删掉或换成真实数据

---

## 仓库信息

- GitHub: `https://github.com/graybai0116/vellum.git`
- 分支: `main`
- 技术栈: Next.js 16 App Router, React, TypeScript, @phosphor-icons/react
- AI: Claude claude-sonnet-4-6 Vision API (`/api/analyze`)
- 两种分析模式: `"style"` (Visual Style) 和 `"realism"` (Photo Fidelity)
