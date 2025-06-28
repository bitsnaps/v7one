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
import { onMounted, onUnmounted } from 'vue';
import Sidebar from '@/components/admin/Sidebar.vue';
import Header from '@/components/admin/Header.vue';

onMounted(() => {
  // const link = document.createElement('link');
  // link.id = 'admin-styles';
  // link.rel = 'stylesheet';
  // link.href = '/adminkit/css/app.css';
  // document.head.appendChild(link);
});

onUnmounted(() => {
  // const link = document.getElementById('admin-styles');
  // if (link) {
  //   document.head.removeChild(link);
  // }
});
</script>

<style>
@import '/public/adminkit/css/app.css';
</style>