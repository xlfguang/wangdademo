import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { setToken } from "@/utils/auth";
import { assetUrl } from "@/utils/assetUrl";
import { delay } from "@/utils/mockApi";
import styles from "./index.module.css";

export default function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleLogin = async () => {
    await delay(500);
    setToken("auth-token");
    message.success("登录成功");
    navigate("/dashboard");
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h1 className={styles.leftTitle}>网达智能体调度平台</h1>
      </div>
      <div className={styles.right}>
        <div className={styles.formWrapper}>
          <div className={styles.formHeader}>
            <img
              src={assetUrl("/logo.png")}
              alt="网达软件"
              className={styles.formLogo}
            />
            <h2>欢迎登录</h2>
          </div>
          <Form
            form={form}
            onFinish={handleLogin}
            size="large"
            initialValues={{ username: "admin", password: "123456" }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: "请输入账号" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="账号" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "请输入密码" }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="密码" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                className={styles.loginBtn}
              >
                登 录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
