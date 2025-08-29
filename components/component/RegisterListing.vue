<template>
  <div class=" space-y-6 relative">
    <!-- Top Right Buttons + Tabs -->
    <div class="flex justify-end items-center space-x-2">
      <!-- Tabs (Filter ke left side par) -->
      <div v-if="showTabs" class="mr-3">
        <Tabs v-model="activeTab" class="w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <!-- Buttons -->
      <div class="flex gap-3">
        <Button variant="outline" @click="showTabs = !showTabs">
          <ListFilter />
          Filter
        </Button>
         <NuxtLink to="/searchform">
  <NuxtLink to="/searchform">
  <Button class="flex items-center gap-2">
    <Cross />
    Ürün Ekle
  </Button>
</NuxtLink>
</NuxtLink>
      </div>
    </div>

    <Card>
      <CardHeader>
        <CardTitle class="text-[#09090B] font-inter text-2xl leading-8 font-semibold not-italic">Register Listing Id</CardTitle>
      </CardHeader>
      <CardContent>
        <!-- Row 1: Input Field -->
        <div class="mb-2">
          <Input
            v-model="searchId"
            placeholder="Enter Listing ID"
            @keyup.enter="handleSearch"
            @focus="isFocused = true"
            @blur="isFocused = false"
            :class="[
              'w-full rounded-md border bg-white focus:outline-none focus:ring-0 focus-visible:ring-0', 
              isFocused ? 'border-black' : 'border-[#E4E4E7]'
            ]"
          />
        </div>
      </CardContent>
      <div>
        <hr class="border-gray-300" />
      </div>

      <!-- Row 3: Button -->
      <div class="flex justify-end px-6">
        <Button
          class="bg-black text-white hover:bg-gray-800"
          @click="handleSearch"
          :disabled="loading"
        >
          <span v-if="loading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Searching...
          </span>
          <span v-else>Search</span>
        </Button>
      </div>
    </Card>

    <!-- Product Card -->
    <Card v-if="showProductCard && filteredProduct">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ürün</TableHead>
              <TableHead>ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow @click="handleProductClick(filteredProduct)">
              <TableCell>
                <div class="flex items-center space-x-3">
                  <div class="w-16">
                    <AspectRatio :ratio="1/1">
  <img
    :src="filteredProduct.image
            ? filteredProduct.image
            : filteredProduct.images?.[0]?.src
            ? filteredProduct.images[0].src
            : '/Aspect Ratio.png'"
    :alt="filteredProduct.title || filteredProduct.name || 'Fallback Image'"
    class="w-full h-full object-cover rounded-md"
  />
</AspectRatio>

                  </div>
                  <span>{{ filteredProduct.title || filteredProduct.name }}</span>
                </div>
              </TableCell>
              <TableCell class="font-semibold">
                {{ filteredProduct.id }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Divider -->
        <div class="my-2">
          <hr class="border-gray-300" />
        </div>

        <!-- Button to show variations -->
        <div class="flex justify-end">
          <Button
            class="bg-black text-white hover:bg-gray-800 mt-5"
            @click="handleProductClick(filteredProduct)"
            :disabled="!hasVariations"
          >
            Varyasyonları Göster
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Variations Table -->
    <Card v-if="showVariations && filteredVariationsByTab.length">
      <CardContent>
        <Table class="border-b">
          <TableHeader>
            <TableRow>
              <TableHead>Ürün</TableHead>
              <TableHead>Beden</TableHead>
              <TableHead>Fiyat</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead class="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="(variant, index) in filteredVariationsByTab"
              :key="index"
            >
              <TableCell>
                <div class="flex items-center space-x-3">
                  <div class="w-16">
                    <AspectRatio :ratio="1/1">
                      <img 
                        :src="variant.image || filteredProduct.image || '/Aspect Ratio.png'" 
                        :alt="variant.title || variant.name" 
                        class="rounded-md object-cover w-full h-full"
                      >
                    </AspectRatio>
                  </div>
                  <span>{{ variant.title || variant.name }}</span>
                </div>
              </TableCell>
              <TableCell>{{ variant.size || variant.option1 || 'N/A' }}</TableCell>
              <TableCell>{{ formatCurrency(variant.price) }}</TableCell>
              <TableCell>{{ variant.inventory_quantity || 'N/A' }}</TableCell>
              <TableCell>
                <Badge :variant="getStatusVariant(variant)">
                  {{ getStatusText(variant) }}
                </Badge>
              </TableCell>
              <TableCell class="text-right">
                <!-- Dropdown Menu -->
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon">⋮</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="onEditClick(variant)">Düzenle</DropdownMenuItem>
                    <DropdownMenuItem
                      class="text-red-600 bg-[#FEF2F2] hover:text-red-600 hover:bg-[#fbd0d0] focus:text-red-600 focus:bg-[#fbd0d0]"
                      @click="openDeleteDialog(variant)"
                    >
                      Sil
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <!-- No Variations Message -->
    <Card v-if="showVariations && !filteredVariationsByTab.length">
      <CardContent>
        <div class="text-center py-8 text-gray-500">
          <p>No variations found for the selected filter.</p>
        </div>
      </CardContent>
    </Card>

    <!-- Dialog Popup -->
    <Dialog v-model:open="dialogOpen">
      <DialogContent>
        <DialogDescription class="text-[#18181B] text-center font-inter text-lg font-semibold leading-none">
          Check Notification Via Email/SMS
        </DialogDescription>
        <DialogFooter>
          <Button @click="closeDialog" class="w-full bg-black focus:outline-none focus:ring-0 focus-visible:ring-0">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="deleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle class="text-[#18181B] text-center font-inter text-lg font-semibold leading-none">Remove Listing?</DialogTitle>
          <DialogDescription class="text-[#71717A] text-center text-sm font-normal leading-5">
            Are you sure you want to remove listing?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" @click="confirmDelete" class="w-full rounded-md bg-[#18181B] shadow text-[#FAFAFA] font-medium text-sm leading-5 font-inter">Remove Listing</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Custom Alert (slide in/out) -->
    <transition name="slide-fade">
      <div
        v-if="showAlert"
        :class="[
          'absolute top-8 right-6 px-5 py-5 rounded-lg shadow-lg flex items-center space-x-2',
          alertType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        ]"
      >
        <span>{{ alertMessage }}</span>
        <button @click="showAlert = false" class="ml-6 text-white font-bold">✕</button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Cross, ListFilter } from "lucide-vue-next";

// reactive state
const searchId = ref("");
const dialogOpen = ref(false);
const showProductCard = ref(false);
const showVariations = ref(false);
const selectedProduct = ref(null);
const selectedVariations = ref([]);
const showAlert = ref(false);
const alertMessage = ref("");
const alertType = ref("success");
const isFocused = ref(false);
const loading = ref(false);
const allProducts = ref([]);

// tabs
const showTabs = ref(false);
const activeTab = ref("all");

// delete dialog
const deleteDialogOpen = ref(false);
const variantToDelete = ref(null);

// Fetch all products from API
const fetchProducts = async () => {
  try {
    loading.value = true;
    const response = await fetch('http://localhost:4000/api/products');
    
    if (!response.ok) {
      throw new Error('Products could not be fetched');
    }
    
    const data = await response.json();
    allProducts.value = Array.isArray(data) ? data : (data.products || []);
  } catch (error) {
    console.error('Error fetching products:', error);
    triggerAlert('Ürünler yüklenirken hata oluştu', 'error');
  } finally {
    loading.value = false;
  }
};

// Find product by ID
const filteredProduct = computed(() => {
  if (!selectedProduct.value) return null;
  
  // First try to find by exact ID match
  let product = allProducts.value.find(p => p.id == selectedProduct.value);
  
  // If not found, try to find by product ID in variations
  if (!product) {
    for (const p of allProducts.value) {
      if (p.variants) {
        const variant = p.variants.find(v => v.id == selectedProduct.value);
        if (variant) {
          product = { ...p, ...variant };
          break;
        }
      }
    }
  }
  
  return product;
});

// Check if product has variations
const hasVariations = computed(() => {
  if (!filteredProduct.value) return false;
  return filteredProduct.value.variants && filteredProduct.value.variants.length > 0;
});

// Get variations for the selected product
const variations = computed(() => {
  if (!filteredProduct.value) return [];
  
  // If the product itself has variants array
  if (filteredProduct.value.variants) {
    return filteredProduct.value.variants.map(variant => ({
      ...variant,
      product_title: filteredProduct.value.title || filteredProduct.value.name,
      image: variant.image || filteredProduct.value.image
    }));
  }
  
  // If we're looking at a single variant, return it as the only variation
  return [filteredProduct.value];
});

// Filter variations based on active tab
const filteredVariationsByTab = computed(() => {
  if (!variations.value.length) return [];
  
  if (activeTab.value === "all") return variations.value;
  
  return variations.value.filter(variant => {
    const status = getStatusText(variant).toLowerCase();
    return status === activeTab.value.toLowerCase();
  });
});

// Format currency
const formatCurrency = (value) => {
  if (!value) return "N/A";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "N/A";
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(num);
};

// Get status text
const getStatusText = (variant) => {
  if (variant.inventory_quantity > 0) return "Active";
  if (variant.inventory_quantity === 0) return "Draft";
  return "Archived";
};

// Get status variant for badge
const getStatusVariant = (variant) => {
  const status = getStatusText(variant).toLowerCase();
  switch (status) {
    case 'active': return 'default';
    case 'draft': return 'secondary';
    case 'archived': return 'outline';
    default: return 'outline';
  }
};

// function to trigger alert with auto-close (5s)
const triggerAlert = (msg, type = "error") => {
  alertMessage.value = msg;
  alertType.value = type;
  showAlert.value = true;
  setTimeout(() => {
    showAlert.value = false;
  }, 5000);
};

const handleSearch = async () => {
  if (!searchId.value.trim()) {
    triggerAlert("Lütfen bir ID girin", "error");
    return;
  }

  showProductCard.value = false;
  showVariations.value = false;
  selectedVariations.value = [];
  selectedProduct.value = null;
  loading.value = true;

  try {
    // If we haven't loaded products yet, fetch them
    if (allProducts.value.length === 0) {
      await fetchProducts();
    }

    // Check if product exists
    const found = allProducts.value.find(p => 
      p.id == searchId.value || 
      (p.variants && p.variants.some(v => v.id == searchId.value))
    );

    if (found) {
      selectedProduct.value = searchId.value;
      dialogOpen.value = true;
    } else {
      triggerAlert("Ürün veritabanında bulunamadı!", "error");
    }
  } catch (error) {
    triggerAlert("Arama sırasında hata oluştu", "error");
  } finally {
    loading.value = false;
    searchId.value = "";
  }
};

const closeDialog = () => {
  dialogOpen.value = false;
  showProductCard.value = true;
};

const handleProductClick = (product) => {
  if (hasVariations.value) {
    showProductCard.value = false;
    selectedVariations.value = variations.value;
    showVariations.value = true;
  } else {
    triggerAlert("Bu ürün için varyasyon bulunamadı", "error");
  }
};

const onEditClick = (variant) => {
  triggerAlert(`Edit clicked for ${variant.title || variant.name}`, "success");
};

const openDeleteDialog = (variant) => {
  variantToDelete.value = variant;
  deleteDialogOpen.value = true;
};

const confirmDelete = () => {
  if (!variantToDelete.value) return;
  try {
    // Here you would make an API call to delete the variant
    // For now, we'll just remove it from the local array
    selectedVariations.value = selectedVariations.value.filter(
      v => v.id !== variantToDelete.value.id
    );
    triggerAlert("Veriler Başarıyla Kaldırıldı!", "success");
  } catch (error) {
    triggerAlert("Veri Silme İşlemi Başarısız!", "error");
  } finally {
    deleteDialogOpen.value = false;
    variantToDelete.value = null;
  }
};

// Fetch products when component mounts
onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
/* Alert slide animation */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>