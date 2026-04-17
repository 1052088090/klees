# 可莉档案袋素材清单

更新时间：2026-04-17

## 目标目录

建议后续统一放到以下目录：

- `public/images/klee/portraits/`
- `public/images/klee/events/`
- `public/images/klee/expressions/`
- `public/images/klee/scenes/`
- `public/images/klee/props/`
- `public/images/klee/constellations/`
- `public/images/klee/dossier/`
- `public/images/klee/relations/`

## 已确认可用的本地素材

来源目录：`D:\下载\klee-main\src\assets`

### 立绘与细节

1. 可莉正式立绘图
   来源：用户在线程内提供的大幅立绘图
   建议文件名：`public/images/klee/portraits/klee-full.png`
   建议用途：
   - 图像档案 `正式立绘全身图`
   - 基础档案 `角色立绘主文件`
   对应代码位：
   - `data/life.ts` 中 `portrait-main` 的第 1 张图
   - `data/projects.ts` 中 `KL-BASE-01` 的第 1 张图

2. 可莉服装与背包细节图
   来源：用户在线程内提供的服装对照图
   建议拆分后使用：
   - `public/images/klee/portraits/klee-detail-bag.png`
   - `public/images/klee/portraits/klee-detail-outfit.png`
   - 可选：`public/images/klee/events/event-costume-detail.png`
   建议用途：
   - 图像档案 `服装与背包细节图`
   - 活动造型 `活动服装局部图`
   对应代码位：
   - `data/life.ts` 中 `portrait-main` 的第 2 张图
   - `data/life.ts` 中 `portrait-festival` 的第 3 张图

### 表情与反应

1. `D:\下载\klee-main\src\assets\1.webp`
   建议文件名：`public/images/klee/expressions/expression-happy-megaphone.webp`
   建议用途：开心 / 活跃表情
   对应代码位：`data/life.ts` 中 `expression-set`

2. `D:\下载\klee-main\src\assets\3.webp`
   建议文件名：`public/images/klee/expressions/expression-pointing.webp`
   建议用途：得意 / 指向表情
   对应代码位：`data/life.ts` 中 `expression-set`

3. `D:\下载\klee-main\src\assets\4.webp`
   建议文件名：`public/images/klee/expressions/expression-teary.webp`
   建议用途：委屈 / 要哭表情
   对应代码位：`data/life.ts` 中 `expression-set`

4. `D:\下载\klee-main\src\assets\meme\4.jpg`
   建议文件名：`public/images/klee/expressions/expression-cry-cloud.jpg`
   建议用途：哭哭 meme 版
   说明：可作为委屈表情备选图

5. `D:\下载\klee-main\src\assets\meme\ebf054c7gy1hr6h4yh7q2j22q82q8b29.jpg`
   建议文件名：`public/images/klee/expressions/expression-teary-alt.jpg`
   建议用途：哭哭白底备选

6. `D:\下载\klee-main\src\assets\meme\ebf054c7gy1hr6h4qw18ej217s17shdt.jpg`
   建议文件名：`public/images/klee/expressions/expression-pointing-alt.jpg`
   建议用途：指向白底备选

### 额外可用的本地素材

1. `D:\下载\klee-main\src\assets\2.8.webp`
   建议文件名：`public/images/klee/events/event-banner-klee.webp`
   建议用途：横幅 / 活动头图备选

2. `D:\下载\klee-main\src\assets\22.webp`
   建议文件名：`public/images/klee/props/klee-catalyst.webp`
   建议用途：法器 / 危险品附录图

3. `D:\下载\klee-main\src\assets\klee.webp`
   建议文件名：`public/images/klee/portraits/klee-face-close.webp`
   建议用途：半身近景或局部裁切备选

4. `D:\下载\klee-main\src\assets\ddk.webp`
   建议文件名：`public/images/klee/props/dodoco.webp`
   建议用途：嘟嘟可 / 边角装饰素材

## 已确认缺失的素材

以下资源当前没有在 `D:\下载\klee-main\src\assets` 中找到：

- 琴团长本地图片文件
- 蒙德街头场景图
- 禁闭室相关图
- 野外冒险场景图
- 骑士团登记页扫描件
- 神之眼与徽记细节图
- 风险复核摘要图
- 陪同条例便签页
- 命座节点图组

## 琴团长素材落位

用户已在线程内提供一张琴团长角色卡图，但当前未提供本地文件路径。

建议文件名：

- `public/images/klee/relations/jean.png`

建议用途：

- 关系卷宗中 `琴` 的头像或卡面

对应代码位：

- `data/friendLinks.ts` 中 `jean.avatar`

说明：

- 如果后续要做小头像，建议从该图裁出半身或脸部区域。
- 如果要保留角色卡完整构图，也可以直接作为关系页卡面素材。

## 当前最值得先接入的素材

建议第一批优先接入这 8 个：

1. `klee-full.png`
2. `klee-detail-bag.png`
3. `klee-detail-outfit.png`
4. `expression-happy-megaphone.webp`
5. `expression-pointing.webp`
6. `expression-teary.webp`
7. `jean.png`
8. `event-banner-klee.webp`

这批接入后，首页、图像档案、关系卷宗和故事氛围都会明显完整。
