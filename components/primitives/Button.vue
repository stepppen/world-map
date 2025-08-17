<template>
  <button class="action-btn py-2 px-4 bg-neutral-200/10 rounded-xl h-12" :class="{ hidden: isHidden }">{{text}}</button>
</template>
<script setup lang="ts">
  defineProps<{text: string, isHidden?: boolean}>();
</script>

<style>
.action-btn.hidden {
  display: none;
}
</style>

