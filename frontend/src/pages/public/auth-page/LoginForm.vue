<template>
  <q-form @submit="handleSubmit">
    <q-card>
      <q-card-section>
        <div class="text-h5 text-weight-medium">Bem-vindo de volta</div>
        <div class="text-caption text-grey-7">Entre com suas credenciais para continuar</div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="row q-col-gutter-xs">
        <q-input
          v-model="form.email"
          label="Email"
          type="email"
          outlined
          :rules="[
            (val) => !!val || 'Email é obrigatório',
            (val) => /.+@.+\..+/.test(val) || 'Email inválido',
          ]"
          lazy-rules
          dense
          class="col-12"
        />

        <q-input
          v-model="form.password"
          label="Senha"
          :type="showPassword ? 'text' : 'password'"
          outlined
          :rules="[(val) => !!val || 'Senha é obrigatória']"
          lazy-rules
          dense
          class="col-12"
        >
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>
        <div class="col-12">
          <div class="row items-center justify-between q-mb-lg">
            <q-checkbox v-model="rememberMe" label="Lembrar-me" dense />
            <q-btn
              flat
              dense
              no-caps
              label="Esqueci minha senha"
              color="primary"
              class="text-caption"
              @click="$emit('forgot-password')"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-actions>
        <q-btn
          type="submit"
          label="Entrar"
          color="primary"
          class="full-width"
          size="md"
          unelevated
          :loading="loading"
          :disable="loading"
        />
      </q-card-actions>
    </q-card>
  </q-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { LoginRequest } from '@backend/features/auth/login/login-schemas';

export default defineComponent({
  name: 'LoginForm',

  props: {
    loading: { type: Boolean, default: false },
  },

  emits: ['submit', 'forgot-password'],

  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      showPassword: false,
      rememberMe: false,
    };
  },

  methods: {
    handleSubmit() {
      const loginData: LoginRequest = {
        email: this.form.email,
        password: this.form.password,
      };

      this.$emit('submit', loginData);
    },
  },
});
</script>
