<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from '#imports'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/component/AppSidebar.vue";
import { ChevronRight } from 'lucide-vue-next';

const route = useRoute()
const router = useRouter()

const productId = ref(route.params.id)
const product = ref(null)
const selectedVariant = ref(null)
const loading = ref(true)

// Variant details
const variantDetails = computed(() => {
  if (!selectedVariant.value) return []
  return [
    { label: 'Ağırlık', value: `${selectedVariant.value.weight || '0'} ${selectedVariant.value.weight_unit || 'kg'}` },
    { label: 'Vergi', value: selectedVariant.value.taxable ? 'Vergili' : 'Vergisiz' },
    { label: 'Kargo', value: selectedVariant.value.requires_shipping ? 'Gerekli' : 'Gerekmez' },
    { label: 'Stok Politikası', value: selectedVariant.value.inventory_policy === 'deny' ? 'Reddet' : 'İzin Ver' }
  ]
})

// Select variant
const selectVariant = (variant) => {
  selectedVariant.value = variant
}

// Navigate to price form
const navigateToPriceForm = () => {
  if (selectedVariant.value && product.value) {
    router.push({
      path: '/priceform',
      query: {
        productId: product.value.id,
        productTitle: product.value.title,
        variantId: selectedVariant.value.id,
        variantSize: selectedVariant.value.option1 || selectedVariant.value.title,
        currentPrice: selectedVariant.value.price
      }
    })
  }
}

// Confirm selection
const confirmSelection = () => {
  if (selectedVariant.value) {
    console.log('Selected variant:', selectedVariant.value)
  }
}

// Fetch product by ID
const fetchProduct = async (id) => {
  if (!id) return
  loading.value = true
  try {
    const response = await $fetch('http://localhost:4000/api/products')
    const foundProduct = response.products.find(p => String(p.id) === String(id))
    if (!foundProduct) throw new Error('Product not found')
    product.value = foundProduct
    selectedVariant.value = foundProduct.variants?.[0] || null
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Initial fetch
onMounted(() => fetchProduct(productId.value))

// SPA route change handling
onBeforeRouteUpdate((to) => {
  productId.value = to.params.id
  fetchProduct(productId.value)
})

// Breadcrumb helpers
const pathSegments = computed(() => route.path.split('/').filter(Boolean))
const generateHref = (index) => '/' + pathSegments.value.slice(0, index + 1).join('/')
const formatSegment = (segment) => decodeURIComponent(segment.replace(/-/g, ' ')).replace(/^\w/, c => c.toUpperCase())
</script>

<template>
  <div class="flex bg-gray-50 min-h-screen">
    <SidebarProvider>
      <AppSidebar />
      <main class="w-full p-4 m-3 bg-white rounded-xl shadow">

        <!-- Top Bar -->
        <div class="flex items-center gap-4 p-4">
          <SidebarTrigger />
          <svg xmlns="http://www.w3.org/2000/svg" width="2" height="16" viewBox="0 0 2 16" fill="none">
            <path d="M1 0.5V15.5" stroke="#E4E4E7"/>
          </svg>

          <!-- Breadcrumb -->
          <Breadcrumb>
            <BreadcrumbList class="flex items-center gap-2 text-sm font-sans text-gray-500">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" class="hover:text-gray-700">Satıcı Paneli</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="mx-1"><ChevronRight /></BreadcrumbSeparator>

              <template v-for="(segment, index) in pathSegments" :key="index">
                <BreadcrumbItem :isCurrentPage="index === pathSegments.length - 1">
                  <BreadcrumbLink 
                    :href="generateHref(index)"
                    :class="index === pathSegments.length - 1 ? 'text-gray-900 font-medium' : 'hover:text-gray-700'"
                  >
                    {{ formatSegment(segment) }}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator v-if="index !== pathSegments.length - 1" class="mx-1"><ChevronRight /></BreadcrumbSeparator>
              </template>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <!-- Content -->
<div class="min-h-screen ">
    <div class="max-w-full mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- Header -->
      <div class="px-4 sm:px-6 pt-6 mb-10">
        <h2 class="text-[#09090B] font-inter text-2xl sm:text-3xl font-semibold leading-8 mb-1 truncate">
          Ürün Varyantı Seç
        </h2>
        <p class="text-[#71717A] font-inter text-sm sm:text-base font-normal leading-5">
          Belirli varyantı seçin
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-6 text-center text-gray-500">Yükleniyor...</div>

      <!-- Product Info -->
      <div v-else class=" pb-6 border-b border-gray-200">
        <div class="px-4 sm:px-6 ">
        <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div class="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
            <img
              v-if="product?.image?.src"
              :src="product.image.src"
              :alt="product.title"
              class="w-16 h-16 rounded object-cover"
            />
            <span v-else class="text-gray-500 text-sm">Resim</span>
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-[#18181B] font-inter text-sm sm:text-base font-normal leading-5 truncate">{{ product?.title }}</h2>
            <p class="text-gray-600 font-inter text-[12px] sm:text-sm truncate">{{ product?.vendor }}</p>
          </div>
        </div>

        <!-- Variant Buttons -->
        <p class="text-[#71717A] font-inter text-sm sm:text-base font-normal leading-5 mt-6 mb-4">
          Beden Varyantı Seçin:
        </p>
        <div class="flex flex-wrap gap-4 mb-6">
          <button
            v-for="variant in product?.variants"
            :key="variant.id"
            @click="selectVariant(variant)"
            :class="[
              'rounded-md border border-[#E4E4E7] shadow-md flex justify-center items-center gap-2 px-3 py-2 w-[100px] sm:w-[120px]',
              selectedVariant?.id === variant.id
                ? 'border-black bg-black text-white font-bold'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            ]"
          >
            {{ variant.option1 || variant.title }}
          </button>
        </div>

        <!-- Selected Variant Info -->
        <div v-if="selectedVariant" class="bg-gray-50 rounded-lg p-4 mb-6 mt-9 overflow-x-auto">
          <p class="font-semibold text-gray-900 mb-6">Seçilen Varyant</p>

          <!-- Variant Table -->
          <div class=" grid grid-cols-1 sm:grid-cols-5 gap-2 text-sm mb-4 text-center">
            <div class="flex flex-col gap-2">
              <div class="font-semibold text-gray-700 p-2 bg-gray-100 rounded">Ölçü</div>
              <div class="text-gray-900 p-2 bg-white rounded">{{ selectedVariant.option1 || selectedVariant.title }}</div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="font-semibold text-gray-700 p-2 bg-gray-100 rounded">Fiyat</div>
              <div class="text-gray-700 p-2 bg-white rounded">{{ selectedVariant.price }} TL</div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="font-semibold text-gray-700 p-2 bg-gray-100 rounded">Stok</div>
              <div class="text-gray-700 p-2 bg-white rounded">{{ selectedVariant.inventory_quantity }}</div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="font-semibold text-gray-700 p-2 bg-gray-100 rounded">SKU</div>
              <div class="text-gray-700 p-2 bg-white rounded">{{ selectedVariant.sku }}</div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="font-semibold text-gray-700 p-2 bg-gray-100 rounded">Barkod</div>
              <div class="text-gray-700 p-2 bg-white rounded">{{ selectedVariant.barcode }}</div>
            </div>
          </div>

          <!-- Additional details -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-4 mt-4 text-center">
            <div v-for="(detail, index) in variantDetails" :key="index">
              <div class="font-semibold text-gray-700 mb-1">{{ detail.label }}</div>
              <div class="text-gray-900 bg-white rounded py-2 px-3 border">{{ detail.value }}</div>
            </div>
          </div>

          <!-- Add Price Button -->
          
        </div>
         </div>
         <div class="flex justify-end border-t border-[#E4E4E7] px-6 pt-6">
        <button
            @click="navigateToPriceForm"
            class="rounded-md bg-[#18181B] shadow px-4 py-3 text-[#FAFAFA] font-inter text-xs font-medium leading-normal"
          >
           Varyantı Seç
          </button>
     </div>
        </div>
    </div>
  </div>

      </main>
    </SidebarProvider>
  </div>
</template>
