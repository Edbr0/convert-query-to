<template>
  <div>
    <NuxtLayout>
      <n-config-provider :theme="darkTheme">
        <n-dialog-provider>
          <NuxtPage/>
        </n-dialog-provider>
      </n-config-provider>
    </NuxtLayout>
   
  </div>
</template>

<script>
  import { defineComponent } from 'vue'
  import { darkTheme } from 'naive-ui'

  export default defineComponent({
    setup() {
      return {
        darkTheme
      }
    }
  })
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

</style>
