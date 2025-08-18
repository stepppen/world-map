<template>
    <div class="h-full overflow-hidden">
        <NavigationTab 
        @add-tag="addTag" 
        @confirm-tag="initiateSave"
        @remove-tag="removeTag" 
        :showConfirmCancel="showConfirmCancel"
        :showAddTag="showAddTag"
         />
        
        <Maptiler 
        :currentMode="currentMode"
        :floatingText="floatingText" 
        :showFloatingMarker="showFloatingMarker"
        :borderHasLocation="borderHasLocation"
        :cardExpanded="cardExpanded"
        @update-floating-text="val => floatingText = val"
        @confirmed-marker="handleConfirmedMarker"
        />
    </div>
</template>

<script setup>

let showConfirmCancel = ref(false)
let showAddTag = ref(true)
let showFloatingMarker = ref(false);
const cardExpanded = ref(false);
const borderHasLocation = ref(false);
let currentMode = ref("")
const floatingText = ref("Move the map");
const selectedMarkerData = ref(null);





function addTag() {
  cardExpanded.value = false;
  showConfirmCancel.value = true
  showAddTag.value = false
  showFloatingMarker.value = true;
  currentMode.value = "floating";
  borderHasLocation.value = true;
}

const handleConfirmedMarker =  (markerData) => {
  selectedMarkerData.value = markerData;
};

const initiateSave = async () => {
    currentMode.value = "confirmed";
    showConfirmCancel.value = false
    showAddTag.value = true
    showFloatingMarker.value = false;
}



// const saveMarkerToFirebase = async (markerDataToSave) => {
//       if (!markerDataToSave) {
//         console.error("No marker data to confirm!");
//         return;
//     }
// };


function removeTag() {
    cardExpanded.value = false;
    showConfirmCancel.value = false
    showAddTag.value = true
    showFloatingMarker.value = false;
}
</script>