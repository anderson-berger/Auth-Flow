<template>
  <q-page class="confirm-email-page">
    <div class="confirm-container">
      <q-card class="confirm-card">
        <q-card-section class="text-center q-pt-xl q-pb-lg">
          <!-- Loading State -->
          <div v-if="status === 'loading'" class="status-content">
            <q-spinner-hourglass size="80px" color="primary" class="q-mb-lg" />
            <h5 class="text-h5 text-weight-medium q-mb-sm">Confirmando seu email...</h5>
            <p class="text-body2 text-grey-7">Por favor, aguarde</p>
          </div>

          <!-- Success State -->
          <div v-else-if="status === 'success'" class="status-content">
            <q-icon name="check_circle" size="80px" color="positive" class="q-mb-lg" />
            <h5 class="text-h5 text-weight-medium q-mb-sm">Email confirmado com sucesso!</h5>
            <p class="text-body2 text-grey-7 q-mb-lg">
              Sua conta foi ativada. Você já pode fazer login.
            </p>
            <q-btn
              unelevated
              color="primary"
              label="Fazer Login"
              size="lg"
              no-caps
              @click="goToLogin"
              class="q-mt-md"
            />
          </div>

          <!-- Error State -->
          <div v-else-if="status === 'error'" class="status-content">
            <q-icon name="error" size="80px" color="negative" class="q-mb-lg" />
            <h5 class="text-h5 text-weight-medium q-mb-sm">Erro na confirmação</h5>
            <p class="text-body2 text-grey-7 q-mb-lg">
              {{ errorMessage }}
            </p>
            <div class="q-gutter-sm">
              <q-btn
                outline
                color="primary"
                label="Tentar Novamente"
                no-caps
                @click="retryConfirmation"
              />
              <q-btn flat color="primary" label="Voltar ao Início" no-caps @click="goToHome" />
            </div>
          </div>

          <!-- Invalid Token State -->
          <div v-else-if="status === 'invalid'" class="status-content">
            <q-icon name="warning" size="80px" color="warning" class="q-mb-lg" />
            <h5 class="text-h5 text-weight-medium q-mb-sm">Link inválido</h5>
            <p class="text-body2 text-grey-7 q-mb-lg">
              O link de confirmação está inválido ou expirado. Por favor, solicite um novo email de
              confirmação.
            </p>
            <q-btn
              outline
              color="primary"
              label="Voltar ao Início"
              no-caps
              @click="goToHome"
              class="q-mt-md"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ApiService from 'src/services/ApiService';

export default defineComponent({
  name: 'ConfirmEmailPage',

  data() {
    return {
      status: 'loading' as 'loading' | 'success' | 'error' | 'invalid',
      errorMessage: '',
      token: '',
    };
  },

  async mounted() {
    this.token = (this.$route.query.token as string) || '';

    if (!this.token) {
      this.status = 'invalid';
      return;
    }

    await this.confirmEmail();
  },

  methods: {
    async confirmEmail() {
      try {
        this.status = 'loading';
        await ApiService.confirmEmail(this.token);

        this.status = 'success';

        this.$q.notify({
          type: 'positive',
          message: 'Email confirmado com sucesso!',
          position: 'top',
        });

        // Redireciona para login após 3 segundos
        setTimeout(() => {
          this.goToLogin();
        }, 3000);
      } catch (error) {
        this.status = 'error';

        if (error instanceof Error) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'Não foi possível confirmar seu email. Tente novamente mais tarde.';
        }

        this.$q.notify({
          type: 'negative',
          message: this.errorMessage,
          position: 'top',
        });
      }
    },

    async retryConfirmation() {
      await this.confirmEmail();
    },

    async goToLogin() {
      await this.$router.push('/auth');
    },

    async goToHome() {
      await this.$router.push('/');
    },
  },
});
</script>

<style scoped>
.confirm-email-page {
  padding: 0;
  min-height: calc(100vh - 64px);
}

.confirm-container {
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

.confirm-card {
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.status-content {
  padding: 32px 24px;
}

.status-content h5 {
  margin: 0;
}

.status-content p {
  margin: 8px 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 600px) {
  .confirm-card {
    max-width: 100%;
  }

  .status-content {
    padding: 24px 16px;
  }

  .status-content .q-icon {
    font-size: 64px !important;
  }
}
</style>
