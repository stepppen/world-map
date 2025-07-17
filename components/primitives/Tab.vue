<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

const items = ref<TabsItem[]>([
  {
    label: 'All',
    content: 'This is the account content.'
  },
  {
    label: '2024',
    content: 'This is the password content.'
  }
])
</script>

<template>
  <UTabs
    :content="false"
    :items="items"
    color="primary"
    variant="pill"
    
  />
</template>

<style scoped>
.action-btn {
  color: rgb(184, 184, 184);
  border: 1px solid rgb(129, 129, 129);
  transition: 0.3s ease-in-out;
  backdrop-filter: blur(var(--blur-md));
}
.action-btn:hover {
  color: white;
  background-color: oklch(50.8% 0 0);
  cursor: pointer;
  transition: 0.3s ease-in-out;
}
</style>
