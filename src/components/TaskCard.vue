<script setup lang="ts">
const props = defineProps<{
  examTaskId: number;
  topicName: string;
  examName: string;
  examState: number;
  startTime?: string;
  endTime?: string;
  answeringUrge?: number;
  revisingUrge?: number;
  isRead?: boolean;
  isExempted: boolean;
}>();
</script>
<template>
  <div
    class="group"
    flex="~ row"
    bg-light
    dark:bg-dark
    shadow-md
    hover:shadow-lg
    min-h-25
    transition-all
    duration-200
    text-start
    p-3
    text-nowrap
    rounded-lg
    m-1.5
  >
    <div truncate flex="~ col" flex-grow-1>
      <div flex="~ items-center">
        <span block truncate font-bold text-lg>{{ props.examName }}</span>
        <span
          v-if="props.isExempted"
          text-sm
          m-l-2
          bg-green-500
          dark:bg-green
          w-2
          h-2
          rounded-full
        ></span>
      </div>
      <div flex="~ col" flex-grow-1>
        <div flex="~">
          <div bg-blue-600 dark:bg-blue-300 w-.6 m-r-1 h-auto rounded-full></div>
          <span text-blue-600 dark:text-blue-300 rounded-sm text-sm w-fit>{{
            props.topicName
          }}</span>
        </div>
        <span block text-sm text-gray-600 dark:text-gray-300>{{ props.startTime }}</span>
        <div text-red color-red fill-red>
          <span v-if="answeringUrge != 0" text-sm flex>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              w-4
              m-r-1
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
              />
            </svg>

            {{ props.answeringUrge }}
          </span>
        </div>
      </div>
    </div>

    <div
      flex="~ items-center"
      transition-transform
      duration-200
      group-hover:translate-x-1
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
      </svg>
    </div>
  </div>
</template>
