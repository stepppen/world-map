import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMapStore = defineStore('map', () => {
  const zoomLevel = ref(12)
  return { zoomLevel }
})


export const useMapstyle = defineStore('style', () => {
  const lightMode = `https://api.maptiler.com/maps/0198248a-991e-798a-ad3f-dfc8fa370879/style.json?key=${import.meta.env.VITE_MAPTILER_API_KEY}`;
  const darkMode = `https://api.maptiler.com/maps/0198c8d5-18d1-758d-ab55-828f35db0b6d/style.json?key=EHWlpvDSVzgBjMi199Y4`;
  return { lightMode, darkMode}
})