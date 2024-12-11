<template>
    <n-layout style="min-height: 100vh; color: #fff;">
      <!-- Navbar -->
      <n-layout-header style="background-color: #1f1f27; padding: 16px;">
        <div class="navbar">
          <n-space align="center" justify="space-between" style="width: 100%;">
            <n-space align="center">
              <n-icon size="24">
                <template #default>
                  <!-- <img src="/logo.svg" alt="Logo" class="logo" /> -->
                </template>
              </n-icon>
              <n-h4 style="margin: 0; color: #fff;">Convert Query To</n-h4>
            </n-space>
            <n-space align="center" size="medium" >
              <n-button text class="!text-white">Home</n-button>
              <!-- <n-button text class="!text-white">About</n-button>
              <n-button text class="!text-white">Contact</n-button> -->
            </n-space>
          </n-space>
        </div>
      </n-layout-header>
  
      <!-- Content -->
      <n-layout-content style="padding: 16px;">
        <slot/>
      </n-layout-content>
  
      <!-- Footer -->
      <n-layout-footer style="text-align: center; background-color: #1f1f27; padding: 16px;">
        <p>© 2024 Convert Query To. All rights reserved by Eduardo Oliveira.</p>
      </n-layout-footer>
    </n-layout>
  </template>
  
  <script setup lang="ts">

  </script>
  
  <style scoped>


  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .logo {
    width: 32px;
    height: 32px;
  }

  .n-layout {
    background-color: #101014;
  }

  .n-layout-content {
    height: 100vh;
  }
  </style>
  