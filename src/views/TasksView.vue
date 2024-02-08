<script setup lang="ts">
import { TabGroup, TabList, Tab } from "@headlessui/vue";
import ExamCard from "@/components/ExamCard.vue";
import { type CommonResponse } from "@/models/CommonResponse";
import { type GetStudentTaskListResult } from "@/models/GetStudentTaskListResult";
import { onMounted, ref } from "vue";
import type { Exam } from "@/models/GetStudentTaskListResult";

import { axiosInstance } from "@/request/axiosInstance";
import type { GetInfoResult } from "@/models/Login";
import { UserCircleIcon, ArrowLeftStartOnRectangleIcon } from "@heroicons/vue/24/outline";
import router from "@/router";
import { useUserInfoStore } from "@/stores/userInfo";

// let exams = (tasksResponse as unknown as CommonResponse<GetStudentTaskListResult>).result.items;

const exams = ref(Array<Exam>());
let selectedIndex = 0;
const avatarSrc = ref<string | null>(null);
const studentName = ref("");

let currentPage = 1;
let isLoading = false;
let isToBottom = false;
onMounted(async () => {
  const getUserInfoRespose = (await axiosInstance.get("api/services/app/User/GetInfoAsync"))
    .data as CommonResponse<GetInfoResult>;
  studentName.value = getUserInfoRespose.result.realName;
  avatarSrc.value = getUserInfoRespose.result.photo;

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
  selectedIndex = index;
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
        taskListType: selectedIndex + 1,
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

function logOut() {
  useUserInfoStore().$patch({
    userId: 0,
    accessToken: "",
    expiresAt: 0,
    refreshToken: "",
    refreshExpiresAt: 0,
  });
  router
}
</script>

<template>
  <div flex="~ col" max-h-screen>
    <div class="group" flex="~ items-center" m-t-2 relative self-start>
      <div v-if="avatarSrc" rounded-full overflow-clip h-8 w-8 m-r-2>
        <img :src="avatarSrc" h-8 />
      </div>
      <UserCircleIcon v-else class="h-8 w-8 m-r-2" />
      <span font-semibold>{{ studentName }}</span>
      <div
        absolute
        top-0
        left-0
        min-w-min
        h-full
        backdrop-blur-lg
        invisible
        group-hover:visible
        opacity-0
        group-hover:opacity-100
        rounded-lg
        transition-all
        duration-150
        shadow-md
        flex="~ items-center"
        class="bg-white/80"
      >
        <button
          @click="logOut"
          p-x-2
          bg-transparent
          text-red
          flex="~ items-center justify-center"
          border-0
          whitespace-nowrap
        >
          <ArrowLeftStartOnRectangleIcon class="h-4 w-4" />
          <span m-l-1 font-semibold>退出登录</span>
        </button>
      </div>
    </div>
    <TabGroup max-w-screen m-t-2 @change="tabChange">
      <TabList space-x-2 overflow-x-auto p-2 bg-slate-300 rounded-3xl shadow-lg flex flex-shrink-0>
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
