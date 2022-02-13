<template>
  <div style="display: none">LoadingMask Inserted</div>
</template>

<script setup>
import {watch} from "vue";
import {ElLoading} from "element-plus";
import {useCounterStore} from "@/store/counter";

const store = useCounterStore();

let loadService = null;

watch(() => store.isLoading, (newStatus) => {
  if (newStatus) {
    loadService = ElLoading.service({
      lock: true,
      text: "Loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
  } else {
    if (loadService) {
      loadService.close();
    }
  }
});

</script>

<style scoped>

</style>