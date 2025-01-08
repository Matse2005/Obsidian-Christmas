import { Notice } from 'obsidian';
import { ChristmasDaysCalculator } from '../services/christmasDaysCalculator';
import ChristmasPlugin from 'main';

export function daysLeftCommand(plugin: ChristmasPlugin) {
  plugin.addCommand({
    id: "daysLeft",
    name: 'Show days left until Christmas',
    callback: () => daysLeft(plugin)
  });
}

export function daysLeft(plugin: ChristmasPlugin): void {
  const configManager = plugin.configManager;
  const calculator = new ChristmasDaysCalculator(configManager);
  const christmasDays = calculator.calculateDays();

  // Emoji selection logic remains the same
  const emojiList = [
    "🎄", "🎅", "🌟", "❄️", "🎁", "✨", "🛷", "🕯️", "🔔", "🥁", "🦌",
    "☃️", "🎶", "🍪", "🥛", "🎆", "📯", "🎊", "🎍", "🎐", "⛄", "🌌", "🕊️"
  ];

  const randomEmoji = (): string => emojiList[Math.floor(Math.random() * emojiList.length)];

  // Updated message templates
  const christmasDayMessages = [
    "{emoji1} Ho Ho Ho, Merry Christmas! {emoji2}{emoji3}",
    "{emoji1} Santa is here! Have a magical Christmas Day! {emoji2}{emoji3}",
    "{emoji1} It's Christmas! Time for joy and love! {emoji2}{emoji3}",
    "{emoji1} Merry Christmas to all, and to all a good day! {emoji2}{emoji3}"
  ];

  const recentlyAfterChristmasMessages = [
    "{emoji1} Christmas was just {days} day{s} ago! The magic still lingers! {emoji2}",
    "{emoji1} Santa visited {days} day{s} ago! Hope you're enjoying your presents! {emoji2}",
    "{emoji1} {days} day{s} after Christmas! Keep the festive spirit alive! {emoji2}"
  ];

  const daysUntilMessages = [
    "{emoji1} {days} days until next Christmas! The countdown continues! {emoji2}",
    "{emoji1} {days} days to go until Christmas returns! {emoji2}",
    "{emoji1} Mark your calendars: {days} days until Christmas! {emoji2}"
  ];

  const oneDayLeftMessages = [
    "{emoji1} Just 1 more sleep until Christmas! {emoji2}",
    "{emoji1} Christmas Eve is here! Santa's loading his sleigh! {emoji2}"
  ];

  const formatMessage = (template: string, placeholders: Record<string, string>): string => {
    let message = template;
    for (const [key, value] of Object.entries(placeholders)) {
      message = message.replace(new RegExp(`{${key}}`, 'g'), value);
    }
    return message;
  };

  // Enhanced message generation logic
  let message: string;

  if (christmasDays.isChristmas) {
    const template = randomFromArray(christmasDayMessages);
    message = formatMessage(template, {
      emoji1: randomEmoji(),
      emoji2: randomEmoji(),
      emoji3: randomEmoji()
    });
  } else if (christmasDays.daysSinceLast !== null && christmasDays.daysSinceLast <= 5) {
    // Within 5 days after Christmas
    const template = randomFromArray(recentlyAfterChristmasMessages);
    message = formatMessage(template, {
      days: christmasDays.daysSinceLast.toString(),
      s: christmasDays.daysSinceLast === 1 ? '' : 's',
      emoji1: randomEmoji(),
      emoji2: randomEmoji()
    });
  } else if (christmasDays.daysUntilNext === 1) {
    const template = randomFromArray(oneDayLeftMessages);
    message = formatMessage(template, {
      emoji1: randomEmoji(),
      emoji2: randomEmoji()
    });
  } else {
    const template = randomFromArray(daysUntilMessages);
    message = formatMessage(template, {
      days: christmasDays.daysUntilNext.toString(),
      emoji1: randomEmoji(),
      emoji2: randomEmoji()
    });
  }

  new Notice(message);
}

// Helper function to randomly select from an array
function randomFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}