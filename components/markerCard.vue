<template>
  <div v-if="mode === 'floating'" class="floating-marker" :class="{ hidden: isHidden }">
    <div :class="divClass">{{ text }}</div>
  </div>
  <div v-else-if="mode === 'confirmed'" class="confirmed-marker hidden">
    <!-- <div :class="divClass">{{ text }}</div>
    <input type="file" accept="image/*"> -->
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text?: string, 
  divClass?: Array<string>, 
  isHidden?: boolean, 
  mode: 'floating' | 'confirmed'}>();
</script>
<style>

/* MARKER UI */
.floating-marker {
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: #dcdcdc;
  border-radius: 8px;
  color: #2c2c2c;
  transform: translate(-50%, -100%); 
  z-index: 20;
  pointer-events: none;
  transition: transform 0.2s ease;
}

.floating-marker.hidden {
  display: none;
}


@keyframes float {
  0% { transform: translate(-50%, -100%); }
  50% { transform: translate(-50%, -110%); }
  100% { transform: translate(-50%, -100%); }
}

.floating-marker {
  animation: float 2s ease-in-out infinite;
}

/* CARD UI */
.confirmed-marker {
    background-color: #dcdcdc;
  border-radius: 8px;
  color: #2c2c2c;
  font-size: 14px;
  padding: 10px 15px;
  position: relative;
  border: 2px solid transparent; /* Default transparent border */
  transition: border-color 0.3s ease;
}
</style>