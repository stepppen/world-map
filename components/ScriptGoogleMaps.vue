<script setup lang="ts">

const mapDiv = ref(null)
let map = null
let googleScript = null
const googleMapsRef = ref()
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const markers = ref([]);


const mapCenter = {
  lat: -37.7995487,
  lng: 144.9867841,
}

// Define error handler
function handleScriptError() {
  console.error('Google Maps failed to load. Check your API key and network connection.')
}


onMounted(() => {
  window.initMap = () => {
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
  googleScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&v=beta&libraries=marker`
  googleScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&v=beta&libraries=marker,geocoding`
  googleScript.async = true
  googleScript.defer = true
  googleScript.onerror = handleScriptError
  
  document.head.appendChild(googleScript)
})

function addTag() {
  const addButton = document.getElementById("add-tag");
  const navButtons = document.getElementById("confirm-reject");
  const floatingMarker = document.getElementById("floating-marker");
  const floatingMarkerText = floatingMarker.querySelector(".name-tag");

  addButton.style.display = "none";
  navButtons.classList.remove("hidden-nav");
  floatingMarker.classList.remove("hidden");

  google.maps.event.addListener(map, 'center_changed', function() {
    const currentCenter = map.getCenter();
    const lat = currentCenter.lat();
    const lng = currentCenter.lng();

    // Remove highlight initially while loading new location
    floatingMarkerText.classList.remove("has-location");
    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results[0]) {
        let locality = null;
        let country = null;
        
        for (const component of results[0].address_components) {
          if (component.types.includes("locality") || 
              component.types.includes("administrative_area_level_1")) {
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

        let displayedAddress = locality + ", " + country;
        if (displayedAddress) {
          // Update text and add highlight class
          floatingMarkerText.textContent = displayedAddress;
          floatingMarkerText.classList.add("has-location");
        } else {
          // Fallback to formatted address
          floatingMarkerText.textContent = results[0].formatted_address;
          floatingMarkerText.classList.add("has-location");
        }
      } else {
        console.error('Geocoder failed due to: ' + status);
        floatingMarkerText.textContent = "Unknown location";
      }
    });
  });
}

function confirmTag() {
  const addButton = document.getElementById("add-tag");
  const navButtons = document.getElementById("confirm-reject");
  const floatingMarker = document.getElementById("floating-marker");
  const floatingMarkerText = floatingMarker.querySelector(".name-tag");



  const currentCenter = map.getCenter();
  const lat = currentCenter.lat();
  const lng = currentCenter.lng();

  const markerContent = document.createElement("div");
  markerContent.className = "name-tag";
  markerContent.textContent = floatingMarkerText.textContent; 

  const marker = new google.maps.marker.AdvancedMarkerElement({
    position: {lat, lng},
    map,
    content: markerContent,
    title: `New location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    gmpClickable: true,
  });
  addButton.style.display = "block";
  navButtons.classList.add("hidden-nav");
  floatingMarker.classList.add("hidden");
  markers.value.push(marker);

}

function cancelTag() {
  const removeTagButton = document.getElementById("add-tag");
  const navButtons = document.getElementById("confirm-reject");
  const floatingMarker = document.getElementById("floating-marker");
  removeTagButton.style.display = "block";
  navButtons.classList.add("hidden-nav");
  floatingMarker.classList.add("hidden");
}

onBeforeUnmount(() => {
  // Clean up to prevent memory leaks
  if (googleScript && googleScript.parentNode) {
    googleScript.parentNode.removeChild(googleScript)
  }
  window.initMap = undefined
})
</script>

<template>
  
  <div class="app-container">
    <div 
        ref="mapDiv" 
        class="absolute w-full h-screen border"
      ></div>
      <div id="floating-marker" class="floating-marker hidden">
      <div class="name-tag">Place me!</div>
    </div>
      <div class="ui-overlay">
        <div class=" header-controls flex p-8 gap-4 w-full ">
          <div>
            <button @click="addTag()" id="add-tag" class="action-btn  py-2 px-4 bg-neutral-200/10 rounded-full">Add place</button>
          </div>
          <div id="confirm-reject" class="hidden-nav flex gap-4">
                    <button @click="confirmTag()" class=" action-btn py-2 px-4 bg-neutral-200/10 rounded-full">Confirm</button>
                    <button @click="cancelTag()" class=" confirm-reject action-btn py-2 px-4 bg-neutral-200/10 rounded-full">Cancel</button>
          </div>
        </div>

      </div>

  </div>
</template>

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
  border-color: #FFC107; /* Yellow border for valid locations */
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

.floating-marker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -100%); /* Centers horizontally and adjusts vertically */
  z-index: 20;
  pointer-events: none;
  transition: transform 0.2s ease;
}

.floating-marker.hidden {
  display: none;
}

/* Make the floating marker appear to float */
@keyframes float {
  0% { transform: translate(-50%, -100%); }
  50% { transform: translate(-50%, -110%); }
  100% { transform: translate(-50%, -100%); }
}

.floating-marker {
  animation: float 2s ease-in-out infinite;
}
</style>