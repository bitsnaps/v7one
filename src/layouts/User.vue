<template>
  <div class="wrapper">
    <UserSidebar />
    <div class="main">
      <Header />
      <router-view />
    </div>
  </div>
</template>

<script setup>
import UserSidebar from '@/components/user/UserSidebar.vue';
import Header from '@/components/user/Header.vue';
</script>

<style>
@import '/public/adminkit/css/app.css';
</style>