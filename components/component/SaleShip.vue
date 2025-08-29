<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Cross, ListFilter, MoreVertical, Truck } from "lucide-vue-next"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
 
const route = useRoute()
const router = useRouter()
 
// Reactive order data
const order = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)
 
// Fetch order details based on ID from URL
const fetchOrderDetails = async () => {
  try {
    loading.value = true
    error.value = null
    const orderId = route.query.orderId as string
 
    if (!orderId) {
      throw new Error("Sipariş ID bulunamadı")
    }
 
    console.log("Fetching order:", orderId)
 
    // First try to get from the all orders list
    try {
      const allOrdersResponse = await fetch('http://localhost:4000/api/orders')
      if (allOrdersResponse.ok) {
        const allOrdersData = await allOrdersResponse.json()
        const foundOrder = allOrdersData.orders.find((o: any) => o.id == orderId || o.order_number == orderId)
        if (foundOrder) {
          order.value = foundOrder
          console.log("Order found in all orders list")
          return
        }
      }
    } catch (e) {
      console.log("Could not fetch all orders list, trying direct endpoint")
    }
 
    // If not found in all orders, try the direct endpoint
    const response = await fetch(`http://localhost:4000/api/orders/${orderId}`)
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Sipariş bulunamadı (ID: ${orderId})`)
      }
      throw new Error(`Sunucu hatası: ${response.status}`)
    }
 
    const orderData = await response.json()
    order.value = orderData.order || orderData
  } catch (err: any) {
    console.error("Error fetching order details:", err)
    error.value = err.message || "Sipariş detayları alınamadı"
  } finally {
    loading.value = false
  }
}
 
// Format currency helper
const formatCurrency = (value: number | string) => {
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "N/A"
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(num)
}
 
// Format date helper
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
 
// Get status text in Turkish
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    paid: "Ödendi",
    pending: "Beklemede",
    refunded: "İade Edildi",
    cancelled: "İptal Edildi",
  }
  return statusMap[status] || status
}
 
// Calculate order totals
const calculateTotals = (ord: any) => {
  if (!ord) return { subtotal: 0, shipping: 0, tax: 0, total: 0 }
 
  const subtotal =
    ord.line_items?.reduce((sum: number, item: any) => {
      return sum + (parseFloat(item.price) * item.quantity || 0)
    }, 0) || 0
 
  const shipping = parseFloat(ord.total_shipping_price_set?.shop_money?.amount || ord.total_shipping_price || "0")
  const tax = parseFloat(ord.total_tax_set?.shop_money?.amount || ord.total_tax || "0")
  const total = parseFloat(ord.total_price_set?.shop_money?.amount || ord.total_price || "0")
 
  return { subtotal, shipping, tax, total }
}
 
onMounted(() => {
  fetchOrderDetails()
})

// Navigate to tracking page
const navigateToTracking = () => {
  const orderId = route.query.orderId as string
  if (orderId) {
    router.push({
      path: '/tracking',  // Simple path, no dynamic segments
      query: { orderId: orderId }  // Pass orderId as query parameter
    })
  } else {
    console.error("Order ID not found for navigation")
  }
}

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



const handleDurumChange = (val: string) => {
  selectedDurum.value = val
}
</script>
<template>
  
  <div class="max-w-full mx-auto p-6 space-y-6">
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
        <ListFilter />
        Filter
      </Button>

      <!-- Ürün Ekle Button -->
        <NuxtLink to="/searchform">
  <Button class="flex items-center gap-2">
   <Cross />
    Ürün Ekle
  </Button>
</NuxtLink>
      
    </div>
    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <p>Yükleniyor...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-8 text-red-600">
      <p>{{ error }}</p>
      <Button @click="fetchOrderDetails" class="mt-4">Tekrar Dene</Button>
    </div>

    <!-- Order -->
    <div v-else-if="order">
      <!-- Products -->
      <Card>
        <CardHeader>
          <CardTitle class="text-[#09090B] text-2xl font-semibold">Sipariş Ürünleri</CardTitle>
          <p class="text-[#71717A] text-sm">Siparişteki ürün detayları</p>
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
                  <div class="flex items-center gap-5">
                    <div class="w-16">
                      <AspectRatio :ratio="1 / 1">
                        <img
                          v-if="item.image?.src || item.product?.images?.[0]?.src"
                          :src="item.image?.src || item.product?.images?.[0]?.src"
                          :alt="item.title"
                          class="rounded-md object-cover w-full h-full"
                        />
                        <img
                          v-else
                          src="/Aspect Ratio.png"
                          alt="Ürün resmi yok"
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
                  <Button size="sm" variant="secondary">{{ getStatusText(order.financial_status) }}</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <!-- Order Summary -->

        <div class="flex items-center justify-between bg-[#F4F4F5] p-6 mt-8">
          <div>
            <h2 class="text-lg font-semibold">
              Sipariş #{{ order.order_number || order.name }}
            </h2>
            <p class="text-sm text-[#71717A]">Tarih: {{ formatDate(order.created_at) }}</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="rounded border border-[#E4E4E7] bg-white shadow-sm p-1.5">
              <Truck class="w-4 h-4" />
            </div>
            <div class="rounded border border-[#E4E4E7] bg-white shadow-sm p-1.5">
              <MoreVertical class="w-4 h-4" />
            </div>
          </div>
        </div>

        <CardContent class="space-y-6 p-6">
          <!-- Order Details -->
          <div>
            <h3 class="text-sm font-semibold">Sipariş Detayları</h3>
            <div class="flex flex-col gap-3 py-3">
              <div v-for="item in order.line_items" :key="item.id" class="flex justify-between text-sm">
                <span class="text-[#71717A]">{{ item.title }} ({{ item.variant_title }}) x{{ item.quantity }}</span>
                <span>{{ formatCurrency(parseFloat(item.price) * item.quantity) }}</span>
              </div>
            </div>

            <Separator class="my-2" />

            <div class="flex flex-col gap-3 py-3">
              <div class="flex justify-between text-sm">
                <span class="text-[#71717A]">Ara Toplam</span>
                <span>{{ formatCurrency(calculateTotals(order).subtotal) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-[#71717A]">Kargo</span>
                <span>{{ formatCurrency(calculateTotals(order).shipping) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-[#71717A]">Vergi</span>
                <span>{{ formatCurrency(calculateTotals(order).tax) }}</span>
              </div>
              <div class="flex justify-between font-semibold">
                <span class="text-[#71717A]">Toplam</span>
                <span>{{ formatCurrency(calculateTotals(order).total) }}</span>
              </div>
            </div>
          </div>

          <Separator class="my-2" />

          <!-- Addresses -->
          <div class="flex flex-col md:flex-row gap-6 py-3">
            <div class="flex-1">
              <h3 class="text-sm font-semibold mb-3">Teslimat Adresi</h3>
              <p class="text-sm text-[#71717A]">{{ order.shipping_address?.name || "Bilgi yok" }}</p>
              <p class="text-sm text-[#71717A]">{{ order.shipping_address?.address1 || "" }}</p>
              <p class="text-sm text-[#71717A]">{{ order.shipping_address?.city || "" }} {{ order.shipping_address?.zip || "" }}</p>
              <p class="text-sm text-[#71717A]">{{ order.shipping_address?.country || "" }}</p>
            </div>

            <div class="flex-1">
              <h3 class="text-sm font-semibold mb-3">Fatura Adresi</h3>
              <p class="text-sm text-[#71717A]">{{ order.billing_address?.name || order.shipping_address?.name || "Bilgi yok" }}</p>
              <p class="text-sm text-[#71717A]">{{ order.billing_address?.address1 || order.shipping_address?.address1 || "" }}</p>
              <p class="text-sm text-[#71717A]">{{ order.billing_address?.city || order.shipping_address?.city || "" }} {{ order.billing_address?.zip || order.shipping_address?.zip || "" }}</p>
              <p class="text-sm text-[#71717A]">{{ order.billing_address?.country || order.shipping_address?.country || "" }}</p>
            </div>
          </div>

          <Separator class="my-2" />

          <!-- Customer Info -->
          <div class="py-3">
            <h3 class="text-sm font-semibold mb-3">Müşteri Bilgileri</h3>
            <div class="text-sm flex flex-col gap-3">
              <div class="flex justify-between">
                <span class="text-[#71717A]">Müşteri:</span>
                <span>{{ order.customer?.first_name }} {{ order.customer?.last_name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[#71717A]">E-posta:</span>
                <span>{{ order.customer?.email || order.contact_email || "Bilgi yok" }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[#71717A]">Telefon:</span>
                <span>{{ order.customer?.phone || order.shipping_address?.phone || "Bilgi yok" }}</span>
              </div>
            </div>
          </div>

          <Separator class="my-2" />

          <!-- Payment Info -->
          <div class="py-3">
            <h3 class="text-sm font-semibold mb-3">Ödeme Bilgileri</h3>
            <div class="flex justify-between text-sm">
              <span class="flex gap-2 text-[#71717A]">
                <CreditCard class="w-5 h-5" />
                {{ order.payment_gateway_names?.[0] || "Ödeme yöntemi" }}
              </span>
              <span>{{ getStatusText(order.financial_status) }}</span>
            </div>
          </div>

          <Separator class="my-2" />

          <div class="flex justify-end pt-3 gap-3">
  <!-- Back Button -->
  <Button variant="outline" @click="router.back()">
    Geri
  </Button>

  <!-- Sipariş Takip Button -->
  <Button @click="navigateToTracking">Sipariş Takip</Button>
</div>

        </CardContent>

    </div>
  </div>
</template>
