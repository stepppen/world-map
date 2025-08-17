<template>
    <div class="h-full overflow-hidden">
        <NavigationTab 
        @add-tag="addTag" 
        @confirm-tag="confirmTag" 
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

function addTag() {
  cardExpanded.value = false;
  showConfirmCancel.value = true
  showAddTag.value = false
  showFloatingMarker.value = true;
  currentMode.value = "floating";
  borderHasLocation.value = true;
}

const confirmTag = () => {
    currentMode.value = "confirmed";
    // console.log("confirm")
    showConfirmCancel.value = false
    showAddTag.value = true
    showFloatingMarker.value = false;
    //---DB logic
    // const { error } = await client.from('markerCard').insert({
    //   place: floatingText.value,
    //   latitude: lat,
    //   longitude: lng,
    // }).select().single()
    // if (error) throw error
}

function removeTag() {
    cardExpanded.value = false;
    showConfirmCancel.value = false
    showAddTag.value = true
    showFloatingMarker.value = false;
}
</script>