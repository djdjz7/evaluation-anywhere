<script setup lang="ts">
import { ref } from "vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";

const isShowing = ref(false);

export interface Props {
  title: string;
  canClose?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  canClose: true,
});

const show = () => {
  isShowing.value = true;
};

defineExpose({ show });
</script>

<template>
  <Transition>
    <div
      v-if="isShowing"
      md:backdrop-blur-lg
      fixed
      top-0
      left-0
      right-0
      bottom-0
      md:flex="~ col items-center justify-center"
      overflow-y-scroll
      overflow-x-clip
    >
      <div
        bg-violet-100
        dark:bg-dark
        md:rounded-4
        absolute
        top-0
        bottom-0
        left-0
        right-0
        md:relative
        p-6
        md:p-12
        md:shadow-lg
        md:w-192
      >
        <h1>{{ props.title }}</h1>
        <button
          bg="violet-200 dark:violet-900/20"
          focus:ring="2 offset-1 violet/50 offset-transparent"
          transition-all
          duration-150
          v-if="props.canClose"
          flex="~ justify-center items-center"
          h-10
          w-10
          rounded-full
          border-none
          absolute
          top-6
          right-6
          md:top-12
          md:right-12
          dark-bg-dark
          @click="isShowing = false"
        >
          <XMarkIcon class="h-6" />
        </button>
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>
