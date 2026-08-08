export const SITE = {
  name: 'PEYT Studio',
  fullName: 'PleaseEnterYourText Studio',
  chineseName: '请输入文本工作室',
  slogan: 'Type Everything',
  badge: 'members 8 · project PEYT Chat · open source',
  githubOrg: 'https://github.com/PleaseEnterYourText-Studio',
} as const;

export const SECTIONS = [
  { id: 'hero', label: '首屏' },
  { id: 'about', label: '关于' },
  { id: 'projects', label: '项目' },
  { id: 'team', label: '团队' },
  { id: 'join', label: '加入' },
] as const;

export const NAV_LINKS = [
  { href: '#about', label: '关于' },
  { href: '#projects', label: '项目' },
  { href: '#team', label: '团队' },
  { href: '#join', label: '加入' },
] as const;
