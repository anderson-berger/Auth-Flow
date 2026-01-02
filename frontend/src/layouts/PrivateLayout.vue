<template>
  <q-layout view="lHh Lpr lFf">
    <PrivateHeader @toggle-drawer="drawer = !drawer" />

    <q-drawer
      v-model="drawer"
      show-if-above
      :width="260"
      :breakpoint="1024"
      bordered
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item-label header class="text-weight-bold text-uppercase text-grey-7">
            Menu Principal
          </q-item-label>

          <q-item
            clickable
            v-ripple
            :active="isCurrentRoute('/app')"
            active-class="text-primary bg-primary-1"
            @click="$router.push('/app')"
          >
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Dashboard</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="isCurrentRoute('/app/profile')"
            active-class="text-primary bg-primary-1"
            @click="goToProfile"
          >
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Perfil</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="isCurrentRoute('/app/settings')"
            active-class="text-primary bg-primary-1"
            @click="goToSettings"
          >
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Configurações</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item-label header class="text-weight-bold text-uppercase text-grey-7">
            Outros
          </q-item-label>

          <q-item
            clickable
            v-ripple
            @click="goToHelp"
          >
            <q-item-section avatar>
              <q-icon name="help" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Ajuda</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            @click="goToDocs"
          >
            <q-item-section avatar>
              <q-icon name="menu_book" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Documentação</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PrivateHeader from 'src/layouts/private-layout/PrivateHeader.vue';

export default defineComponent({
  name: 'PrivateLayout',

  components: {
    PrivateHeader,
  },

  data() {
    return {
      drawer: true,
    };
  },

  methods: {
    isCurrentRoute(path: string): boolean {
      return this.$route.path === path;
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

    goToHelp() {
      this.$q.notify({
        type: 'info',
        message: 'Funcionalidade em desenvolvimento',
        position: 'top',
      });
    },

    goToDocs() {
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
.q-drawer {
  background: var(--q-grey-1);
}
</style>
