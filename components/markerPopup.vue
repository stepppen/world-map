<template>
  <div class="card bg-neutral-200/10">
    <h2>{{ text }}</h2>
    <input type="date" v-model="date" name="image-time">
    <img src="/landscape-placeholder.svg" alt="couples image" ref="chosenPic"> 
    <label for="marker-file-input">update image</label>
    <input class="hidden" type="file" accept="image/*" id="marker-file-input" ref="inputFile" @change="onFileChange">
    <button @click="onSave">Save</button>
    <button @click="onCancel">Cancel</button>
    <button @click="onDelete">Delete</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ text: string, zoomLevel: number }>();

const date = ref('2018-07-22');
const chosenPic = ref<HTMLImageElement | null>(null);
const inputFile = ref<HTMLInputElement | null>(null);

function onFileChange() {
  if (inputFile.value && inputFile.value.files && inputFile.value.files[0] && chosenPic.value) {
    chosenPic.value.src = URL.createObjectURL(inputFile.value.files[0]);
  }
}

const sizeChange = computed(() =>{

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
  padding: 1rem;
  border-radius: 10%;
  margin-bottom: 1rem;

}
label {
    display: block;
    background:rgb(36, 25, 247);
    color: white;
    padding: 1rem;
    margin: 10px auto;
    border-radius: calc(infinity * 1px);
    cursor:pointer;
}
</style>