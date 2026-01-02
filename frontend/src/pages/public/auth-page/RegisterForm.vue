<template>
  <q-form @submit="handleSubmit">
    <q-card>
      <q-card-section>
        <div class="text-h5 text-weight-medium">Criar Conta</div>
        <div class="text-caption text-grey-7">Preencha seus dados para se cadastrar</div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="row q-col-gutter-xs">
        <q-input
          v-model="form.name"
          label="Nome completo"
          outlined
          :rules="[(val) => !!val || 'Nome é obrigatório']"
          lazy-rules
          class="col-12"
          dense
        />
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
          class="col-12"
          dense
        />
        <q-input
          v-model="form.password"
          label="Senha"
          :type="showPassword ? 'text' : 'password'"
          outlined
          :rules="[
            (val) => !!val || 'Senha é obrigatória',
            (val) => val.length >= 8 || 'Senha deve ter no mínimo 8 caracteres',
          ]"
          lazy-rules
          class="col-12"
          dense
        >
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>

        <q-input
          v-model="form.confirmPassword"
          label="Confirmar senha"
          :type="showConfirmPassword ? 'text' : 'password'"
          outlined
          :rules="[
            (val) => !!val || 'Confirmação de senha é obrigatória',
            (val) => val === form.password || 'As senhas não coincidem',
          ]"
          lazy-rules
          class="col-12"
          dense
        >
          <template v-slot:append>
            <q-icon
              :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showConfirmPassword = !showConfirmPassword"
            />
          </template>
        </q-input>
      </q-card-section>
      <q-card-actions>
        <q-btn
          type="submit"
          label="Cadastrar"
          color="primary"
          class="full-width"
          :loading="loading"
          :disable="loading"
      /></q-card-actions>
    </q-card>
  </q-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { RegisterRequest } from '@backend/features/auth/register/register-schemas';

export default defineComponent({
  name: 'RegisterForm',

  props: { loading: { type: Boolean, default: false } },

  emits: ['submit'],

  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      showPassword: false,
      showConfirmPassword: false,
    };
  },

  methods: {
    handleSubmit() {
      // Apenas emite os dados formatados para o pai (sem confirmPassword)
      const registerData: RegisterRequest = {
        name: this.form.name,
        email: this.form.email,
        password: this.form.password,
      };

      this.$emit('submit', registerData);
    },

    clearForm() {
      this.form = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      };
    },
  },
});
</script>
