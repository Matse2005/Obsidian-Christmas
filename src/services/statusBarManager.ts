import { daysLeft } from '../commands/daysLeft';
import { ConfigManager } from './configManager';
import { ChristmasCountdownCalculator } from './christmasCountdownCalculator';
import ChristmasPlugin from 'main';
import { ChristmasDaysCalculator } from './christmasDaysCalculator';

export class StatusBarManager {
  private statusBar: HTMLElement;
  private configManager: ConfigManager;
  private daysCalculator: ChristmasDaysCalculator;
  private calculator: ChristmasCountdownCalculator;
  private readonly loadingStatusBarText: string = "Christmas Plugin is starting...";
  private readonly statusBarIcon: string = "🎅";

  constructor(private plugin: ChristmasPlugin) {
    this.configManager = plugin.configManager;
    this.daysCalculator = new ChristmasDaysCalculator(this.configManager);
    this.calculator = new ChristmasCountdownCalculator(this.configManager, this.daysCalculator);
    this.initialize();
  }

  private initialize(): void {
    this.statusBar = this.createStatusBarItem(this.loadingStatusBarText);
    this.plugin.registerDomEvent(this.statusBar, 'click', () => daysLeft(this.plugin)); // Fix this line to call daysLeft correctly
    this.updateStatusBarSettings();
  }

  private createStatusBarItem(text: string): HTMLElement {
    const statusBar = this.plugin.addStatusBarItem();
    statusBar.setText(text);
    statusBar.addClass('christmas-statusbar');
    return statusBar;
  }

  public updateStatusBarSettings(): void {
    const beforeChristmas = this.configManager.settings.StatusBarVisibleTimeBeforeChristmas;

    // Check if status bar should be visible
    if (!this.isVisible(beforeChristmas)) {
      this.hideStatusBar();
      return;
    }

    this.showStatusBar();
    this.updateStatusBarText();
  }

  private isVisible(beforeChristmas: string): boolean {
    const daysLeft = this.daysCalculator.calculateDays().daysUntilNext;
    switch (beforeChristmas) {
      case '1 day':
        return daysLeft <= 1;
      case '5 days':
        return daysLeft <= 5;
      case '1 week':
        return daysLeft <= 7;
      case '1 month':
        return daysLeft <= 30;
      case '2 months':
        return daysLeft <= 60;
      case '6 months':
        return daysLeft <= 180;
      case 'Always':
        return true;
      default:
        return false;
    }
  }

  private hideStatusBar(): void {
    this.statusBar.hide();
  }

  private showStatusBar(): void {
    this.statusBar.show();
  }

  private updateStatusBarText(): void {
    const isLargeText = this.configManager.settings.toggleLargeStatusBarText;
    const text = isLargeText ? `${this.statusBarIcon} ${this.calculator.getFormattedCountdown()}` : this.statusBarIcon;
    this.statusBar.setText(text);
  }
}