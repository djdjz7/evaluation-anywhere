<script setup lang="ts">
import { ref } from "vue";
import { type AnswersToQstFlow } from "@/models/Answers";
import { useUserInfoStore } from "@/stores/userInfo";
import { CameraIcon, PhotoIcon } from "@heroicons/vue/24/outline";

const props = defineProps<{
  examTaskId: number;
  questionId: number;
  uuid: string;
}>();

const images: Blob[] = [];
const imageSrc = ref<string[]>([]);
const accpetedTypes = ["image/png", "image/jpg", "image/jpeg"];

let lastUpdate: number = Date.now();

const cameraInput = ref<HTMLInputElement | null>();
const albumnInput = ref<HTMLInputElement | null>();

const getQstAnswerAsync = async (): Promise<AnswersToQstFlow> => {
  // TODO: merge images and put object
  return {
    answers: [
      `http://ezy-sxz.oss-cn-hangzhou.aliyuncs.com/answers/${useUserInfoStore().userId}/ToCorrect/${props.examTaskId}/${props.questionId}/${props.uuid}}/sketch/answer_${lastUpdate}.webp`,
    ],
    uuid: props.uuid,
  };
};

function addImage(input: HTMLInputElement | null | undefined) {
  if (images.length >= 3) {
    alert("图片数量已达上限。");
    return;
  }
  input?.click();
}

function handleImage(input: HTMLInputElement | null | undefined) {
  if (input?.files == null) {
    return;
  }
  const file = input.files[0];
  if (accpetedTypes.indexOf(file.type) < 0) {
    alert("不支持的文件格式");
    return;
  }
  images.push(file);
  imageSrc.value.push(URL.createObjectURL(file));
  input.files = null;
}

defineExpose({ getQstAnswerAsync });
</script>

<template>
  <img v-for="image in imageSrc" :src="image" w-full />
  <input
    capture="environment"
    un-hidden
    type="file"
    accpet="image/png, image/jpg, image/jpeg"
    ref="cameraInput"
    @change="handleImage(cameraInput)"
  />
  <input
    un-hidden
    type="file"
    accpet="image/png, image/jpg, image/jpeg"
    ref="albumnInput"
    @change="handleImage(albumnInput)"
  />
  <div flex="~ items-center justify-center">
    <button
      flex="~ items-center"
      rounded="0 tl-md bl-md"
      text="dark dark:light"
      bg="white dark:dark"
      un-border="1 solid violet"
      focus:outline-none
      @click="addImage(cameraInput)"
    >
      <CameraIcon class="h-8" />
    </button>
    <button
      flex="~ items-center"
      rounded="0 tr-md br-md"
      text="dark dark:light"
      bg="white dark:dark"
      un-border="1 solid violet"
      focus:outline-none
      @click="addImage(albumnInput)"
      class="-m-l-1"
    >
      <PhotoIcon class="h-8" />
    </button>
  </div>
</template>
