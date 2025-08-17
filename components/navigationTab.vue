<template>
        <div class="flex justify-between align-center p-4 border-b border-gray-300 header-element drop-shadow-md">
                <div class="header-controls w-32">
                        <div class="flex justify-item-start">
                                <div>
                                        <primitivesButton @click="$emit('add-tag')" :isHidden="!showAddTag" text="Add place"></primitivesButton>
                                </div>
                                <div class="flex gap-2">
                                        <primitivesButton @click="$emit('confirm-tag')" :isHidden="!showConfirmCancel" text="Confirm"></primitivesButton>
                                        <primitivesButton @click="$emit('remove-tag')" :isHidden="!showConfirmCancel" text="Cancel"></primitivesButton>
                                </div>
                        </div>
                </div>
                <span class="text-center inline-block align-middle">Digital Pinboard</span>
                <PrimitivesTab />
        </div>
</template>

<script setup lang="ts">


interface Props{
    showConfirmCancel?: boolean,
    showAddTag?: boolean
}

const props = defineProps<Props>()
</script>

<style>
.header-element{
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
}
.header-controls {
  pointer-events: auto;
  display: flex;
}
</style>