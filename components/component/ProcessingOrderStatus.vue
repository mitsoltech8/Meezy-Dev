<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue"
import { useRoute, useRouter } from "vue-router"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ListFilter, File } from "lucide-vue-next"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

// Route
const route = useRoute()
const router = useRouter()

// Data
const order = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Filter
const filterTabsVisible = ref(false)
const filterStatus = ref<'all' | 'pending' | 'completed'>('all')

// Dialog & Progress
const isProcessing = ref(false)
const progress = ref(0)

// Fetch order details
const fetchOrderDetails = async () => {
  try {
    loading.value = true
    error.value = null

    const orderId = route.query.orderId as string
    if (!orderId) throw new Error("Sipariş ID bulunamadı")

    const allOrdersResponse = await fetch('http://localhost:4000/api/orders')
    if (allOrdersResponse.ok) {
      const allOrdersData = await allOrdersResponse.json()
      const foundOrder = allOrdersData.orders.find((o: any) => o.id == orderId || o.order_number == orderId)
      if (foundOrder) {
        order.value = foundOrder
        return
      }
    }

    const response = await fetch(`http://localhost:4000/api/orders/${orderId}`)
    if (!response.ok) throw new Error(`Sipariş bulunamadı (ID: ${orderId})`)
    const orderData = await response.json()
    order.value = orderData.order || orderData
  } catch (err: any) {
    error.value = err.message || "Sipariş detayları alınamadı"
  } finally {
    loading.value = false
  }
}

// Helpers
const formatCurrency = (value: number | string) => {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "N/A"
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(num)
}

const getFulfillmentStatusText = (status: string | null) => {
  if (!status) return "Beklemede"
  const statusMap: Record<string, string> = {
    fulfilled: "Tamamlandı",
    partial: "Kısmen Tamamlandı",
    unfulfilled: "Beklemede",
    cancelled: "İptal Edildi"
  }
  return statusMap[status] || status
}

// Computed filtered line items
const filteredLineItems = computed(() => {
  if (!order.value) return []
  const lineItems = order.value.line_items || []
  if (filterStatus.value === 'all') return lineItems
  if (filterStatus.value === 'completed') return lineItems.filter((item: any) => item.fulfillment_status === 'fulfilled')
  if (filterStatus.value === 'pending') return lineItems.filter((item: any) => item.fulfillment_status !== 'fulfilled')
  return lineItems
})

// Update fulfillment status
const updateOrderStatus = async (orderId: string) => {
  if (!order.value) return
  const lineItems = order.value.line_items || []
  const anyPending = lineItems.some((item: any) => item.fulfillment_status !== "fulfilled")
  if (!anyPending) {
    // alert("Bu siparişin durumu zaten tamamlandı.") // ⚡ comment out alert
    return
  }

  let interval: any = null

  try {
    // Dialog trigger
    isProcessing.value = true
    progress.value = 0

    // Fake progress animation
    interval = setInterval(() => {
      if (progress.value < 90) progress.value += 10
    }, 100)

    // API call
    const response = await fetch(`http://localhost:4000/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        line_items: lineItems.map((item: any) => ({
          id: item.id,
          fulfillment_status: "fulfilled"
        }))
      }),
    })

    if (!response.ok) {
      // alert("Sipariş durumu güncellenemedi") ⚡ comment out alert
      return
    }

    const updatedOrder = await response.json()
    order.value = updatedOrder.order || updatedOrder

    progress.value = 100
    clearInterval(interval)

    setTimeout(() => {
      isProcessing.value = false
      // alert("Tüm sipariş ürünleri başarıyla tamamlandı!") ⚡ comment out alert
    }, 300)

  } catch (err: any) {
    progress.value = 100
    isProcessing.value = false
    if (interval) clearInterval(interval)
    // alert(err.message || "Bir hata oluştu") ⚡ comment out alert
  }
}





onMounted(async () => {
  await nextTick()
  fetchOrderDetails()
})
</script>


<template>
<div class="max-w-full mx-auto space-y-6 mt-6">

  <!-- Loading -->
  <div v-if="loading" class="text-center py-8">Yükleniyor...</div>

  <!-- Error -->
  <div v-else-if="error" class="text-center py-8 text-red-600">{{ error }}</div>

  <!-- Order Details -->
  <div v-else-if="order">

    <!-- Right: Status filter + button -->
    <div class="flex items-center gap-2 mb-4 justify-end">
      <div v-if="filterTabsVisible">
        <Tabs v-model:value="filterStatus" :default-value="filterStatus" class="w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Button variant="outline" @click="filterTabsVisible = !filterTabsVisible" class="flex items-center gap-1">
        <ListFilter /> Filter
      </Button>
      <Button variant="outline">
       <File />
          Export</Button>
    </div>

    <!-- Products Table -->
    <div class="py-8">
      <CardHeader class="mb-8">
        <CardTitle class="text-[24px] leading-[32px] font-semibold text-[#09090B] font-inter">Processing Status</CardTitle>
        <CardDescription class="text-sm font-normal leading-5 text-[#71717A] font-inter">Ürünlerinizi yukarıdaki filtreleri kullanarak duruma göre filtreleyebilirsiniz.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table class="border-b">
          <TableHeader>
            <TableRow>
              <TableHead>Ürün</TableHead>
              <TableHead>Beden</TableHead>
              <TableHead>Adet</TableHead>
              <TableHead>Birim Fiyat</TableHead>
              <TableHead>Toplam</TableHead>
              <TableHead>Durum</TableHead> <!-- Ye ab fulfillment_status show karega -->
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="item in filteredLineItems" :key="item.id">
              <TableCell>
                <div class="flex items-center gap-5">
                  <div class="w-16">
                    <AspectRatio :ratio="1 / 1">
                      <img v-if="item.image?.src || item.product?.images?.[0]?.src"
                        :src="item.image?.src || item.product?.images?.[0]?.src"
                        :alt="item.title"
                        class="rounded-md object-cover w-full h-full"
                      />
                      <img v-else src="/Aspect Ratio.png" alt="Ürün resmi yok" class="rounded-md object-cover w-full h-full"/>
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
                <Badge size="sm" :variant="item.fulfillment_status === 'fulfilled' ? 'default' : 'outline'" class="font-semibold">
                  {{ getFulfillmentStatusText(item.fulfillment_status) }}
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </div>

     <div class="border-t my-6"></div>

    <!-- Bottom Buttons -->
    <!-- Bottom Buttons -->
<div class="flex justify-end gap-6">
  <Button variant="outline" @click="router.back()">Geri</Button>

  <Button
    class="bg-black text-white"
    @click="updateOrderStatus(order.id)"
  >
    Durumu Güncelle
  </Button>
</div>
</div>
</div>
<!-- Processing Dialog -->
<Dialog v-model:open="isProcessing">
  <DialogContent class="sm:max-w-md">
    <DialogHeader>
      <DialogTitle class="text-[#18181B] text-center text-lg font-semibold leading-none">Processing</DialogTitle>
      <DialogDescription class="text-center text-sm font-normal leading-5 text-[#71717A]">
        Your order is being processed
      </DialogDescription>
    </DialogHeader>
    <Progress :model-value="progress" class="w-full h-2" />
  </DialogContent>
</Dialog>
</template>