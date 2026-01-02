<template>
  <q-layout view="lHh Lpr lFf">
    <PublicHeader />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PublicHeader from 'src/layouts/public-layout/PublicHeader.vue';

export default defineComponent({
  name: 'PublicLayout',

  components: {
    PublicHeader,
  },
});
</script>

<style scoped>
/* Estilos locais aqui */
</style>
