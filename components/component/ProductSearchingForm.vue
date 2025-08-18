<template>
  <div class="space-y-6">
    <!-- Ürün Ekle -->
    <Card>
      <CardHeader>
       <CardTitle class="text-[#09090B] font-inter text-2xl font-semibold leading-8">
  Ürün Ekle
</CardTitle>

<CardDescription class="text-gray-500 font-inter text-sm font-normal leading-5">
  Aşağıdan eklemek istediğiniz ürünün adını arayabilirsiniz.
</CardDescription>

      </CardHeader>
  <CardContent class="px-0">
  <div class="space-y-4 px-6">
    <!-- Search Input -->
    <Input
  placeholder="Ürünleri Ara"
  class="w-full overflow-hidden text-ellipsis text-sm leading-normal font-normal
         border border-[#E4E4E7] rounded-md bg-white shadow-sm
         px-3 py-1
          focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none"
/>

  </div>
  
    <!-- Buttons row with top border -->
    <div class=" border-t border-[#E4E4E7] pt-6 mt-6">
        <div class="px-6 flex justify-between items-center ">
      <div class="text-black font-inter text-sm font-medium leading-5">Ürünleri burada göster</div>
      <Button @click="showForm = true" class="font-inter"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <g clip-path="url(#clip0_326_5807)">
    <path d="M7.3335 1.33301C6.97987 1.33301 6.64074 1.47348 6.39069 1.72353C6.14064 1.97358 6.00016 2.31272 6.00016 2.66634V5.99967H2.66683C2.31321 5.99967 1.97407 6.14015 1.72402 6.3902C1.47397 6.64025 1.3335 6.97939 1.3335 7.33301V8.66634C1.3335 9.39967 1.9335 9.99967 2.66683 9.99967H6.00016V13.333C6.00016 14.0663 6.60016 14.6663 7.3335 14.6663H8.66683C9.02045 14.6663 9.35959 14.5259 9.60964 14.2758C9.85969 14.0258 10.0002 13.6866 10.0002 13.333V9.99967H13.3335C13.6871 9.99967 14.0263 9.8592 14.2763 9.60915C14.5264 9.3591 14.6668 9.01996 14.6668 8.66634V7.33301C14.6668 6.97939 14.5264 6.64025 14.2763 6.3902C14.0263 6.14015 13.6871 5.99967 13.3335 5.99967H10.0002V2.66634C10.0002 2.31272 9.85969 1.97358 9.60964 1.72353C9.35959 1.47348 9.02045 1.33301 8.66683 1.33301H7.3335Z" stroke="#FAFAFA" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_326_5807">
      <rect width="16" height="16" fill="white"/>
    </clipPath>
  </defs>
</svg>Add new Product</Button>
    </div>
    </div>
</CardContent>

    </Card>

    
  </div>
</template>

<script setup>
import { ref } from "vue"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const showForm = ref(false)

const form = ref({
  name: "",
  price: "",
  stock: "",
  sku: "",
  description: ""
})

function saveProduct() {
  console.log("Product Saved:", form.value)
}
</script>
