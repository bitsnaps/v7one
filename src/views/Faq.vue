<script setup>
</script>

<template>
  <div class="container-xxl py-5">
    <div class="container">
      <h1 class="mb-4">{{ $t('faqs.title', 'Frequently Asked Questions') }}</h1>
      <div class="mb-3">
        <h5 class="mb-1">{{ $t('faqs.q1', 'How do I post a deal?') }}</h5>
        <p class="text-muted">{{ $t('faqs.a1', "Go to 'Post Deal' from the navbar, fill in details, and submit.") }}</p>
      </div>
      <div class="mb-3">
        <h5 class="mb-1">{{ $t('faqs.q2', 'Do I need an account?') }}</h5>
        <p class="text-muted">{{ $t('faqs.a2', 'Yes, you need to sign in to post deals or message sellers.') }}</p>
      </div>
      <div class="mb-3">
        <h5 class="mb-1">{{ $t('faqs.q3', 'How can I contact support?') }}</h5>
        <p class="text-muted">{{ $t('faqs.a3', 'Use the Contact page form or email contact@v7one.com.') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>