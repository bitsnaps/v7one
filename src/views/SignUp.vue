<script setup>
import { ref } from 'vue';
const firstName = ref('');
const lastName = ref('');
const usernameOrEmail = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');   
const handleSignUp = async () => {
    errorMessage.value = ''; // Clear previous error messages
    if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match.';
        return;
    }
    if (!firstName.value || !lastName.value || !usernameOrEmail.value || !password.value) {
        errorMessage.value = 'Please fill in all fields.';
        return;
    }
    console.log('Attempting to sign up with:', firstName.value, lastName.value, usernameOrEmail.value, password.value);
}
</script>

<template>
    <div class="signup-container">
        <div class="signup-box">
            <h2>Sign Up</h2>
            <form @submit.prevent="handleSignUp">
                <div class="mb-3">
                    <label for="firstName" class="form-label">First Name</label>
                    <input type="text" class="form-control" id="firstName" v-model="firstName" required>
                </div>
                <div class="mb-3">
                    <label for="lastName" class="form-label">Last Name</label>
                    <input type="text" class="form-control" id="lastName" v-model="lastName" required>
                </div>
                <div class="mb-3">
                    <label for="usernameOrEmail" class="form-label">Username or Email</label>
                    <input type="text" class="form-control" id="usernameOrEmail" v-model="usernameOrEmail" required>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" v-model="password" required>
                </div>
                <div class="mb-3">
                    <label for="confirmPassword" class="form-label">Confirm Password</label>
                    <input type="password" class="form-control" id="confirmPassword" v-model="confirmPassword" required>
                </div>
                <div v-if="errorMessage" class="alert alert-danger" role="alert">
                    {{ errorMessage }}
                </div>
                <button type="submit" class="btn btn-primary w-100">Sign Up</button>
            </form>
            <p class="mt-3 text-center">
                Already have an account? <router-link to="/signin">Sign In</router-link>
            </p>
        </div>
    </div>
</template>
<style>
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

