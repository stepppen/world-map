<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const mapDiv = ref(null)
let map = null
let googleScript = null
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const mapCenter = {
  lat: -37.7995487,
  lng: 144.9867841,
}

// Define error handler
function handleScriptError() {
  console.error('Google Maps failed to load. Check your API key and network connection.')
}

onMounted(() => {
  // Define the callback function first
  window.initMap = () => {
    if (mapDiv.value) {
      try {
        map = new google.maps.Map(mapDiv.value, {
          center: mapCenter,
          zoom: 12,
          disableDefaultUI: true,
          mapId: 'e955169f2ea6eda',
        })
        console.log('Map initialized successfully')
      } catch (error) {
        console.error('Error initializing map:', error)
      }
    } else {
      console.error('Map container not found')
    }
  }

  // Load Google Maps API script
  googleScript = document.createElement('script')
  googleScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`
  googleScript.async = true
  googleScript.defer = true
  googleScript.onerror = handleScriptError
  
  document.head.appendChild(googleScript)
})

onBeforeUnmount(() => {
  // Clean up to prevent memory leaks
  if (googleScript && googleScript.parentNode) {
    googleScript.parentNode.removeChild(googleScript)
  }
  window.initMap = undefined
})
</script>

<template>
  <div class="not-prose">
    <div class="flex items-center justify-center p-5">
      <div 
        ref="mapDiv" 
        class="w-full min-h-screen border border-gray-300"
        style="min-height: 100vh;"
      ></div>
    </div>
  </div>
</template>