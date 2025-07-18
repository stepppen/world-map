<template>
  
  <div class="app-container">
    <div 
        ref="mapDiv" 
        class="absolute w-full h-screen border"
      ></div>
    <markerCard
      :divClass="['name-tag', { 'has-location': borderHasLocation, 'expanded': cardExpanded }]"
      :isHidden="currentMode === 'floating' ? !showFloatingMarker : false"
      :text="currentMode === 'floating' ? floatingText : confirmedMarker?.text"
      :lat="currentMode === 'confirmed' && confirmedMarker ? confirmedMarker.lat : null"
      :lng="currentMode === 'confirmed' && confirmedMarker ? confirmedMarker.lng : null"
      :mode="currentMode"
    />
      
    <div class="ui-overlay">
      <div class=" header-controls flex justify-between p-8 gap-4 w-full ">
        <div>
          <div>
            <primitivesButton @click="addTag()" :isHidden="!showAddTag" text="Add place"></primitivesButton>
          </div>
          <div class="flex gap-4">
            <primitivesButton @click="confirmTag()" :isHidden="!showConfirmCancel" text="Confirm"></primitivesButton>
            <primitivesButton @click="cancelTag()" :isHidden="!showConfirmCancel" text="Cancel"></primitivesButton>
          </div>
        </div>
        <Navigation />
      </div>

    </div>
    <div >
      
    </div>

  </div>
</template>

<script setup lang="ts">
import { createApp } from 'vue'
import markerPopup from './markerPopup.vue'
import { useMapStore } from '@/stores/mapStore'

let map = null
let googleScript = null
const mapDiv = ref(null)
const googleMapsRef = ref()
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const markers = ref([]);
let currentZoom = ref(0);
const floatingText = ref("Move the map");
const showFloatingMarker = ref(false);
const showConfirmCancel = ref(false);
const showAddTag = ref(true);
const borderHasLocation = ref(false);
const cardExpanded = ref(false);
const currentMode = ref('floating');
const confirmedMarker = ref<null | { lat: number, lng: number, text: string }>(null);
const mapStore = useMapStore()

const client = useSupabaseClient()
const markerCard = ref([])



const mapCenter = {
  lat: -37.7995487,
  lng: 144.9867841,
}

// Error Handler
function handleScriptError() {
  console.error('Google Maps failed to load. Check your API key and network connection.')
}


onMounted(async () => {
  
   window.initMap = async () => {
    if (mapDiv.value) {
      try {
        map = new google.maps.Map(mapDiv.value, {
          center: mapCenter,
          zoom: 12,
          disableDefaultUI: true,
          mapId: 'e955169f2ea6eda',
          minZoom: 4, 
          maxZoom: 14,
          mapTypeId: 'roadmap',
          
        });
        google.maps.event.addListener(map, 'zoom_changed', function() {
          mapStore.zoomLevel = map.getZoom()
        });
      
     const { data, error } = await client.from('markerCard').select('*')
     if (error) {
          console.error('Error fetching markers from Supabase:', error);
          return;
        }
    markerCard.value = data;

    data.forEach(markerItem => {
          const markerContent = document.createElement('div');

          const app = createApp(markerPopup, {
            text: markerItem.text || 'No text',
            marker: null,
            markerData: markerItem,
            unmount: () => {
              app.unmount();
              markerContent.remove();
            }
          });

          app.mount(markerContent);

          const marker = new google.maps.marker.AdvancedMarkerElement({
            position: {
              lat: markerItem.latitude,
              lng: markerItem.longitude
            },
            map,
            content: markerContent,
            title: `Saved marker at ${markerItem.latitude}, ${markerItem.longitude}`,
            gmpClickable: true,
          });

          app._instance.props.marker = marker;
          markers.value.push(marker);
        });
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    } else {
      console.error('Map container not found');
    }
  };
  


  // Load Google Maps API script
  googleScript = document.createElement('script')
  googleScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&callback=initMap`
  googleScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&callback=initMap&v=beta&libraries=marker`
  googleScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&callback=initMap&v=beta&libraries=marker,geocoding`
  googleScript.async = true
  googleScript.defer = true
  googleScript.onerror = handleScriptError
  
  document.head.appendChild(googleScript)


})



function addTag() {
  cardExpanded.value = false;
  showFloatingMarker.value = true;
  showConfirmCancel.value = true;
  showAddTag.value = false;
  currentMode.value = "floating";

  // addButton.style.display = "none";
  // navButtons.classList.remove("hidden-nav");
  // floatingMarker.classList.remove("hidden");

  google.maps.event.clearListeners(map, 'center_changed'); // Prevent multiple listeners
  google.maps.event.addListener(map, 'center_changed', function() {
    const currentCenter = map.getCenter();
    const lat = currentCenter.lat();
    const lng = currentCenter.lng();

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results[0]) {
        let locality = null;
        let country = null;
        for (const component of results[0].address_components) {
          if (component.types.includes("locality") || component.types.includes("administrative_area_level_1")) {
            locality = component.long_name;
            break;
          }
        }
        for (const component of results[0].address_components) {
          if (component.types.includes("country")) {
            country = component.long_name;
            break;
          }
        }
        floatingText.value = locality && country ? `${locality}, ${country}` : results[0].formatted_address;
        borderHasLocation.value = true;
        
      } else {
        floatingText.value = "Unknown location";
        borderHasLocation.value = false;
      }
      
    });
    
  });
}

const confirmTag = async () => {
  

  if (!map) {
    console.error('Map is not initialized');
    return;
  }

  const currentCenter = map.getCenter();
  const lat = currentCenter.lat();
  const lng = currentCenter.lng();

  // Create a new div for the marker content
  const markerContent = document.createElement("div");
  const app = createApp(markerPopup, { 
    text: floatingText.value, 
    marker: null,
    // markerData: markerItem,
    unmount: () => {
      app.unmount();
      markerContent.remove(); 
    } });
    app.mount(markerContent);

  // Create new marker
  const marker = new google.maps.marker.AdvancedMarkerElement({
    position: { lat, lng },
    map,
    content: markerContent,
    title: `New location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    gmpClickable: true,
  });
  app._instance.props.marker = marker;
  markers.value.push(marker);



  showAddTag.value = true;
  showConfirmCancel.value = false;
  showFloatingMarker.value = false;

  const { error } = await client.from('markerCard').insert({
    place: floatingText.value,
    latitude: lat,
    longitude: lng,
  }).select().single()

  markerCard.value.push(data)

  if (error) throw error
}

function cancelTag() {
  cardExpanded.value = false;
  showAddTag.value = true;
  showConfirmCancel.value = false;
  showFloatingMarker.value = false;
  currentMode.value = "floating";
}



// // Remove the listener.
// google.maps.event.removeListener(clickListener);

onBeforeUnmount(() => {
  if (googleScript && googleScript.parentNode) {
    googleScript.parentNode.removeChild(googleScript)
  }
  window.initMap = undefined
})
</script>

<style>
/* Root container */
.app-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* Map container */
.map-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* UI overlay */
.ui-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Let map events pass through */
  z-index: 10;
}

.header-controls {
  pointer-events: auto;
  padding: 2rem;
  display: flex;
  gap: 1rem;
}
.hidden-nav {
  display: none;
}
.name-tag {
  background-color: #4285F4;
  border-radius: 8px;
  color: #FFFFFF;
  font-size: 14px;
  padding: 10px 15px;
  position: relative;
  border: 2px solid transparent; /* Default transparent border */
  transition: border-color 0.3s ease;
}

.name-tag.has-location {
    border-color: #FFC107;
}

.name-tag::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translate(-50%, 0);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #4285F4;
}




</style>