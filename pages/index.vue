<template>
  <div class="flex bg-zinc-900 h-screen">
    <!-- sidebar -->
    <div class="bg-black w-[338px] p-8 overflow-auto">
      <Logo />

      <!-- today main container -->
      <note-card
        :notes="todayNotes"
        :dateTitle="'Today'"
        v-model:selectedNote="selectedNote"
      />

      <!-- yesterday main container -->
      <note-card
        :notes="yesterdayNotes"
        :dateTitle="'Yesterday'"
        v-model:selectedNote="selectedNote"
      />

      <!-- earlier days main container -->
      <note-card
        :notes="earlierNotes"
        :dateTitle="'Earlier'"
        v-model:selectedNote="selectedNote"
      />
    </div>
    <!-- sidebar -->

    <!-- note container -->
    <div class="w-full flex flex-col pb-8">
      <div class="flex justify-between w-full items-start p-8">
        <button
          @click="createNewNote"
          class="inline-flex items-center space-x-2 text-xs text-[#C2C2C5] font-bold hover:text-white"
        >
          <Pen />
          <span> Create Note </span>
        </button>
        <button>
          <Trash @click="deleteNote" class="text-[#6D6D73] hover:text-white" />
        </button>
      </div>

      <div
        class="text-[#D4D4D4] max-w-[437px] mx-auto space-y-2 w-full flex-grow flex flex-col"
      >
        <p v-if="selectedNote.updatedAt" class="text-[#929292] font-playfair">
          {{ formatToDDMMYYYY(selectedNote.updatedAt) }}
        </p>
        <textarea
          ref="textarea"
          v-model="updatedNote"
          name="note"
          id="note"
          class="font-playfair w-full bg-transparent focus:outline-none resize-none flex-grow"
          @input="handleInput"
        >
        </textarea>
      </div>
      <button
        @click="logout"
        class="text-[#C2C2C5] hover:text-white text-sm font-bold absolute right-0 bottom-0 p-8"
      >
        Log out
      </button>
    </div>

    <!-- note container -->
  </div>
</template>

<script setup>
const updatedNote = ref("");
const textarea = ref(null);
const notes = ref([]);
const selectedNote = ref({});

definePageMeta({
  // references to middlware/auth.js
  // when visit this page, it will run code in auth.js , before render anything of index.vue
  middleware: ["auth"],
});

watch(selectedNote, (newNote) => {
  updatedNote.value = newNote.text || "";
});

function logout() {
  const jwtCookie = useCookie("appleNote");
  jwtCookie.value = null;
  navigateTo("/login");
}

async function createNewNote() {
  try {
    const newNote = await $fetch(`/api/notes`, {
      method: "POST",
      body: {
        updatedNote: "",
      },
    });

    const newNoteData = newNote.context;
    notes.value.unshift(newNoteData);
    selectedNote.value = newNoteData;
    updatedNote.value = newNoteData.text;

    // make focus when create a new one
    textarea?.value?.focus();
  } catch (err) {
    console.log("createNote err", err);
    const msg =
      err?.response?._data?.data?.message || err?.response?._data?.message;
    showErrorAlert({ message: msg });
  }
}

async function deleteNote() {
  try {
    const isConfirm = await showWarningAlert();

    if (isConfirm) {
      const res = await $fetch(`/api/notes/${selectedNote.value.id}`, {
        method: "DELETE",
      });

      if (res.data === "success") {
        const index = notes.value.findIndex((note) => {
          return note.id === selectedNote.value.id;
        });

        // delete note
        notes.value.splice(index, 1);

        // case 1: notes still exist at the same index (next note moves into that position (same idx))
        if (notes.value.length > index) {
          selectedNote.value = notes.value[index];
          updatedNote.value = notes.value[index].text;

          // case 2: delete last item, but still has other notes >> go to select the first note
        } else if (notes.value.length > 0) {
          selectedNote.value = notes.value[0];
          updatedNote.value = notes.value[0].text;

          // case 3: no notes left >> create a new note
        } else {
          createNewNote();
        }
      }
    }
  } catch (err) {
    console.log("deleteNote err", err);
    const msg =
      err?.response?._data?.data?.message || err?.response?._data?.message;
    showErrorAlert({ message: msg });
  }
}

const debouncedFn = useDebounceFn(async () => {
  await updateNote();
}, 1000);

async function updateNote() {
  try {
    await $fetch(`/api/notes/${selectedNote.value.id}`, {
      method: "PATCH",
      body: {
        updatedNote: updatedNote.value,
      },
    });
  } catch (err) {
    console.log("updateNote err", err);
    const msg =
      err?.response?._data?.data?.message || err?.response?._data?.message;
    showErrorAlert({ message: msg });
  }
}
function handleInput() {
  debouncedFn();
  selectedNote.value.text = updatedNote.value;
}

const todayNotes = computed(() => {
  return notes.value.filter((note) => {
    const isToday = getRelativeDayLabel(note.updatedAt) === "today";
    return isToday;
  });
});

const yesterdayNotes = computed(() => {
  return notes.value.filter((note) => {
    const isYesterday = getRelativeDayLabel(note.updatedAt) === "yesterday";
    return isYesterday;
  });
});

const earlierNotes = computed(() => {
  return notes.value.filter((note) => {
    const isEarlier = getRelativeDayLabel(note.updatedAt) === "earlier";
    return isEarlier;
  });
});

// watchEffect(() => {
//   console.log('todaysNotes:', todayNotes.value);
// });

onMounted(async () => {
  const res = await $fetch("/api/notes");
  notes.value = res;
  notes.value.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  if (res.length > 0) {
    selectedNote.value = res[0];
    updatedNote.value = selectedNote.value.text;

    // make focus when came to index page
    textarea?.value?.focus();
  } else {
    await createNewNote();
  }
});
</script>
