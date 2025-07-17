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
      <img @click="isOpen = !isOpen" src="/landscape-placeholder.svg" alt="couples image" ref="chosenPic"> 
      <div class="hovered-square flex justify-center items-center" @click="wasSaved = !wasSaved">
        <UButton class="edit-button" icon="material-symbols:edit-outline" variant="subtle" ></UButton>
      </div>
    </div>
    

    <div v-if="!wasSaved && isOpen">
      
      <label :for="uniqueId">update image</label>
      <input type="date" v-model="date" name="image-time">
      <input type="file" class="hidden" accept="image/*" :id="uniqueId" ref="inputFile" @change="onFileChange">
      <button @click="onDelete" class="cardButton">Delete Card</button>
      <button @click="onSave" class="cardButton">Save</button>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { useMapStore } from '@/stores/mapStore'
import { ref, getCurrentInstance } from 'vue'
const mapStore = useMapStore()

const props = defineProps<{
  text: string,
  marker: google.maps.marker.AdvancedMarkerElement | null,
  unmount: () => void
}>()


const date = ref('2018-07-22');
const chosenPic = ref<HTMLImageElement | null>(null);
const inputFile = ref<HTMLInputElement | null>(null);
let isOpen = ref(true);
let wasSaved = ref(false);

const instance = getCurrentInstance()
const uuid = ref(instance.uid)


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

function onSave() {
  wasSaved.value = true;

}

function onDelete() {
  props.marker.map = null; 
  props.unmount();         
}


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