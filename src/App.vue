<template>
  <article id="nav-header" class="component">
    <nav>
      <ul>
        <li><strong>Poke @ Griselbrand</strong></li>
      </ul>
      <ul>
        <li id="empty-warning" v-if="input.deck === ''">No Decklist Set!</li>
        <li><button class="outline contrast" @click="$refs.configModal.show()">Config</button></li>
      </ul>
    </nav>
  </article>
  <div class="container">
    <div class="body">
      <ConfigModal ref="configModal" @config-change="onConfigChange" />
      <!-- <h4 v-html="prettyPath"></h4> -->
      <section id="log">
        <LogComponent :entries="logEntries" />
      </section>
      <section id="menu">
        <div class="container">
          <NestedMenu :config="activeMenu" :has-parent="traversalPath.length != 0" @traverse="onTraverse" />
        </div>
      </section>
      <!-- <section id="freetext">
        <div class="container">
          <textarea id="freetext-input"></textarea>
        </div>
      </section> -->
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

function expandNestabledMenu(menu: NestableMenu, deck: Array<NestableMenu>): Array<NestableMenu> {
  if (menu.name === "$deck") {
    return deck;
  } else if (menu.name.startsWith("$deck/")) {
    // FIXME: Make this a bit more intelligent.
    const sectionName = menu.name.split("$deck/")[1];
    const matchedSection = deck.filter(it => {
      return (it.name ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() === sectionName;
    })[0];
    return matchedSection?.children ?? [];
  } else if (menu.children !== undefined && menu.children.length > 0) {
    return [{
      ...menu,
      children: menu.children.flatMap(it => { return expandNestabledMenu(it, deck); }),
    }];
  } else {
    return [menu];
  }
}

export default defineComponent({
  name: 'App',
  components: {
    NestedMenu,
    ConfigModal,
    LogComponent,
  },
  data() {
    return {
      input: {
        deck: '' as string,
      },
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
    parsedDeck(): Map<String, Array<String>> {
      if (/\S/.test(this.input.deck)) {
        return new Map(this.input.deck.split(/\n\n+/)
          .map(section => {
            return section
              .split(/\n/)
              .filter(it => it.trim() !== '')
              .map(line => {
                const [ , name ] = /^(?:\d+?x?\s)?(.+?)$/gmi.exec(line.trim()) as Array<String>;
                return name;
              });
          })
          .map(chunk => {
            return [chunk[0].split(':')[0], chunk.slice(1)];
          })
        );
      } else {
        return new Map();
      }
    },
    deckMenuChildren(): Array<NestableMenu> {
      return [...this.parsedDeck].map(([k, v]) => {
        return {
          name: k,
          children: v.map(it => { return { name: it } }),
        } as NestableMenu;
      });
    },
    resolvedMenu(): NestableMenu {
      const expandedMenu = expandNestabledMenu(this.menu, this.deckMenuChildren);
      return expandedMenu[0];
    },
    activeMenu(): NestableMenu {
      let currentPath = this.resolvedMenu;
      for (const path of this.traversalPath) {
        currentPath = (currentPath.children ?? [])[path];
        // console.log(`${path} -> ${JSON.stringify(currentPath)}`);
      }
      return currentPath;
    },
    activePath(): Array<String> {
      // TODO: Error handling to default back to Home if there's an issue.
      let currentPath = this.resolvedMenu;
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
    onConfigChange(config: any): void {
      this.onTraverse(-1);
      this.input.deck = config.deck.trim();
    },
    onTraverse(index: number): void {
      // TODO: Maybe this handles publishing a final path instead of using a watcher?
      if (index == -1) {
        this.traversalPath = [];
      } else {
        this.traversalPath.push(index);
      }
    },
  },
});
</script>

<style>
#nav-header {
  --pico-nav-element-spacing-vertical: 0.25rem;
  --pico-nav-element-spacing-horizontal: 0.5rem;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

#empty-warning {
  color: var(--pico-del-color);
  animation: pulse 2s infinite;
}

#menu {
  height: var(--pico-line-height) * 10rem;
  min-height: var(--pico-line-height) * 10rem;
  margin-bottom: 2rem;
}

#menu .container {
  max-width: 650px;
  align-content: center;
}

#log {
  --pico-block-spacing-vertical: 3rem;
  max-height: 100px;
  overflow-y: scroll;
}

#freetext-input {
  height: 8rem;
}
</style>
