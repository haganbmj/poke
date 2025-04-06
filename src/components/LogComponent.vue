<template>
  <div class="log-title">Last Message:</div>
  <div class="log-entry" v-for="(entry, index) in entries.slice(-1)" :key="index" v-html="entry"></div>
  <div class="log-entry" v-if="entries.length === 0"><code>None</code></div>
</template>

<script lang="ts">
import { PropType } from 'vue';

// Note that this takes in a list, but I'm reverse slicing it down to just the most recent.
// Was originally thinking I might want an actual log.
export default {
  props: {
    entries: {
      type: Array as PropType<Array<String>>,
      required: true,
    },
  },
}
</script>

<style lang="sass" scoped>
.log-title {
  font-size: .8rem;
}

.log-entry {
  font-size: 1.2rem;
}
</style>