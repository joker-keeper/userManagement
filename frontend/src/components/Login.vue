<template>
  <el-container class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">Login</h2>
      <el-form :model="loginForm" ref="loginForm" :rules="loginRules" label-width="80px">
        <el-form-item label="Username" prop="username">
          <el-input v-model="loginForm.username" placeholder="Enter your username"></el-input>
        </el-form-item>
        <el-form-item label="PassWord" prop="email">
          <el-input v-model="loginForm.email" type="email" placeholder="Enter your password"></el-input>
        </el-form-item>
        <el-form-item label-width="0" class="button-container">
          <el-button type="primary" @click="handleLogin">Login</el-button>
        </el-form-item>
      </el-form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </el-card>
  </el-container>
</template>

<script>
import { Message } from 'element-ui';
import axios from "axios";

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        email: ''
      },
      loginRules: {
        username: [
          { required: true, message: 'Please input your username', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Please input your password', trigger: 'blur' },
        ]
      },
      errorMessage: ''
    };
  },
  methods: {
    async handleLogin() {
      console.log('Sending login request with data:', this.loginForm);
      this.$refs.loginForm.validateField('username', (errorMessage) => {
        console.log('Username validation:', errorMessage);
      });

      this.$refs.loginForm.validateField('email', (errorMessage) => {
        console.log('Email validation:', errorMessage);
      });
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          try {
            console.log('Sending login request with data:', this.loginForm);
            const response = await axios.post('http://localhost:8080/api/users/login', this.loginForm, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
            if (response.status === 200) {
              localStorage.setItem('authToken', 'your-token'); // 简单处理
              localStorage.setItem('username', this.loginForm.username); // 保存用户名
              await this.$router.push('/user-list');
              Message.success('Login successful!');
            }
          } catch (error) {
            this.errorMessage = 'Login failed. Please check your credentials.';
            Message.error('Login failed. Please check your credentials.');
          }
        } else {
          Message.warning('Please complete the form.');
        }
      });
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f2f2f2;
}

.login-card {
  width: 400px;
  padding: 20px;
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}

.button-container {
  text-align: center; /* 居中对齐 */
}

</style>
