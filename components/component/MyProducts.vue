<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal, ChevronDown, ChevronRight, CornerRightDown, ListFilter, Plus
} from "lucide-vue-next"

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Toaster, toast } from "vue-sonner"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"


import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
const showTabs = ref(false)

// dialog state
const showDeleteDialog = ref(false)
const deleteTargetId = ref<number | string | null>(null)

// alert state
const alertMessage = ref("")
const alertType = ref<"success" | "error" | "cancel" | null>(null)
const showAlert = ref(false)

// confirm delete
const confirmDelete = async () => {
  showDeleteDialog.value = false
  try {
    // yahan tum actual delete API call ya logic lagao
    const success = Math.random() > 0.5 // dummy: kabhi success, kabhi fail

    if (success) {
      alertMessage.value = "Data Removed Successfully!"
      alertType.value = "success"
    } else {
      throw new Error("Data Deletion Failed!")
    }
  } catch (error) {
    alertMessage.value = "Data Deletion Failed!"
    alertType.value = "error"
  }

  triggerAlert()
}

// cancel delete
const cancelDelete = () => {
  showDeleteDialog.value = false
  alertMessage.value = "Silme işlemi iptal edildi!"
  alertType.value = "cancel"
  triggerAlert()
}

// helper for showing alert
const triggerAlert = () => {
  showAlert.value = true
  setTimeout(() => {
    showAlert.value = false
  }, 5000) // 5 sec baad gayab
}




/** Tabs */
const activeTab = ref<"satis" | "onay">("satis")

/** Types */
type VariantAPI = {
  id: number | string
  title?: string       // e.g. "M"
  price?: string       // string price
  option1?: string
  inventory_quantity?: number
  image_id?: number | string | null
}

type ProductAPI = {
  id: number | string
  title?: string
  status?: "active" | "draft" | string
  image?: { src?: string } | null
  images?: Array<{ src?: string }>
  variants?: VariantAPI[]
}

type Variation = {
  id: number | string
  size?: string
  price?: string | number
  inventory?: number
  image?: string
  statusKey: "active" | "draft"
  statusLabel: string
}

type Product = {
  id: number | string
  title: string
  image?: string
  statusKey: "active" | "draft"
  statusLabel: string
  // quick summary for main row
  size?: string
  priceMin?: number | null
  variations: Variation[]
}

/** Data state */
const allProducts = ref<Product[]>([])
const loading = ref(true)
const errorMessage = ref("")

/** Expand/collapse (single open) */
const expanded = ref<number | string | null>(null)
const toggleExpand = (id: number | string) => {
  expanded.value = expanded.value === id ? null : id
}

/** Helpers */
const parsePrice = (v: any) => {
  const n = typeof v === "number" ? v : parseFloat(v ?? "NaN")
  return Number.isFinite(n) ? n : null
}

const formatCurrency = (v: any) => {
  const n = parsePrice(v)
  if (n === null) return "N/A"
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n)
}

const pickImage = (p: ProductAPI) => p?.image?.src || p?.images?.[0]?.src || ""

/** API fetch + normalization */
const fetchProducts = async () => {
  try {
    const config = useRuntimeConfig()
    const resp: any = await $fetch(`${config.public.baseURL}/products`)
    const arr: ProductAPI[] = Array.isArray(resp) ? resp : (resp?.products ?? [])

    allProducts.value = arr.map((p) => {
      const statusKey: "active" | "draft" = /draft/i.test(p.status || "") ? "draft" : "active"
      const statusLabel = statusKey === "active" ? "Satışta" : "Onay Bekliyor"

      const variations: Variation[] = (p.variants ?? []).map((v) => ({
        id: v.id,
        size: v.title || v.option1,
        price: v.price,
        inventory: v.inventory_quantity ?? 0,
        image: "", // per-variant image not provided in this payload (image_id exists, but no direct URL)
        statusKey,
        statusLabel
      }))

      // quick summary (first variant size, min price across variants)
      const size = p.variants?.[0]?.title || p.variants?.[0]?.option1
      const priceMin = (p.variants ?? [])
        .map((v) => parsePrice(v.price))
        .filter((n): n is number => n !== null)
        .sort((a, b) => a - b)[0] ?? null

      const product: Product = {
        id: p.id,
        title: p.title || "No title",
        image: pickImage(p),
        statusKey,
        statusLabel,
        size,
        priceMin,
        variations
      }
      return product
    })
  } catch (err: any) {
    console.error(err)
    errorMessage.value = err?.message || "Ürünler alınamadı."
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)

/** Products by active tab */
const products = computed(() =>
  allProducts.value.filter((p) =>
    activeTab.value === "satis" ? p.statusKey === "active" : p.statusKey === "draft"
  )
)

/** Actions */
const editProduct = (id: number | string) => {
  alert(`Düzenle clicked for product ID: ${id}`)
}
const deleteProduct = (id: number | string) => {
  alert(`Sil clicked for product ID: ${id}`)
}

</script>

<template>
<transition name="slide-fade">
  <div
    v-if="showAlert"
    :class="[ 
      'fixed top-12 right-12 rounded-md shadow-lg text-white px-6 py-6 transition-all flex items-start justify-between',
      alertType === 'success' ? 'bg-green-600' : 'bg-red-600'
    ]"
    style="width: 350px;"
  >
    <span>{{ alertMessage }}</span>

    <!-- Close Button -->
    <button 
      @click="showAlert = false"
      class="ml-4 text-white hover:text-white focus:outline-none"
    >
      ✖
    </button>
  </div>
</transition>

  <div class="space-y-4">
    <!-- Header Actions -->
    <div class="flex justify-between items-center mb-2.5">
      <!-- Tab Switcher -->
      <div class="relative flex bg-gray-100 rounded-lg p-1 w-[260px] overflow-hidden">
        <div
          class="absolute top-1 bottom-1 w-1/2 bg-white rounded-lg shadow transition-all duration-300"
          :class="activeTab === 'satis' ? 'left-1' : 'left-[calc(50%+4px)]'"
        />
        <button
          class="z-10 w-1/2 text-center py-2 font-medium transition-colors"
          :class="activeTab === 'satis' ? 'text-black' : 'text-gray-500'"
          @click="activeTab = 'satis'"
        >
          Satışta
        </button>
        <button
          class="z-10 w-1/2 text-center py-2 font-medium transition-colors"
          :class="activeTab === 'onay' ? 'text-black' : 'text-gray-500'"
          @click="activeTab = 'onay'"
        >
          Onay Bekleyen
        </button>
      </div>

<!-- Header Actions -->
<div class="flex justify-between items-start mb-2.5 gap-4">
  <!-- Tabs (left side, row layout) -->
  <div v-if="showTabs" class="w-auto ">
    <Tabs default-value="all" class="w-full">
      <TabsList class="flex flex-row gap-2">
   <TabsTrigger value="all">Tümü</TabsTrigger>
<TabsTrigger value="active">Aktif</TabsTrigger>
<TabsTrigger value="draft">Taslak</TabsTrigger>
<TabsTrigger value="archive">Arşiv</TabsTrigger>

      </TabsList>
    </Tabs>
  </div>

  <!-- Right Buttons -->
  <div class="flex gap-2">
    <Button
      variant="outline"
      class="flex items-center gap-2"
      @click="showTabs = !showTabs"
    >
      <ListFilter class="w-4 h-4" />
      Filter
    </Button>

    <Button class="flex items-center gap-2">
      <Plus class="w-4 h-4" />
      Ürün Ekle
    </Button>
  </div>
</div>

    </div>

    <!-- Table Section -->
    <div class="rounded-lg border border-[#E4E4E7] bg-white shadow-sm flex flex-col items-start self-stretch p-[24px]">
      <div class="gap-6 flex flex-col items-start self-stretch w-full">
        <div>
          <h2 class="text-[#09090B] font-inter text-2xl font-semibold leading-8">Ürünlerim</h2>
          <p class="text-[#71717A] font-inter text-sm leading-5">
            Ürünlerinizi yukarıdaki filtreleri kullanarak duruma göre filtreleyebilirsiniz.
          </p>
        </div>

        <!-- Loading / Error -->
        <div v-if="loading" class="text-sm text-gray-500">Yükleniyor…</div>
        <div v-else-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</div>

        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead>Ürün</TableHead>
              <TableHead>Beden</TableHead>
              <TableHead>Fiyat</TableHead>
              <TableHead>Satıcıya Kalan</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead class="text-right">İşlem</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody v-if="products.length">
            <template v-for="product in products" :key="product.id">
              <!-- Main Product Row -->
              <TableRow
                class="cursor-pointer hover:bg-gray-50 transition"
                @click="product.variations.length && toggleExpand(product.id)"
              >
                <TableCell class="flex items-center gap-3">
                  <!-- chevron space reserved -->
                  <span class="inline-block w-4">
                    <ChevronRight
                      v-if="product.variations.length && expanded !== product.id"
                      class="w-4 h-4"
                    />
                    <ChevronDown
                      v-else-if="product.variations.length && expanded === product.id"
                      class="w-4 h-4"
                    />
                  </span>
                  <div class="w-16 h-16 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                    <img
                      v-if="product.image"
                      :src="product.image"
                      alt="product"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full bg-gray-200" />
                  </div>
                  <span>{{ product.title }}</span>
                </TableCell>

                <!-- summary size = first variant size -->
                <TableCell>{{ product.size || "—" }}</TableCell>

                <!-- summary price = min variant price -->
                <TableCell>{{ product.priceMin !== null ? formatCurrency(product.priceMin) : "N/A" }}</TableCell>

                <!-- Shopify doesn't expose sellerPrice here -->
                <TableCell>-</TableCell>

                <TableCell>
                  <Badge variant="outline">{{ product.statusLabel }}</Badge>
                </TableCell>

                <TableCell class="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" class="h-8 w-8 p-0" @click.stop>
                        <MoreHorizontal class="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem @click="editProduct(product.id)">Düzenle</DropdownMenuItem>
                      <DropdownMenuSeparator />
                   <DropdownMenuItem
  @click="deleteTargetId = product.id; showDeleteDialog = true"
  class="text-red-600 bg-[#FEF2F2] hover:text-red-600 hover:bg-[#fbd0d0] focus:text-red-600 focus:bg-[#fbd0d0]"
>
  Sil
</DropdownMenuItem>



                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>

              <!-- Variation Title Row -->
              <TableRow
                v-if="expanded === product.id && product.variations.length"
                class="bg-white hover:bg-white"
              >
                <TableCell colspan="6" class="font-semibold text-sm pl-12 flex items-center gap-2">
                  Varyasyonlar
                  <CornerRightDown class="w-4 h-4 text-gray-600" />
                </TableCell>
              </TableRow>

              <!-- Variation Rows -->
              <TableRow
                v-if="expanded === product.id"
                v-for="variation in product.variations"
                :key="variation.id"
                class="bg-gray-50"
              >
                <TableCell class="pl-12 flex items-center gap-3">
                  <div class="w-12 h-12 bg-gray-200 rounded"></div>
                  <span>{{ product.title }} - {{ variation.size || "—" }}</span>
                </TableCell>
                <TableCell>{{ variation.size || "—" }}</TableCell>
                <TableCell>{{ formatCurrency(variation.price) }}</TableCell>
                <TableCell>
                  <!-- using inventory here to give useful info -->
                  <span class="text-xs text-gray-700">Stok: {{ variation.inventory ?? 0 }}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{{ variation.statusLabel }}</Badge>
                </TableCell>
                <TableCell class="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" class="h-8 w-8 p-0" @click.stop>
                        <MoreHorizontal class="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem @click="editProduct(variation.id)">Düzenle</DropdownMenuItem>
                      <DropdownMenuSeparator />
<DropdownMenuItem
  @click="deleteTargetId = product.id; showDeleteDialog = true"
  class="text-red-600 bg-[#FEF2F2] hover:text-red-600 hover:bg-[#fbd0d0] focus:text-red-600 focus:bg-[#fbd0d0]"
>
  Sil
</DropdownMenuItem>

                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            </template>
          </TableBody>

          <TableBody v-else>
            <TableRow>
              <TableCell colspan="6" class="text-center text-sm text-gray-500 py-8">
                Bu sekmede gösterilecek ürün yok.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- Bottom Left Product Count -->
      <div class="pt-4 text-sm text-gray-600 border-t border-[#E4E4E7] w-full m-0">
        Toplam {{ products.length }} Ürün
      </div>
    </div>
  </div>



  <Dialog v-model:open="showDeleteDialog">
  <DialogContent>
    <DialogHeader>
      <DialogTitle class="text-[#18181B] text-center font-inter text-lg font-semibold leading-none">Remove Listing?</DialogTitle>
      <DialogDescription class="text-[#71717A] text-center text-sm font-normal leading-5">
       Are you sure you want to remove listing?
      </DialogDescription>
    </DialogHeader>
   <DialogFooter class="flex sm:justify-center justify-center gap-2 items-center">
  <Button variant="destructive" @click="confirmDelete" class="w-full rounded-md bg-[#18181B] shadow text-[#FAFAFA] font-medium text-sm leading-5 font-inter">Remove Listing</Button>
</DialogFooter>

  </DialogContent>
</Dialog>


</template>

