<template>
  <div>
    <!-- ✅ Alert -->
    <transition name="slide-fade">
      <div
        v-if="showAlert"
        :class="['alert', alertType === 'success' ? 'success' : 'error']"
      >
        <span>{{ alertMessage }}</span>
        <button @click="showAlert = false" class="alert-close">✖</button>
      </div>
    </transition>

    <!-- ✅ Top Controls -->
    <div class="flex justify-end items-center gap-3 mb-4">
      <!-- Tabs (Filter button ke left side, by default hidden) -->
      <div v-if="showTabs">
        <Tabs v-model="selectedDurum">
          <TabsList>
            <TabsTrigger
              v-for="item in durumList"
              :key="item.key"
              :value="item.key"
              @click="handleDurumChange(item.key)"
            >
              {{ item.label }}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <!-- Filter Button -->
      <Button variant="outline" @click="showTabs = !showTabs">
        Filter
      </Button>

      <!-- Ürün Ekle Button -->
      <Button class="bg-black text-white hover:bg-gray-800">
        Ürün Ekle
      </Button>
    </div>

    <!-- ✅ Orders Table -->
    <Card>
      <CardHeader>
        <CardTitle>Siparişlerim</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sipariş No</TableHead>
              <TableHead>Ürün</TableHead>
              <TableHead>Beden</TableHead>
              <TableHead>Toplam</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Sipariş Durumu</TableHead>
              <TableHead class="text-right">Detay</TableHead>
            </TableRow>
          </TableHeader>

          <!-- ✅ Orders -->
          <TableBody v-if="filteredOrders.length">
            <TableRow v-for="order in filteredOrders" :key="order.id">
              <!-- Sipariş No -->
              <TableCell>{{ order.order_number }}</TableCell>

              <!-- Ürün (image + title) -->
              <TableCell>
                <div
                  v-for="(item, i) in order.line_items.slice(0,1)"
                  :key="item.id"
                  class="flex items-center gap-2"
                >
                  <div class="w-16 h-16">
                    <AspectRatio :ratio="1 / 1">
                      <img
                        v-if="item.image?.src || (item.product && item.product.images && item.product.images[0]?.src)"
                        :src="item.image?.src || item.product.images[0]?.src"
                        alt="product"
                        class="rounded-md object-cover w-full h-full"
                      />
                      <img
                        v-else
                        src="/Aspect Ratio.png"
                        alt="Placeholder"
                        class="rounded-md object-cover w-full h-full"
                      />
                    </AspectRatio>
                  </div>
                  <span>{{ item.title }}</span>
                </div>
              </TableCell>

              <!-- Beden -->
              <TableCell>
                <div v-if="order.line_items.length">
                  {{ order.line_items[0].variant_title || 'N/A' }}
                </div>
              </TableCell>

              <!-- Toplam -->
              <TableCell>{{ formatCurrency(order.total_price) }}</TableCell>

              <!-- Durum -->
              <TableCell>
                <Badge variant="outline">
                  {{ getStatusText(order.financial_status) }}
                </Badge>
              </TableCell>
              <TableCell >
                <button
                  class="px-3 py-1 rounded-md border  bg-black text-white  hover:bg-gray-800 text-sm  transition-colors"
                  @click="viewOrderStatus(order)"
                  >
                  Sipariş Durumu
                </button>
              </TableCell>

              <!-- ✅ Detay Button (now functional) -->
              <TableCell class="text-right">
                <button
                  class="px-3 py-1 rounded-md bg-black text-white text-sm hover:bg-gray-800 transition-colors"
                  @click="viewOrderDetails(order)"
                >
                  Detay
                </button>
              </TableCell>
            </TableRow>
          </TableBody>

          <!-- ✅ Empty State -->
          <TableBody v-else>
            <TableRow>
              <TableCell colspan="6" class="text-center text-muted-foreground">
                Hiç sipariş yok.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter>
        Toplam {{ filteredOrders.length }} Sipariş
      </CardFooter>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRouter } from 'vue-router'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const router = useRouter()

// ✅ State
const orders = ref([])
const loading = ref(false)
const errorMessage = ref('')

// ✅ Tabs show/hide state
const showTabs = ref(false)

// ✅ Filter state
const selectedDurum = ref("hepsi")

// ✅ Durum list
const durumList = [
  { key: "hepsi", label: "Hepsi" },
  { key: "paid", label: "Ödendi" },
  { key: "pending", label: "Beklemede" },
  { key: "refunded", label: "Refund" }
]

// ✅ Orders filter logic
const filteredOrders = computed(() => {
  if (selectedDurum.value === "hepsi") return orders.value
  return orders.value.filter(o => o.financial_status === selectedDurum.value)
})

const handleDurumChange = (val) => {
  selectedDurum.value = val
}

// ✅ Alert state
const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref('success')

// ✅ Navigate to order details
const viewOrderDetails = (order) => {
  // Navigate to the saleship page with order ID as parameter
  router.push({
    path: '/saleship',
    query: { orderId: order.id }
  })
}

// ✅ Navigate to order details
const viewOrderStatus = (order) => {
  // Navigate to the saleship page with order ID as parameter
  router.push({
    path: '/order',
    query: { orderId: order.id }
  })
}

// ✅ Fetch orders
const fetchOrders = async () => {
  try {
    loading.value = true
    const config = useRuntimeConfig()
    const response = await $fetch(`${config.public.baseURL}/orders`)
    orders.value = response.orders || []
  } catch (err) {
    console.error("Error fetching orders:", err)
    errorMessage.value = err?.message || "Siparişler alınamadı."
    triggerAlert("Siparişler yüklenirken bir hata oluştu", "error")
  } finally {
    loading.value = false
  }
}

// ✅ Helpers
const formatCurrency = (value) => {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "N/A"
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(num)
}

const getStatusText = (status) => {
  const statusMap = {
    "paid": "Ödendi",
    "pending": "Beklemede",
    "refunded": "Refund"
  }
  return statusMap[status] || status
}

const triggerAlert = (message, type = "success") => {
  alertMessage.value = message
  alertType.value = type
  showAlert.value = true
  setTimeout(() => (showAlert.value = false), 5000)
}

// ✅ Lifecycle
onMounted(() => {
  fetchOrders()
})
</script>