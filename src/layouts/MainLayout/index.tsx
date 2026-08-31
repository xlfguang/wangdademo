import { Layout, Menu, Avatar, Badge, Dropdown, Breadcrumb } from 'antd'
import {
  DashboardOutlined,
  VideoCameraOutlined,
  DatabaseOutlined,
  AudioOutlined,
  GlobalOutlined,
  TeamOutlined,
  ClearOutlined,
  BookOutlined,
  CheckSquareOutlined,
  ProjectOutlined,
  BellOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { removeToken } from '@/utils/auth'
import styles from './index.module.css'

const { Header, Sider, Content } = Layout

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '工作台' },
  { key: '/video/overview', icon: <VideoCameraOutlined />, label: '视频处理插件' },
  { key: '/data/overview', icon: <DatabaseOutlined />, label: '数据处理插件' },
  { key: '/audio/overview', icon: <AudioOutlined />, label: '音频交互处理' },
  { key: '/crawler/overview', icon: <GlobalOutlined />, label: '搜索爬虫插件' },
  { key: '/community/overview', icon: <TeamOutlined />, label: '社群管理' },
  { key: '/data-clean/overview', icon: <ClearOutlined />, label: '数据清洗服务' },
  { key: '/knowledge/overview', icon: <BookOutlined />, label: '知识库管理' },
  { key: '/task/overview', icon: <CheckSquareOutlined />, label: '任务协作助手' },
  { key: '/project', icon: <ProjectOutlined />, label: '项目管理' },
]

const breadcrumbMap: Record<string, string> = {
  dashboard: '工作台',
  video: '视频处理插件',
  analysis: '视频分析',
  'api-debug': '接口调试',
  config: '插件配置',
  governance: '数据治理',
  quality: '数据质量',
  'ai-analysis': 'AI智能分析',
  sync: '同步任务',
  system: '系统管理',
  reports: '可视化报表',
  audio: '音频交互处理',
  workspace: '音频工作台',
  transcription: '语音转文字',
  extraction: '关键信息提取',
  history: '历史记录',
  crawler: '搜索爬虫插件',
  search: '检索工作台',
  opinion: '舆情监控',
  community: '社群管理',
  inbox: '消息聚合',
  'ai-reply': '智能应答',
  push: '消息推送',
  portrait: '用户画像',
  'data-clean': '数据清洗服务',
  upload: '文档接入',
  batches: '批次管理',
  pipeline: '清洗流水线',
  knowledge: '知识库管理',
  bases: '知识库管理',
  structure: '文档结构化',
  validation: '内容审核',
  base: '知识库详情',
  project: '项目管理',
  task: '任务协作助手',
  tasks: '任务拆解',
  tracking: '进度跟踪',
  docs: '文档协作',
  collab: '跨岗联动',
  closure: '成果闭环',
  groups: '社群列表',
  channels: '渠道管理',
  messages: '消息推送',
}

function getBreadcrumbTitle(part: string, parts: string[]): string {
  const root = parts[0]
  if (part === 'overview') return '能力概览'
  if (part === 'settings') return '插件设置'
  if (part === 'data' && root === 'crawler') return '数据管理'
  if (part === 'data' && root === 'data') return '数据处理插件'
  if (part === 'sources' && root === 'crawler') return '数据源与信源'
  if (part === 'sources' && root === 'data') return '数据源管理'
  if (part === 'quality' && root === 'data-clean') return '质量校验'
  if (part === 'quality' && root === 'data') return '数据质量'
  if (part === 'sync' && root === 'knowledge') return '同步任务'
  if (part === 'sync' && root === 'data') return '同步任务'
  if (part === 'tasks' && root === 'task') return '任务拆解'
  if (part === 'tasks' && root === 'video') return '视频处理任务'
  if (part === 'docs' && root === 'task') return '文档协作'
  if (part === 'tracking' && root === 'task') return '进度跟踪'
  if (part === 'collab' && root === 'task') return '跨岗联动'
  if (part === 'closure' && root === 'task') return '成果闭环'
  if (part === 'task' && root === 'task') return '任务详情'
  if (part === 'search' && root === 'knowledge') return '知识检索'
  if (part === 'search' && root === 'crawler') return '检索工作台'
  if (part === 'workspace' && root === 'video') return '视频工作台'
  if (part === 'workspace' && root === 'audio') return '音频工作台'
  if (part === 'synthesis') return '语音合成'
  if (part === 'schedules') return '定时任务'
  return breadcrumbMap[part] ?? part
}

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const firstSegment = location.pathname.split('/').filter(Boolean)[0]
  const menuSelectedKey =
    firstSegment === 'video' ? '/video/overview'
    : firstSegment === 'data' ? '/data/overview'
    : firstSegment === 'audio' ? '/audio/overview'
    : firstSegment === 'crawler' ? '/crawler/overview'
    : firstSegment === 'community' ? '/community/overview'
    : firstSegment === 'data-clean' ? '/data-clean/overview'
    : firstSegment === 'knowledge' ? '/knowledge/overview'
    : firstSegment === 'project' ? '/project'
    : firstSegment === 'task' ? '/task/overview'
    : `/${firstSegment}`

  const pathParts = location.pathname.split('/').filter(Boolean)
  const breadcrumbItems = pathParts.map((part, index) => ({
    title: getBreadcrumbTitle(part, pathParts),
    onClick: index < pathParts.length - 1
      ? () => navigate('/' + pathParts.slice(0, index + 1).join('/'))
      : undefined,
  }))

  const userMenu = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: '个人中心' },
      { key: 'settings', icon: <SettingOutlined />, label: '系统设置' },
      { type: 'divider' as const },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        onClick: () => {
          removeToken()
          navigate('/login')
        },
      },
    ],
  }

  return (
    <Layout className={styles.layout}>
      <Sider width={240} className={styles.sider} theme="light">
        <div className={styles.logo}>
          <img src="/logoandtext.png" alt="网达智能体调度平台" className={styles.logoImg} />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[menuSelectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className={styles.menu}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <Breadcrumb items={breadcrumbItems} />
          <div className={styles.headerRight}>
            <Badge count={5} size="small">
              <BellOutlined className={styles.headerIcon} />
            </Badge>
            <SettingOutlined className={styles.headerIcon} />
            <Dropdown menu={userMenu} placement="bottomRight">
              <div className={styles.userInfo}>
                <Avatar size="small" icon={<UserOutlined />} style={{ background: '#1677ff' }} />
                <span>管理员</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
