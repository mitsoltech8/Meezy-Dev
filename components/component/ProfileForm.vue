<template>
  <!-- Alert Box -->
  <div class="rounded-md border border-[#178C3A] bg-[#178C3A] shadow-[0_10px_15px_-3px_rgba(23,140,58,0.10),0_4px_6px_-2px_rgba(23,140,58,0.05)] text-[#FEF2F2] p-4 flex justify-between items-center max-w-[270px] font-inter absolute w-full right-[50px] top-[63px] z-9">
    <span class="text-[14px] font-semibold">Veriler Başarıyla Kaydedildi</span>
    <button class="bg-transparent border-0 text-white cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M12 4L4 12M4 4L12 12" stroke="#F4F4F5" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>

  <!-- Profile Form Container -->
  <div class="rounded-lg border border-[#E4E4E7] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
    <!-- Profile Image Upload -->
    <div class="relative w-[183px] h-[183px] mx-auto my-[32px] mb-[62px]">
      <img :src="imagePreview" alt="Profile" class="w-full h-full object-cover rounded-full" />
      <label for="profile-upload" class="absolute bottom-[3px] left-[53%] translate-x-full bg-[#f0f0f0] border border-[#ccc] rounded-full p-[11px] flex items-center justify-center cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none">
          <path d="M8 2.00016H3.33333C2.97971 2.00016 2.64057 2.14064 2.39052 2.39069C2.14048 2.64074 2 2.97987 2 3.3335V12.6668C2 13.0205 2.14048 13.3596 2.39052 13.6096C2.64057 13.8597 2.97971 14.0002 3.33333 14.0002H12.6667C13.0203 14.0002 13.3594 13.8597 13.6095 13.6096C13.8595 13.3596 14 13.0205 14 12.6668V8.00016M12.2501 1.75015C12.5153 1.48493 12.875 1.33594 13.2501 1.33594C13.6251 1.33594 13.9848 1.48493 14.2501 1.75015C14.5153 2.01537 14.6643 2.37508 14.6643 2.75015C14.6643 3.12522 14.5153 3.48493 14.2501 3.75015L8.2414 9.75948C8.0831 9.91765 7.88753 10.0334 7.67273 10.0962L5.7574 10.6562C5.70003 10.6729 5.63922 10.6739 5.58134 10.6591C5.52345 10.6442 5.47061 10.6141 5.42836 10.5719C5.38611 10.5296 5.35599 10.4768 5.34116 10.4189C5.32633 10.361 5.32733 10.3002 5.34406 10.2428L5.90406 8.32748C5.96708 8.11285 6.08309 7.91752 6.2414 7.75948L12.2501 1.75015Z" stroke="#3F3F46" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <input type="file" id="profile-upload" class="hidden" @change="handleImageUpload" />
      </label>
    </div>

    <!-- Form -->
    <form @submit.prevent="submitForm" class="flex flex-col gap-6 p-0 w-full">
      <!-- 1. Kişisel Bilgiler -->
      <div class="px-4">
        <h2 class="text-[#18181B] font-roboto text-[22px] font-medium leading-[28px] mb-5 ml-[3px]">1. Kişisel Bilgiler</h2>
        <div class="flex flex-wrap gap-[15px] my-4">
          <div class="flex flex-col flex-1 min-w-[200px] my-4">
            <label class="mb-2 text-[#18181B] font-inter text-[14px] font-medium leading-[100%]">Adınız</label>
            <input type="text"  v-model="form.firstName"  placeholder="Adınızı girin" class="p-5 border border-[#E4E4E7] rounded-md text-[16px] font-inter shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] placeholder-[#71717A]" />
          </div>
          <div class="flex flex-col flex-1 min-w-[200px] my-4">
            <label class="mb-2 text-[#18181B] font-inter text-[14px] font-medium leading-[100%]">Soyadınız</label>
            <input type="text"  v-model="form.lastName" placeholder="Soyadınızı girin" class="p-5 border border-[#E4E4E7] rounded-md text-[16px] font-inter shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] placeholder-[#71717A]" />
          </div>
        </div>

        <!-- Date of Birth & National ID -->
        <div class="flex flex-wrap gap-[15px] my-4">
          <div class="flex flex-col flex-1 min-w-[200px] my-4">
            <label class="mb-2 text-[#18181B] font-inter text-[14px] font-medium leading-[100%]">Doğum Tarihi</label>
            <flat-pickr
              v-model="form.dob"
              :config="dateConfig"
              placeholder="Doğum tarihinizi seçin"
              class="w-full  p-5 rounded-md border border-[#E4E4E7] bg-white text-[#18181B] font-inter text-base font-normal shadow-sm placeholder-[#71717A] focus:outline-none"
            />
          </div>
          <div class="flex flex-col flex-1 min-w-[200px] my-4">
            <label class="mb-2 text-[#18181B] font-inter text-[14px] font-medium leading-[100%]">National ID (TCID)</label>
            <input  type="text" v-model="form.nationalId"   placeholder="Enter your national ID number (e.g., 12345678901)" class="p-5 border border-[#E4E4E7] rounded-md text-[16px] font-inter shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] placeholder-[#71717A]" />
          </div>
        </div>
      </div>

      <!-- 2. Hesap Bilgileri -->
      <div class="px-4">
        <h2 class="text-[#18181B] font-roboto text-[22px] font-medium leading-[28px] mb-5 ml-[3px]">2. Hesap Bilgileri</h2>
        <div class="my-4">
          <label class="mb-2 text-[#18181B] font-inter text-[14px] font-medium leading-[100%]">E-posta</label>
          <input type="email" v-model="form.email" placeholder="E-posta adresinizi girin (örn. john@example.com)" class="p-5 border border-[#E4E4E7] rounded-md text-[16px] font-inter shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] placeholder-[#71717A] w-full" />
        </div>
        <div class="flex flex-wrap gap-[15px] my-4">
          <div class="flex flex-col flex-1 min-w-[200px] my-4">
            <label class="mb-2 text-[#18181B] font-inter text-[14px] font-medium leading-[100%]">Şifreyi Değiştir</label>
            <input type="password" placeholder="Yeni şifrenizi girin" class="p-5 border border-[#E4E4E7] rounded-md text-[16px] font-inter shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] placeholder-[#71717A]" />
          </div>
          <div class="flex flex-col flex-1 min-w-[200px] my-4">
            <label class="mb-2 text-[#18181B] font-inter text-[14px] font-medium leading-[100%]">Şifreyi Onayla</label>
            <input type="password" placeholder="Yeni şifrenizi tekrar girin" class="p-5 border border-[#E4E4E7] rounded-md text-[16px] font-inter shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] placeholder-[#71717A]" />
          </div>
        </div>
      </div>

      <!-- 3. İletişim Bilgileri -->
      <div class="px-4">
        <h2 class="text-[#18181B] font-roboto text-[22px] font-medium leading-[28px] mb-5 ml-[3px]">3. İletişim Bilgileri</h2>
        <div class="flex flex-wrap gap-[15px] my-4">
          <div class="flex flex-col flex-1 min-w-[200px] my-4">
            <label class="mb-2 text-[#18181B] font-inter text-[14px] font-medium leading-[100%]">Telefon Numarası</label>
            <input type="text" v-model="form.phone" placeholder="Telefon numaranızı girin (örn. +90 532...)" class="p-5 border border-[#E4E4E7] rounded-md text-[16px] font-inter shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] placeholder-[#71717A]" />
          </div>
          <div class="flex flex-col flex-1 min-w-[200px] my-4">
            <label class="mb-2 text-[#18181B] font-inter text-[14px] font-medium leading-[100%]">Şehir</label>
            <input type="text" placeholder="Şehrinizi girin (örn. İstanbul)" v-model="form.city" class="p-5 border border-[#E4E4E7] rounded-md text-[16px] font-inter shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] placeholder-[#71717A]" />
          </div>
        </div>
        <div class="flex flex-col my-4">
          <label class="mb-2 text-[#18181B] font-inter text-[14px] font-medium leading-[100%]">Adres</label>
          <input type="text"  placeholder="Tam adresinizi girin (örn. 123 Sokak, Daire 4B)" class="p-5 border border-[#E4E4E7] rounded-md text-[16px] font-inter shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] placeholder-[#71717A] w-full" />
        </div>
      </div>

      <!-- 4. İşletme Bilgileri -->
      <div class="px-4">
        <h2 class="text-[#18181B] font-roboto text-[22px] font-medium leading-[28px] mb-5 ml-[3px]">4. İşletme Bilgileri</h2>
        <div class="flex flex-wrap gap-[15px] my-4">
          <div class="flex flex-col flex-1 min-w-[200px] my-4">
            <label class="mb-2 text-[#18181B] font-inter text-[14px] font-medium leading-[100%]">Vergi Numarası</label>
            <input  type="text" v-model="form.taxNumber"  placeholder="Varsa vergi numaranızı girin"   class="p-5 border border-[#E4E4E7] rounded-md text-[16px] font-inter shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] placeholder-[#71717A]" />
          </div>
          <div class="flex flex-col flex-1 min-w-[200px] my-4">
            <label class="mb-2 text-[#18181B] font-inter text-[14px] font-medium leading-[100%]">Banka Hesabı</label>
            <input type="text" v-model="form.bankAccount"  placeholder="Banka hesap numaranızı veya IBAN girin" class="p-5 border border-[#E4E4E7] rounded-md text-[16px] font-inter shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] placeholder-[#71717A]" />
          </div>
        </div>
        <div class="flex flex-col my-4">
          <label class="mb-2 text-[#18181B] font-inter text-[14px] font-medium leading-[100%]">Vergi Detayları</label>
          <input type="text" v-model="form.taxDetails" placeholder="Vergi ile ilgili ek bilgileri girin" class="p-5 border border-[#E4E4E7] rounded-md text-[16px] font-inter shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] placeholder-[#71717A] w-full" />
        </div>
      </div>

      <!-- Submit -->
      <div class="text-center p-6 border-t border-[#E4E4E7]">
        <button type="submit" class="rounded-md bg-[#18181B] shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_0_rgba(0,0,0,0.06)] text-[#FAFAFA] font-inter text-[16px] font-semibold leading-[140%] cursor-pointer px-[94px] py-2 hover:bg-[#333] border-0">
          Değişiklikleri Kaydet
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useLocalStorage } from '@vueuse/core'


const form = ref({
  firstName: '',
  lastName: '',
  dob: '',
  nationalId: '',
  email: '',
  phone: '',
  city: '',
  address: '',
  taxNumber: '',
  bankAccount: '',
  taxDetails: '',
});

const imagePreview = ref('/Ellipse 1.svg');
const avatarFile = ref(null);

// Define dateConfig here (the configuration object for flatpickr)
const dateConfig = {
  dateFormat: 'd-m-y',
  allowInput: true,
};

// Handle image upload
function handleImageUpload(e) {
  const file = e.target.files[0];
  if (file) {
    avatarFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
}

axios.defaults.baseURL = 'http://localhost:4000';

// Fetch profile data on mounted
onMounted(async () => {
  const token = localStorage.getItem('auth_token');
  
  // Check if the token is available in localStorage
  if (!token) {
    alert("No token found, please log in again.");
    this.$router.push('/login');  // Redirect to login if token is missing
    return;
  }

  try {
    // Set Authorization header with Bearer token
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    console.log('Fetching profile...');
    const { data } = await axios.get('/api/profile/me');
    
    console.log('Profile fetched:', data);
    if (data) {
      // Populate the form with profile data
      Object.assign(form.value, {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        dob: data.dob ? new Date(data.dob).toISOString().slice(0, 10) : '',
        nationalId: data.nationalId || '',
        email: data.email || '',
        phone: data.phone || '',
        city: data.city || '',
        address: data.address || '',
        taxNumber: data.taxNumber || '',
        bankAccount: data.bankAccount || '',
        taxDetails: data.taxDetails || '',
      });
      if (data.avatarUrl) imagePreview.value = data.avatarUrl;
    }
  } catch (e) {
    console.error('Error fetching profile:', e);
    alert('Profile fetching failed!');
  }
});




// Submit form data
const submitForm = async () => {
  try {
    // Log the value of dob before conversion
    console.log('DOB value before conversion:', form.value.dob);

    // Check if dob is a valid date
    if (form.value.dob) {
      // Split the date in d-m-y format and reformat it to YYYY-MM-DD
      const dobParts = form.value.dob.split('-');
      
      // Check if the date has the correct number of parts (d, m, y)
      if (dobParts.length === 3) {
        const day = dobParts[0].padStart(2, '0'); // Ensure day is two digits
        const month = dobParts[1].padStart(2, '0'); // Ensure month is two digits
        const year = '20' + dobParts[2]; // Assume year is in 'yy' format

        // Create a new date string in YYYY-MM-DD format
        const formattedDate = `${year}-${month}-${day}`;

        // Log the formatted date
        console.log('Formatted Date:', formattedDate);

        // Convert the formatted date to ISO string
        const dobDate = new Date(formattedDate);
        
        // Check if the date is valid
        if (isNaN(dobDate.getTime())) {
          throw new Error('Invalid date format');
        }

        form.value.dob = dobDate.toISOString(); // Convert it to ISO format before submitting
      } else {
        throw new Error('Invalid date format');
      }
    } else {
      console.error('DOB is empty or invalid');
    }

    const fd = new FormData();
    Object.entries(form.value).forEach(([k, v]) => fd.append(k, v ?? ''));
    if (avatarFile.value) fd.append('avatar', avatarFile.value);

    const { data } = await axios.post('/api/profile/me', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert('Veriler başarıyla kaydedildi');

    router.push('http://localhost:3000/searchform');
  } catch (e) {
    alert('Kaydetme başarısız');
    console.error('Error during profile submission:', e.response || e);  // Log detailed error
  }
};




// const imagePreview = ref('/Ellipse 1.svg')

// function handleImageUpload(e) {
//   const file = e.target.files[0]
//   if (file) {
//     imagePreview.value = URL.createObjectURL(file)
//   }
// }

// function submitForm() {
//   console.log('Form submitted')
// }

// const form = ref({
//   dob: null,
//   nationalId: ''
// })

// const dateConfig = {
//   dateFormat: 'd-m-y'
// }
</script>
