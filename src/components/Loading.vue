<script setup lang="ts"></script>

<template>
  <div
    backdrop-blur-lg
    fixed
    top-0
    left-0
    right-0
    bottom-0
    z-999
    flex="~ items-center justify-center"
    overflow-y-scroll
    overflow-x-clip
  >
    <div bg-light dark:bg-dark rounded-4 p-6 shadow-lg>
      <div w-8 h-8 rounded-full p-1 class="circle">
        <div w-full h-full rounded-full bg-light dark:bg-dark></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.circle {
  background-image: conic-gradient(transparent, transparent, gray, gray, gray);
  animation: loading-animation linear 1s infinite;
}

@keyframes loading-animation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
