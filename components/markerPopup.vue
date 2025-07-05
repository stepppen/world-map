<template>
  <div class="card bg-neutral-200/10" :style="{ transform: `scale(${sizeChange})` }">
    <div class="flex justify-between">
      <div>
        <h2>{{ text }}</h2>
        <input type="date" v-model="date" name="image-time">
      </div>
      <button @click="onCancel"><span class="material-symbols-outlined">
close
</span></button>
    </div>
    <div class="image-frame aspect-square mask-cover">
      <img src="/landscape-placeholder.svg" class="hidden" alt="couples image" ref="chosenPic"> 
    </div>
    <UButton icon="i-lucide-sun" variant="subtle">Button</UButton>
    <label :for="uniqueId">update image</label>
    <input type="file" class="hidden" accept="image/*" :id="uniqueId" ref="inputFile" @change="onFileChange">
    <!-- <button @click="onDelete" class="cardButton">Delete Card</button> -->
    <button @click="onDelete" class="cardButton">Save</button>
    

  </div>
</template>

<script setup lang="ts">
import { useMapStore } from '@/stores/mapStore'
const mapStore = useMapStore()

const { text } = defineProps<{ text: string }>();

const date = ref('2018-07-22');
const chosenPic = ref<HTMLImageElement | null>(null);
const inputFile = ref<HTMLInputElement | null>(null);

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
    let newScale = scale(mapStore.zoomLevel, 4, 14, 0.1, 0.8);
    return newScale;
})

function onSave() {
  alert('Save clicked!');
}

function onCancel() {
  alert('Cancel clicked!');
}

function onDelete() {
  alert('Delete clicked!');
}

</script>

<style>
/* CARD UI  */
.card{
  transform-origin: bottom center;
  padding: 1rem;
  border-radius: 5%;
  text-align: center;
  color: rgb(184, 184, 184);
  border: 1px solid rgb(129, 129, 129);
  transition: 0.3s ease-in-out;
  backdrop-filter: blur(var(--blur-md));
}

.card img{
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card h2{
  padding: 1rem;
  border-radius: 10%;
  margin-bottom: 1rem;

}

.image-frame{
  width: 200px;
  height: 200px;
  padding: 1rem;
  border-radius: 10%;
  margin-bottom: 1rem;
  border: white dashed 1px;
}
label {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
    background:rgb(36, 25, 247, 0.2);
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
</style>