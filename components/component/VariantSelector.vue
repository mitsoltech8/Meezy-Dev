<template>
  <div class="rounded-lg border border-[#E4E4E7] bg-white shadow-sm">
    <div class="p-6 m-0">
      <!-- Heading -->
      <div class="mb-[40px]">
        <h2 class="text-[#09090B] font-inter text-2xl not-italic font-semibold leading-8 mb-1">
          Ürün Varyantı Seç
        </h2>
        <p class="text-[#71717A] font-inter text-sm not-italic font-normal leading-5">
          Belirli varyantı seçin
        </p>
      </div>

      <!-- Product Info -->
      <div class="flex items-center gap-5 mb-[40px]">
        <div class="w-16">
          <AspectRatio :ratio="1/1">
            <img src="/Aspect Ratio.png" alt="Image" class="rounded-md object-cover w-full h-full">
          </AspectRatio>
        </div>
        <span class="overflow-hidden text-[#18181B] text-ellipsis whitespace-nowrap font-inter text-sm not-italic font-normal leading-5">
          Yeezy Boost 350 V2 Steel Beluga
        </span>
      </div>

      <!-- Size Selector -->
      <div>
        <p class="text-[#71717A] font-inter text-sm not-italic font-normal leading-5 mb-6">
          Beden Varyantı Seçin:
        </p>
<div class="grid grid-cols-4  max-[555px]:grid-cols-3 max-[445px]:grid-cols-2 gap-6 w-full md:w-fit">
  <Button
    v-for="size in sizes"
    :key="size"
    variant="outline"
    class="rounded-md border border-[#E4E4E7] bg-white shadow-md flex w-[100px] h-12 px-3 py-2 justify-center items-center gap-2 max-[445px]:w-auto"
    :class="selected === size ? 'bg-black text-white hover:bg-black hover:!text-white' : ''"
    @click="selected = size"
  >
    {{ size }}
  </Button>
</div>

      </div>
    </div>

    <!-- Action Button -->
    <div class="flex justify-end border-t border-[#E4E4E7] px-6 py-4">
      <Button class="bg-black text-white hover:bg-black/90">
        Varyantı Seç
      </Button>
    </div>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { ref } from 'vue'

const sizes = [
  "35.5","36","36.5","37.5","38","38.5","39","40",
  "40.5","41","42","42.5","43","44","44.5","45",
  "45.5","46","47","47.5","48","48.5","49.5","50",
  "50.5","51","51.5","52.5"
]
const selected = ref(null)
</script>
