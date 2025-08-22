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
import { ref, onBeforeUnmount } from "vue"

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

// --- chart data (same as before)
const chartData = { labels: ["Mon","Tue","Wed","Thu","Fri","Sat"],
  datasets:[{ label:"Resting HR", data:[60,65,63,58,62,61],
    borderColor:"#2BB5FF", backgroundColor:"transparent", tension:0.4, borderWidth:2, pointRadius:0 }] }
const chartOptions = { responsive:true, maintainAspectRatio:false,
  plugins:{ legend:{ display:false } },
  scales:{ x:{ grid:{ display:false } }, y:{ grid:{ color:"#E5E7EB" }, ticks:{ stepSize:5 } } } }

// --- dialog + progress state
const isOpen = ref(false)
const progress = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

function startProgress() {
  // reset + clear any previous timer
  progress.value = 0
  if (timer) { clearInterval(timer); timer = null }
  // increment smoothly to 100
  timer = setInterval(() => {
    if (progress.value < 100) {
      progress.value += 2               // ~5s total
    } else {
      clearInterval(timer!); timer = null
      // optional: close automatically when done
      // isOpen.value = false
    }
  }, 100)
}

function openDialog() {
  isOpen.value = true
  // start after dialog opens to avoid SSR/render timing issues
  // tiny delay ensures Progress is mounted
  setTimeout(startProgress, 50)
}

onBeforeUnmount(() => { if (timer) clearInterval(timer) })
</script>

<template>
  <div class="rounded-lg border border-[#E4E4E7] bg-white shadow-sm p-6">
    <!-- Top Section -->
    <div class="flex justify-between mb-4">
      <div>
        <p class="text-[#71717A] text-sm font-normal">Resting HR</p>
        <div class="flex items-end gap-1">
          <span class="text-[#09090B] text-[36px] font-semibold">62</span>
          <span class="text-[#71717A] text-sm mb-1">bpm</span>
        </div>
      </div>
      <div class="mx-auto text-center">
        <p class="text-[#71717A] text-sm font-normal">Variability</p>
        <div class="flex justify-center items-end gap-1">
          <span class="text-[#09090B] text-[36px] font-semibold">35</span>
          <span class="text-[#71717A] text-sm mb-1">ms</span>
        </div>
      </div>
    </div>

    <!-- Chart -->
    <div class="h-40">
      <Line :data="chartData" :options="chartOptions" />
    </div>

    
  </div>


  <!-- Divider & Button -->
    <div class="border-t mt-4 pt-4 flex justify-end">
      <button
        @click="openDialog"
        class="px-4 py-2 text-sm text-white rounded-md bg-[#18181B] shadow-sm hover:bg-[#27272A] transition"
      >
        Varyant Seç
      </button>

      <!-- Dialog -->
      <Dialog v-model:open="isOpen">
        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle class="text-[#18181B] text-center text-lg font-semibold leading-none">Processing</DialogTitle>
            <DialogDescription class="text-center text-sm font-normal leading-5 text-[#71717A] ">
              Your order is being processed
            </DialogDescription>
          </DialogHeader>

          <!-- WORKING progress bar -->
          <Progress
            :model-value="progress"
            class="w-full h-2"
          />
        </DialogContent>
      </Dialog>
    </div>
</template>
