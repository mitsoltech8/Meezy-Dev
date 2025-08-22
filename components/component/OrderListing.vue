<script setup lang="ts">
import { ref, computed } from "vue"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { File, ListFilter, MoreHorizontal, X } from "lucide-vue-next"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"

// Tabs state
const selectedTab = ref("week")

// Filter tabs visibility
const filterTabsVisible = ref(false)
const filterStatus = ref("all")

// Dummy products
const products = ref([
  {
    id: 1,
    name: "Yeezy Boost 350 V2 Steel Grey",
    size: "44 2/3",
    price: "300",
    sellerPrice: "12,000,00 TL",
    status: "Satışta",
    image: "https://via.placeholder.com/60"
  }
])

// Dummy orders
const orders = ref([
  {
    id: 1,
    customer: "Stephanie Sharkey",
    email: "steph56@gmail.com",
    type: "Sale",
    status: "Pending",
    date: new Date("2025-08-21T06:12:00")
  },
  {
    id: 2,
    customer: "Ali Khan",
    email: "ali@example.com",
    type: "Sale",
    status: "Completed",
    date: new Date("2025-08-18T14:45:00")
  },
  {
    id: 3,
    customer: "John Doe",
    email: "john@example.com",
    type: "Refund",
    status: "Pending",
    date: new Date("2025-07-10T10:30:00")
  }
])

// Filtered orders according to main tab + filter status
const filteredOrders = computed(() => {
  const now = new Date()
  let result = [...orders.value]

  // Time filter
  if (selectedTab.value === "week") {
    const weekAgo = new Date()
    weekAgo.setDate(now.getDate() - 7)
    result = result.filter(o => o.date >= weekAgo)
  } else if (selectedTab.value === "month") {
    const monthAgo = new Date()
    monthAgo.setMonth(now.getMonth() - 1)
    result = result.filter(o => o.date >= monthAgo)
  } else if (selectedTab.value === "year") {
    const yearAgo = new Date()
    yearAgo.setFullYear(now.getFullYear() - 1)
    result = result.filter(o => o.date >= yearAgo)
  }

  // Status filter
  if (filterStatus.value === "pending") {
    result = result.filter(o => o.status === "Pending")
  } else if (filterStatus.value === "completed") {
    result = result.filter(o => o.status === "Completed")
  }

  return result
})

// Handlers for product menu
const editProduct = (id: number) => {
  console.log("Edit product:", id)
}

// Dialog & alert states
const showDeleteDialog = ref(false)
const productToDelete = ref<number | null>(null)

// ✅ Alert state
const showAlert = ref(false)
const alertMessage = ref("")
const alertType = ref<"success" | "error">("success")

// helper for showing alert
const triggerAlert = (msg: string, type: "success" | "error" = "success") => {
  alertMessage.value = msg
  alertType.value = type
  showAlert.value = true
  setTimeout(() => {
    showAlert.value = false
  }, 5000)
}

// Delete button → open dialog
const deleteProduct = (id: number) => {
  productToDelete.value = id
  showDeleteDialog.value = true
}

// Confirm remove → close dialog + show alert
const confirmRemove = () => {
  if (productToDelete.value !== null) {
    products.value = products.value.filter(p => p.id !== productToDelete.value)
    productToDelete.value = null
    showDeleteDialog.value = false

    triggerAlert("Data Removed Successfully!", "success")
  }
}

// Cancel delete → sirf dialog close kare
const cancelDelete = () => {
  showDeleteDialog.value = false
}

// Close alert manually
const closeAlert = () => {
  showAlert.value = false
}
</script>

<template>
  <div class="space-y-6 p-6 relative">
    <!-- ✅ Slide Alert -->
    <transition name="slide-down">
      <div
        v-if="showAlert"
        :class="[ 
          'fixed top-12 right-12 rounded-md shadow-lg text-white px-5 py-5 transition-all flex items-start justify-between',
          alertType === 'success'
            ? 'bg-green-500 border border-green-400 text-white'
            : 'bg-red-500 border border-red-400 text-white'
        ]"
      >
        <span>{{ alertMessage }}</span>
        <button @click="closeAlert" class="ml-3">
          <X class="w-4 h-4" />
        </button>
      </div>
    </transition>

    <!-- Top bar -->
    <div class="flex items-center justify-between">
      <!-- Tabs -->
      <Tabs v-model="selectedTab" class="w-auto rounded-sm">
        <TabsList>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="year">Year</TabsTrigger>
        </TabsList>
      </Tabs>

      <!-- Right side -->
      <div class="flex items-center gap-2">
        <!-- Filter Tabs (toggle on button click) -->
        <div v-if="filterTabsVisible" class="mr-2">
          <Tabs v-model="filterStatus" class="w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <!-- Buttons -->
        <Button variant="outline" @click="filterTabsVisible = !filterTabsVisible">
          <ListFilter />
            Filter
        </Button>
        <Button variant="outline">
            <File />
            Export</Button>
      </div>
    </div>

    <!-- Products -->
    <div class="my-8">
      <CardHeader class="mb-4">
        <CardTitle class="text-[24px] leading-[32px] font-semibold text-[#09090B] font-inter">Ürünlerim</CardTitle>
        <p class="text-sm font-normal leading-5 text-[#71717A] font-inter">
          Ürünlerinizi yukarıdaki filtreleri kullanarak duruma göre filtreleyebilirsiniz.
        </p>
      </CardHeader>
      <CardContent>
        <Table class="border-b">
          <TableHeader>
            <TableRow>
              <TableHead>Ürün</TableHead>
              <TableHead>Beden</TableHead>
              <TableHead>Fiyat</TableHead>
              <TableHead>Satıcıya Kalan</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="p in products" :key="p.id">
              <TableCell>
                <div class="flex items-center gap-4">
                   <div class="w-16">
          <AspectRatio :ratio="1/1">
            <img src="/Aspect Ratio.png" alt="Image" class="rounded-md object-cover w-full h-full">
          </AspectRatio>
        </div>
                  <span>{{ p.name }}</span>
                </div>
              </TableCell>
              <TableCell>{{ p.size }}</TableCell>
              <TableCell>{{ p.price }}</TableCell>
              <TableCell>{{ p.sellerPrice }}</TableCell>
              <TableCell>
                <Badge variant="outline">{{ p.status }}</Badge>
              </TableCell>
              <TableCell class="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal class="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="editProduct(p.id)">
                      Düzenle
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      @click="deleteProduct(p.id)"
                      class="text-red-600 bg-[#FEF2F2] hover:text-red-600 hover:bg-[#fbd0d0] focus:text-red-600 focus:bg-[#fbd0d0]"
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
    </div>

    <!-- Orders -->
    <Card>
      <CardHeader>
        <CardTitle class="font-inter text-[24px] font-semibold leading-8 tracking-[-0.4px] text-[#09090B]" >Orders</CardTitle>
        <p class="text-[#71717A] font-inter text-sm font-normal leading-5">Recent orders from your store.</p>
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
            <TableRow v-for="o in filteredOrders" :key="o.id">
              <TableCell>
                <div>
                  <div class="font-medium">{{ o.customer }}</div>
                  <div class="text-sm text-muted-foreground">{{ o.email }}</div>
                </div>
              </TableCell>
              <TableCell>{{ o.type }}</TableCell>
              <TableCell>
                <Badge :variant="o.status === 'Pending' ? 'outline' : 'default'">
                  {{ o.status }}
                </Badge>
              </TableCell>
              <TableCell>{{ o.date.toLocaleString() }}</TableCell>
            </TableRow>
            <TableRow v-if="filteredOrders.length === 0">
              <TableCell colspan="4" class="text-center text-muted-foreground py-4">
                No orders found for this filter.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <!-- Divider -->
    <div class="border-t"></div>

    <!-- Bottom Button -->
    <div class="flex justify-end">
      <Button variant="default">Varyant Seç</Button>
    </div>

    <!-- ✅ Delete Dialog -->
    <Dialog v-model:open="showDeleteDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle class="text-[#18181B] text-center font-inter text-lg font-semibold leading-none">
            Remove Listing?
          </DialogTitle>
          <DialogDescription class="text-[#71717A] text-center text-sm font-normal leading-5">
            Are you sure you want to remove listing?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            @click="confirmRemove"
            class="w-full rounded-md bg-[#18181B] shadow text-[#FAFAFA] font-medium text-sm leading-5 font-inter"
          >
            Remove Listing
          </Button>
          
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.slide-down-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
