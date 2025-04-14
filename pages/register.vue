<template>
  <div class="flex bg-black h-screen">
    <!-- sidebar -->
    <div class="bg-zinc-900 w-[516px] p-8 flex flex-col justify-center">
      <Logo />
      <h1 class="text-white font-bold text-lg mt-8">
        Sign up for a free account
      </h1>
      <p class="text-zinc-300 mt-0.5 text-sm">
        Already registered?
         <nuxt-link to="/login" class="font-bold text-[#FFAC00]"> Log in </nuxt-link>
        to your account
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
            <span>Sign Up</span> <ArrowRight />
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
    const response = await $fetch("/api/user", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
      },
    });

    console.log("res", response);
    const isConfirm =  await showSuccessAlert({message: 'account created successfully'})
    if (isConfirm) {
      navigateTo('/')
    }
  } catch (error) {
    console.log("error", error?.response);
    const msg = error?.response?._data?.message;
    showErrorAlert({ message: msg });
  }
}
</script>
