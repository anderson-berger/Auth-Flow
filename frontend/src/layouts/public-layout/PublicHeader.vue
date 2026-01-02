<template>
  <q-header elevated class="bg-grey-1 text-grey-9">
    <q-toolbar>
      <q-btn flat dense round icon="menu" class="q-mr-sm lt-md" @click="toggleDrawer" />

      <q-toolbar-title class="text-h6 text-weight-bold cursor-pointer" @click="$router.push('/')">
        <q-icon name="shield" size="sm" class="q-mr-sm" color="primary" />
        <span class="text-primary">Auth</span>Flow
      </q-toolbar-title>

      <div class="gt-sm">
        <q-btn
          flat
          dense
          no-caps
          label="Início"
          class="q-mr-sm"
          :class="{ ' text-weight-medium': isCurrentRoute('/') }"
          @click="$router.push('/')"
        />
        <q-btn flat dense no-caps label="Recursos" class="q-mr-sm" @click="scrollToFeatures" />
        <q-btn flat dense no-caps label="Documentação" class="q-mr-sm" @click="handleDocsClick" />
      </div>

      <q-space />

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

      <q-btn
        outline
        no-caps
        label="Entrar"
        color="primary"
        class="q-mr-sm"
        @click="$router.push('/auth')"
      />

      <q-btn unelevated no-caps label="Criar Conta" color="primary" @click="handleCreateAccount" />
    </q-toolbar>
  </q-header>

  <!-- Mobile Drawer -->
  <q-drawer
    v-model="drawer"
    overlay
    behavior="mobile"
    :width="280"
    :breakpoint="1024"
    class="lt-md"
  >
    <q-list padding>
      <q-item-label header class="text-weight-bold"> Menu </q-item-label>

      <q-item
        clickable
        v-ripple
        :active="isCurrentRoute('/')"
        active-class="text-primary bg-primary-1"
        @click="navigateAndCloseDrawer('/')"
      >
        <q-item-section avatar>
          <q-icon name="home" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Início</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple @click="scrollToFeaturesAndCloseDrawer">
        <q-item-section avatar>
          <q-icon name="star" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Recursos</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple @click="handleDocsClickAndCloseDrawer">
        <q-item-section avatar>
          <q-icon name="menu_book" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Documentação</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator class="q-my-md" />

      <q-item clickable v-ripple @click="navigateAndCloseDrawer('/auth')">
        <q-item-section avatar>
          <q-icon name="login" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Entrar</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple class="text-primary" @click="handleCreateAccountAndCloseDrawer">
        <q-item-section avatar>
          <q-icon name="person_add" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-medium">Criar Conta</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Dark } from 'quasar';

export default defineComponent({
  name: 'PublicHeader',

  data() {
    return {
      drawer: false,
      isDarkMode: Dark.isActive,
    };
  },

  methods: {
    toggleDarkMode() {
      Dark.toggle();
      this.isDarkMode = Dark.isActive;
      localStorage.setItem('darkMode', String(Dark.isActive));
    },

    toggleDrawer() {
      this.drawer = !this.drawer;
    },

    isCurrentRoute(path: string): boolean {
      return this.$route.path === path;
    },

    async scrollToFeatures() {
      if (this.$route.path !== '/') {
        await this.$router.push('/').then(() => {
          setTimeout(() => {
            this.scrollToFeaturesSection();
          }, 100);
        });
      } else {
        this.scrollToFeaturesSection();
      }
    },

    scrollToFeaturesSection() {
      const featuresSection = document.querySelector('.features-section') as HTMLElement;
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },

    handleDocsClick() {
      this.$q.notify({
        type: 'info',
        message: 'Documentação em breve',
        position: 'top',
      });
    },

    async handleCreateAccount() {
      await this.$router.push('/auth');
    },

    async navigateAndCloseDrawer(path: string) {
      await this.$router.push(path);
      this.drawer = false;
    },

    async scrollToFeaturesAndCloseDrawer() {
      await this.scrollToFeatures();
      this.drawer = false;
    },

    handleDocsClickAndCloseDrawer() {
      this.handleDocsClick();
      this.drawer = false;
    },

    async handleCreateAccountAndCloseDrawer() {
      await this.handleCreateAccount();
      this.drawer = false;
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

.cursor-pointer {
  cursor: pointer;
  transition: opacity 0.2s;
}

.cursor-pointer:hover {
  opacity: 0.8;
}

.q-btn {
  transition: all 0.2s ease;
}

@media (max-width: 1023px) {
  .q-toolbar {
    padding: 0 16px;
  }
}
</style>
