<template>
  <q-page class="dashboard-page q-pa-md">
    <div class="dashboard-container">
      <!-- Header -->
      <div class="page-header q-mb-lg">
        <h4 class="text-h4 text-weight-bold q-ma-none">Dashboard</h4>
        <p class="text-body1 text-grey-7 q-mt-sm">Bem-vindo ao AuthFlow</p>
      </div>

      <!-- Stats Cards -->
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered>
            <q-card-section>
              <div class="row items-center">
                <div class="col">
                  <div class="text-h6 text-weight-medium">1,234</div>
                  <div class="text-caption text-grey-7">Total de Usuários</div>
                </div>
                <div class="col-auto">
                  <q-icon name="people" size="48px" color="primary" class="stat-icon" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered>
            <q-card-section>
              <div class="row items-center">
                <div class="col">
                  <div class="text-h6 text-weight-medium">567</div>
                  <div class="text-caption text-grey-7">Sessões Ativas</div>
                </div>
                <div class="col-auto">
                  <q-icon name="devices" size="48px" color="positive" class="stat-icon" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered>
            <q-card-section>
              <div class="row items-center">
                <div class="col">
                  <div class="text-h6 text-weight-medium">89</div>
                  <div class="text-caption text-grey-7">Pendentes</div>
                </div>
                <div class="col-auto">
                  <q-icon name="pending" size="48px" color="warning" class="stat-icon" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered>
            <q-card-section>
              <div class="row items-center">
                <div class="col">
                  <div class="text-h6 text-weight-medium">12</div>
                  <div class="text-caption text-grey-7">Alertas</div>
                </div>
                <div class="col-auto">
                  <q-icon
                    name="notifications_active"
                    size="48px"
                    color="negative"
                    class="stat-icon"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Charts/Content Row -->
      <div class="row q-col-gutter-md">
        <!-- Recent Activity -->
        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-h6 text-weight-medium q-mb-md">Atividade Recente</div>
              <q-list separator>
                <q-item v-for="i in 5" :key="i">
                  <q-item-section avatar>
                    <q-avatar color="primary" text-color="white" icon="person" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Novo usuário cadastrado</q-item-label>
                    <q-item-label caption>{{ getRandomTime() }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="chevron_right" color="grey-5" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <!-- Quick Actions -->
        <div class="col-12 col-md-6">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-h6 text-weight-medium q-mb-md">Ações Rápidas</div>
              <div class="q-gutter-sm">
                <q-btn
                  unelevated
                  color="primary"
                  icon="person_add"
                  label="Adicionar Usuário"
                  class="full-width"
                  @click="quickAction('add-user')"
                />
                <q-btn
                  unelevated
                  color="secondary"
                  icon="mail"
                  label="Enviar Email"
                  class="full-width"
                  @click="quickAction('send-email')"
                />
                <q-btn
                  outline
                  color="primary"
                  icon="settings"
                  label="Configurações"
                  class="full-width"
                  @click="quickAction('settings')"
                />
                <q-btn
                  outline
                  color="primary"
                  icon="assessment"
                  label="Relatórios"
                  class="full-width"
                  @click="quickAction('reports')"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- System Status -->
      <div class="row q-col-gutter-md q-mt-md">
        <div class="col-12">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-h6 text-weight-medium q-mb-md">Status do Sistema</div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-4">
                  <div class="status-item">
                    <q-icon name="check_circle" color="positive" size="24px" />
                    <span class="q-ml-sm">API Online</span>
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="status-item">
                    <q-icon name="check_circle" color="positive" size="24px" />
                    <span class="q-ml-sm">Database Conectado</span>
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="status-item">
                    <q-icon name="check_circle" color="positive" size="24px" />
                    <span class="q-ml-sm">Email Service Ativo</span>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DashboardPage',

  methods: {
    getRandomTime(): string {
      const times = ['há 2 minutos', 'há 5 minutos', 'há 10 minutos', 'há 30 minutos', 'há 1 hora'];
      return times[Math.floor(Math.random() * times.length)] || '';
    },

    quickAction(action: string) {
      this.$q.notify({
        type: 'info',
        message: `Ação "${action}" em desenvolvimento`,
        position: 'top',
      });
    },
  },
});
</script>

<style scoped>
.dashboard-page {
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-container {
  padding: 16px 0;
}

.page-header {
  padding: 16px 0;
}

.stat-icon {
  opacity: 0.3;
}

.status-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

@media (max-width: 599px) {
  .page-header h4 {
    font-size: 1.5rem;
  }
}
</style>
