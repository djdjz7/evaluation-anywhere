<script setup lang="ts">
import { RouterView } from "vue-router";
import { KeepAlive } from "vue";
</script>

<template>
  <RouterView v-slot="{ Component }">
    <KeepAlive>
      <component v-if="$route.meta.keepAlive" :is="Component" />
    </KeepAlive>
    <component v-if="!$route.meta.keepAlive" :is="Component" />
  </RouterView>
</template>
