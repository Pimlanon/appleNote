<template>
  <div class="flex bg-zinc-900 h-screen">
    <!-- sidebar -->
    <div class="bg-black w-[516px] p-8 flex flex-col justify-center">
      <Logo />
      <h1 class="text-white font-bold text-lg mt-8">
        Log in to your account
      </h1>
      <p class="text-zinc-300 mt-0.5 text-sm">
        Don't have an account? 
        <nuxt-link to="/register" class="font-bold text-[#FFAC00]"> Sign up </nuxt-link>
      </p>

      <form @submit.prevent="submit">
        <div class="mt-8">
          <label for="" class="text-zinc-300 text-sm block mb-0.5"
            >Email Address</label
          >
          <input
            v-model="email"
            type="email"
            class="block w-full bg-[#27272A] border border-[#3F3F46] rounded text-white text-sm px-4 py-2 placeholder:text-zinc-500"
            placeholder="you@example.com"
          />
        </div>

        <div class="mt-6">
          <label for="" class="text-zinc-300 text-sm block mb-0.5"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            class="block w-full bg-[#27272A] border border-[#3F3F46] rounded text-white text-sm px-4 py-2 placeholder:text-zinc-500"
            placeholder="*********"
          />
        </div>

        <!-- sign up btn -->
        <div>
          <button
            class="w-full mt-4 bg-[#FFAC00] rounded-full px-4 py-2 text-sm font-bold flex justify-center items-center space-x-2"
          >
            <span>Log in </span> <ArrowRight />
          </button>
        </div>
        <!-- sign up btn -->
      </form>
    </div>
    <!-- sidebar -->

    <!-- note introduction -->
    <div></div>
    <!-- note introduction -->
  </div>
</template>

<script setup>
const email = ref("");
const password = ref("");

async function submit() {
  try {
     await $fetch("/api/login", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
      },
    });

    const isConfirm =  await showSuccessAlert({message: 'logged in successfully'})
    if (isConfirm) {
      navigateTo('/')
    }
  } catch (error) {
    console.log("error", error?.response);
    const msg = error?.response?._data?.data?.message || error?.response?._data?.message;
    showErrorAlert({ message: msg });
  }
}
</script>