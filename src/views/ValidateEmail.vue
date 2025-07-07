<script>
import { ref } from 'vue';
</script>

<template>
  <div class="validate-email-container">
    <div class="validate-email-box">
      <h2 class="text-center mb-4">
        {{ $t('signUp.thanksForSignUp', 'Thank you for signing up!') }}</h2>

      <p class="text-center">
        {{ $t('signUp.verifyYourEmail', "We've sent a verification link to your email address. Please click the link to complete your registration.") }}
      </p>
      <div class="d-grid mt-4">
        <router-link to="/signin" class="btn btn-primary">
            {{ $t('signUp.backToSignIn', 'Back to Sign In') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.validate-email-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f8f9fa;
}
.validate-email-box {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 450px;
  text-align: center;
}
</style>