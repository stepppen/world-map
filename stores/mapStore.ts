import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMapStore = defineStore('map', () => {
  const zoomLevel = ref(12)
  return { zoomLevel }
})