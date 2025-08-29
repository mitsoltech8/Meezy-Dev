<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/component/AppSidebar.vue";
import MyProducts from '~/components/component/MyProducts.vue';
import { ChevronRight } from 'lucide-vue-next';

// Current route
const route = useRoute();

// Split URL path into segments
const pathSegments = computed(() =>
  route.path.split('/').filter(Boolean)
);

// Generate href for each segment
const generateHref = (index) => {
  return '/' + pathSegments.value.slice(0, index + 1).join('/');
};

// Format segment for display
const formatSegment = (segment) => {
  return decodeURIComponent(segment.replace(/-/g, ' '))
    .replace(/^\w/, (c) => c.toUpperCase());
};
</script>

<template>
  <div class="flex bg-gray-50 min-h-screen">
    <SidebarProvider>
      <AppSidebar />
      <main class="w-full p-4 m-3 bg-white rounded-xl shadow">
        <!-- Top Bar -->
        <div class="flex items-center gap-4 p-4">
          <!-- Sidebar Trigger -->
          <SidebarTrigger />

          <svg xmlns="http://www.w3.org/2000/svg" width="2" height="16" viewBox="0 0 2 16" fill="none">
            <path d="M1 0.5V15.5" stroke="#E4E4E7"/>
          </svg>

          <!-- Dynamic Breadcrumb -->
          <Breadcrumb>
            <BreadcrumbList class="flex items-center gap-2 text-sm font-sans text-gray-500">
              <!-- Fixed First Item -->
              <BreadcrumbItem>
                <BreadcrumbLink href="/" class="hover:text-gray-700">
                  Satıcı Paneli
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator class="mx-1">
              <ChevronRight />
              </BreadcrumbSeparator>

              <!-- Dynamic Items -->
              <template v-for="(segment, index) in pathSegments" :key="index">
                <BreadcrumbItem :isCurrentPage="index === pathSegments.length - 1">
                  <BreadcrumbLink 
                    :href="generateHref(index)" 
                    :class="index === pathSegments.length - 1 ? 'text-gray-900 font-medium' : 'hover:text-gray-700'"
                  >
                    {{ formatSegment(segment) }}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator v-if="index !== pathSegments.length - 1" class="mx-1"> <ChevronRight /></BreadcrumbSeparator>
              </template>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <!-- Content -->
        <MyProducts />
        <slot />
      </main>
    </SidebarProvider>
  </div>
</template>
