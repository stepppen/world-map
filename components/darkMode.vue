<script setup>
const colorMode = useColorMode()
const { lightMode, darkMode } = useMapStyles()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(_isDark) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  }
})

const currentMapStyle = computed(() => {
  return isDark.value ? darkMode : lightMode
})

watch(isDark, (newIsDark) => {
  console.log('Theme changed to:', newIsDark ? 'dark' : 'light')
  console.log('New map style:', currentMapStyle.value)
})
</script>

<template>
  <ClientOnly v-if="!colorMode?.forced">
    <UButton
      :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
      color="neutral"
      variant="ghost"
      @click="isDark = !isDark"
    />

    <template #fallback>
      <div class="size-8" />
    </template>
  </ClientOnly>
</template>