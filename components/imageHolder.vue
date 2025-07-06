<!-- <template>
    <div v-if="isOpen" class="card bg-neutral-200/10" :style="{ transform: `scale(${sizeChange})` }">
    <div class="rounded-full bg-neutral-200/10 position-marker"></div>
    <div class="flex justify-between">
      <div>
        <h2>{{ text }}</h2>
        <input type="date" v-model="date" name="image-time">
      </div>
      <div class="flex gap-16"> 
        <UButton icon="material-symbols:edit-outline" variant="subtle" @click="wasSaved = !wasSaved"></UButton>
        <UButton icon="material-symbols:close-rounded" variant="subtle"  @click="isOpen = !isOpen"></UButton>
      </div>
    </div>
    <div class="image-frame aspect-square mask-cover">
      <img src="/landscape-placeholder.svg" alt="couples image" ref="chosenPic"> 
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{text: string, divClass: string, isHidden?: boolean, mode: 'floating' | 'confirmed'}>();
</script> -->