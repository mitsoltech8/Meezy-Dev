<template>
  <div class="side-bar">
    <!-- Sidebar -->
  <SidebarProvider>
  <AppSidebar />
  <main class="main">
    <!-- Top Bar -->
    <div class="flex items-center gap-4 p-4 ">
      <!-- Sidebar Trigger -->
      <SidebarTrigger />
     
<svg xmlns="http://www.w3.org/2000/svg" width="2" height="16" viewBox="0 0 2 16" fill="none">
  <path d="M1 0.5V15.5" stroke="#E4E4E7"/>
</svg>
      <!-- Breadcrumb (shadcn-vue) -->
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Satıcı Paneli</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/Ürünlerim">Ürünlerim</BreadcrumbLink>
          </BreadcrumbItem>
         
         
        </BreadcrumbList>
      </Breadcrumb>
    </div>
 
    <!-- Content -->
    <MyProduct />
    <slot />
  </main>
</SidebarProvider>
 
 
   
  </div>
</template>
 
<script setup>
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar.vue";
import MyProduct from '~/components/MyProducts.vue';
import { LucideSeparatorVertical } from "lucide-vue-next";
 
 
</script>
<style scoped>
.side-bar{
    display: flex;
    background-color: #fafafa;
}
.main{
    width: 100%;
    padding: 16px;
    margin: 12px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
.breadcrumb-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 6px 25px;
}
 
.breadcrumb-icon img {
  width: 16px;
  height: 16px;
}
.breadcrumb-icon{
    display: flex;
}
 
.breadcrumb-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  color: #6b7280;
}
 
.breadcrumb-link {
color: #71717A;
font-family: Inter;
font-size: 14px;
font-style: normal;
font-weight:  400;
line-height:  20px;
  cursor: pointer;
}
 
.breadcrumb-current {
color:  #18181B;
font-family:  Inter;
font-size: 14px;
font-style: normal;
font-weight:  400;
line-height:  20px;
}
 
.breadcrumb-separator {
   
    display: flex;
}
 
</style>
 