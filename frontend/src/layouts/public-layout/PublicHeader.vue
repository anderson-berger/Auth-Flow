<template>
  <q-header elevated class="bg-white text-dark">
    <q-toolbar>
      <q-toolbar-title class="text-h6 text-weight-medium">
        <q-icon name="lock" size="sm" class="q-mr-sm" />
        AuthFlow
      </q-toolbar-title>

      <q-space />

      <q-btn flat dense rounded label="Sobre" class="q-mr-sm" @click="$router.push('/')" />
    </q-toolbar>
  </q-header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PublicHeader',
});
</script>

<style scoped>
.q-toolbar {
  min-height: 64px;
}
</style>
