<template>
  <q-header elevated class="bg-grey-1 text-grey-9">
    <q-toolbar>
      <q-btn flat dense round icon="menu" @click="toggleDrawer" class="q-mr-sm" />

      <q-toolbar-title class="text-h6 text-weight-bold">
        <q-icon name="shield" size="sm" class="q-mr-sm" color="primary" />
        <span class="text-primary">Auth</span>Flow
      </q-toolbar-title>

      <q-space />
      <q-btn
        flat
        dense
        round
        :icon="isDarkMode ? 'light_mode' : 'dark_mode'"
        @click="healthCheck"
        class="q-mr-sm"
      >
        <q-tooltip>{{ isDarkMode ? 'Modo Claro' : 'Modo Escuro' }}</q-tooltip>
      </q-btn>

      <q-btn
        flat
        dense
        round
        :icon="isDarkMode ? 'light_mode' : 'dark_mode'"
        @click="toggleDarkMode"
        class="q-mr-sm"
      >
        <q-tooltip>{{ isDarkMode ? 'Modo Claro' : 'Modo Escuro' }}</q-tooltip>
      </q-btn>

      <q-btn flat dense round icon="notifications" class="q-mr-sm">
        <q-badge color="red" floating>3</q-badge>
        <q-tooltip>Notificações</q-tooltip>
      </q-btn>

      <q-btn flat dense round>
        <q-avatar size="32px" color="primary" text-color="white">
          <q-icon name="person" />
        </q-avatar>

        <q-menu>
          <q-list style="min-width: 200px">
            <q-item-label header class="text-weight-medium">
              {{ userName }}
            </q-item-label>

            <q-separator />

            <q-item clickable v-ripple @click="goToProfile">
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>
              <q-item-section>Perfil</q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="goToSettings">
              <q-item-section avatar>
                <q-icon name="settings" />
              </q-item-section>
              <q-item-section>Configurações</q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable v-ripple @click="handleLogout" class="text-negative">
              <q-item-section avatar>
                <q-icon name="logout" color="negative" />
              </q-item-section>
              <q-item-section>Sair</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
  </q-header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Dark } from 'quasar';
import AuthService from 'src/services/AuthService';
import ApiService from 'src/services/ApiService';

export default defineComponent({
  name: 'PrivateHeader',

  data() {
    return {
      isDarkMode: Dark.isActive,
    };
  },

  computed: {
    userName(): string {
      const userData = AuthService.getUserData();
      return userData?.name || 'Usuário';
    },
  },

  methods: {
    toggleDarkMode() {
      Dark.toggle();
      this.isDarkMode = Dark.isActive;
      localStorage.setItem('darkMode', String(Dark.isActive));
    },

    toggleDrawer() {
      this.$emit('toggle-drawer');
    },

    goToProfile() {
      this.$q.notify({
        type: 'info',
        message: 'Funcionalidade em desenvolvimento',
        position: 'top',
      });
    },

    goToSettings() {
      this.$q.notify({
        type: 'info',
        message: 'Funcionalidade em desenvolvimento',
        position: 'top',
      });
    },

    handleLogout() {
      this.$q
        .dialog({
          title: 'Confirmar',
          message: 'Tem certeza que deseja sair?',
          cancel: {
            flat: true,
            label: 'Cancelar',
          },
          ok: {
            flat: true,
            label: 'Sair',
            color: 'negative',
          },
          persistent: true,
        })
        .onOk(() => {
          void this.logout();
        });
    },

    async logout() {
      AuthService.logout();

      this.$q.notify({
        type: 'positive',
        message: 'Logout realizado com sucesso!',
        position: 'top',
      });

      await this.$router.push({ name: 'auth' });
    },

    async healthCheck() {
      await ApiService.healthCheck();
    },
  },

  mounted() {
    // Inicializa dark mode do localStorage
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      Dark.set(savedMode === 'true');
      this.isDarkMode = Dark.isActive;
    }
  },
});
</script>

<style scoped>
.q-toolbar {
  min-height: 64px;
  padding: 0 24px;
}

@media (max-width: 1023px) {
  .q-toolbar {
    padding: 0 16px;
  }
}
</style>
