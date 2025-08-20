<template>
    <UButton
      :icon="isDark ? 'i-lucide-settings-2' : 'i-lucide-settings-2'"
      color="neutral"
      variant="ghost"
      @click="isDark = !isDark"
    />
    <!-- <div v-if="isClosed">
        <Icon path={mdiDotsVertical} size={1} />
    </div> -->

</template>

<script>
const isClosed = ref(true)


</script>