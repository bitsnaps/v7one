<script setup>
import { ref } from 'vue';

// Contact form data
const formData = ref({
    name: '',
    email: '',
    subject: '', // Added subject field
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
        subject: '', // Reset subject field
        message: ''
    };
}

</script>

<template>
    <div class="container-xxl py-5">
        <div class="container">
            <div class="text-center mx-auto mb-5" style="max-width: 600px;">
                <h1 class="mb-3">{{ $t('contact.title', 'Contact Us') }}</h1>
                <p>{{ $t('contact.subtitle', 'You can contact us via this form for any inqueries.') }}</p>
            </div>
            <div class="row g-4">
                <div class="col-12">
                    <div class="row gy-4">
                        <div class="col-md-6 col-lg-4">
                            <div class="bg-light rounded p-3">
                                <div class="d-flex align-items-center bg-white rounded p-3" style="border: 1px dashed rgba(0, 185, 142, .3)">
                                    <div class="icon me-3" style="width: 45px; height: 45px;">
                                        <i class="fa fa-map-marker-alt text-primary"></i>
                                    </div>
                                    <span>{{ $t('footer.address') }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-4">
                            <div class="bg-light rounded p-3">
                                <div class="d-flex align-items-center bg-white rounded p-3" style="border: 1px dashed rgba(0, 185, 142, .3)">
                                    <div class="icon me-3" style="width: 45px; height: 45px;">
                                        <i class="fa fa-envelope-open text-primary"></i>
                                    </div>
                                    <span>contact@v7one.com</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-4">
                            <div class="bg-light rounded p-3">
                                <div class="d-flex align-items-center bg-white rounded p-3" style="border: 1px dashed rgba(0, 185, 142, .3)">
                                    <div class="icon me-3" style="width: 45px; height: 45px;">
                                        <i class="fa fa-phone-alt text-primary"></i>
                                    </div>
                                    <span>00213656242575</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 ">
                    <iframe class="position-relative rounded w-100 h-100" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d199.79562686592078!2d2.8886350338917293!3d36.75305071199806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fbb319ef1395b%3A0x24f8a7c2ef15813c!2sBanque%20de%20D%C3%A9veloppement%20Local!5e0!3m2!1sfr!2sdz!4v1747765346794!5m2!1sfr!2sdz" frameborder="0" style="min-height: 400px; border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
                </div>
                <div class="col-md-6">
                        <form @submit.prevent="submitForm">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <div class="form-floating">
                                        <input type="text" class="form-control" id="name" v-model="formData.name" :placeholder="$t('contact.namePlaceholder', 'Your Name')" required>
                                        <label for="name">{{ $t('contact.nameLabel', 'Your Name') }}</label>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-floating">
                                        <input type="email" class="form-control" id="email" v-model="formData.email" :placeholder="$t('contact.emailPlaceholder', 'Your Email')" required>
                                        <label for="email">{{ $t('contact.emailLabel', 'Your Email') }}</label>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-floating">
                                        <input type="text" class="form-control" id="subject" v-model="formData.subject" :placeholder="$t('contact.subjectPlaceholder', 'Subject')" required>
                                        <label for="subject">{{ $t('contact.subjectLabel', 'Subject') }}</label>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-floating">
                                        <textarea class="form-control" :placeholder="$t('contact.messagePlaceholder', 'Leave a message here')" id="message" v-model="formData.message" style="height: 150px" required></textarea>
                                        <label for="message">{{ $t('contact.messageLabel', 'Message') }}</label>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <button class="btn btn-primary w-100 py-3" type="submit">{{ $t('contact.submitButton', 'Send Message') }}</button>
                                </div>
                            </div>
                        </form>
                        <!-- Display success message if form is submitted -->
                        <div v-if="formSubmitted" class="alert alert-success mt-3" role="alert">
                            {{ $t('contact.successMessage', 'Form submitted successfully!') }}
                        </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>