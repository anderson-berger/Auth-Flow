<template>
  <q-page class="landing-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">AuthFlow</h1>
          <p class="hero-subtitle">Sistema de autenticação moderno e seguro</p>
          <p class="hero-description">
            Serverless, escalável e fácil de integrar. Proteja sua aplicação com autenticação JWT e
            confirmação por email.
          </p>
          <div class="hero-actions">
            <q-btn
              label="Começar Agora"
              color="white"
              text-color="primary"
              size="lg"
              unelevated
              no-caps
              class="hero-btn"
              @click="goToAuth"
            />
            <q-btn
              label="Saber Mais"
              color="white"
              size="lg"
              outline
              no-caps
              class="hero-btn-outline"
              @click="scrollToFeatures"
            />
          </div>
        </div>
        <div class="hero-image">
          <q-icon name="shield" size="300px" color="white" class="hero-icon" />
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section ref="featuresSection" class="features-section">
      <div class="section-container">
        <h2 class="section-title">Recursos Principais</h2>
        <p class="section-subtitle">Tudo que você precisa para autenticação segura</p>

        <div class="features-grid">
          <q-card class="feature-card" flat>
            <q-card-section class="feature-card-content">
              <q-icon name="lock" size="64px" color="primary" class="feature-icon" />
              <h3 class="feature-title">Autenticação Segura</h3>
              <p class="feature-description">
                Sistema de autenticação baseado em JWT com tokens de acesso e refresh para máxima
                segurança.
              </p>
            </q-card-section>
          </q-card>

          <q-card class="feature-card" flat>
            <q-card-section class="feature-card-content">
              <q-icon name="email" size="64px" color="primary" class="feature-icon" />
              <h3 class="feature-title">Confirmação por Email</h3>
              <p class="feature-description">
                Verificação de email integrada com AWS SES para garantir a autenticidade dos
                usuários.
              </p>
            </q-card-section>
          </q-card>

          <q-card class="feature-card" flat>
            <q-card-section class="feature-card-content">
              <q-icon name="cloud" size="64px" color="primary" class="feature-icon" />
              <h3 class="feature-title">Serverless</h3>
              <p class="feature-description">
                Arquitetura serverless com AWS Lambda e DynamoDB para escalabilidade automática.
              </p>
            </q-card-section>
          </q-card>

          <q-card class="feature-card" flat>
            <q-card-section class="feature-card-content">
              <q-icon name="speed" size="64px" color="primary" class="feature-icon" />
              <h3 class="feature-title">Alta Performance</h3>
              <p class="feature-description">
                Resposta rápida e eficiente com infraestrutura otimizada e cache inteligente.
              </p>
            </q-card-section>
          </q-card>

          <q-card class="feature-card" flat>
            <q-card-section class="feature-card-content">
              <q-icon name="code" size="64px" color="primary" class="feature-icon" />
              <h3 class="feature-title">TypeScript</h3>
              <p class="feature-description">
                100% TypeScript para segurança de tipos e melhor experiência de desenvolvimento.
              </p>
            </q-card-section>
          </q-card>

          <q-card class="feature-card" flat>
            <q-card-section class="feature-card-content">
              <q-icon name="settings" size="64px" color="primary" class="feature-icon" />
              <h3 class="feature-title">Fácil Integração</h3>
              <p class="feature-description">
                API REST simples e documentada para integração rápida com qualquer frontend.
              </p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2 class="cta-title">Pronto para começar?</h2>
        <p class="cta-description">Crie sua conta gratuitamente e comece a usar agora mesmo</p>
        <q-btn
          label="Criar Conta Grátis"
          color="white"
          text-color="primary"
          size="lg"
          unelevated
          no-caps
          class="cta-btn"
          @click="goToAuth"
        />
      </div>
    </section>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LandingPage',

  methods: {
    async goToAuth() {
      await this.$router.push('/auth');
    },

    scrollToFeatures() {
      const featuresSection = this.$refs.featuresSection as HTMLElement;
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
  },
});
</script>

<style scoped>
.landing-page {
  padding: 0;
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  min-height: calc(100vh - 64px);
  background: linear-gradient(
    135deg,
    var(--landing-gradient-start) 0%,
    var(--landing-gradient-end) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
}

.hero-content {
  max-width: 1200px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 64px;
}

.hero-text {
  flex: 1;
  color: white;
}

.hero-title {
  font-size: 64px;
  font-weight: 700;
  margin: 0 0 24px 0;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 32px;
  font-weight: 500;
  margin: 0 0 16px 0;
  opacity: 0.95;
}

.hero-description {
  font-size: 18px;
  line-height: 1.6;
  margin: 0 0 32px 0;
  opacity: 0.9;
  max-width: 600px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.hero-btn {
  padding: 12px 32px;
  font-weight: 600;
  font-size: 16px;
}

.hero-btn-outline {
  padding: 12px 32px;
  font-weight: 600;
  font-size: 16px;
  border: 2px solid white;
}

.hero-image {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-icon {
  opacity: 0.2;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Features Section */
.features-section {
  padding: 80px 24px;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 48px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 16px 0;
}

.section-subtitle {
  font-size: 20px;
  text-align: center;
  margin: 0 0 64px 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.feature-card {
  border-radius: 12px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.feature-card-content {
  text-align: center;
  padding: 32px;
}

.feature-icon {
  margin-bottom: 24px;
}

.feature-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.feature-description {
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
}

/* CTA Section */
.cta-section {
  padding: 80px 24px;
  background: linear-gradient(
    135deg,
    var(--landing-gradient-start) 0%,
    var(--landing-gradient-end) 100%
  );
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  color: white;
}

.cta-title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 16px 0;
}

.cta-description {
  font-size: 20px;
  margin: 0 0 32px 0;
  opacity: 0.9;
}

.cta-btn {
  padding: 12px 48px;
  font-weight: 600;
  font-size: 18px;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
  }

  .hero-title {
    font-size: 48px;
  }

  .hero-subtitle {
    font-size: 24px;
  }

  .hero-description {
    font-size: 16px;
  }

  .hero-image {
    display: none;
  }

  .hero-actions {
    justify-content: center;
  }

  .section-title {
    font-size: 36px;
  }

  .section-subtitle {
    font-size: 18px;
  }

  .cta-title {
    font-size: 36px;
  }

  .cta-description {
    font-size: 18px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
