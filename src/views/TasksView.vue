<script setup lang="ts">
import { TabGroup, TabList, Tab } from "@headlessui/vue";

import { useUserInfoStore } from "@/stores/userInfo";
import ExamCard from "@/components/ExamCard.vue";
import { type CommonResponse } from "@/models/CommonResponse";
import { type GetStudentTaskListResult } from "@/models/GetStudentTaskListResult";
import tasksResponse from "@/references/get-student-task-list-response-reference.json";
import { onMounted, ref } from "vue";
import type { Exam } from "@/models/GetStudentTaskListResult";

import { axiosInstance } from "@/request/axiosInstance";

// let exams = (tasksResponse as unknown as CommonResponse<GetStudentTaskListResult>).result.items;

const exams = ref(Array<Exam>());
onMounted(async () => {
  const getStudentTaskListResponse = (
    await axiosInstance.post(
      "api/services/app/Task/GetStudentTaskListAsync",
      {
        maxResultCount: 90,
        skipCount: 0,
        taskListType: 1,
      },
    )
  ).data as CommonResponse<GetStudentTaskListResult>;
  exams.value = getStudentTaskListResponse.result.items;
});
</script>

<template>
  <div grid="~ cols-1 lg:cols-4 md:cols-3" gap-2>
    <div v-for="exam in exams">
      <ExamCard :exam="exam" />
    </div>
  </div>
</template>
