<template>
  <div v-for="(entry, index) in entries" :key="index" v-html="entry"></div>
</template>

<script lang="ts">
import { PropType } from 'vue';

export default {
  props: {
    entries: {
      type: Array as PropType<Array<String>>,
      required: true,
    },
  },
}
</script>