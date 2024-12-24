import { Plugin } from 'obsidian';
import { daysLeftCommand } from 'src/commands/daysLeft';
import { ConfigManager } from 'src/services/configManager';
import { ChristmasSettingTab } from 'src/services/settingsTab';
import { StatusBarManager } from 'src/services/statusBarManager';

export default class ChristmasPlugin extends Plugin {
	configManager: ConfigManager;
	statusBarManager: StatusBarManager;

	async onload() {
		this.configManager = new ConfigManager(this);
		await this.configManager.loadSettings();

		this.addSettingTab(new ChristmasSettingTab(this.app, this));

		this.injectCSS();

		daysLeftCommand(this);

		this.statusBarManager = new StatusBarManager(this);
		this.statusBarManager.updateStatusBarSettings();

		this.registerInterval(window.setInterval(() => {
			this.statusBarManager.updateStatusBarSettings();
		}, 1000));
	}

	async onunload() {
		await this.configManager.saveSettings();
	}

	injectCSS() {
		const css = `
      .christmas-statusbar {
        cursor: pointer;
      }

      .christmas-statusbar:hover {
        background-color: var(--background-modifier-hover);
      }
    `;

		const style = document.createElement('style');
		style.textContent = css;
		document.head.appendChild(style);
	}
}