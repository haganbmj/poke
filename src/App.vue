<template>
  <div class="container">
    <div class="header">
      <!-- <button class="btn p-centered" @click="$refs.configModal.show()">Config</button> -->
    </div>
    <div class="body">
      <ConfigModal ref="configModal" />
      <h4 v-html="prettyPath"></h4>
      <section id="menu">
        <NestedMenu :config="activeMenu" :has-parent="traversalPath.length != 0" @traverse="onTraverse" />
      </section>
      <section id="log">
        <LogComponent :entries="logEntries" />
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import ConfigModal from './components/ConfigModal.vue';
import NestedMenu from './components/NestedMenu.vue';
import { NestableMenu } from '@/types/NestableMenu';
import menuOptions from './menuOptions';
import LogComponent from './components/LogComponent.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  components: {
    NestedMenu,
    ConfigModal,
    LogComponent,
  },
  data() {
    return {
      menu: menuOptions as NestableMenu,
      traversalPath: [] as Array<number>,
      logEntries: [] as Array<String>,
    }
  },
  watch: {
    activeMenu: function(newValue: NestableMenu): void {
      if (newValue.children == undefined || newValue.children.length == 0) {
        // Is there some race condition here or if it's all cascading computeds am I okay?
        this.logEntries.push(this.prettyPath)
        this.traversalPath = [];
      }
    },
  },
  computed: {
    activeMenu(): NestableMenu {
      let currentPath = this.menu;
      for (const path of this.traversalPath) {
        currentPath = (currentPath.children ?? [])[path];
        console.log(`${path} -> ${JSON.stringify(currentPath)}`)
      }
      return currentPath;
    },
    activePath(): Array<String> {
      let currentPath = this.menu;
      let namedPath = [];
      for (const path of this.traversalPath) {
        currentPath = (currentPath.children ?? [])[path];
        namedPath.push(currentPath.name);
      }
      return namedPath;
    },
    prettyPath(): String {
      const effectivePath = this.activePath;
      if (effectivePath.length == 0) {
        effectivePath.push('Home');
      }
      return effectivePath.map(it => `<code>${it}</code>`).join(" > ");
    }
  },
  methods: {
    onTraverse(index: number): void {
      console.log('traverse: ' + index);
      if (index == -1) {
        this.traversalPath = [];
      } else {
        this.traversalPath.push(index);
      }
    }
  }
})
</script>

<style>
.body {
  margin-top: 50px;
}

#log {
  max-height: 100px;
  overflow-y: scroll;
}
</style>
