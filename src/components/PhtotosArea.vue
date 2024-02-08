<script setup lang="ts">
import { ref } from "vue";
import { type AnswersToQstFlow } from "@/models/Answers";
import { useUserInfoStore } from "@/stores/userInfo";

const props = defineProps<{
  examTaskId: number;
  questionId: number;
  uuid: string;
}>();

const images: Blob[] = [];
const imageSrc = ref<string[]>([]);

let lastUpdate: number = Date.now();

const hiddenInput = ref<HTMLInputElement | null>();

const getQstAnswerAsync = (): Promise<AnswersToQstFlow> => {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        // TODO: merge images and put object

        answers: [
          `http://ezy-sxz.oss-cn-hangzhou.aliyuncs.com/answers/${useUserInfoStore().userId}/ToCorrect/${props.examTaskId}/${props.questionId}/${props.uuid}}/sketch/answer_${lastUpdate}.webp`,
        ],
        uuid: props.uuid,
      });
    } catch (e) {
      reject(e);
    }
  });
};

function addImage() {
  if (images.length >= 3) {
    alert("图片数量已达上限。");
    return;
  }
  hiddenInput.value?.click();
}

function handleImage() {
  if (hiddenInput.value?.files == null) {
    return;
  }
  const file = hiddenInput.value.files[0];
  images.push(file);
  imageSrc.value.push(URL.createObjectURL(file));
  hiddenInput.value.files = null;
}

defineExpose({ getQstAnswerAsync });
</script>

<template>
  <img v-for="image in imageSrc" :src="image" />
  <input
    capture="environment"
    hidden
    type="file"
    accpet="image/png, image/jpg, image/jpeg"
    ref="hiddenInput"
    @change="handleImage"
  />
  <button @click="addImage"></button>
  <!--TODO: photos upload -->
</template>
