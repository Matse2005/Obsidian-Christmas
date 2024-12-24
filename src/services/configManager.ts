import ChristmasPlugin from "main";

interface ChristmasSettings {
  StatusBarVisibleTimeBeforeChristmas: string;
  toggleLargeStatusBarText: boolean;
  ChristmasDay: number;
  ChristmasMonth: number;
}

const DEFAULT_SETTINGS: Partial<ChristmasSettings> = {
  StatusBarVisibleTimeBeforeChristmas: '1 month',
  toggleLargeStatusBarText: true,
  ChristmasDay: 25,
  ChristmasMonth: 12,
};

export class ConfigManager {
  plugin: ChristmasPlugin;
  settings: ChristmasSettings;

  constructor(plugin: ChristmasPlugin) {
    this.plugin = plugin;
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.plugin.loadData());
  }

  async saveSettings() {
    await this.plugin.saveData(this.settings);
    this.plugin.app.workspace.trigger('settings-changed');
  }
}