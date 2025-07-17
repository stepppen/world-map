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
    class="font-bold rounded-full"
    :ui="{
      wrapper: 'flex gap-2',
      list: 'flex gap-2',
      item: {
        base: 'action-btn px-4 py-2 rounded-full border border-gray-500 text-gray-400 backdrop-blur-md transition ease-in-out duration-300',
        active: 'text-white bg-[oklch(50.8%_0_0)]'
      }
    }"
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
