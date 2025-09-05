<script setup>
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/component/AppSidebar.vue";
import { ChevronRight } from 'lucide-vue-next';
import { useRoute, useRouter } from '#imports';
import { ref, computed, watch, onMounted } from 'vue';
import { jwtDecode } from 'jwt-decode';

const route = useRoute();
const router = useRouter();

// Reactive values
const productId = ref('');
const productTitle = ref('');
const variantId = ref('');
const variantSize = ref('');
const currentPrice = ref('');

const newPrice = ref('');
const shippingCost = ref(50);
const commissionRate = ref(15);

// NEW: stock for this variant
const variantStock = ref(null); // number | null
const stockLoading = ref(false);
const stockError = ref('');

// Load query params
const loadQueryParams = (query) => {
  if (!query) return;
  productId.value = String(query.productId || '');
  variantId.value = String(query.variantId || '');
  variantSize.value = String(query.variantSize || '');
  newPrice.value = '';
  if (!query.productTitle || !query.currentPrice) fetchProductData();
  else {
    productTitle.value = query.productTitle;
    currentPrice.value = query.currentPrice;
  }
  // Also load stock
  fetchVariantStock();
};

// Fetch product info (db or shopify)
const fetchProductData = async () => {
  if (!productId.value || !variantId.value) return;
  try {
    const res = await fetch(`http://localhost:4000/api/products/${productId.value}`);
    const data = await res.json();
    // normalize to your DB shape
    const product = data.product || data; // your previous code expected fields at root
    productTitle.value = product.title;
    const variant = (product.variants || []).find(v => String(v.id) === String(variantId.value));
    if (variant) {
      currentPrice.value = variant.price;
      variantSize.value = variant.option1 || '';
    }
  } catch (err) {
    console.error('Failed to fetch product:', err);
  }
};

// NEW: fetch live stock for this variant
const fetchVariantStock = async () => {
  variantStock.value = null;
  stockError.value = '';
  if (!productId.value || !variantId.value) return;
  stockLoading.value = true;
  try {
    const res = await fetch(`http://localhost:4000/api/products/${productId.value}?includeStock=1`);
    if (!res.ok) throw new Error('Stock fetch failed');
    const data = await res.json();
    const stockArr = data.stock || [];
    const row = stockArr.find(s => String(s.variantId) === String(variantId.value));
    variantStock.value = row ? Number(row.available) : null;
  } catch (e) {
    stockError.value = e.message || 'Unable to load stock';
  } finally {
    stockLoading.value = false;
  }
};

onMounted(() => {
  loadQueryParams(route.query);
});

watch(() => route.query, (newQuery) => {
  loadQueryParams(newQuery);
});

// Commission and net profit
const commissionAmount = computed(() => newPrice.value ? (newPrice.value * commissionRate.value / 100).toFixed(2) : '0.00');
const netProfit = computed(() => newPrice.value ? (newPrice.value - shippingCost.value - parseFloat(commissionAmount.value)).toFixed(2) : '0.00');

const goBack = () => router.back();

// Update price API call
const updatePrice = async () => {
  const token = localStorage.getItem('auth_token');
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  try {
    const response = await fetch(`http://localhost:4000/api/products/${productId.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        variantId: variantId.value,
        newPrice: newPrice.value,
        userId: userId
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Failed to update price: ${err.error || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Price updated successfully:', data);
    router.push(`/products?updated=${productId.value}&success=true`);
  } catch (error) {
    console.error('Price update error:', error);
    alert(`Price update failed: ${error.message}`);
  }
};

// Breadcrumb helpers
const pathSegments = computed(() => route.path.split('/').filter(Boolean));
const generateHref = (index) => '/' + pathSegments.value.slice(0, index + 1).join('/');
const formatSegment = (segment) => decodeURIComponent(segment.replace(/-/g, ' ')).replace(/^\w/, c => c.toUpperCase());
</script>

<template>
  <div class="flex bg-gray-50 min-h-screen">
    <SidebarProvider>
      <AppSidebar />
      <main class="w-full p-4 m-3 bg-white rounded-xl shadow">
        <div class="flex items-center gap-4 p-4">
          <SidebarTrigger />
          <svg xmlns="http://www.w3.org/2000/svg" width="2" height="16" viewBox="0 0 2 16" fill="none">
            <path d="M1 0.5V15.5" stroke="#E4E4E7" />
          </svg>

          <Breadcrumb>
            <BreadcrumbList class="flex items-center gap-2 text-sm font-sans text-gray-500">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" class="hover:text-gray-700">Satıcı Paneli</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="mx-1">
                <ChevronRight />
              </BreadcrumbSeparator>
              <template v-for="(segment, index) in pathSegments" :key="index">
                <BreadcrumbItem :isCurrentPage="index === pathSegments.length - 1">
                  <BreadcrumbLink :href="generateHref(index)"
                    :class="index === pathSegments.length - 1 ? 'text-gray-900 font-medium' : 'hover:text-gray-700'">
                    {{ formatSegment(segment) }}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator v-if="index !== pathSegments.length - 1" class="mx-1">
                  <ChevronRight />
                </BreadcrumbSeparator>
              </template>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div class="min-h-screen">
          <div class="max-w-full mx-auto bg-white rounded-lg shadow border border-gray-200">
            <div class="px-6 py-4">
              <h1 class="text-[#09090B] font-inter text-2xl font-semibold leading-8">Ürün Fiyatını Gir</h1>
              <p class="text-[#71717A] font-inter text-sm font-normal leading-5 mt-2">
                Seçilen varyant için fiyat belirleyin:
                <span class="text-black">{{ productTitle }} - Beden {{ variantSize }}</span>
              </p>

              <!-- NEW: Live stock indicator -->
              <div class="mt-2">
                <span class="text-sm text-gray-600">
                  Stok:
                  <span v-if="stockLoading">yükleniyor…</span>
                  <span v-else-if="stockError" class="text-red-600">{{ stockError }}</span>
                  <span v-else-if="variantStock === null">-</span>
                  <span v-else class="font-semibold" :class="variantStock > 0 ? 'text-green-600' : 'text-red-600'">
                    {{ variantStock }}
                  </span>
                </span>
              </div>
            </div>

            <div class="px-6 py-4">
              <div class="mb-6 flex flex-col gap-1.5">
                <label class="text-[#18181B] font-inter text-sm font-medium leading-none">Lütfen Fiyatınız (TL):</label>
                <input
                  v-model="newPrice"
                  type="number"
                  step="0.01"
                  class="w-full px-3 py-2 focus:outline-none focus:ring focus:ring-black rounded-md border border-[#E4E4E7] bg-white shadow-sm max-w-[700px]"
                  placeholder="örn. 300,00"
                />
                <div>
                  <p class="text-[#71717A] font-inter text-sm font-normal leading-5 mt-1.5">
                    Fiyatınız, bu varyantın mevcut Shopify fiyatı
                    <span class="font-bold text-black">{{ currentPrice }} TL</span> ile karşılaştırılacaktır.
                  </p>
                </div>
              </div>

              <div v-if="newPrice" class="bg-gray-50 p-4 rounded-lg mb-3">
                <h3 class="font-semibold text-gray-900 mb-3">Kazanç Hesaplaması:</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between"><span>Satış Fiyatı:</span><span class="font-medium">{{ newPrice }} TL</span></div>
                  <div class="flex justify-between text-red-600"><span>Kargo Ücreti:</span><span>- {{ shippingCost }} TL</span></div>
                  <div class="flex justify-between text-red-600"><span>Komisyon (%{{ commissionRate }}):</span><span>- {{ commissionAmount }} TL</span></div>
                  <div class="flex justify-between border-t border-gray-200 pt-2 font-semibold">
                    <span>Net Kazanç:</span><span class="text-green-600">{{ netProfit }} TL</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-200 px-6 py-6 text-center text-sm text-gray-600">
              <div class="flex space-x-3 justify-end">
                <button @click="goBack" class="px-4 py-2 rounded-md border border-[#E4E4E7] bg-[#F4F4F5] shadow-sm">
                  Geri Dön
                </button>
                <button
                  @click="updatePrice"
                  :disabled="!newPrice"
                  :class="['px-4 py-2 rounded-md bg-[#18181B] shadow ', newPrice ? 'text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed']"
                >
                  Fiyatı Güncelle
                </button>
              </div>
            </div>
          </div>
        </div>

      </main>
    </SidebarProvider>
  </div>
</template>
