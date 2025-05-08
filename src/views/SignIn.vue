<script setup lang="ts">
import { ref } from 'vue';
// import { useRouter } from 'vue-router'; // Uncomment if you use vue-router

const usernameOrEmail = ref('');
const password = ref('');
const errorMessage = ref('');
// const router = useRouter(); // Uncomment if you use vue-router

const handleSignIn = async () => {
  errorMessage.value = ''; // Clear previous error messages
  console.log('Attempting to sign in with:', usernameOrEmail.value, password.value);

  // Basic validation (can be expanded)
  if (!usernameOrEmail.value || !password.value) {
    errorMessage.value = 'Please enter both username/email and password.';
    return;
  }

  try {
    // Replace with your actual API endpoint
    const response = await fetch('/api/login', { // Assuming your Hono API is at /api
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: usernameOrEmail.value, // Adjust if your API expects 'email'
        password: password.value,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log('Sign in successful:', data.message);
      // Handle successful sign-in (e.g., store token, redirect)
      // Example: router.push('/dashboard'); // Uncomment if using vue-router
      alert('Sign in successful!'); // Placeholder
    } else {
      errorMessage.value = data.message || 'Sign in failed. Please check your credentials.';
      console.error('Sign in failed:', data.message);
    }
  } catch (error) {
    console.error('An error occurred during sign in:', error);
    errorMessage.value = 'An unexpected error occurred. Please try again later.';
  }
};
</script>

<template>
  <div class="signin-container">
    <div class="signin-box">
      <h2 class="text-center mb-4">Sign In</h2>
      <form @submit.prevent="handleSignIn">
        <div class="mb-3">
          <label for="usernameOrEmail" class="form-label">Username or Email</label>
          <input
            type="text"
            class="form-control"
            id="usernameOrEmail"
            v-model="usernameOrEmail"
            required
            placeholder="Enter your username or email"
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            v-model="password"
            required
            placeholder="Enter your password"
          />
        </div>
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>
        <div class="d-grid">
          <button type="submit" class="btn btn-primary w-100">Sign In</button>
        </div>
      </form>
      <p class="mt-3 text-center">
        Don't have an account? <router-link to="/signup">Sign Up</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.signin-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh; /* Full viewport height */
  padding: 1rem;
  background-color: #f8f9fa; /* Optional: background color for the page */
}

.signin-box {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px; /* Max width for larger screens */
}

@media (max-width: 576px) { /* Mobile responsiveness */
  .signin-box {
    margin: 1rem;
    padding: 1.5rem;
  }
}
h2 {
  text-align: center;
}
</style>