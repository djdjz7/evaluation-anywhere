<script setup lang="ts">
import { onMounted, ref } from "vue";
import { type AnswersToQstFlow } from "@/models/Answers";
import { useUserInfoStore } from "@/stores/userInfo";
import { ossClient } from "@/oss/client";

const props = defineProps<{
  examTaskId: number;
  questionId: number;
  uuid: string;
}>();
const canvasRef = ref<HTMLCanvasElement | null>(null);
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null;
let lastUpdate = Date.now();

onMounted(() => {
  if (canvasRef.value == null) {
    return;
  }
  canvas = canvasRef.value;

  ctx = canvas.getContext("2d");
  if (ctx == null) {
    alert("未知错误，请刷新页面后重试。");
    return;
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  canvas.onmousedown = mousedown;
  canvas.onmouseup = mouseup;
  canvas.ontouchstart = touchstart;
  canvas.ontouchend = touchend;
});

function mousedown(e: MouseEvent) {
  ctx?.beginPath();
  ctx?.moveTo(e.offsetX, e.offsetY);
  canvas.onmousemove = mousemove;
}

function mousemove(e: MouseEvent) {
  ctx?.lineTo(e.offsetX, e.offsetY);
  ctx?.stroke();
}

function mouseup() {
  ctx?.closePath();
  canvas.onmousemove = null;
  lastUpdate = Date.now();
}

function touchstart(e: TouchEvent) {
  e.preventDefault();
  e.stopPropagation();
  const rect = canvas.getBoundingClientRect();
  ctx?.beginPath();
  ctx?.moveTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
  canvas.addEventListener("touchmove", touchmove, { passive: false });
}

const touchmove = (e: TouchEvent) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  ctx?.lineTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
  ctx?.stroke();
};

function touchend() {
  ctx?.closePath();
  canvas.ontouchmove = null;
  lastUpdate = Date.now();
}

const getQstAnswerAsync = async (): Promise<AnswersToQstFlow> => {
  return new Promise((resolve, reject) => {
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
  });
};

defineExpose({ getQstAnswerAsync });
</script>

<template>
  <canvas ref="canvasRef" bg-white un-border="violet 1 solid"></canvas>
</template>
