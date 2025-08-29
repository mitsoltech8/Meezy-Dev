<template>
  <div class="flex justify-center">
    <div
      class="flex flex-col-reverse lg:flex-row h-auto lg:h-screen font-sans bg-white overflow-hidden max-w-[1392px] w-full"
    >
      <!-- Left side: Form -->
      <div
        class="w-full lg:w-1/2 py-8 px-6 lg:py-16 lg:px-[100px] flex flex-col justify-center"
      >
        <h1
          class="text-[#232323] font-roboto text-[28px] lg:text-[36px] font-medium my-3"
        >
          Kayıt Ol
        </h1>
        <p
          class="text-[#969696] font-inter text-sm lg:text-base font-normal mb-8"
        >
          Meezy'nin özelliklerinden faydalanmak için kaydolun
        </p>

        <!-- Alert -->
        <div
         v-if="successMessage"
          class="flex items-start border border-[#178C3A] bg-white rounded-lg py-3 px-4 mb-8 max-w-full lg:max-w-[500px] font-sans"
        >
          <div class="mr-3 mt-[3px]">
            <!-- SVG Icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
            >
              <g clip-path="url(#clip0)">
                <path
                  d="M8 5.333v2.667M8 10.667h.007M14.667 8A6.667 6.667 0 1 1 1.333 8 6.667 6.667 0 0 1 14.667 8Z"
                  stroke="#178C3A"
                  stroke-width="1.33"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div class="text-[#178C3A] font-inter text-sm leading-5">
            <strong class="block font-bold leading-none">Kayıt Başarılı!</strong>
            Hesabınız oluşturuldu.
          </div>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Full Name -->
          <div>
            <label
              for="name"
              class="block text-[#18181B] font-inter text-sm font-medium mb-2"
            >
              Adınız Soyadınız
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="Adınızı ve soyadınızı girin"
              required
              class="w-full px-3 py-4 rounded-md border border-[#E4E4E7] bg-white text-[#18181B] font-inter text-base font-normal shadow-sm placeholder-[#71717A]  focus:ring-black"
            />
          </div>

          <!-- Date of Birth -->
          <div>
            <label
              for="dob"
              class="block text-[#18181B] font-inter text-sm font-medium mb-2"
            >
              Doğum Tarihi
            </label>
            <div class="relative flex items-center">
              <svg
                class="absolute left-3 text-[#71717A]"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
              >
                <path
                  d="M5.333 1.333V4M10.667 1.333V4M2 6.667h12M5.333 9.333h.007M8 9.333h.007M10.667 9.333h.006M5.333 12h.007M8 12h.007M10.667 12h.006M3.333 2.667h9.334A1.333 1.333 0 0 1 14 4v9.333a1.333 1.333 0 0 1-1.333 1.333H3.333A1.333 1.333 0 0 1 2 13.333V4A1.333 1.333 0 0 1 3.333 2.667Z"
                  stroke="#71717A"
                  stroke-width="1.33"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <flat-pickr
                v-model="form.dob"
                :config="dateConfig"
                placeholder="Doğum tarihinizi seçin"
                class="w-full pl-11 pr-11 py-4 rounded-md border border-[#E4E4E7] bg-white text-[#18181B] font-inter text-base font-normal shadow-sm placeholder-[#71717A] focus:ring-black"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-[#18181B] font-inter text-sm font-medium mb-2"
            >
              E-posta Adresi
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="E-posta adresinizi girin"
              required
              class="w-full px-3 py-4 rounded-md border border-[#E4E4E7] bg-white text-[#18181B] font-inter text-base font-normal shadow-sm placeholder-[#71717A] focus:ring-black"
            />
          </div>

          <!-- Password -->
          <div>
            <label
              for="password"
              class="block text-[#18181B] font-inter text-sm font-medium mb-2"
            >
              Şifre
            </label>
            <div class="relative flex items-center">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="form.password"
                placeholder="Güvenli bir şifre oluşturun"
                required
                class="pl-3 pr-11 py-4 w-full rounded-md border border-[#E4E4E7] bg-white text-[#18181B] font-inter text-base font-normal shadow-sm placeholder-[#71717A] focus:ring-black"
              />
              <button
                type="button"
                class="absolute right-3 bg-transparent border-none cursor-pointer flex items-center justify-center w-7 h-7"
                @click="togglePassword"
              >
                <svg
                  v-if="!showPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                >
                  <g clip-path="url(#clip0)">
                    <path
                      d="M6.587 6.587A2.667 2.667 0 0 0 9.413 9.413M7.153 3.387c.281-.035.564-.053.847-.054 4.667 0 6.667 4.667 6.667 4.667a10.664 10.664 0 0 1-1.113 1.787M4.407 4.407A10.665 10.665 0 0 0 1.333 8s2 4.667 6.667 4.667c1.277.004 2.527-.37 3.593-1.073M1.333 1.333l13.334 13.334"
                      stroke="#71717A"
                      stroke-width="1.33"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  width="16"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5.25 12 5.25s8.268 2.693 9.542 6.75c-1.274 4.057-5.065 6.75-9.542 6.75S3.732 16.057 2.458 12z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            class="text-[#FAFAFA] font-inter text-base font-semibold leading-[140%] rounded-md opacity-50 bg-[#18181B] mix-blend-luminosity py-[11px] px-[38px] shadow-md w-full cursor-pointer"
            type="submit"
          >
            Kayıt Ol
          </button>
        </form>
      </div>

      <!-- Right side: Image -->
    <div class="w-full lg:w-3/5 flex items-center justify-center overflow-hidden p-3 sm:h-full md:h-full lg:h-full">
  <img
    src="/reg.png"
    alt="Happy user"
    class="h-full w-full object-cover rounded-[24px]"
  />
</div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from 'axios';
import FlatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

const form = ref({
  name: "",
  dob: "",
  email: "",
  password: "",
});

const showPassword = ref(false);
const successMessage = ref('');

function togglePassword() {
  showPassword.value = !showPassword.value;
}



function handleRegister() {
  console.log("Form Submitted:", form.value);
  // alert(`Kayıt başarılı: ${form.value.name}`);


    // Convert the 'dob' field into a valid date format 'YYYY-MM-DD'
  const dateParts = form.value.dob.split('-'); // Split by hyphen (assuming it's in 'DD-MM-YY' format)
  if (dateParts.length === 3) {
    // Reformat it into 'YYYY-MM-DD'
    const formattedDate = `20${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    
    form.value.dob = formattedDate; // Assign it back to form.dob
  } else {
    console.error("Invalid date format.");
    alert("Doğum tarihi geçerli formatta değil.");
    return; // Don't proceed if the date is invalid
  }
 

   // Send POST request to backend to register the user
  axios.post('http://localhost:4000/api/user/register', form.value)
    .then(response => {
      const { token, user } = response.data || {};
      if (token) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
      }


       successMessage.value = `Kayıt başarılı: ${form.value.name}`;
      console.log(response.data); // Log success message from backend
      window.location.href = '/profile';
    })
    .catch(error => {
      alert('Kayıt başarısız: ' + error.response.data.message);
      console.error(error.response.data);
    });
}

const dateConfig = {
  dateFormat: "d-m-y",
  allowInput: true,
};
</script>
