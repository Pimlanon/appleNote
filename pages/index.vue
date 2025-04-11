<template>
    <h1>Index</h1>
</template>

<script setup>
    definePageMeta({
        // references to middlware/auth.js 
        // when visit this page, it will run code in auth.js , before render anything of index.vue
        middleware: ['auth'] 
    })
</script>