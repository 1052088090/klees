import type { Skill, SkillCategory } from '../types';

export const skillCategories: SkillCategory[] = [
  {
    id: 'identity',
    name: '身份标签',
    skills: [
      { id: 'pyro', name: '火元素适配', level: 9, relatedProjects: [1], description: '持续制造高热量火花与范围爆破。' },
      { id: 'catalyst', name: '法器作战', level: 8, relatedProjects: [1], description: '以抛物线与爆破落点构成主要输出方式。' },
      { id: 'spark-knight', name: '火花骑士', level: 10, relatedProjects: [1], description: '骑士团登记名号，也是整份卷宗的核心识别标签。' },
    ],
  },
  {
    id: 'behavior',
    name: '行为画像',
    skills: [
      { id: 'curiosity', name: '高好奇心', level: 9, relatedProjects: [2], description: '探索意愿极强，容易被新鲜事物与冒险吸引。' },
      { id: 'joy', name: '情绪感染力', level: 10, relatedProjects: [2], description: '能迅速点亮氛围，也会让周围人更难真正生气。' },
      { id: 'escort', name: '需陪同观察', level: 8, relatedProjects: [201], description: '离开安全边界后，风险上升速度很快。' },
    ],
  },
  {
    id: 'combat',
    name: '作战要点',
    skills: [
      { id: 'aoe', name: '范围压制', level: 9, relatedProjects: [101, 105], description: '战场覆盖效率高，擅长以连锁爆炸制造压力。' },
      { id: 'mine', name: '诡雷控制', level: 8, relatedProjects: [102], description: '战技残留物会迫使敌人改变路线。' },
      { id: 'burst', name: '高爆发节奏', level: 9, relatedProjects: [103, 106], description: '短时间内可把童趣完全转化为真实伤害。' },
    ],
  },
];

export const skillsData: Skill[] = skillCategories.flatMap((cat) => cat.skills);
