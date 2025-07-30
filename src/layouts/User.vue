<template>
  <div class="wrapper">
    <UserSidebar />
    <div class="main">
      <UserHeader />
      <router-view />
    </div>
  </div>
</template>

<script setup>
import UserSidebar from '@/components/user/UserSidebar.vue';
import UserHeader from '@/components/user/UserHeader.vue';
</script>

<style>
@import '/public/adminkit/css/app.css';
</style>