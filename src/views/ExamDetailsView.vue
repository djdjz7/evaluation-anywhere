<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute();
const examTaskId = route.params.examTaskId;
</script>
<template>
  <span block>ExamDetails</span>
  <span block>{{ examTaskId }}</span>
</template>