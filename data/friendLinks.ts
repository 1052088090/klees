import type { FriendLink } from '../types';

export const friendLinksData: FriendLink[] = [
  {
    id: 'jean',
    name: '琴',
    description: '代理团长，也是最常在卷宗里签署陪同与禁闭决定的人。',
    dossierCode: 'REL-001',
    relation: '直接监护',
    role: '西风骑士团代理团长',
    status: '高优先陪同人',
    notes: [
      '对可莉的行动范围拥有最高日常裁量权。',
      '大多数禁闭室记录与外出许可均由其签核。',
    ],
    keywords: ['监护', '纪律', '签核'],
    avatar: '/images/klee/relations/jean-card.png',
  },
  {
    id: 'albedo',
    name: '阿贝多',
    description: '会认真观察可莉的人，也是她极其信任的家人之一。',
    dossierCode: 'REL-002',
    relation: '家人 / 研究协力',
    role: '首席炼金术士',
    status: '稳定信赖对象',
    notes: [
      '更擅长从行为与兴趣层面理解可莉，而非单纯约束。',
      '在可莉相关卷宗中经常被标记为“可安全交接对象”。',
    ],
    keywords: ['家人', '炼金', '信赖'],
    avatar: 'https://placehold.co/100x100/e8d9bf/6f4d27?text=ABD',
  },
  {
    id: 'kaeya',
    name: '凯亚',
    description: '经常能一眼看穿现场发生了什么，但未必会立刻说破。',
    dossierCode: 'REL-003',
    relation: '观察与善后',
    role: '西风骑士团骑兵队长',
    status: '机动协力对象',
    notes: [
      '更擅长在事后还原现场，判断可莉是否参与了某次“意外”。',
      '对危险局面有较高容错与安抚经验。',
    ],
    keywords: ['观察', '善后', '机动'],
    avatar: 'https://placehold.co/100x100/c0d6ef/2c486b?text=KY',
  },
  {
    id: 'alice',
    name: '爱丽丝',
    description: '卷宗中最常被以“远程影响源”标记的人物，也是可莉爆炸浪漫想象的根部。',
    dossierCode: 'REL-004',
    relation: '血亲 / 遥距影响',
    role: '旅行者与魔女会成员',
    status: '高影响缺席角色',
    notes: [
      '虽不长期在场，但对可莉世界观与兴趣结构影响极深。',
      '许多蹦蹦、冒险与“试试看”倾向可追溯到其教育方式。',
    ],
    keywords: ['母亲', '魔女会', '远程影响'],
    avatar: 'https://placehold.co/100x100/f3c7b8/7f2a25?text=ALS',
  },
];
