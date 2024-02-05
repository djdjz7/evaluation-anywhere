<script setup lang="ts">
import { onMounted, ref } from "vue";
import { type AnswersToQstFlowWithBlob } from "@/models/Answers";

const props = defineProps<{
  uuid: string;
}>();
const canvasRef = ref<HTMLCanvasElement | null>(null);
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null;

onMounted(() => {
  if (canvasRef.value == null) {
    return;
  }
  canvas = canvasRef.value;

  ctx = canvas.getContext("2d");

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

function mouseup(e: MouseEvent) {
  ctx?.closePath();
  canvas.onmousemove = null;
}

function touchstart(e: TouchEvent) {
  e.stopPropagation();
  const rect = canvas.getBoundingClientRect();
  ctx?.beginPath();
  ctx?.moveTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
  canvas.ontouchmove = touchmove;
}

function touchmove(e: TouchEvent) {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  ctx?.lineTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
  ctx?.stroke();
}

function touchend(e: TouchEvent) {
  ctx?.closePath();
  canvas.ontouchmove = null;
}

const getImageBlobAsync = (): Promise<AnswersToQstFlowWithBlob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob == null) {
        reject(new Error("Canvas.toBlob returned null"));
      } else {
        resolve({
          answers: blob,
          uuid: props.uuid,
        });
      }
    });
  });
};

defineExpose({ getImageBlobAsync });
</script>

<template>
  <canvas ref="canvasRef"></canvas>
</template>
