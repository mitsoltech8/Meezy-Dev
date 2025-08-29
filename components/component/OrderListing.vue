<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CreditCard, MoreVertical, Truck } from "lucide-vue-next"
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

const getFulfillmentStatusText = (status: string | null) => {
  if (!status) return "Beklemede" // fallback if null
  const statusMap: Record<string, string> = {
    fulfilled: "Tamamlandı",
    partial: "Kısmen Tamamlandı",
    unfulfilled: "Beklemede",
    cancelled: "İptal Edildi"
  }
  return statusMap[status] || status
}

</script>
<template>
  <div class="max-w-full mx-auto p-6 space-y-6">
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



   <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>Recent orders from your store.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
  <TableRow v-if="order">
    <TableCell>
      <span>{{ order.customer?.first_name }} {{ order.customer?.last_name }}</span>
      <br/>
      <span>{{ order.customer?.email || order.contact_email || "Bilgi yok" }}</span>
    </TableCell>
    <TableCell>Sale</TableCell>
    <TableCell>
      <Badge size="sm" variant="outline">
        {{ getFulfillmentStatusText(order.line_items?.[0]?.fulfillment_status || null) }}
      </Badge>
    </TableCell>
    <TableCell>{{ formatDate(order.created_at) }}</TableCell>
  </TableRow>

  <!-- Only show when no order exists -->
  <TableRow v-else>
    <TableCell colspan="4" class="text-center text-muted-foreground py-4">
      No orders found for this filter.
    </TableCell>
  </TableRow>
</TableBody>

        </Table>
      </CardContent>
    </Card>

    </div>
  </div>
</template>
