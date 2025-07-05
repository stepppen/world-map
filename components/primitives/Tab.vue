<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

const items = ref<TabsItem[]>([
  {
    label: 'Account',
    icon: 'i-lucide-user',
    content: 'This is the account content.'
  },
  {
    label: 'Password',
    icon: 'i-lucide-lock',
    content: 'This is the password content.'
  }
])
</script>

<template>
  <UTabs :items="items" class="w-full" />
</template>
