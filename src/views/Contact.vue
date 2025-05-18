<script setup>
import { ref } from 'vue';

// Contact form data
const formData = ref({
    name: '',
    email: '',
    message: ''

});

// Flag to track form submission
const formSubmitted = ref(false);
// Function to handle form submission
const submitForm = () => {
    // Perform form validation here
    // For simplicity, we'll just set the formSubmitted flag to true
    formSubmitted.value = true;
    // You can also send the form data to a server here
    // For this example, we'll just log the form data to the console
    console.log('Form submitted:', formData.value);
    // Reset the form after submission
    formData.value = {
        name: '',
        email: '',
        message: ''
    };
}

</script>

<template>
    <div class="container">

        <h1>{{ $t('contact.title', 'Contact Us') }}</h1>
        <form @submit.prevent="submitForm">
            <div class="mb-3">
                <label for="name" class="form-label">{{ $t('contact.nameLabel', 'Name') }}</label>
                <input type="text" class="form-control" id="name" v-model="formData.name" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">{{ $t('contact.emailLabel', 'Email') }}</label>
                <input type="email" class="form-control" id="email" v-model="formData.email" required>
            </div>
            <div class="mb-3">
                <label for="message" class="form-label">{{ $t('contact.messageLabel', 'Message') }}</label> 
                <textarea class="form-control" id="message" v-model="formData.message" rows="5" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">{{ $t('contact.submitButton', 'Submit') }}</button>
        </form>
        <!-- Display success message if form is submitted -->
        <div v-if="formSubmitted" class="alert alert-success mt-3" role="alert">
            {{ $t('contact.successMessage', 'Form submitted successfully!') }}
        </div>
    </div>
</template>

<style scoped>
</style>