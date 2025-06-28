<template>
  <div class="category-tree">
    <div v-for="category in categories" :key="category.id" class="category-item">
      <div class="d-flex justify-content-between align-items-center p-2">
        <span>{{ category.name }}</span>
        <div>
          <button class="btn btn-sm btn-primary me-2" @click="$emit('edit', category)">Edit</button>
          <button class="btn btn-sm btn-danger" @click="$emit('delete', category.id)">Delete</button>
        </div>
      </div>
      <div v-if="category.children && category.children.length" class="ms-4">
        <CategoryTree :categories="category.children" @edit="$emit('edit', $event)" @delete="$emit('delete', $event)" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  categories: {
    type: Array,
    required: true,
  },
});
defineEmits(['edit', 'delete']);
</script>

<style scoped>
.category-tree {
  width: 100%;
}
.category-item {
  border: 1px solid #eee;
  border-radius: 4px;
  margin-top: 8px;
}
</style>