<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const displayName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');

const handleSignUp = async () => {
  errorMessage.value = '';
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.';
    return;
  }
  
  const userData = {
    email: email.value,
    password: password.value,
    displayName: displayName.value || email.value.split('@')[0],
  };

  const success = await authStore.signup(userData);

  if (success) {
    router.push('/validate-email');
  } else {
    errorMessage.value = authStore.authError || 'An unknown error occurred.';
  }
};

const handleGoogleSignUp = () => {
  console.log('Attempting to sign up with Google');
  // Placeholder for Google Sign-Up logic
  alert('Google Sign-Up not implemented yet.');
};

const handleFacebookSignUp = () => {
  console.log('Attempting to sign up with Facebook');
  // Placeholder for Facebook Sign-Up logic
  alert('Facebook Sign-Up not implemented yet.');
};
</script>

<template>
    <div class="signup-container">
        <div class="signup-box">
            <h2 class="text-center mb-4">{{ $t('signUp.title', 'Sign Up') }}</h2>
            <form @submit.prevent="handleSignUp">
                <div class="mb-3">
                    <label for="displayName" class="form-label">{{ $t('signUp.displayNameLabel', 'Display Name') }}</label>
                    <input type="text" class="form-control" id="displayName" v-model="displayName">
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">{{ $t('signUp.emailLabel', 'Email') }}</label>
                    <input type="email" class="form-control" id="email" v-model="email" required>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">{{ $t('signUp.passwordLabel', 'Password') }}</label>
                    <input type="password" class="form-control" id="password" v-model="password" required>
                </div>
                <div class="mb-3">
                    <label for="confirmPassword" class="form-label">{{ $t('signUp.confirmPasswordLabel', 'Confirm Password') }}</label>
                    <input type="password" class="form-control" id="confirmPassword" v-model="confirmPassword" required>
                </div>
                <div v-if="errorMessage" class="alert alert-danger" role="alert">
                    {{ errorMessage }}
                </div>
                <div class="d-grid">
                    <button type="submit" class="btn btn-primary w-100">{{ $t('signUp.signUpButton', 'Sign Up') }}</button>
                </div>
            </form>

            <div class="or-divider my-3">
                <span>{{ $t('signIn.or', 'OR') }}</span>
            </div>

            <!-- <div class="d-grid gap-2">
                <button @click="handleGoogleSignUp" class="btn btn-danger w-100">
                    <i class="fa-brands fa-google me-2"></i> {{ $t('signUp.signUpWithGoogle', 'Sign Up with Google') }}
                </button>
                <button @click="handleFacebookSignUp" class="btn btn-primary w-100" style="background-color: #3b5998; border-color: #3b5998;">
                    <i class="fa-brands fa-facebook me-2"></i> {{ $t('signUp.signUpWithFacebook', 'Sign Up with Facebook') }}
                </button>
            </div> -->

            <p class="mt-3 text-center">
                {{ $t('signUp.alreadyHaveAccount', 'Already have an account?') }} <router-link to="/signin">{{ $t('signUp.signInLink', 'Sign In') }}</router-link>
            </p>
        </div>
    </div>
</template>
<style scoped>
.signup-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh; /* Full viewport height */
    padding: 1rem;
    background-color: #f8f9fa; /* Optional: background color for the page */
}

.signup-box {
    background-color: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    width: 100%;
    max-width: 400px; /* Max width for larger screens */
}

.or-divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: #6c757d; /* Bootstrap's secondary text color */
}

.or-divider::before,
.or-divider::after {
  content: '';
  flex-grow: 1;
  border-bottom: 1px solid #dee2e6; /* Bootstrap's border color */
}

.or-divider span {
  padding: 0 0.5rem;
}

@media (max-width: 576px) { /* Mobile responsiveness */
    .signup-box {
        margin: 1rem;
        padding: 1.5rem;
    }
}
h2 {
    text-align: center;
}
</style>

