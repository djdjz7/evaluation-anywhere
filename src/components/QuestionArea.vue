<script setup lang="ts">
import type { Question } from "@/models/GetNoQstExamTask";
import { RadioGroup, RadioGroupOption } from "@headlessui/vue";
import { defineProps } from "vue";
const props = defineProps<{
  question: Question;
}>();
</script>
<template>
  <h3>{{ question.number }}. {{ question.name }}</h3>
  <div v-for="qstFlow in question.qstFlows">
    <!-- if no subQs -->
    <div v-if="Boolean(qstFlow.subQuestions?.length != 0)">
      <RadioGroup v-if="qstFlow.qstType == 1 || qstFlow.qstType == 2">
        <div class="gap-x-2" grid grid-cols-4>
          <RadioGroupOption
            as="template"
            v-for="option in qstFlow.options"
            :key="option"
            :value="option"
            v-slot="{ active, checked }"
          >
            <div
              :class="[
                active ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300' : '',
                checked ? 'bg-sky-900/75 text-white ' : 'bg-white ',
              ]"
              class="relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none"
            >
              <span :class="checked ? 'text-white' : 'text-gray-900'" class="font-medium">
                {{ option }}
              </span>
            </div>
          </RadioGroupOption>
        </div>
      </RadioGroup>
    </div>

    <!-- if has subQs -->
    <div v-else></div>
  </div>
</template>
