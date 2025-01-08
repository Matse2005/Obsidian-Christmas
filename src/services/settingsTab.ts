import ChristmasPlugin from '../../main';
import { App, Notice, PluginSettingTab, Setting } from 'obsidian';

export class ChristmasSettingTab extends PluginSettingTab {
  plugin: ChristmasPlugin;

  constructor(app: App, plugin: ChristmasPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName('Christmas day')
      .setDesc('The calendar day of Christmas at your location')
      .addText((text) =>
        text
          .setPlaceholder('25')
          .setValue(this.plugin.configManager.settings.ChristmasDay.toString())
          .onChange(async (value) => {
            const day = parseInt(value, 10);
            if (!isNaN(day) && day >= 1 && day <= 31) {
              this.plugin.configManager.settings.ChristmasDay = day;
              await this.plugin.configManager.saveSettings();
            } else if (value.trim() == "") {
              // Ignore
            } else {
              new Notice('Invalid day. Please enter a number between 1 and 31.');
            }
          })
      );

    new Setting(containerEl)
      .setName('Christmas month')
      .setDesc('The calendar month of Christmas at your location')
      .addDropdown((dropdown) =>
        dropdown
          .addOptions({
            '1': 'January',
            '2': 'February',
            '3': 'March',
            '4': 'April',
            '5': 'May',
            '6': 'June',
            '7': 'July',
            '8': 'August',
            '9': 'September',
            '10': 'October',
            '11': 'November',
            '12': 'December',
          })
          .setValue(this.plugin.configManager.settings.ChristmasMonth.toString())
          .onChange(async (value) => {
            this.plugin.configManager.settings.ChristmasMonth = parseInt(value);
            await this.plugin.configManager.saveSettings();
          })
      );

    const visibilityOptions: Record<string, string> = {
      '1 day': '1 day',
      '5 days': '5 days',
      '1 week': '1 week',
      '1 month': '1 month',
      '2 months': '2 months',
      '6 months': '6 months',
      'Always': 'Always',
    };

    new Setting(containerEl)
      .setName('Statusbar visible time before Christmas')
      .setDesc('Make the Christmas Statusbar show up on a specific time before Christmas')
      .addDropdown((dropdown) =>
        dropdown
          .addOptions(visibilityOptions)
          .setValue(this.plugin.configManager.settings.StatusBarVisibleTimeBeforeChristmas)
          .onChange(async (value) => {
            this.plugin.configManager.settings.StatusBarVisibleTimeBeforeChristmas = value;
            await this.plugin.configManager.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Large Statusbar text')
      .setDesc('Enable or disable large text in the status bar')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.configManager.settings.toggleLargeStatusBarText)
          .onChange(async (value) => {
            this.plugin.configManager.settings.toggleLargeStatusBarText = value;
            await this.plugin.configManager.saveSettings();
          })
      );
  }
}