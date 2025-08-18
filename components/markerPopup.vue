<template>
  <div  class="card bg-neutral-200/10" :style="{ transform: `scale(${sizeChange})` }">
    <div class="rounded-full bg-neutral-200/10 position-marker"></div>
    <div class="flex justify-between">
      <div>
        <h2>{{ text }}</h2>
        <p>{{ date }}</p>
        
      </div>

      <!-- <div class="flex gap-16"> 
        <UButton class="edit-button opacity-0" icon="material-symbols:edit-outline" variant="subtle" @click="wasSaved = !wasSaved"></UButton>
        <UButton icon="material-symbols:close-rounded" variant="subtle"  @click="isOpen = !isOpen"></UButton>
      </div> -->
    </div>
    <div class="image-frame aspect-square mask-cover">
      <img @click="isOpen = !isOpen" :src="imageSrc || '/landscape-placeholder.svg'" alt="couples image" ref="chosenPic"> 
      <!-- <div class="hovered-square flex justify-center items-center" @click="wasSaved = !wasSaved">
        <UButton class="edit-button" icon="material-symbols:edit-outline" variant="subtle" ></UButton>
      </div> -->
    </div>
    

    <div v-if="isOpen">
      
      <label :for="uniqueId">update image</label>
      <input type="date" v-model="date" name="image-time">
      <input type="file" class="hidden" accept="image/*" :id="uniqueId" ref="inputFile" @change="onFileChange">
      <button @click="onDelete" class="cardButton">Delete Card</button>
      <button @click="onSave" class="cardButton">Save</button>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app';
import * as maptilersdk from '@maptiler/sdk';
import { useMapStore } from '@/stores/mapStore'
import { ref, getCurrentInstance } from 'vue'
import { ref as dbRef, update, remove as deleteDb, get } from 'firebase/database'; // 'get' is for reading
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import type { FirebaseStorage } from 'firebase/storage';
const mapStore = useMapStore()
// const { $firebaseDb } = useNuxtApp();
const props = defineProps<{
  text: string,
  marker?: maptilersdk.Marker | null,
  markerData?: object,
  markerId: string,
  imageSrc?: string,
  isOpen?: boolean
  unmount: () => void
}>()

const { $firebaseDb, $firebaseApp } = useNuxtApp();
const storage: FirebaseStorage = getStorage($firebaseApp);


const date = ref(new Date().toISOString().split('T')[0]);
const chosenPic = ref<HTMLImageElement | null>(null);
const inputFile = ref<HTMLInputElement | null>(null);
let isOpen = ref(props.isOpen ?? false);
// let wasSaved = ref(false);
let emit = defineEmits(['complete-save'])


// Generate a unique id for this instance
const uniqueId = `marker-file-input-${Math.random().toString(36).slice(2)}`;

function onFileChange() {
  if (inputFile.value && inputFile.value.files && inputFile.value.files[0] && chosenPic.value) {
    chosenPic.value.src = URL.createObjectURL(inputFile.value.files[0]);

  }
}

function scale (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

const sizeChange = computed(() =>{
    let newScale = scale(mapStore.zoomLevel, 4, 14, 0.2, 1);
    return newScale;
})

const onDelete = async () => {
  
  if (!props.markerId) {
    console.warn("Cannot delete: markerId is not available.");
    props.unmount();
    return;
  }

  const markerDataRef = dbRef($firebaseDb, `locations/${props.markerId}`);

  try {
    // 1. Get current data to check for image URL
    const snapshot = await get(markerDataRef);
    const data = snapshot.val();

    if (data && data.imageUrl) {
      // 2. Delete image from Cloud Storage
      
      const imageStorageRef = storageRef(storage, data.imageUrl);
      try {
        await deleteObject(imageStorageRef);
        console.log("Image deleted from storage.");
      } catch (error) {
        console.error("Error deleting image from storage:", error);
        // Continue to delete DB entry even if image deletion fails
      }
    }

    // 3. Delete entry from Realtime Database
    await deleteDb(markerDataRef);
    console.log("Marker entry deleted from Realtime Database.");
    props.unmount(); // Unmount the popup after successful deletion
  } catch (error) {
    console.error("Error deleting marker:", error);
    // Handle error, maybe show a toast message
  }
};


const onSave = async () => {
  console.log(getStorage)
  isOpen.value = false;
  let imageUrl: string | null = null; // Initialize to null

  // Ensure we have a markerId to update
  if (!props.markerId) {
    console.error("Cannot save: markerId prop is missing.");
    emit('complete-save', false);
    return;
  }

  // 1. Upload image to Cloud Storage if a file is selected
  if (inputFile.value && inputFile.value.files && inputFile.value.files[0]) {
    const file = inputFile.value.files[0];
    // Create a unique path for the image in storage using the markerId
    const imagePath = `marker_images/${props.markerId}/${file.name}`;
    const imageStorageRef = storageRef(storage, imagePath);

    try {
      const snapshot = await uploadBytes(imageStorageRef, file);
      imageUrl = await getDownloadURL(snapshot.ref);
      console.log("Image uploaded to Cloud Storage:", imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      // Even if image upload fails, try to save other data
    }
  }

  // 2. Update the existing marker data in Realtime Database
  const markerRef = dbRef($firebaseDb, `locations/${props.markerId}`);
  const updates: { [key: string]: any } = {
    date: date.value, // Save the selected date
  };

  if (imageUrl) {
    updates.imageUrl = imageUrl; // Add the image URL if uploaded successfully
  }

  try {
    await update(markerRef, updates); // Use 'update' to merge new data into the existing record
    console.log("Marker data updated in Realtime Database.");
    emit('complete-save', true); // Emit success
  } catch (error) {
    console.error("Error updating marker in Realtime Database:", error);
    emit('complete-save', false); // Emit failure
    // Handle the error (e.g., show a user notification)
  }
};
</script>


<style>
/* CARD UI  */
.card{
  transform-origin: bottom center;
  padding: 1rem;
  border-radius: 15px;
  text-align: center;
  color: rgb(184, 184, 184);
  border: 1px solid rgb(129, 129, 129);
  transition: 0.3s ease-in-out;
  backdrop-filter: blur(var(--blur-md));
}

img{
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.card h2{
  padding: 1rem;
  border-radius: 10%;
  margin-bottom: 1rem;

}

/* HOVER EDIT FIELD */
.hovered-square{
  opacity: 0;
  transition: 150ms ease-in-out;
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 10px;
  background-color: rgb(0,0,0,0.5);
}

.edit-button{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.image-frame{
  position: relative;
  display: block;
  width: 200px;
  height: 200px;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.image-frame:hover .hovered-square {
  opacity: 1;
}

label {
    display: block;
    /* position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); */
    cursor: pointer;
    background:rgb(36, 25, 247);
    color: white;
    padding: 1rem;
    margin: 10px auto;
    border-radius: calc(infinity * 1px);
    cursor:pointer;
}

.cardButton{
  width: 100%;
    display: block;
    background:rgb(205, 16, 69);
    color: white;
    padding: 1rem;
    margin: 10px auto;
    border-radius: calc(infinity * 1px);
    cursor:pointer;
}

.position-marker{
  position: absolute;
  width: 20px;
  height: 20px;
  border: rgb(199, 199, 199) solid 1px;
  left: 50%;
  top: 102%;
  transform: translateX(-10px);
}
</style>