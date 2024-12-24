import { ConfigManager } from './configManager';

interface ChristmasDays {
  daysUntilNext: number;
  daysSinceLast: number | null;  // null if we're before first Christmas of the year
  isChristmas: boolean;
}

export class ChristmasDaysCalculator {
  private configManager: ConfigManager;

  constructor(configManager: ConfigManager) {
    this.configManager = configManager;
  }

  calculateDays(): ChristmasDays {
    // Get the current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get Christmas day and month from configuration
    // const { day: christmasDay, month: christmasMonth } = this.configManager.getChristmasDayAndMonth();
    const christmasDay = this.configManager.settings.ChristmasDay;
    const christmasMonth = this.configManager.settings.ChristmasMonth

    // Create Date objects for this year's and next year's Christmas
    const thisYearChristmas = new Date(today.getFullYear(), christmasMonth - 1, christmasDay);
    thisYearChristmas.setHours(0, 0, 0, 0);

    const nextYearChristmas = new Date(today.getFullYear() + 1, christmasMonth - 1, christmasDay);
    nextYearChristmas.setHours(0, 0, 0, 0);

    const oneDay = 1000 * 60 * 60 * 24;

    // Check if it's Christmas
    if (today.getTime() === thisYearChristmas.getTime()) {
      return {
        daysUntilNext: 365, // or 366 in leap years
        daysSinceLast: 0,
        isChristmas: true
      };
    }

    // Calculate days until next Christmas
    const daysUntilNext = today < thisYearChristmas
      ? Math.ceil((thisYearChristmas.getTime() - today.getTime()) / oneDay)
      : Math.ceil((nextYearChristmas.getTime() - today.getTime()) / oneDay);

    // Calculate days since last Christmas
    thisYearChristmas.setHours(23, 59, 59, 59)
    const daysSinceLast = today > thisYearChristmas
      ? Math.floor((today.getTime() - thisYearChristmas.getTime()) / oneDay + 1)
      : null;

    return {
      daysUntilNext,
      daysSinceLast,
      isChristmas: false
    };
  }
}