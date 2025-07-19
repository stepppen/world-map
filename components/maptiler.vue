<template>
  <div class="map-wrap">
    <div class="map" ref="mapContainer"></div>
  </div>
</template>

<script setup>
import { Map, MapStyle, config } from '@maptiler/sdk';
import { shallowRef, onMounted, onUnmounted, markRaw } from 'vue';
import '@maptiler/sdk/dist/maptiler-sdk.css';

const mapContainer = shallowRef(null);
const map = shallowRef(null);
const style = "https://api.maptiler.com/maps/0198248a-991e-798a-ad3f-dfc8fa370879/style.json?key=EHWlpvDSVzgBjMi199Y4"

onMounted(() => {
  config.apiKey = 'EHWlpvDSVzgBjMi199Y4';

  const initialState = { lng: 139.753, lat: 35.6844, zoom: 14 };

  map.value = markRaw(new Map({
    container: mapContainer.value,
    style: style,
    center: [initialState.lng, initialState.lat],
    zoom: initialState.zoom
  }));

}),
onUnmounted(() => {
  map.value?.remove();
})
</script>

<style scoped>
.map-wrap {
  position: relative;
  width: 100%;
  height: calc(100vh - 77px); /* calculate height of the screen minus the heading */
}

.map {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>