<script setup lang="ts">
import { TabGroup, TabList, Tab } from "@headlessui/vue";

import ExamCard from "@/components/ExamCard.vue";
import { type CommonResponse } from "@/models/CommonResponse";
import { type GetStudentTaskListResult } from "@/models/GetStudentTaskListResult";
import tasksResponse from "@/references/get-student-task-list-response-reference.json";

let exams = (tasksResponse as unknown as CommonResponse<GetStudentTaskListResult>).result.items;
</script>

<template>
  <div grid="~ cols-4" gap-2>
    <div v-for="exam in exams">
      <ExamCard :exam="exam" />
    </div>
  </div>
</template>
