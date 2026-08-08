export interface Member {
  name: string;
  role: string;
  direction: string;
  tagline: string;
  avatarUrl: string;
  siteUrl: string;
  siteLabel: string;
}

const RAW_BASE = 'https://raw.githubusercontent.com/PleaseEnterYourText-Studio/About/main/members';

export const MEMBERS: Member[] = [
  {
    name: 'NoWint',
    role: '联合创始人',
    direction: 'Desktop @ macOS · TUI',
    tagline: '「我是神」',
    avatarUrl: `${RAW_BASE}/NoWint/NoWint.png`,
    siteUrl: 'https://nowint.github.io/',
    siteLabel: 'nowint.github.io',
  },
  {
    name: 'TiantianYZJ',
    role: '联合创始人',
    direction: 'Desktop @ Windows',
    tagline: '「我不是冯诺 1 曼派」',
    avatarUrl: `${RAW_BASE}/TiantianYZJ/TiantianYZJ.png`,
    siteUrl: 'https://yzjtiantian.cn/',
    siteLabel: 'yzjtiantian.cn',
  },
  {
    name: 'CarryRao',
    role: '核心成员',
    direction: 'Android Backend · Desktop Linux',
    tagline: '「前端小菜鸡，后端半吊子」',
    avatarUrl: `${RAW_BASE}/CarryRao/CarryRao.png`,
    siteUrl: 'https://carryrao.top/',
    siteLabel: 'carryrao.top',
  },
  {
    name: '浣芷轩',
    role: '核心成员',
    direction: 'Desktop macOS',
    tagline: '「(◐‿◑) 你爹来啦」',
    avatarUrl: `${RAW_BASE}/浣芷轩/浣芷轩.png`,
    siteUrl: 'https://space.bilibili.com/1716940207',
    siteLabel: 'bilibili',
  },
  {
    name: 'Falsw',
    role: '核心成员',
    direction: '底层',
    tagline: '「闷声修底层，偶尔冒泡整活」',
    avatarUrl: `${RAW_BASE}/Falsw/Falsw.png`,
    siteUrl: 'https://falswqwq.github.io/',
    siteLabel: 'falswqwq.github.io',
  },
  {
    name: 'MaherJon',
    role: '核心成员',
    direction: 'Android Frontend',
    tagline: '「书写一些代码，声明一些 UI」',
    avatarUrl: `${RAW_BASE}/MaherJon/MaherJon.png`,
    siteUrl: 'https://maherjon.github.io/MAHE/',
    siteLabel: 'MAHE',
  },
];

export const INACTIVE_MEMBERS = ['SUKY', 'chenmuyun_bit'];
