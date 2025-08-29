<script setup>
import { ref, onMounted, defineProps } from 'vue'
import axios from 'axios'

// Add defineProps to receive the id as a prop
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const product = ref(null)
const sizes = ref([])
const selectedSize = ref(null)

onMounted(async () => {
  loading.value = true
  try {
    const res = await axios.get(`http://localhost:4000/api/products/${productId}`)
    console.log('Product data:', res.data)
    product.value = res.data
    console.log('Finding variant with ID:', variantId)
    variant.value = product.value.variants.find(v => String(v.id) === String(variantId))
    console.log('Found variant:', variant.value)
  } catch (err) {
    console.error(err)
    variant.value = null
  } finally {
    loading.value = false
  }
})

</script>



<template>
  <div class="rounded-lg border border-[#E4E4E7] bg-white shadow-sm p-6">
    <h2 class="text-2xl font-semibold mb-4">{{ product?.title }}</h2>
    <div class="flex items-center gap-5 mb-6">
      <img :src="product?.image || '/default-image.png'" class="w-16 h-16 rounded-md object-cover" />
    </div>

    <p class="text-gray-500 mb-2">Beden Varyantı Seçin:</p>
    <div class="grid grid-cols-4 gap-4">
      <button
        v-for="size in sizes"
        :key="size"
        @click="selectedSize = size"
        :class="selectedSize === size ? 'bg-black text-white' : 'bg-white text-black border border-gray-300'"
        class="px-3 py-2 rounded-md"
      >
        {{ size }}
      </button>
    </div>

    <div class="mt-4">
      <p v-if="selectedSize">Seçilen Beden: {{ selectedSize }}</p>
    </div>
  </div>
</template>
