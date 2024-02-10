<script setup lang="ts">
import { onMounted, ref } from "vue";
import { type AnswersToQstFlow } from "@/models/Answers";
import { useUserInfoStore } from "@/stores/userInfo";
import { CameraIcon, PhotoIcon } from "@heroicons/vue/24/outline";
import { ossClient } from "@/oss/client";

const props = defineProps<{
  examTaskId: number;
  questionId: number;
  uuid: string;
}>();

const images: Blob[] = [];
const imageBitmaps = new Array<ImageBitmap>();
const accpetedTypes = ["image/png", "image/jpg", "image/jpeg"];

let lastUpdate: number = Date.now();

const cameraInput = ref<HTMLInputElement | null>();
const albumnInput = ref<HTMLInputElement | null>();
const canvasRef = ref<HTMLCanvasElement | null>();
let canvas: HTMLCanvasElement | null | undefined;
let ctx: CanvasRenderingContext2D | null;

const deltaHeight: number[] = [0];

onMounted(() => {
  canvas = canvasRef.value;
  if (canvas == null) {
    alert("未知错误，请刷新页面后重试。");
    return;
  }
  ctx = canvas.getContext("2d");
  if (ctx == null) {
    alert("未知错误，请刷新页面后重试。");
    return;
  }
});

const getQstAnswerAsync = async (): Promise<AnswersToQstFlow> => {
  return new Promise((resolve, reject) => {
    if (canvas == null) {
      reject(new Error("Canvas is null or undefined."));
    } else {
      canvas.toBlob(async (blob) => {
        if (blob == null) {
          reject(new Error("Canvas.toBlob returned null"));
        } else {
          const path = `answers/${useUserInfoStore().userId}/ToCorrect/${props.examTaskId}/${props.questionId}/${props.uuid}}/sketch/answer_${lastUpdate}.${blob.type == "image/webp" ? "webp" : "png"}}`;
          try {
            await ossClient.put(path, blob);
          } catch (e) {
            reject(e);
          }
          resolve({
            answers: [`http://ezy-sxz.oss-cn-hangzhou.aliyuncs.com/${path}`],
            uuid: props.uuid,
          });
        }
      }, "image/webp");
    }
  });
};

function addImage(input: HTMLInputElement | null | undefined) {
  if (images.length >= 3) {
    alert("图片数量已达上限。");
    return;
  }
  input?.click();
}

async function handleImage(input: HTMLInputElement | null | undefined) {
  if (input?.files == null) {
    return;
  }
  if (canvas == null) {
    alert("未知错误，请刷新页面后重试。");
    return;
  }
  if (ctx == null) {
    alert("未知错误，请刷新页面后重试。");
    return;
  }
  const file = input.files[0];
  if (accpetedTypes.indexOf(file.type) < 0) {
    alert("不支持的文件格式");
    return;
  }
  images.push(file);
  const imageBitmap = await createImageBitmap(file);
  imageBitmaps.push(imageBitmap);
  if (imageBitmap.width <= 1600) {
    deltaHeight.push(deltaHeight[deltaHeight.length - 1] + imageBitmap.height);
  } else {
    deltaHeight.push(
      deltaHeight[deltaHeight.length - 1] + imageBitmap.height * (1600 / imageBitmap.width)
    );
  }

  let totalHeight = 0;
  imageBitmaps.forEach((x) => {
    if (x.width <= 1600) {
      totalHeight += x.height;
    } else {
      const resizedHeight = x.height * (1600 / x.width);
      totalHeight += resizedHeight;
    }
  });

  canvas.height = totalHeight;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 1600, totalHeight);

  imageBitmaps.forEach((x, index) => {
    if (x.width <= 1600) {
      const deltax = (1600 - x.width) / 2;
      ctx!.drawImage(x, deltax, deltaHeight[index]);
    } else {
      const ratio = 1600 / x.width;
      const resizedHeight = x.height * ratio;
      ctx!.drawImage(x, 0, deltaHeight[index], 1600, resizedHeight);
    }
  });
  input.files = null;
  lastUpdate = Date.now();
}

defineExpose({ getQstAnswerAsync });
</script>

<template>
  <canvas width="1600" height="0" ref="canvasRef"></canvas>
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
      bg="white dark:dark hover:violet-100 dark:hover:violet-900"
      un-border="1 solid violet"
      focus:outline-none
      shadow-md
      @click="addImage(cameraInput)"
      transition-all
      duration-100
    >
      <CameraIcon class="h-6 m-1" />
    </button>
    <button
      flex="~ items-center"
      rounded="0 tr-md br-md"
      text="dark dark:light"
      bg="white dark:dark hover:violet-100 dark:hover:violet-900"
      un-border="1 solid violet"
      focus:outline-none
      shadow-md
      @click="addImage(albumnInput)"
      class="-m-l-1"
      transition-all
      duration-100
    >
      <PhotoIcon class="h-6 m-1" />
    </button>
  </div>
</template>
