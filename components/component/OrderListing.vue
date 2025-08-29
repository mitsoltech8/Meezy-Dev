<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ListFilter, File } from "lucide-vue-next"

// Route
const route = useRoute()
const router = useRouter()
// Data
const order = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Filters
const selectedTab = ref<'week' | 'month' | 'year'>('week') // Left tab default
const filterTabsVisible = ref(false)
const filterStatus = ref<'all' | 'pending' | 'completed'>('all') // Right tab default

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

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })
}

const getStatusText = (status: string | null) => {
  if (!status) return "Beklemede"
  const statusMap: Record<string, string> = {
    paid: "Ödendi",
    pending: "Beklemede",
    refunded: "İade Edildi",
    cancelled: "İptal Edildi",
  }
  return statusMap[status] || status
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

  const orderDate = new Date(order.value.created_at)
  const today = new Date()
  let passDateFilter = false

  if (selectedTab.value === 'week') {
    const weekAgo = new Date()
    weekAgo.setDate(today.getDate() - 7)
    passDateFilter = orderDate >= weekAgo
  } else if (selectedTab.value === 'month') {
    const monthAgo = new Date()
    monthAgo.setMonth(today.getMonth() - 1)
    passDateFilter = orderDate >= monthAgo
  } else if (selectedTab.value === 'year') {
    const yearAgo = new Date()
    yearAgo.setFullYear(today.getFullYear() - 1)
    passDateFilter = orderDate >= yearAgo
  }

  if (!passDateFilter) return []

  const lineItems = order.value.line_items || []
  if (filterStatus.value === 'all') return lineItems
  if (filterStatus.value === 'completed') return lineItems.filter((item: any) => item.fulfillment_status === 'fulfilled')
  if (filterStatus.value === 'pending') return lineItems.filter((item: any) => item.fulfillment_status !== 'fulfilled')

  return lineItems
})
import { nextTick } from "vue"
onMounted(async () => {
  await nextTick() // wait for DOM render
  selectedTab.value = 'week'
  filterStatus.value = 'all'
  fetchOrderDetails()
})


const updateOrderStatus = async (orderId: string) => {
  if (!order.value) return

  const lineItems = order.value.line_items || []
  const anyPending = lineItems.some((item: any) => item.fulfillment_status !== "fulfilled")

  if (!anyPending) {
    alert("Bu siparişin durumu zaten tamamlandı.")
    return
  }

  try {
    loading.value = true

    const response = await fetch(`http://localhost:4000/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        line_items: lineItems.map((item: any) => ({ id: item.id, fulfillment_status: "fulfilled" }))
      }),
    })

    if (!response.ok) throw new Error("Sipariş durumu güncellenemedi")

    const updatedOrder = await response.json()
    order.value = updatedOrder.order || updatedOrder

    alert("Tüm sipariş ürünleri başarıyla tamamlandı!")
  } catch (err: any) {
    alert(err.message || "Bir hata oluştu")
  } finally {
    loading.value = false
  }
}






const buttonText = computed(() => {
  if (!order.value || !Array.isArray(order.value.line_items)) return "Yükleniyor..." // Loading in Turkish

  const lineItems = order.value.line_items

  const allFulfilled = lineItems.every((item: any) => item.fulfillment_status === "fulfilled")
  const anyPending = lineItems.some((item: any) => item.fulfillment_status !== "fulfilled")

  if (["cancelled","refunded"].includes(order.value.financial_status)) return "Değiştirilemez" // Cannot Change
  if (allFulfilled) return "Tamamlandı" // Completed
  if (anyPending) return "Tamamlandı olarak işaretle" // Mark as Completed

  return "Durumu Güncelle" // Update Status
})




// ✅ Navigate to order details
const viewOrderDetails = (order: { id: any }) => {
  // Navigate to the saleship page with order ID as parameter
  router.push({
    path: '/orderstatus',
    query: { orderId: order.id }
  })
}


</script>

<template>
<div class="max-w-full mx-auto space-y-6 mt-6">

  <!-- Loading -->
  <div v-if="loading" class="text-center py-8">Yükleniyor...</div>

  <!-- Error -->
  <div v-else-if="error" class="text-center py-8 text-red-600">{{ error }}</div>

  <!-- Order Details -->
  <div v-else-if="order">

    <div class="flex items-center justify-between mb-4">
      <!-- Left: Date filter -->
      <Tabs v-model:value="selectedTab" :default-value="selectedTab" >
  <TabsList>
    <TabsTrigger value="week">Week</TabsTrigger>
    <TabsTrigger value="month">Month</TabsTrigger>
    <TabsTrigger value="year">Year</TabsTrigger>
  </TabsList>
</Tabs>


      <!-- Right: Status filter + button -->
      <div class="flex items-center gap-2">
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
    </div>

    <!-- Products Table -->
    <div class="py-8">
      <CardHeader class="mb-6">
        <CardTitle class="text-[24px] leading-[32px] font-semibold text-[#09090B] font-inter">Sipariş Ürünleri</CardTitle>
        <CardDescription class="text-sm font-normal leading-5 text-[#71717A] font-inter">Yukarıdaki filtreleri kullanarak siparişlerinizi durumlarına göre filtreleyebilirsiniz.</CardDescription>
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
              <TableHead>Durum</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="item in order.line_items" :key="item.id">
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
                <Badge size="sm" variant="secondary">{{ getStatusText(order.financial_status) }}</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </div>

    <!-- Order Info Table (Filtered Badge) -->
    <Card>
      <CardHeader>
        <CardTitle class="font-inter text-[24px] font-semibold leading-8 tracking-[-0.4px] text-[#09090B]">Sipariş</CardTitle>
        <CardDescription class="text-[#71717A] font-inter text-sm font-normal leading-5">Mağazanızdan gelen son siparişler.
</CardDescription>
      </CardHeader>
      <CardContent>
        <Table class="border-b">
          <TableHeader>
            <TableRow>
              <TableHead>Müşteri</TableHead>
              <TableHead>Tip</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Tarih</TableHead>
            </TableRow>
          </TableHeader>
         <TableBody>
  <TableRow>
    <TableCell class="py-3">
      <span class="overflow-hidden text-ellipsis text-[#18181B] font-medium text-sm leading-5 font-inter">
        {{ order.customer?.first_name }} {{ order.customer?.last_name }}
      </span><br/>
      <span class="overflow-hidden whitespace-nowrap text-ellipsis text-[#71717A] font-normal text-sm leading-5 font-inter">
        {{ order.customer?.email || order.contact_email || "Bilgi yok" }}
      </span>
    </TableCell>
    <TableCell>Sale</TableCell>
    <TableCell>
      <Badge size="sm" :variant="order.fulfillment_status === 'fulfilled' ? 'default' : 'outline'" class="font-semibold">
        {{ order.fulfillment_status === 'fulfilled' ? 'Tamamlandı' : 'Beklemede' }}
      </Badge>
    </TableCell>
    <TableCell>{{ formatDate(order.created_at) }}</TableCell>
  </TableRow>
</TableBody>

        </Table>
      </CardContent>
    </Card>


     <div class="border-t my-6"></div>

    <!-- Bottom Button -->
    <div class="flex justify-end gap-6">
<!-- Back Button -->
  <Button variant="outline" @click="router.back()">Geri</Button>


 <Button
  v-if="order"
  :disabled="!order.line_items?.some((item: { fulfillment_status: string }) => item.fulfillment_status !== 'fulfilled') || ['cancelled','refunded'].includes(order.financial_status)"
  @click="viewOrderDetails(order)"
  class="bg-black text-white"
>
  {{ buttonText }}
</Button>



<!-- Optional fallback -->
<div v-else class="text-gray-500">Loading...</div>

    </div>

  </div>
</div>
</template>
