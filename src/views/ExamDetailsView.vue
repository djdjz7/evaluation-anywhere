<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute();
const examId = route.params.examId;
const examState = Number(route.query.examState);
const taskState = Number(route.query.taskState);
const isNoStem = (route.query.isNoStem as string).toLowerCase() === "true";
</script>
<template>
  <span block>{{ examId }}</span>
  <span block>examState: {{ examState }}</span>
  <span block>taskState: {{ taskState }}</span>
  <span block>isNoStem: {{ isNoStem }}</span>
</template>
