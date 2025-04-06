<template>
  <article id="nav-header" class="component">
    <nav>
      <ul>
        <li><strong>Poke @ Griselbrand</strong></li>
      </ul>
      <ul>
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
      return it.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() === sectionName;
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
        deck: `
          Pokémon
          3 Hoothoot SCR 114
          1 Hoothoot PRE 77
          4 Noctowl SCR 115
          2 Wellspring Mask Ogerpon ex
          2 Teal Mask Ogerpon ex TWM 25
          2 Fan Rotom SCR 118
          1 Bloodmoon Ursaluna ex TWM 141
          1 Pikachu ex SSP 57
          1 Fezandipiti ex SFA 38
          1 Ditto MEW 132
          1 Terapagos ex SCR 128
          1 Mew ex MEW 151
          1 Lillie's Clefairy ex JTG 56
          1 Cornerstone Mask Ogerpon ex TWM 112
          1 Latias ex SSP 76

          Trainer
          3 Crispin SCR 133
          2 Boss's Orders PAL 172
          1 Iono PAL 185
          1 Professor Turo's Scenario PAR 171
          1 Judge SVI 176
          1 Professor's Research JTG 155
          4 Ultra Ball SVI 196
          4 Nest Ball SVI 181
          3 Energy Switch SVI 173
          2 Night Stretcher SFA 61
          1 Earthen Vessel PAR 163
          1 Counter Catcher PAR 160
          1 Sparkling Crystal SCR 142
          2 Area Zero Underdepths SCR 131


          Energy
          4 Grass Energy SVE 9
          2 Psychic Energy SVE 13
          1 Water Energy SVE 11
          1 Metal Energy SVE 16
          1 Lightning Energy SVE 12
          1 Fighting Energy SVE 14
        ` as String,
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
          return [chunk[0], chunk.slice(1)];
        })
      );
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
      this.input.deck = config.deck;
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
</style>
