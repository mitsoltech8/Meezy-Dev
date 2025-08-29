<template>
  <div class="max-w-full mx-auto p-6 space-y-6">
    <!-- Header with back button -->
    <div class="flex items-center gap-3 mb-6">
      <button @click="goBack" class="p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
        <ArrowLeft class="w-5 h-5" />
      </button>
      <div>
        <h1 class="text-[#09090B] text-2xl font-semibold">Sipariş Takip: {{ order?.order_number || order?.name }}</h1>
        <p class="text-[#71717A] text-sm">Sipariş durumu ve performans takibi</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Takip bilgileri yükleniyor...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12 text-red-600">
      <p>{{ error }}</p>
      <Button @click="fetchData" class="mt-4">Tekrar Dene</Button>
    </div>

    <!-- Tracking Content -->
    <div v-else-if="order" class="space-y-6">
      <!-- ✅ Product Table inside Card -->
      <Card class="max-w-full shadow-sm">
        <CardHeader>
          <CardTitle class="text-[#09090B] text-xl font-semibold">Sipariş Ürünü</CardTitle>
          <CardDescription class="text-[#71717A] text-sm">Seçilen ürün bilgisi</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ürün</TableHead>
                <TableHead>Beden</TableHead>
                <TableHead>Adet</TableHead>
                <TableHead>Birim Fiyat</TableHead>
                <TableHead>Toplam</TableHead>
                <TableHead>Durum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="item in order.line_items" :key="item.id">
                <TableCell>
                  <div class="flex items-center gap-4">
                    <div class="w-16">
                      <AspectRatio :ratio="1/1">
                        <img 
                          :src="item.image?.src || item.product?.images?.[0]?.src || '/Aspect Ratio.png'" 
                          :alt="item.title" 
                          class="rounded-md object-cover w-full h-full" 
                        />
                      </AspectRatio>
                    </div>
                    <span class="font-medium">{{ item.title }}</span>
                  </div>
                </TableCell>
                <TableCell>{{ item.variant_title || "N/A" }}</TableCell>
                <TableCell>{{ item.quantity }}</TableCell>
                <TableCell>{{ formatCurrency(item.price) }}</TableCell>
                <TableCell>{{ formatCurrency(parseFloat(item.price) * item.quantity) }}</TableCell>
                <TableCell>
                  <Button size="sm" variant="secondary">
                    {{ getStatusText(order.financial_status) }}
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <!-- Performance Card -->
      <div class="rounded-lg border border-[#E4E4E7] bg-white shadow-sm p-6">
        <!-- Top Section -->
        <div class="flex justify-between mb-4 w-1/2">
          <div>
            <p class="text-[#71717A] text-sm font-normal">Toplam Satış</p>
            <div class="flex items-end gap-1">
              <span class="text-[#09090B] text-[36px] font-semibold">{{ totalSales }}</span>
              <span class="text-[#71717A] text-sm mb-1">TRY</span>
            </div>
          </div>
          <div class="text-center">
            <p class="text-[#71717A] text-sm font-normal">Sipariş Sayısı</p>
            <div class="flex justify-center items-end gap-1">
              <span class="text-[#09090B] text-[36px] font-semibold">{{ orderCount }}</span>
              <span class="text-[#71717A] text-sm mb-1">adet</span>
            </div>
          </div>
        </div>

        <!-- Chart -->
        <div class="h-40">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>

    
      <!-- Action Button -->
      <div class="border-t pt-6 flex justify-end">
<Button 
        @click="openRefreshDialog" 
        class="px-4 py-2 text-sm text-white rounded-md bg-[#18181B] shadow-sm hover:bg-[#27272A] transition"
>
        Verileri Yenile
</Button>
</div>

      <!-- Dialog -->
     <Dialog v-model:open="isRefreshDialogOpen">
<DialogContent class="sm:max-w-md">
<DialogHeader>
<DialogTitle class="text-[#18181B] text-center text-lg font-semibold leading-none">Veriler Yenileniyor</DialogTitle>
<DialogDescription class="text-center text-sm font-normal leading-5 text-[#71717A]">
            Son veriler API'den alınıyor...
</DialogDescription>
</DialogHeader>
<Progress :model-value="refreshProgress" class="w-full h-2" />
<div class="text-center text-xs text-[#71717A]">
          %{{ refreshProgress }} tamamlandı
</div>
</DialogContent>
</Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js"
import { Line } from "vue-chartjs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ArrowLeft, Truck } from "lucide-vue-next"
import { ref, onMounted, computed, onBeforeUnmount } from "vue"
import { useRoute, useRouter } from "vue-router"

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)






// --- Refresh dialog state
const isRefreshDialogOpen = ref(false)
const refreshProgress = ref(0)
let refreshTimer: ReturnType<typeof setInterval> | null = null
 
// Function to open refresh dialog and start progress
const openRefreshDialog = () => {
  isRefreshDialogOpen.value = true
  refreshProgress.value = 0
  // Start progress animation
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
  refreshTimer = setInterval(() => {
    if (refreshProgress.value < 100) {
      refreshProgress.value += 10 // Faster progress for refresh
    } else {
      clearInterval(refreshTimer!)
      refreshTimer = null
      // When progress completes, fetch new data
      fetchNewData()
    }
  }, 100)
}
 
// Function to fetch new data from API
const fetchNewData = async () => {
  try {
    loading.value = true
    const orderId = route.query.orderId as string
    if (!orderId) {
      throw new Error("Sipariş ID bulunamadı")
    }
 
    // Add timestamp to avoid caching
    const timestamp = new Date().getTime()
    // Fetch fresh data from API
    const response = await fetch(`http://localhost:4000/api/orders/${orderId}?t=${timestamp}`)
    if (!response.ok) {
      // Fallback: try all orders endpoint
      const allResponse = await fetch(`http://localhost:4000/api/orders?t=${timestamp}`)
      if (!allResponse.ok) {
        throw new Error("Güncel veriler alınamadı")
      }
      const allOrders = await allResponse.json()
      const foundOrder = allOrders.orders.find((o: any) => o.id == orderId || o.order_number == orderId)
      if (!foundOrder) {
        throw new Error("Sipariş bulunamadı")
      }
      order.value = foundOrder
    } else {
      const orderData = await response.json()
      order.value = orderData.order || orderData
    }
    // Show success message (optional)
    console.log("Veriler başarıyla güncellendi")
  } catch (err: any) {
    console.error("Veriler güncellenirken hata oluştu:", err)
    error.value = err.message || "Veriler güncellenirken hata oluştu"
  } finally {
    loading.value = false
    // Close dialog after a short delay
    setTimeout(() => {
      isRefreshDialogOpen.value = false
    }, 500)
  }
}
 
// Cleanup timer on unmount
onBeforeUnmount(() => { 
  if (refreshTimer) clearInterval(refreshTimer) 
})










const route = useRoute()
const router = useRouter()
const order = ref<any>(null)
const loading = ref(true)
const error = ref("")

// --- dialog + progress state
const isOpen = ref(false)
const progress = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

function startProgress() {
  progress.value = 0
  if (timer) { clearInterval(timer); timer = null }
  timer = setInterval(() => {
    if (progress.value < 100) {
      progress.value += 2
    } else {
      clearInterval(timer!); timer = null
    }
  }, 100)
}

function openDialog() {
  isOpen.value = true
  setTimeout(startProgress, 50)
}

onBeforeUnmount(() => { if (timer) clearInterval(timer) })

// --- chart data (dynamic based on order data)
const chartData = computed(() => {
  // Generate chart data based on order date
  const orderDate = order.value ? new Date(order.value.created_at) : new Date()
  const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
  
  // Get the day of the week when order was placed
  const orderDayIndex = orderDate.getDay()
  const orderDay = days[orderDayIndex === 0 ? 6 : orderDayIndex - 1] // Adjust for Sunday
  
  // Create labels starting from order day
  const labels = []
  for (let i = 0; i < 7; i++) {
    labels.push(days[(orderDayIndex + i) % 7])
  }
  
  // Generate sales data based on order total
  const orderTotal = order.value ? parseFloat(order.value.total_price) : 0
  const data = Array(7).fill(0).map((_, i) => {
    // Create a sales pattern that peaks around the order day
    const distance = Math.abs(i - 3) // Distance from center (order day)
    return Math.round(orderTotal * (1 - distance * 0.15) + (Math.random() * 50 - 25))
  })
  
  return {
    labels,
    datasets: [{
      label: "Günlük Satış",
      data,
      borderColor: "#2BB5FF",
      backgroundColor: "transparent",
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 0
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: "#E5E7EB" }, ticks: { stepSize: 50 } }
  }
}

// Computed properties
const totalSales = computed(() => {
  return order.value ? Math.round(parseFloat(order.value.total_price)) : 0
})

const orderCount = computed(() => {
  // This would normally come from API, using order items count as proxy
  return order.value?.line_items?.length || 1
})

// Format currency
const formatCurrency = (value: string | number) => {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "N/A"
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(num)
}

// Format date
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })
}

const getStatusText = (status: string) => {
  switch (status) {
    case "paid": return "Ödendi"
    case "pending": return "Beklemede"
    case "refunded": return "İade Edildi"
    default: return "Bilinmiyor"
  }
}

// Fetch order data
const fetchData = async () => {
  try {
    loading.value = true
    error.value = ""
    
    const orderId = route.query.orderId as string
    
    if (!orderId) {
      throw new Error("Sipariş ID bulunamadı")
    }

    // Try to fetch from API
    const response = await fetch(`http://localhost:4000/api/orders/${orderId}`)
    
    if (!response.ok) {
      // Fallback: fetch all orders and filter
      const allResponse = await fetch('http://localhost:4000/api/orders')
      if (!allResponse.ok) {
        throw new Error("Siparişler alınamadı")
      }
      
      const allOrders = await allResponse.json()
      const foundOrder = allOrders.orders.find((o: any) => o.id == orderId || o.order_number == orderId)
      
      if (!foundOrder) {
        throw new Error("Sipariş bulunamadı")
      }
      
      order.value = foundOrder
    } else {
      const orderData = await response.json()
      order.value = orderData.order || orderData
    }
    
  } catch (err: any) {
    console.error("Sipariş bilgileri alınamadı:", err)
    error.value = err.message || "Sipariş bilgileri alınamadı"
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchData()
})
</script>