<script setup>
import { ref } from 'vue';

// Contact form data
const formData = ref({
    name: '',
    email: '',
    tel: '',
    deal: ''
    // photos...

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
        tel: '',
        deal: ''
        // photos...
    };
}

</script>

<template>
    <div class="container">

        <h1>{{ $t('postDeal.title', 'Post your Deal') }}</h1>
        <form @submit.prevent="submitForm">
            <div class="mb-3">
                <label for="name" class="form-label">{{ $t('postDeal.nameLabel', 'Name') }}</label>
                <input type="text" class="form-control" id="name" v-model="formData.name" required>
            </div>
            <div class="mb-3">
                <label for="tel" class="form-label">{{ $t('postDeal.telLabel', 'Tel') }}</label>
                <input type="tel" class="form-control" id="tel" v-model="formData.tel" required>
            </div>
            <div class="mb-3">
                <label for="deal" class="form-label">{{ $t('postDeal.dealDetailsLabel', 'Deal Details') }}</label> 
                <textarea class="form-control" id="deal" v-model="formData.deal" rows="5" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">{{ $t('postDeal.submitButton', 'Submit') }}</button>
        </form>
        <!-- Display success message if form is submitted -->
        <div v-if="formSubmitted" class="alert alert-success mt-3" role="alert">
            {{ $t('postDeal.successMessage', 'Form submitted successfully!') }}
        </div>
    </div>
</template>

<style scoped>
</style>