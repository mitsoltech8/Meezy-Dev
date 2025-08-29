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
        <div class="px-6 mt-6" v-if="filteredProducts.length > 0">
          <Table>
            <TableBody>
              <TableRow v-for="(product, index) in filteredProducts" :key="index">
                <!-- IMAGE CELL with AspectRatio -->
                <TableCell class="w-[60px]">
                    <div class="w-16 h-16">
    <AspectRatio :ratio="1 / 1">
      <img
        v-if="product.image?.src || (product.images && product.images[0]?.src)"
        :src="product.image?.src || product.images[0]?.src"
        alt="product"
        class="rounded-md object-cover w-full h-full"
      />
      <span v-else class="text-gray-400 text-xs flex items-center justify-center">
        <div class="w-[64px]">
                <AspectRatio :ratio="1 / 1">
                  <img src="/Aspect Ratio.png" alt="Image" class="rounded-md object-cover w-full h-full">
                </AspectRatio>
              </div>
      </span>
    </AspectRatio>
  </div>
                </TableCell>

                <!-- PRODUCT NAME -->
                <TableCell class="text-sm font-normal font-inter">
                  {{ product.title }}
                </TableCell>

                <!-- BUTTON -->
                <TableCell class="text-right">
                  <Button
                    type="button"
                    variant="outline"
                    class="rounded-md bg-[#18181B] shadow-md text-[#FAFAFA] text-xs font-medium leading-4 font-inter"
                    @click="navigateToVariantPage(product.id)"
                  >
                    Ürünü Seç
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- No products found -->
        <div v-else-if="searchQuery.trim() !== ''">
          <p class="ml-6 mt-6 text-gray-500">No products found</p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Cross } from "lucide-vue-next";

const showForm = ref(false);
const searchQuery = ref("");  // Two-way binding with input
const products = ref([]);
const isLoading = ref(true);

const router = useRouter();
const isMounted = ref(false);

// Fetch products from backend
onMounted(() => {
  isMounted.value = true;
  axios.get("http://localhost:4000/api/products")
    .then((response) => {
      if (isMounted.value) {
        products.value = Array.isArray(response.data.products)
          ? response.data.products
          : [];
        isLoading.value = false;
      }
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      isLoading.value = false;
    });
});

onUnmounted(() => {
  isMounted.value = false;
});

// Real-time filtered products based on searchQuery
const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return []; // show nothing if search empty

  return products.value.filter(p =>
    p.title?.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Navigate to variant page
const navigateToVariantPage = (productId) => {
  router.push(`/variant/${productId}`);
};
</script>
