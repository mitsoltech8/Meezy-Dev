<template> 
  <div class="flex h-screen">
    <!-- Sidebar -->
    <Sidebar class="bg-gray-900 text-black w-64">
      <SidebarContent class="flex h-full flex-col">
          <!-- HEADER: Logo -->
  <SidebarHeader class="flex items-start justify-center py-[20px]">
    <a href="/" class="flex items-center gap-2">
     
        <span class="logo-svg"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
  <path d="M20.1424 0.843087L16.9853 0L14.3248 9.89565L11.9228 0.961791L8.76555 1.80488L11.3608 11.4573L4.8967 5.01518L2.58549 7.31854L9.67576 14.3848L0.845959 12.0269L0 15.1733L9.64767 17.7496C9.53721 17.2748 9.47877 16.7801 9.47877 16.2717C9.47877 12.6737 12.4055 9.75685 16.0159 9.75685C19.6262 9.75685 22.5529 12.6737 22.5529 16.2717C22.5529 16.7768 22.4952 17.2685 22.3861 17.7405L31.1541 20.0818L32 16.9354L22.314 14.3489L31.1444 11.9908L30.2984 8.84437L20.6128 11.4308L27.0768 4.98873L24.7656 2.68538L17.7737 9.65357L20.1424 0.843087Z" fill="#747474"/>
  <path d="M22.3777 17.7769C22.107 18.9173 21.5356 19.9419 20.7515 20.7628L27.1034 27.0933L29.4147 24.7899L22.3777 17.7769Z" fill="#747474"/>
  <path d="M20.6872 20.8291C19.8936 21.6369 18.8907 22.2397 17.7661 22.5503L20.0775 31.1471L23.2346 30.304L20.6872 20.8291Z" fill="#747474"/>
  <path d="M17.6483 22.5818C17.1265 22.7155 16.5796 22.7866 16.016 22.7866C15.4122 22.7866 14.8275 22.705 14.2724 22.5522L11.959 31.1569L15.1161 31.9999L17.6483 22.5818Z" fill="#747474"/>
  <path d="M14.1608 22.5206C13.0533 22.1945 12.0683 21.584 11.291 20.7739L4.92334 27.1199L7.23454 29.4233L14.1608 22.5206Z" fill="#747474"/>
  <path d="M11.238 20.718C10.474 19.9028 9.91743 18.8919 9.65253 17.769L0.855957 20.1181L1.70191 23.2645L11.238 20.718Z" fill="#747474"/>
</svg></span>
        <span class="text-center font-inter font-semibold text-[24px] leading-[110%] tracking-[-0.96px]">Meezy Archive</span>
  
    </a>
  </SidebarHeader>


        <!-- TOP: Groups / Menus -->
        <SidebarGroup class="flex-1 border-0">
          <SidebarGroupLabel>Satıcı Paneli</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="(item, index) in items" :key="item.title">
                <SidebarMenuButton
                  asChild
                  @click.prevent="item.children.length && toggleSubmenu(index)"
                  class="flex items-center justify-between px-2 py-2 rounded cursor-pointer select-none"
                >
                  <a :href="item.url" class="flex items-center gap-2 flex-1" @click.stop>
                    <div class="flex items-center gap-2 flex-1">
                      <component :is="item.icon" class="w-5 h-5" />
                      <span class="truncate overflow-hidden text-[#3F3F46] text-ellipsis font-inter text-sm font-normal leading-none">{{ item.title }}</span>
                    </div>

                    <template v-if="item.children.length">
                      <svg
                        :class="[
                          'transform transition-transform duration-300 opacity-75',
                          openIndexes.includes(index) ? 'rotate-90' : 'rotate-0'
                        ]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </template>
                  </a>
                </SidebarMenuButton>

                <SidebarMenuSub v-if="openIndexes.includes(index)">
                  <SidebarMenuSubItem v-for="subItem in item.children" :key="subItem.title">
                    <SidebarMenuSubButton asChild>
                      <a :href="subItem.url" class="block p-2 hover:bg-gray-800 rounded overflow-hidden text-[#3F3F46] text-ellipsis font-inter text-sm font-normal leading-none">
                        {{ subItem.title }}
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <!-- BOTTOM: Footer profile with popup -->
        <SidebarFooter class="mt-2">
          <DropdownMenu :modal="false">
            <DropdownMenuTrigger as-child>
              <!-- Footer button (like screenshot) -->
              <button
                class="w-full flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-[#f5f5f5] transition select-none text-left"
              >
                <Avatar class="h-8 w-8 shrink-0 rounded-lg">
                  <AvatarImage :src="user.avatar" alt="avatar" />
                  <AvatarFallback>{{ user.initials }}</AvatarFallback>
                </Avatar>
                <div class="min-w-0 flex-1">
                  <div class="text-sm font-medium leading-5 truncate">{{ user.name }}</div>
                  <div class="text-xs text-black-300 truncate">{{ user.email }}</div>
                </div>
                <ChevronsUpDown class="h-4 w-4 opacity-70" />
              </button>
            </DropdownMenuTrigger>

            <!-- Popup menu opening to the RIGHT of sidebar -->
            <DropdownMenuContent
              :side="'right'"
              :align="'start'"
              :side-offset="8"
              :align-offset="0"
              class="w-64 p-0"
            >
              <!-- Header inside popup -->
              <div class="flex items-center gap-3 p-3">
                <Avatar class="h-10 w-10 shrink-0">
                  <AvatarImage :src="user.avatar" alt="avatar" />
                  <AvatarFallback>{{ user.initials }}</AvatarFallback>
                </Avatar>
                <div class="min-w-0">
                  <div class="text-sm font-medium truncate">{{ user.name }}</div>
                  <div class="text-xs text-muted-foreground truncate">{{ user.email }}</div>
                </div>
              </div>
              <Separator />

              <DropdownMenuItem class="gap-2 py-2.5">
                <Sparkles class="h-4 w-4" />
                <span>Upgrade to Pro</span>
              </DropdownMenuItem>

              <DropdownMenuItem class="gap-2 py-2.5">
                <User class="h-4 w-4" />
                <span>Account</span>
              </DropdownMenuItem>

              <DropdownMenuItem class="gap-2 py-2.5">
                <CreditCard class="h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>

              <DropdownMenuItem class="gap-2 py-2.5">
                <Bell class="h-4 w-4" />
                <span>Notifications</span>
              </DropdownMenuItem>

              <Separator />
              <DropdownMenuItem class="gap-2 py-2.5 text-red-500 focus:text-red-500">
                <LogOut class="h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>

   
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import {
  Calendar, Home, Inbox, Search, Settings,
  ChevronsUpDown, Sparkles, User, CreditCard, Bell, LogOut,
  ShoppingCart,
  Package,
  Settings2,
  UserCog
} from "lucide-vue-next"

import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem,
  SidebarMenuSubButton, SidebarFooter, SidebarHeader
} from "@/components/ui/sidebar"

import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const items = [
  { title: "Ana Sayfa", url: "#", icon: Home, children: [] },
  {
    title: "Satışlarım", url: "#", icon: ShoppingCart,
    children: [{ title: "Aktif", url: "#" }, { title: "Tamamlanan", url: "#" }, { title: "İptal Edilen", url: "#" }]
  },
  { title: "Ürünlerim", url: "#", icon: Package,
    children: [{ title: "Satışta", url: "#" }, { title: "Onay Bekleyen", url: "#" }, { title: "Askıda", url: "#" }]
},
  {
    title: "Ayarlarım", url: "#", icon: Settings2,
    children: [{ title: "Bildirimler", url: "#" }, { title: "Tatil Modu", url: "#" }]
  },
  { title: "Satıcı Bilgilerim", url: "#", icon: UserCog, children: [] },
]

const openIndexes = ref<number[]>([])
function toggleSubmenu(index: number) {
  if (openIndexes.value.includes(index)) {
    openIndexes.value = openIndexes.value.filter(i => i !== index)
  } else {
    openIndexes.value.push(index)
  }
}

// footer user data
const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "https://i.pravatar.cc/80?img=3",
  get initials() { return this.name.slice(0, 2).toUpperCase() }
}
</script>

<style scoped>
/* optional: subtle popup shadow like screenshot */
:deep(.dropdown-menu-content) {
  box-shadow: 0 10px 20px rgba(0,0,0,.25), 0 2px 6px rgba(0,0,0,.16);
}
li svg{
  height: 16px;
  color: #4B5563;
  width: 16px;
}
</style>

