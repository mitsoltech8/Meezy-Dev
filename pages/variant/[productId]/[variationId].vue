<script setup>
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/component/AppSidebar.vue";
import { ChevronRight } from 'lucide-vue-next';
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const productId = route.params.productId
const variantId = route.params.variationId

const product = ref(null)
const variant = ref(null)
const loading = ref(true)

const variantDetails = computed(() => {
  if (!variant.value) return []
  return [
    { label: 'Ağırlık', value: `${variant.value.weight || '0'} ${variant.value.weight_unit || 'kg'}` },
    { label: 'Vergi', value: variant.value.taxable ? 'Vergili' : 'Vergisiz' },
    { label: 'Kargo', value: variant.value.requires_shipping ? 'Gerekli' : 'Gerekmez' },
    { label: 'Stok Politikası', value: variant.value.inventory_policy === 'deny' ? 'Reddet' : 'İzin Ver' }
  ]
})

// Navigate to Price Form
const navigateToPriceForm = () => {
  if (variant.value) {
    router.push({
      path: '/priceform',
      query: {
        productId: product.value.id,
        productTitle: product.value.title,
        variantId: variant.value.id,
        variantSize: variant.value.option1 || variant.value.title,
        currentPrice: variant.value.price
      }
    })
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await axios.get(`http://localhost:4000/api/products/${productId}`)
    product.value = res.data
    variant.value = product.value.variants.find(v => String(v.id) === String(variantId))
    console.log('Found variant:', variant.value)
  } catch (err) {
    console.error(err)
    variant.value = null
  } finally {
    loading.value = false
  }
})

// Split URL path into segments
const pathSegments = computed(() =>
  route.path.split('/').filter(Boolean)
);

// Generate href for each segment
const generateHref = (index) => {
  return '/' + pathSegments.value.slice(0, index + 1).join('/');
};

// Format segment for display
const formatSegment = (segment) => {
  return decodeURIComponent(segment.replace(/-/g, ' '))
    .replace(/^\w/, (c) => c.toUpperCase());
};
</script>

<template>
  <div class="flex bg-gray-50 min-h-screen">
    <SidebarProvider>
      <AppSidebar />
      <main class="w-full p-4 m-3 bg-white rounded-xl shadow">
        <!-- Top Bar -->
        <div class="flex items-center gap-4 p-4">
          <!-- Sidebar Trigger -->
          <SidebarTrigger />

          <svg xmlns="http://www.w3.org/2000/svg" width="2" height="16" viewBox="0 0 2 16" fill="none">
            <path d="M1 0.5V15.5" stroke="#E4E4E7"/>
          </svg>

          <!-- Dynamic Breadcrumb -->
          <Breadcrumb>
            <BreadcrumbList class="flex items-center gap-2 text-sm font-sans text-gray-500">
              <!-- Fixed First Item -->
              <BreadcrumbItem>
                <BreadcrumbLink href="/" class="hover:text-gray-700">
                  Satıcı Paneli
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator class="mx-1">
              <ChevronRight />
              </BreadcrumbSeparator>

              <!-- Dynamic Items -->
              <template v-for="(segment, index) in pathSegments" :key="index">
                <BreadcrumbItem :isCurrentPage="index === pathSegments.length - 1">
                  <BreadcrumbLink 
                    :href="generateHref(index)" 
                    :class="index === pathSegments.length - 1 ? 'text-gray-900 font-medium' : 'hover:text-gray-700'"
                  >
                    {{ formatSegment(segment) }}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator v-if="index !== pathSegments.length - 1" class="mx-1"> <ChevronRight /></BreadcrumbSeparator>
              </template>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <!-- Content -->
  
  <div class=" flex justify-center items-start ">
    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-else-if="!variant" class="text-red-500">Variant not found</div>
    <div v-else class="w-full bg-white rounded-lg shadow-sm border border-gray-200 ">
      

      <!-- Header -->
      <div class="px-4 sm:px-6 pt-6 mb-10">
        <h2 class="text-[#09090B] font-inter text-2xl sm:text-3xl font-semibold leading-8 mb-1 truncate">
          Ürün Varyantı Seç
        </h2>
        <p class="text-[#71717A] font-inter text-sm sm:text-base font-normal leading-5">
          Belirli varyantı seçin
        </p>
      </div>


      <div class="px-6">
      <!-- Product Info -->
      <div class="flex items-center mb-4">
        <div class="w-16 h-16 bg-gray-200 flex items-center justify-center rounded mr-4">
          <img v-if="product.image?.src" :src="product.image.src" class="object-cover w-16 h-16 rounded" />
          <span v-else class="text-gray-500 text-sm">Resim</span>
        </div>
        <div>
          <h2 class="text-[#18181B] font-inter text-sm sm:text-base font-normal leading-5 truncate">{{ product.title }}</h2>
          <p class="text-gray-600 font-inter text-[12px] sm:text-sm truncate">{{ product.vendor }}</p>
        </div>
      </div>

      <!-- Variant Info -->
       <div class="bg-gray-50 rounded-lg p-4 mb-6 mt-9 overflow-x-auto">
        <p class="font-semibold text-gray-900 mb-6">Variant Details</p>
          <div class=" grid grid-cols-1 sm:grid-cols-5 gap-2 text-sm mb-4 text-center">
            <div class="flex flex-col gap-2">
              <div class="font-semibold text-gray-700 p-2 bg-gray-100 rounded">Ölçü</div>
              <div class="p-2 bg-white text-center rounded">{{ variant.option1 || variant.title }}</div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="font-semibold text-gray-700 p-2 bg-gray-100 rounded">Fiyat</div>
              <div class="p-2 bg-white text-center rounded">{{ variant.price }} TL</div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="font-semibold text-gray-700 p-2 bg-gray-100 rounded">Stok</div>
              <div class="p-2 bg-white text-center rounded">{{ variant.inventory_quantity }}</div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="font-semibold text-gray-700 p-2 bg-gray-100 rounded">SKU</div>
              <div class="p-2 bg-white text-center rounded">{{ variant.sku }}</div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="font-semibold text-gray-700 p-2 bg-gray-100 rounded">Barkod</div>
              <div class="p-2 bg-white text-center rounded">{{ variant.barcode }}</div>
            </div>
          </div>



      <!-- Additional Details -->
      <div class="grid grid-cols-4 gap-3 text-sm mb-4 mt-6">
        <div v-for="(detail, index) in variantDetails" :key="index" class="text-center">
          <div class="font-semibold mb-1">{{ detail.label }}</div>
          <div class="text-gray-900 bg-white rounded py-2 px-3 border">{{ detail.value }}</div>
        </div>
      </div>
      </div>
</div>
      <!-- Add Price Button -->
       <div class="flex justify-end border-t border-[#E4E4E7] p-6">
      <button 
        @click="navigateToPriceForm"
       class="rounded-md bg-[#18181B] shadow px-4 py-3 text-[#FAFAFA] font-inter text-xs font-medium leading-normal"
      >
        Fiyat Ekle
      </button>
</div>
    </div>
  </div>
        <slot />
      </main>
    </SidebarProvider>
  </div>
</template>
