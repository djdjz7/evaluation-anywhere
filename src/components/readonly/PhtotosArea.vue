<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { type AnswerList } from "@/models/GetQuestionView";

const props = defineProps<{
  uuid: string;
  answerList: AnswerList[];
  initialized: boolean;
}>();

const answerImage = ref<string | undefined>("");
const answerComment = ref<string | undefined>("");
const revisedImage = ref<string | undefined>("");
const revisedComment = ref<string | undefined>("");

watch(props, (val) => {
  for (let i = 0; i < val.answerList.length; i++) {
    const x = val.answerList[i];
    if (x.uuid == val.uuid) {
      answerImage.value = x.examAnswers[0];
      answerComment.value = x.examComments[0];
      revisedImage.value = x.revisingAnswers[0];
      revisedComment.value = x.revisingComments[0];
      break;
    }
  }
});
</script>

<template>
  <div m-x-2>
    <div flex="~">
      <div self-stretch w-1 rounded-full bg-violet="500 dark:300"></div>
      <h3 m-0 m-l-1>我的答案</h3>
    </div>
    <div v-if="Boolean(answerImage)" w-full relative m-t-2>
      <img w-full :src="answerImage" />
      <img absolute top-0 left-0 w-full v-if="Boolean(answerComment)" :src="answerComment" />
    </div>
  </div>
  <div m-x-2 m-t-4 v-if="Boolean(revisedImage)">
    <div flex="~">
      <div self-stretch w-1 rounded-full bg-violet="500 dark:300"></div>
      <h3 m-0 m-l-1>订正答案</h3>
    </div>
    <div w-full relative m-t-2>
      <img w-full :src="revisedImage" />
      <img absolute top-0 left-0 w-full v-if="Boolean(revisedComment)" :src="revisedComment" />
    </div>
  </div>
</template>
