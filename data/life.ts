import type { LifeItem } from '../types';

const archive = (label: string) =>
  `https://placehold.co/960x540/f9dcb0/8b3d1d?text=${encodeURIComponent(label)}`;
const local = (path: string) => `/images/klee/${path}`;

export const gameData: LifeItem[] = [
  {
    id: 'portrait-main',
    title: '立绘总览',
    description: '火花骑士标准立绘、主视觉和身份页素材的统一入口。',
    dossierCode: 'KL-IMG-01',
    summary: '收纳可莉最核心的一组角色视觉，是整套图像卷宗里最先被读取的身份主档。',
    tech: ['立绘', '主视觉', '身份页'],
    link: '#',
    imageUrl: local('portraits/klee-half-archive.png'),
    articleContent:
      '这条图像卷宗用来收纳可莉最核心的一组角色视觉，包括正式立绘、半身特写和身份页扫描件。它承担的是“第一眼就知道这是可莉”的识别任务，所以建议优先替换为最标准、最稳定的官方素材。\n\n如果后面要继续往下补，最值得先放进去的是全身立绘、服装与背包细节，以及一张更适合做封面的半身特写。这样首页、内容页和详情页之间都能共用同一套主视觉语言。',
    galleryImages: [
      { src: local('dossier/knight-registration.png'), caption: '骑士团身份卷宗页' },
      { src: archive('Portrait Detail'), caption: '待补：服装与背包细节图' },
      { src: local('portraits/klee-half-archive.png'), caption: '卷宗半身特写图' },
    ],
    notes: [
      '优先替换为官方立绘、半身特写和身份页扫描件三类核心素材。',
      '这条图像卷宗承担“第一眼识别可莉”的任务，适合作为首页与详情页共用主视觉。',
      '如果后续补动态效果，建议把封面图与半身特写作为首批动效素材来源。',
    ],
  },
  {
    id: 'portrait-festival',
    title: '活动造型',
    description: '活动插图、节庆卡面和特殊服装画面的归档入口。',
    dossierCode: 'KL-IMG-02',
    summary: '补足角色在节庆、活动与特殊场景中的视觉状态，让图像卷宗拥有更完整的情绪层。',
    tech: ['活动', '节庆', '服装变化'],
    link: '#',
    imageUrl: local('events/event-banner-klee.webp'),
    articleContent:
      '这一条更适合放节日活动、联动插图和特殊造型相关的画面，让角色视觉不只停留在标准立绘。它负责补足“可莉在不同场合是什么样子”的那部分情绪和氛围。\n\n后续整理时，可以按横幅主视觉、活动剧情卡面和局部服装细节三类来归档。这样既方便补图，也方便后面做活动回顾或图像附录。',
    galleryImages: [
      { src: local('events/event-banner-klee.webp'), caption: '活动横幅主视觉' },
      { src: local('dossier/ancient-dossier-cover.png'), caption: '档案风活动封面页' },
      { src: archive('Festival Card 3'), caption: '待补：活动服装局部图' },
    ],
    notes: [
      '建议按横幅主视觉、活动剧情卡面和服装局部图三类整理。',
      '这组素材最适合增强页面气氛，不一定需要最完整，但需要最有记忆点。',
    ],
  },
];

export const travelData: LifeItem[] = [
  {
    id: 'expression-set',
    title: '表情与反应',
    description: '开心、心虚、委屈和得意这些高辨识度瞬间的图像索引。',
    dossierCode: 'KL-IMG-03',
    summary: '保留可莉最鲜明的情绪反馈，让图像卷宗在静态资料之外仍然拥有角色温度。',
    tech: ['表情', '神态', '反应'],
    link: '#',
    imageUrl: local('expressions/expression-happy-megaphone.webp'),
    articleContent:
      '可莉最有感染力的部分之一，就是几乎所有情绪都会立刻写在脸上。这组图像适合收表情包、对话截图和各种细小神态变化，让卷宗在阅读信息之外，也能保留她最直接的角色气息。\n\n如果只先挑几张，建议优先保留“开心、心虚、得意、委屈”四类高辨识度表情。它们最容易和故事记录、语音摘录、禁闭室条目形成联动。',
    galleryImages: [
      { src: local('expressions/expression-happy-megaphone.webp'), caption: '开心表情：扩音器回应' },
      { src: local('expressions/expression-pointing.webp'), caption: '得意表情：指向与强调' },
      { src: local('expressions/expression-teary.webp'), caption: '委屈表情：要哭边缘' },
    ],
    notes: [
      '优先保留开心、心虚、得意、委屈这四类高辨识度表情。',
      '这组素材和故事卷宗、语音摘录的联动价值很高，适合后面做交叉引用。',
    ],
  },
  {
    id: 'memo-scenes',
    title: '场景截图',
    description: '蒙德街头、禁闭室和野外爆破现场等代表性场景的图像记录。',
    dossierCode: 'KL-IMG-04',
    summary: '补足人物之外的空间信息，让图像卷宗也能讲出可莉活跃在哪些场景里。',
    tech: ['截图', '场景', '冒险记录'],
    link: '#',
    imageUrl: local('scenes/mondstadt-street.png'),
    articleContent:
      '这组条目负责补足“可莉出现在哪里、那些场景看起来是什么样”的空间感。它适合放剧情截图、日常场景和冒险途中带有环境信息的画面，让图像卷宗不只是人物特写，也有真实的世界背景。\n\n后续如果补图，可以先按蒙德街头、禁闭室和野外冒险三类分组。这样整站后面的故事记录和关系卷宗也更容易互相引用。',
    galleryImages: [
      { src: local('scenes/mondstadt-street.png'), caption: '蒙德街头场景图' },
      { src: local('scenes/confinement-room.png'), caption: '禁闭室与观察室场景图' },
      { src: local('scenes/wild-explosion-field.png'), caption: '野外冒险与爆破现场图' },
    ],
    notes: [
      '建议先按蒙德街头、禁闭室和野外冒险三类归档。',
      '这组画面最适合给故事页和关系卷宗提供环境背景。',
    ],
  },
];

export const otherData: LifeItem[] = [
  {
    id: 'props-notes',
    title: '附加素材',
    description: '四叶草、炸弹图标、便签和卷宗角标等小型装饰素材的集中收纳。',
    dossierCode: 'KL-IMG-05',
    summary: '收纳所有不承担主叙事、但能显著提升档案袋成品感的边角物料。',
    tech: ['图标', '便签', '装饰素材'],
    imageUrl: local('props/clover-pyro-device.png'),
    articleContent:
      '如果后面要把整站打磨得更像一份被翻阅过的角色档案，这些小素材会非常关键。它们不承担主要叙事，但能把卷宗里的边角、注记、标签和危险提示全部补完整。\n\n推荐优先准备四叶草符号、炸弹图样、手写便签和骑士团印章。等这些素材补齐以后，首页、HUD、详情页和附录备注的统一度会明显提升。',
    galleryImages: [
      { src: local('dossier/escort-protocol-sheet.png'), caption: '便签与印章组合页' },
      { src: local('props/clover-mark.svg'), caption: '四叶草符号与角标素材' },
    ],
    notes: [
      '优先准备四叶草符号、炸弹图样、手写便签和骑士团印章。',
      '这类素材虽然小，但会直接影响整站是否像一份被翻阅过的卷宗。',
    ],
  },
];
