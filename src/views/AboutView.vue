<script setup lang="ts">
import DialogComponent from "@/components/DialogComponent.vue";
import { ref } from "vue";

const dialog = ref<InstanceType<typeof DialogComponent> | null>(null);

const click = async () => {
  await dialog.value?.showDialog("test", "test");
};
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button> <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <button @click="click">aaaa</button>
  <DialogComponent ref="dialog"></DialogComponent>
</template>

<style></style>
