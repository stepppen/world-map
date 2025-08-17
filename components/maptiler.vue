<template>
  <div class="map-wrap overflow-hidden">
    <div class="map overflow-hidden" ref="mapContainer"></div>
    <markerCard
      :divClass="['name-tag', { 'has-location': borderHasLocation, 'expanded': cardExpanded }]"
      :isHidden="currentMode === 'floating' ? !showFloatingMarker : false"
      :text="currentMode === 'floating' ? floatingText : confirmedMarker?.text"
      :lat="currentMode === 'confirmed' && confirmedMarker ? confirmedMarker.lat : null"
      :lng="currentMode === 'confirmed' && confirmedMarker ? confirmedMarker.lng : null"
      :mode="currentMode"
    />
  </div>
</template>

<script setup>
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { createApp } from 'vue'
import markerPopup from '@/components/markerPopup.vue'

const mapContainer = shallowRef(null);
const map = shallowRef(null);
const confirmedMarker = ref(null)
const markers = ref([]);
const style = `https://api.maptiler.com/maps/0198248a-991e-798a-ad3f-dfc8fa370879/style.json?key=${import.meta.env.VITE_MAPTILER_API_KEY}`
let emit = defineEmits(['update-floating-text']);

onMounted(() => {
  maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;
  const initialState = { lng: 139.753, lat: 35.6844, zoom: 14 };

  map.value = markRaw(new maptilersdk.Map({
    container: mapContainer.value,
    style: style,
    center: [initialState.lng, initialState.lat],
    zoom: initialState.zoom
  }));
  
  map.value.on('moveend', async() => {
  try{
    const center = map.value.getCenter();
    const results = await maptilersdk.geocoding.reverse([center.lng, center.lat]);
    emit('update-floating-text', results.features[5].place_name_en);
  }
  catch (error){
    emit('update-floating-text', "Place not found"); 
  }
});

})


onUnmounted(() => {
  map.value?.remove();
})

const props = defineProps({
  currentMode: String,
  floatingText: String,
  showFloatingMarker: Boolean,
  borderHasLocation: Boolean,
  cardExpanded: Boolean
})

watch(() => props.currentMode, async (newMode) => {
  const center = map.value.getCenter();

  if (newMode === 'floating') {
    // Floating marker: just a visual indicator at center
    // You already have markerCard bound to floatingText, so no extra marker needed
    return;
  }

  if (newMode === 'confirmed') {
    // Create persistent marker
    const markerContent = document.createElement("div");

    const app = createApp(markerPopup, {
      text: props.floatingText,
      marker: null,
      unmount: () => {
        app.unmount();
        markerContent.remove();
      }
    });
    app.mount(markerContent);

    const marker = new maptilersdk.Marker({element: markerContent})
      .setLngLat([center.lng, center.lat])
      .addTo(map.value);

    app._instance.props.marker = marker;
    markers.value.push(marker);
    

    // Update confirmedMarker (so markerCard shows correct info)
    confirmedMarker.value = {
      lat: center.lat,
      lng: center.lng,
      text: props.floatingText
    };

    // Emit to parent to save to DB
    // emit('confirmed-marker', confirmedMarker.value);
  }
});

</script>

<style scoped>
.map-wrap {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: calc(100vh - 40px);
}

.map {
  position: absolute;
  width: 100%;
  height: 100%;
}
  .maplibregl-popup {
    max-width: 200px;
  }
</style>

<!-- :divClass="['name-tag', { 'has-location': borderHasLocation, 'expanded': cardExpanded }]" 
 :text="currentMode === 'floating' ? floatingText : confirmedMarker?.text"-->