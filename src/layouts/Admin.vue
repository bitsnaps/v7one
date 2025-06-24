<template>
  <div class="wrapper">
    <Sidebar />
    <div class="main">
      <Header />
      <router-view />
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/admin/Sidebar.vue';
import Header from '@/components/admin/Header.vue';
</script>

<style>
@import '/public/adminkit/css/app.css';
</style>