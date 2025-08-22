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
            v-model="searchQuery"
            placeholder="Ürünleri Ara"
            class="w-full overflow-hidden text-ellipsis text-sm leading-normal font-normal
              border border-[#E4E4E7] rounded-md bg-white shadow-sm
              px-3 py-1
              focus-visible:outline-none focus-visible:ring-0 "
          />
        </div>

        <!-- Buttons row with top border -->
        <div class="border-t border-[#E4E4E7] pt-6 mt-6">
        <div class="px-6 flex flex-col-reverse gap-5 sm:flex-row sm:justify-between sm:items-center">
  <div class="text-black font-inter text-sm font-medium leading-5">
    Ürünleri burada göster
  </div>
  <Button @click="showForm = true" class="font-inter flex items-center gap-2">
    <Cross />
    Add new Product
  </Button>
</div>

        </div>

       <!-- Products Table -->
<div class="px-6 mt-6" v-if="searchQuery.trim()">
  <Table>
    <TableBody>
      <TableRow v-for="(product, index) in filteredProducts" :key="index">
        <!-- IMAGE CELL with AspectRatio -->
        <TableCell class="w-[60px]">
          <div class="w-16 h-16">
            <AspectRatio :ratio="1 / 1">
              <img :src="product.image" alt="Image" class="rounded-md object-cover w-full h-full" />
            </AspectRatio>
          </div>
        </TableCell>

        <!-- PRODUCT NAME -->
        <TableCell class="truncate text-[#18181B] text-sm leading-5 font-normal font-inter">
          {{ product.name }}
        </TableCell>

        <!-- BUTTON -->
        <TableCell class="text-right">
          <Button variant="outline"  class="rounded-md bg-[#18181B] shadow-md text-[#FAFAFA] text-xs font-medium leading-4 font-inter">
            Ürünü Seç
          </Button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</div>

      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableRow
} from "@/components/ui/table"
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  Cross
} from "lucide-vue-next"
const showForm = ref(false)

// 👇 search query
const searchQuery = ref("")

// dummy products
const products = ref([
  { name: "Yeezy Boost 350 V2 Steel Beluga", image: "/Aspect Ratio.png" },
  { name: "Yeezy Boost 350 V2 Zebra", image: "/Aspect Ratio.png" },
  { name: "Yeezy Boost 350 V2 Cream White", image: "/Aspect Ratio.png" }
])

// 👇 filtered products computed
const filteredProducts = computed(() =>
  products.value.filter(p =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)
</script>
