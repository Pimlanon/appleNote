<template>
  <div>
    <p class="font-xs font-bold text-[#C2C2C5] mt-12 mb-4">{{ dateTitle }}</p>

    <div class="ml-4 space-y-2">
      <div
        v-for="note in notes"
        v-bind:key="note?.id"
        class="p-2 rounded-lg cursor-pointer"
        :class="{
          'bg-[#A1842C]': note?.id === selectedNote?.id,
          'hover:bg-[#A1842C]/50': note?.id !== selectedNote?.id,
        }"
        @click="emit('update:selectedNote', note)"
      >
        <h3 class="text-sm font-bold text-[#F4F4F5] truncate">
          {{ note.text.substring(0, 50) }}
        </h3>
        <div class="leading-none truncate text-[#D6D6D6]">
          <span class="text-xs text-[#F4F4F5] mr-4">{{
            formatToDDMMYYYY(note.updatedAt)
          }}</span>
          <span v-if="note.text.length > 50" class="text-xs">
            {{ "..." + note.text.substring(50, 100) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  notes: Array,
  dateTitle: String,
  selectedNote: Object,
});

const emit = defineEmits(["update:selectedNote"]);
// watch(() => props.notes, (newVal) => {
//   console.log('notes changed to', newVal);
// });
</script>
