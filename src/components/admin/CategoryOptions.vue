<template>
  <template v-for="category in categories" :key="category.id">
    <option :value="category.id">{{ prefix }} {{ category.name }}</option>
    <CategoryOptions v-if="category.children && category.children.length" :categories="category.children" :prefix="prefix + '--'" />
  </template>
</template>

<script setup>
import CategoryOptions from './CategoryOptions.vue';

defineProps({
  categories: {
    type: Array,
    required: true,
  },
  prefix: {
    type: String,
    default: '',
  },
});
</script>