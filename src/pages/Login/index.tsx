import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { setToken } from '@/utils/auth'
import { assetUrl } from '@/utils/assetUrl'
import { delay } from '@/utils/mockApi'
import styles from './index.module.css'

export default function Login() {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const handleLogin = async () => {
    await delay(500)
    setToken('auth-token')
    message.success('登录成功')
    navigate('/dashboard')
  }

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.leftContent}>
          <img src={assetUrl('/logo.png')} alt="网达软件" className={styles.leftLogo} />
          <h1 className={styles.leftTitle}>网达智能体调度平台</h1>
          <p className={styles.leftSubtitle}>统一调度、编排与管理企业级 AI 智能体与能力插件</p>
          <div className={styles.features}>
            <div className={styles.featureItem}>
              <span className={styles.featureDot} />
              模块化 AI 能力插件
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureDot} />
              企业级知识库管理
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureDot} />
              数据智能治理与运营
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureDot} />
              行业解决方案交付
            </div>
          </div>
        </div>
        <div className={styles.leftFooter}>网达软件 · 智能体调度 · 持续运营</div>
      </div>
      <div className={styles.right}>
        <div className={styles.formWrapper}>
          <div className={styles.formHeader}>
            <img src={assetUrl('/logo.png')} alt="网达软件" className={styles.formLogo} />
            <h2>欢迎登录</h2>
            <p>网达智能体调度平台</p>
          </div>
          <Form form={form} onFinish={handleLogin} size="large" initialValues={{ username: 'admin', password: '123456' }}>
            <Form.Item name="username" rules={[{ required: true, message: '请输入账号' }]}>
              <Input prefix={<UserOutlined />} placeholder="账号" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="密码" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block className={styles.loginBtn}>
                登 录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
