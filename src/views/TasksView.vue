<script setup lang="ts">
import { TabGroup, TabList, Tab } from "@headlessui/vue";
import ExamCard from "@/components/ExamCard.vue";
import Loading from "@/components/Loading.vue";
import { type CommonResponse } from "@/models/CommonResponse";
import { type GetStudentTaskListResult } from "@/models/GetStudentTaskListResult";
import { onActivated, onMounted, ref } from "vue";
import type { Exam } from "@/models/GetStudentTaskListResult";

import { axiosInstance } from "@/request/axiosInstance";
import type { GetInfoResult } from "@/models/Login";
import { UserCircleIcon, ArrowLeftStartOnRectangleIcon } from "@heroicons/vue/24/outline";
import { useUserInfoStore } from "@/stores/userInfo";
import { useRoute, useRouter } from "vue-router";

const exams = ref(Array<Exam>());
const avatarSrc = ref<string | null>(null);
const studentName = ref("");
const router = useRouter();
let currentPage = 1;
let isLoading = ref(false);
let isToBottom = false;
let selectedIndex = 0;

onActivated(async () => {
  isLoading.value = false;
  if (useRoute().query.needRefresh == "true") {
    router.push("/");
    currentPage = 0;
    isLoading.value = true;
    const getUserInfoRespose = (await axiosInstance.get("api/services/app/User/GetInfoAsync"))
      .data as CommonResponse<GetInfoResult>;
    studentName.value = getUserInfoRespose.result.realName;
    avatarSrc.value = getUserInfoRespose.result.photo;

    const getStudentTaskListResponse = (
      await axiosInstance.post("api/services/app/Task/GetStudentTaskListAsync", {
        maxResultCount: 90,
        skipCount: 0,
        taskListType: selectedIndex + 1,
      })
    ).data as CommonResponse<GetStudentTaskListResult>;
    exams.value = getStudentTaskListResponse.result.items;
    isLoading.value = false;
  }
});

onMounted(async () => {
  // alert(
  //   "注意：\n本项目所有实现均为基于事实的猜测，与新测评行为并不完全一致。\n请自行承担使用后果。"
  // );
  try {
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
  } catch {
    alert("异常");
  }
});

async function tabChange(index: number) {
  selectedIndex = index;
  isLoading.value = true;
  const getStudentTaskListResponse = (
    await axiosInstance.post("api/services/app/Task/GetStudentTaskListAsync", {
      maxResultCount: 90,
      skipCount: 0,
      taskListType: index + 1,
    })
  ).data as CommonResponse<GetStudentTaskListResult>;

  exams.value = getStudentTaskListResponse.result.items;
  if (exams.value.length < 90) isToBottom = true;
  else isToBottom = false;

  currentPage = 0;
  isLoading.value = false;
}

async function handleScroll(e: Event) {
  if (isLoading.value || isToBottom) {
    return;
  }
  const target = e.target as unknown as HTMLDivElement;
  const fullHeight = target.scrollHeight;
  const currentHeight = target.scrollTop + target.clientHeight;
  if (fullHeight - currentHeight < 100) {
    isLoading.value = true;
    const getStudentTaskListResponse = (
      await axiosInstance.post("api/services/app/Task/GetStudentTaskListAsync", {
        maxResultCount: 90,
        skipCount: currentPage * 90,
        taskListType: selectedIndex + 1,
      })
    ).data as CommonResponse<GetStudentTaskListResult>;
    if (getStudentTaskListResponse.result.items.length == 0) {
      isToBottom = true;
      isLoading.value = false;
      return;
    }
    exams.value = exams.value.concat(getStudentTaskListResponse.result.items);
    currentPage++;
    isLoading.value = false;
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
  router.push("/login");
}
</script>

<template>
  <div flex="~ col" m-x-2>
    <div class="group" flex="~ items-center" m-t-2 relative self-start>
      <div v-if="avatarSrc" rounded-full overflow-clip h-8 w-8 m-r-2 shadow-md>
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
          class="!text-red !hover:bg-white"
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
      <TabList
        space-x-2
        overflow-x-auto
        p-2
        bg="violet-200 dark:violet-900/40"
        rounded-xl
        shadow-lg
        flex
        flex-shrink-0
      >
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
      bg="violet-200 dark:violet-900/40"
      m-y-2
      grid="~ cols-1 lg:cols-4 md:cols-3"
      gap-2
      flex-shrink-1
      overflow-y-auto
    >
      <div v-for="exam in exams" :key="exam.examTaskId">
        <ExamCard :exam="exam" />
      </div>
    </div>
  </div>
  <Loading v-if="isLoading" />
</template>

<style scoped>
button {
  --at-apply: "bg-white hover:bg-violet-100 focus:outline-none focus:bg-violet-100 p-x-4 p-y-2 text-black border-0 shadow-md rounded-md transition-all duration-150";
}
button[data-headlessui-state~="selected"] {
  --at-apply: "bg-violet-500 hover:bg-violet focus:bg-violet text-white shadow-violet-700 shadow-inner ";
}
</style>
