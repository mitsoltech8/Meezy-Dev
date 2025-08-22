<script setup>
import { ref, computed } from 'vue'

const listeFiyatı = ref('')
const kargoÜcreti = 50   // TL
const komisyon = 30      // TL

const kazanc = computed(() => {
  if (!listeFiyatı.value) return null

  const parsedPrice = parseFloat(
    listeFiyatı.value.replace('.', '').replace(',', '.')
  ) || 0
  
  const result = parsedPrice - kargoÜcreti - komisyon
  return result.toLocaleString('tr-TR', { minimumFractionDigits: 2 })
})
</script>

<template>
  <div class="rounded-lg border border-[#E4E4E7] bg-white shadow-sm">
    <div class="p-6 m-0">
      <!-- Heading -->
      <div class="mb-9">
        <h2 class="text-[#09090B] font-inter text-2xl  font-semibold leading-8">
          Ürün Fiyatını Gir
        </h2>
        <p class="text-[#71717A] font-inter text-sm font-normal leading-5 mt-1.5">
          Seçilen varyant için fiyat belirleyin: Yeezy Boost 350 V2 Steel Beluga Beden 44,5
        </p>
      </div>

      <!-- Price Input -->
       <div class="flex flex-col gap-2">
      <label class="text-[#18181B] font-inter text-sm font-medium leading-none">
        Liste Fiyatınız (TL):
      </label>
      <input
        v-model="listeFiyatı"
        type="text"
        class="w-full px-3 py-2 focus:outline-none focus:ring focus:ring-black rounded-md border border-[#E4E4E7] bg-white shadow-sm max-w-[600px]"
        placeholder="örn. 300,00"
      />

      <p class="text-[#71717A] font-inter text-sm font-normal leading-5 mt-1.5">
        Fiyatınız, bu varyantın mevcut Shopify fiyatı (2990 TL) ile karşılaştırılacaktır.
      </p>
      </div>
    </div>

    <!-- Kazanç Section -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-6 border-t border-[#E4E4E7] px-6 py-4">
  <p class="flex items-center">
    <strong class="text-[#18181B] font-inter text-sm font-medium leading-none">Kazanç:</strong>
    <span v-if="kazanc !== null" class="text-[#18181B] font-roboto text-[22px] font-medium leading-[28px] tracking-[0]">{{ kazanc }} TL</span>
    <span v-else class="text-[#71717A] font-inter text-sm font-normal leading-5">(listeFiyatı - kargoÜcreti - komisyon)</span>
  </p>
  <div class="flex gap-2">
    <button class="px-4 py-2 rounded-md border border-[#E4E4E7] bg-[#F4F4F5] shadow-sm">Fiyat En Düşüğe Ayarla</button>
    <button class="px-4 py-2 rounded-md bg-[#18181B] shadow text-white">Varyantı Seç</button>
  </div>
</div>

  </div>
</template>
