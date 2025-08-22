<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CreditCard, MoreVertical, Ship, Truck } from "lucide-vue-next"
import { AspectRatio } from '@/components/ui/aspect-ratio'
// dummy product data
const products = [
  {
    id: 1,
    title: "Yeezy Boost 350 V2 Steel Grey",
    size: "44 2/3",
    price: "300",
    sellerAmount: "12.000,00 TL",
    status: "Satışta",
    image: "/images/sample-shoe.jpg",
  },
]

const order = {
  id: "Oe31b70H",
  date: "November 23, 2023",
product1:"$250.00",
product2:"$49.00",
  subtotal: "$299.00",
  shipping: "$5.00",
  tax: "$25.00",
  total: "$329.00",
  shippingInfo: {
    name: "Liam Johnson",
    address: "1234 Main St.",
    city: "Anytown, CA 12345",
  },
  customer: {
    name: "Liam Johnson",
    email: "liam@acme.com",
    phone: "+1 234 567 890",
  },
  payment: "•••• •••• •••• 4532",
}
</script>

<template>
  <div class="max-w-full mx-auto p-6 space-y-6">

    <!-- Products Card -->
    <Card>
      <CardHeader>
        <CardTitle class="text-[#09090B] font-inter text-2xl font-semibold leading-8">Ürünlerim</CardTitle>
        <p class="text-[#71717A] font-inter text-sm font-normal leading-5">
          Ürünlerinizi yukarıdaki filtreleri kullanarak duruma göre filtreleyebilirsiniz.
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ürün</TableHead>
              <TableHead>Beden</TableHead>
              <TableHead>Fiyat</TableHead>
              <TableHead>Satıcıya Kalan</TableHead>
              <TableHead>Durum</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="p in products" :key="p.id">
              <TableCell>
                <div class="flex items-center gap-5">
                   <div class="w-16">
          <AspectRatio :ratio="1/1">
            <img src="/Aspect Ratio.png" alt="Image" class="rounded-md object-cover w-full h-full">
          </AspectRatio>
        </div>
                  <span class="font-medium">{{ p.title }}</span>
                </div>
              </TableCell>
              <TableCell>{{ p.size }}</TableCell>
              <TableCell>{{ p.price }}</TableCell>
              <TableCell>{{ p.sellerAmount }}</TableCell>
              <TableCell>
                <Button size="sm" variant="secondary">{{ p.status }}</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

   
    

 
      <div  class="m-0">
          <!-- Order Header -->
      <div class="flex items-center justify-between bg-[#F4F4F5] p-6 ">
        <div>
          <h2 class="text-[#09090B] font-inter text-lg font-semibold leading-7 tracking-[-0.4px]">Order {{ order.id }}</h2>
          <p class="text-[#71717A] font-inter text-sm font-normal leading-5 tracking-normal">Date: {{ order.date }}</p>
        </div>
        <div class="flex items-center gap-3">
            <div class="rounded border border-[#E4E4E7] bg-white shadow-sm p-1.5">
          <Truck class="w-4 h-4 " />
          </div>
          <div class="rounded border border-[#E4E4E7] bg-white shadow-sm p-1.5">
          <MoreVertical class="w-4 h-4 " />
          </div>
        </div>
      </div>
        <CardContent class="space-y-6 p-6">

          <!-- Order Details -->
          <div class="m-0">
            <h3 class="text-[#09090B] font-inter text-sm font-semibold leading-5">Order Details</h3>

<div class="flex flex-col gap-3 py-3">
            <div class="flex justify-between text-sm ">
              <span class="text-[#71717A] font-inter text-sm font-normal leading-5">Glimmer Lamps x</span>
              <span  class="text-[#09090B] font-inter text-sm font-normal leading-5">{{ order.product1 }}</span>
            </div>
            <div class="flex justify-between text-sm ">
              <span class="text-[#71717A] font-inter text-sm font-normal leading-5">Aqua Filters x</span>
              <span  class="text-[#09090B] font-inter text-sm font-normal leading-5">{{ order.product2 }}</span>
            </div>
           

            </div>
            <Separator class="my-2" />
<div class="flex flex-col gap-3 py-3">
            <div class="flex justify-between text-sm ">
              <span class="text-[#71717A] font-inter text-sm font-normal leading-5">Subtotal</span>
              <span  class="text-[#09090B] font-inter text-sm font-normal leading-5">{{ order.subtotal }}</span>
            </div>
            <div class="flex justify-between text-sm ">
              <span class="text-[#71717A] font-inter text-sm font-normal leading-5">Shipping</span>
              <span  class="text-[#09090B] font-inter text-sm font-normal leading-5">{{ order.shipping }}</span>
            </div>
            <div class="flex justify-between text-sm ">
              <span class="text-[#71717A] font-inter text-sm font-normal leading-5">Tax</span>
              <span  class="text-[#09090B] font-inter text-sm font-normal leading-5">{{ order.tax }}</span>
            </div>
            <div class="flex justify-between font-semibold">
              <span class="text-[#71717A] font-inter text-sm font-normal leading-5">Total</span>
              <span  class="text-[#09090B] font-inter text-sm font-normal leading-5">{{ order.total }}</span>
            </div>

            </div>
          </div>

         <Separator class="my-2" />

        <!-- Shipping & Billing Info -->
<div class="flex flex-col md:flex-row gap-6 py-3 m-0">
  <!-- Shipping Info -->
  <div class="flex-1">
    <h3 class="text-[#09090B] font-inter text-sm font-semibold leading-5 mb-3">Shipping Information</h3>
    <p  class="text-[#71717A] font-inter text-sm font-normal leading-5">{{ order.shippingInfo.name }}</p>
    <p class="text-[#71717A] font-inter text-sm font-normal leading-5">{{ order.shippingInfo.address }}</p>
    <p class="text-[#71717A] font-inter text-sm font-normal leading-5">{{ order.shippingInfo.city }}</p>
  </div>

  <!-- Billing / Customer Info -->
  <div class="flex-1">
    <h3 class="text-[#09090B] font-inter text-sm font-semibold leading-5 mb-3">Billing Information</h3>
    <p class="text-[#71717A] font-inter text-sm font-normal leading-5">Same as shipping address</p>
   
  </div>
</div>


          <Separator class="my-2"  />


        <!-- Customer Info -->
<div class="py-3 m-0">
  <h3 class="text-[#09090B] font-inter text-sm font-semibold leading-5 mb-3">Customer Information</h3>
  <div class="text-sm space-y-1 flex flex-col gap-3">
    <div class="flex justify-between m-0">
      <span class="text-[#71717A] font-inter text-sm font-normal leading-5">Customer:</span>
      <span  class="text-[#09090B] font-inter text-sm font-normal leading-5">{{ order.customer.name }}</span>
    </div>
    <div class="flex justify-between m-0">
      <span class="text-[#71717A] font-inter text-sm font-normal leading-5">E-posta:</span>
      <span  class="text-[#09090B] font-inter text-sm font-normal leading-5">{{ order.customer.email }}</span>
    </div>
    <div class="flex justify-between m-0">
      <span class="text-[#71717A] font-inter text-sm font-normal leading-5">Phone:</span>
      <span  class="text-[#09090B] font-inter text-sm font-normal leading-5">{{ order.customer.phone }}</span>
    </div>
  </div>
</div>

<Separator class="my-2" />

<!-- Payment Info -->
<div class="py-3 m-0">
  <h3 class="text-[#09090B] font-inter text-sm font-semibold leading-5 mb-3">Payment Information</h3>
  <div class="flex justify-between text-sm">
    <span class="flex gap-2 text-[#71717A] font-inter text-sm font-normal leading-5">
        <CreditCard class="w-5 h-5" /> Visa
    </span>
    <span  class="text-[#09090B] font-inter text-sm font-normal leading-5">{{ order.payment }}</span>
  </div>
</div>
<Separator class="my-2" />

          <!-- Button -->
          <div class="flex justify-end pt-3">
            <Button>Varyant Seç</Button>
          </div>
        </CardContent>
    </div>
    </div>

</template>
