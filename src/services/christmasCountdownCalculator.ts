import { ChristmasDaysCalculator } from './christmasDaysCalculator';
import { ConfigManager } from './configManager';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export class ChristmasCountdownCalculator {
  private configManager: ConfigManager;
  private christmasDaysCalculator: ChristmasDaysCalculator;

  constructor(configManager: ConfigManager, christmasDaysCalculator: ChristmasDaysCalculator) {
    this.configManager = configManager;
    this.christmasDaysCalculator = christmasDaysCalculator;
  }

  calculateTimeLeft(): TimeRemaining {
    // Get the current date and time
    const now = new Date();

    // Get Christmas day and month from configuration
    const christmasDay = this.configManager.settings.ChristmasDay;
    const christmasMonth = this.configManager.settings.ChristmasMonth

    // Create Date objects for this year's and next year's Christmas
    const thisYearChristmas = new Date(now.getFullYear(), christmasMonth - 1, christmasDay);
    const nextYearChristmas = new Date(now.getFullYear() + 1, christmasMonth - 1, christmasDay);

    // Determine which Christmas date to use
    let targetDate: Date;

    if (now < thisYearChristmas) {
      // Before this year's Christmas
      targetDate = thisYearChristmas;
    } else if (now.getDate() === thisYearChristmas.getDate() && now.getMonth() === thisYearChristmas.getMonth()) {
      // It's Christmas day
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    } else {
      // After this year's Christmas
      targetDate = nextYearChristmas;
    }

    // Calculate total milliseconds difference
    const diff = targetDate.getTime() - now.getTime();

    // Convert to days, hours, minutes, seconds
    const oneSecond = 1000;
    const oneMinute = oneSecond * 60;
    const oneHour = oneMinute * 60;
    const oneDay = oneHour * 24;

    const days = Math.floor(diff / oneDay);
    const hours = Math.floor((diff % oneDay) / oneHour);
    const minutes = Math.floor((diff % oneHour) / oneMinute);
    const seconds = Math.floor((diff % oneMinute) / oneSecond);

    return {
      days,
      hours,
      minutes,
      seconds
    };
  }

  getFormattedCountdown(): string {
    const time = this.calculateTimeLeft();
    const christmasDays = this.christmasDaysCalculator.calculateDays();

    // Handle Christmas Day
    if (christmasDays.isChristmas) {
      return "It's Christmas!";
    }

    // Handle post-Christmas period (within 5 days)
    if (christmasDays.daysSinceLast !== null && christmasDays.daysSinceLast <= 5) {
      return `Christmas was ${christmasDays.daysSinceLast} ${christmasDays.daysSinceLast === 1 ? 'day' : 'days'} ago`;
    }

    // Handle countdown to next Christmas
    const parts = [];
    if (time.days > 0) parts.push(`${time.days} ${time.days === 1 ? 'day' : 'days'}`);
    if (time.hours > 0 || time.days > 0) parts.push(`${time.hours} ${time.hours === 1 ? 'hour' : 'hours'}`);
    if (time.minutes > 0 || time.hours > 0 || time.days > 0) parts.push(`${time.minutes} ${time.minutes === 1 ? 'minute' : 'minutes'}`);
    if (time.seconds > 0 || (time.minutes === 0 && time.hours === 0 && time.days === 0)) {
      parts.push(`${time.seconds} ${time.seconds === 1 ? 'second' : 'seconds'}`);
    }

    return parts.join(', ');
  }
}