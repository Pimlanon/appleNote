<template>
  <div class="flex bg-zinc-900 h-screen">
    <!-- sidebar -->
    <div class="bg-black w-[338px] p-8 overflow-auto">
      <Logo />

      <!-- today main container -->
      <note-card
        :notes="todayNotes"
        :dateTitle="'Today'"
        v-model:selectedNotes="selectedNotes"
      />
      <!-- today main container -->

      <!-- yesterday main container -->
      <note-card
        :notes="yesterdayNotes"
        :dateTitle="'Yesterday'"
        v-model:selectedNotes="selectedNotes"
      />
      <!-- yesterday main container -->

      <!-- earlier days main container -->
      <note-card
        :notes="earlierNotes"
        :dateTitle="'Earlier'"
        v-model:selectedNotes="selectedNotes"
      />
      <!-- earlier main container -->
    </div>
    <!-- sidebar -->

    <!-- note container -->
    <div class="w-full flex flex-col pb-8">
      <div class="flex justify-between w-full items-start p-8">
        <button
          class="inline-flex items-center space-x-2 text-xs text-[#C2C2C5] font-bold hover:text-white"
        >
          <Pen />
          <span> Create Note </span>
        </button>
        <button><Trash class="text-[#6D6D73] hover:text-white" /></button>
      </div>

      <div
        class="text-[#D4D4D4] max-w-[437px] mx-auto space-y-2 w-full flex-grow flex flex-col"
      >
        <p v-if="selectedNotes.updatedAt" class="text-[#929292] font-playfair">
          {{ formatToDDMMYYYY(selectedNotes.updatedAt) }}
        </p>
        <textarea
          v-model="updatedNote"
          name="note"
          id="note"
          class="font-playfair w-full bg-transparent focus:outline-none resize-none flex-grow"
          @input="debouncedFn"
        >
        </textarea>
      </div>
    </div>
    <!-- note container -->
  </div>
</template>

<script setup>
const updatedNote = ref("");
const notes = ref([]);
const selectedNotes = ref({});

definePageMeta({
  // references to middlware/auth.js
  // when visit this page, it will run code in auth.js , before render anything of index.vue
  middleware: ["auth"],
});

watch(selectedNotes, (newNote) => {
  updatedNote.value = newNote.text || "";
});

const debouncedFn = useDebounceFn(async () => {
  await updateNote();
  console.log("segsdgsdgsdgdsg");
}, 1000);

async function updateNote() {
  console.log("updateNote", updatedNote.value);
  try {
    await $fetch(`/api/notes/${selectedNotes.value.id}`, {
      method: "PATCH",
      body: {
        updatedNote: updatedNote.value,
      },
    });

    // get new update
    const res = await $fetch("/api/notes");
    notes.value = res;

    if (res.length > 0) {
      selectedNotes.value = res.id[selectedNotes.value.id];
      updatedNote.value = selectedNotes.value.text;
    }
  } catch (err) {
    console.log("updateNote err", err);
  }
}

const todayNotes = computed(() => {
  return notes.value.filter((note) => {
    const isToday = getRelativeDayLabel(note.updatedAt) === "today";
    console.log("note:", note.id, note.updatedAt, "-> isToday:", isToday);
    return isToday;
  });
});

const yesterdayNotes = computed(() => {
  return notes.value.filter((note) => {
    const isYesterday = getRelativeDayLabel(note.updatedAt) === "yesterday";
    console.log(
      "note:",
      note.id,
      note.updatedAt,
      "-> isYesterday:",
      isYesterday
    );
    return isYesterday;
  });
});

const earlierNotes = computed(() => {
  return notes.value.filter((note) => {
    const isEarlier = getRelativeDayLabel(note.updatedAt) === "earlier";
    console.log("note:", note.id, note.updatedAt, "-> isEarlier:", isEarlier);
    return isEarlier;
  });
});

// watchEffect(() => {
//   console.log('✅ todaysNotes:', todayNotes.value);
// });

console.log("todayNotes", todayNotes.value);

onMounted(async () => {
  const res = await $fetch("/api/notes");
  notes.value = res;

  if (res.length > 0) {
    selectedNotes.value = res[0];
    updatedNote.value = selectedNotes.value.text;
  }
  console.log("res", res);
});
</script>
