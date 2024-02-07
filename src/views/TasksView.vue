<script setup lang="ts">
import { TabGroup, TabList, Tab } from "@headlessui/vue";
import ExamCard from "@/components/ExamCard.vue";
import { type CommonResponse } from "@/models/CommonResponse";
import { type GetStudentTaskListResult } from "@/models/GetStudentTaskListResult";
import { onMounted, ref } from "vue";
import type { Exam } from "@/models/GetStudentTaskListResult";

import { axiosInstance } from "@/request/axiosInstance";

// let exams = (tasksResponse as unknown as CommonResponse<GetStudentTaskListResult>).result.items;

const exams = ref(Array<Exam>());
const selectedIndex = ref(0);
let currentPage = 1;
let isLoading = false;
let isToBottom = false;
onMounted(async () => {
  const getStudentTaskListResponse = (
    await axiosInstance.post("api/services/app/Task/GetStudentTaskListAsync", {
      maxResultCount: 90,
      skipCount: 0,
      taskListType: 1,
    })
  ).data as CommonResponse<GetStudentTaskListResult>;
  exams.value = getStudentTaskListResponse.result.items;
});

async function tabChange(index: number) {
  isLoading = true;
  exams.value = [];
  const getStudentTaskListResponse = (
    await axiosInstance.post("api/services/app/Task/GetStudentTaskListAsync", {
      maxResultCount: 90,
      skipCount: 0,
      taskListType: index + 1,
    })
  ).data as CommonResponse<GetStudentTaskListResult>;
  exams.value = getStudentTaskListResponse.result.items;
  currentPage = 0;
  isLoading = false;
  isToBottom = false;
}

async function handleScroll(e: Event) {
  if (isLoading || isToBottom) {
    return;
  }
  const target = e.target as unknown as HTMLDivElement;
  const fullHeight = target.scrollHeight;
  const currentHeight = target.scrollTop + target.clientHeight;
  if (fullHeight - currentHeight < 100) {
    isLoading = true;
    const getStudentTaskListResponse = (
      await axiosInstance.post("api/services/app/Task/GetStudentTaskListAsync", {
        maxResultCount: 90,
        skipCount: currentPage * 90,
        taskListType: selectedIndex.value + 1,
      })
    ).data as CommonResponse<GetStudentTaskListResult>;
    if (getStudentTaskListResponse.result.items.length == 0) {
      isToBottom = true;
      isLoading = false;
      return;
    }
    exams.value = exams.value.concat(getStudentTaskListResponse.result.items);
    currentPage++;
    isLoading = false;
  }
}
</script>

<template>
  <div flex="~ col" max-h-screen>
    <TabGroup max-w-screen m-t-2 @change="tabChange" :selected-index="selectedIndex">
      <TabList space-x-2 overflow-x-auto p-2 bg-slate-300 rounded-2xl shadow-lg flex flex-shrink-0>
        <Tab flex-shrink-0>待处理</Tab>
        <Tab flex-shrink-0>全部测评</Tab>
        <Tab flex-shrink-0>收藏夹</Tab>
        <Tab flex-shrink-0>已完成</Tab>
      </TabList>
    </TabGroup>
    <div
      @scroll="handleScroll"
      rounded-xl
      shadow-xl
      p-2
      bg-slate-300
      m-y-2
      grid="~ cols-1 lg:cols-4 md:cols-3"
      gap-2
      flex-shrink-1
      overflow-y-scroll
    >
      <div v-for="exam in exams">
        <ExamCard :exam="exam" />
      </div>
    </div>
  </div>
</template>
