<template>
  <q-page class="auth-page">
    <div class="auth-container">
      <q-card class="auth-card">
        <q-tabs v-model="activeTab" align="justify">
          <q-tab name="login" label="Login" />
          <q-tab name="register" label="Criar Conta" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="activeTab" animated keep-alive>
          <q-tab-panel name="login" class="q-pa-none">
            <LoginForm
              :loading="$load.isLoading('login')"
              @submit="handleLogin"
              @forgot-password="handleForgotPassword"
            />
            <div class="text-center q-pb-lg q-px-lg text-caption text-grey-7">
              Não tem uma conta?
              <q-btn
                flat
                dense
                no-caps
                label="Criar conta"
                color="primary"
                class="text-caption text-weight-medium"
                @click="activeTab = 'register'"
              />
            </div>
          </q-tab-panel>

          <q-tab-panel name="register" class="q-pa-none">
            <RegisterForm
              ref="registerFormRef"
              :loading="$load.isLoading('register')"
              @submit="handleRegister"
            />
            <div class="text-center q-pb-lg q-px-lg text-caption text-grey-7">
              Já tem uma conta?
              <q-btn
                flat
                dense
                no-caps
                label="Fazer login"
                color="primary"
                class="text-caption text-weight-medium"
                @click="activeTab = 'login'"
              />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LoginForm from 'src/pages/public/auth-page/LoginForm.vue';
import RegisterForm from 'src/pages/public/auth-page/RegisterForm.vue';
import type { LoginRequest } from '@backend/features/auth/login/login-schemas';
import type { RegisterRequest } from '@backend/features/auth/register/register-schemas';
import ApiService from 'src/services/ApiService';
import AuthService from 'src/services/AuthService';

export default defineComponent({
  name: 'AuthPage',

  components: {
    LoginForm,
    RegisterForm,
  },
  props: {
    from: {
      type: String as () => 'login' | 'register' | undefined,
      required: false,
    },
  },

  data() {
    return {
      activeTab: this.from === 'register' ? 'register' : 'login',
    };
  },

  methods: {
    async handleLogin(loginData: LoginRequest) {
      try {
        await this.$load.execute('login', async () => {
          const response = await ApiService.login(loginData);

          // Armazena tokens usando AuthService
          AuthService.setTokens(response.accessToken, response.refreshToken);

          this.$q.notify({
            type: 'positive',
            message: 'Login realizado com sucesso!',
            position: 'top',
          });

          // Verifica se tem redirect query param
          const redirect = (this.$route.query.redirect as string) || '/app';
          await this.$router.push(redirect);
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Erro ao fazer login. Verifique suas credenciais.';
        this.$q.notify({
          type: 'negative',
          message,
          position: 'top',
        });
      }
    },

    async handleRegister(registerData: RegisterRequest) {
      try {
        await this.$load.execute('register', async () => {
          await ApiService.register(registerData);

          this.$q.notify({
            type: 'positive',
            message: 'Conta criada com sucesso! Verifique seu email para confirmar.',
            position: 'top',
          });

          // Limpa o formulário
          const registerForm = this.$refs.registerFormRef as InstanceType<typeof RegisterForm>;
          if (registerForm && registerForm.clearForm) {
            registerForm.clearForm();
          }

          // Muda para tab de login após 1.5s
          setTimeout(() => {
            this.activeTab = 'login';
          }, 1500);
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Erro ao criar conta. Tente novamente.';
        this.$q.notify({
          type: 'negative',
          message,
          position: 'top',
        });
      }
    },

    handleForgotPassword() {
      this.$q.notify({
        type: 'info',
        message: 'Funcionalidade em desenvolvimento',
        position: 'top',
      });
    },
  },
});
</script>

<style scoped>
.auth-page {
  padding: 0;
  min-height: calc(100vh - 64px);
}

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px);
  padding: 24px;
  background: linear-gradient(
    135deg,
    var(--landing-gradient-start) 0%,
    var(--landing-gradient-end) 100%
  );
}

.auth-card {
  width: 100%;
  max-width: 480px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

:deep(.q-tab-panel) {
  padding: 0;
}

:deep(.q-tab) {
  font-weight: 500;
}
</style>
