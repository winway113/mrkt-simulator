/** All Telegram gift collections from api.changes.tg/gifts */
export const GIFT_NAMES = [
  "Santa Hat", "Signet Ring", "Precious Peach", "Plush Pepe", "Spiced Wine", "Jelly Bunny",
  "Durov's Cap", "Perfume Bottle", "Eternal Rose", "Berry Box", "Vintage Cigar", "Magic Potion",
  "Kissed Frog", "Hex Pot", "Evil Eye", "Sharp Tongue", "Trapped Heart", "Skull Flower",
  "Scared Cat", "Spy Agaric", "Homemade Cake", "Genie Lamp", "Lunar Snake", "Party Sparkler",
  "Jester Hat", "Witch Hat", "Hanging Star", "Love Candle", "Cookie Heart", "Desk Calendar",
  "Jingle Bells", "Snow Mittens", "Voodoo Doll", "Mad Pumpkin", "Hypno Lollipop", "B-Day Candle",
  "Bunny Muffin", "Astral Shard", "Flying Broom", "Crystal Ball", "Eternal Candle", "Swiss Watch",
  "Ginger Cookie", "Mini Oscar", "Lol Pop", "Ion Gem", "Star Notepad", "Loot Bag", "Love Potion",
  "Toy Bear", "Diamond Ring", "Sakura Flower", "Sleigh Bell", "Top Hat", "Record Player",
  "Winter Wreath", "Snow Globe", "Electric Skull", "Tama Gadget", "Candy Cane", "Neko Helmet",
  "Jack-in-the-Box", "Easter Egg", "Bonded Ring", "Pet Snake", "Snake Box", "Xmas Stocking",
  "Big Year", "Holiday Drink", "Gem Signet", "Light Sword", "Restless Jar", "Nail Bracelet",
  "Heroic Helmet", "Bow Tie", "Heart Locket", "Lush Bouquet", "Whip Cupcake", "Joyful Bundle",
  "Cupid Charm", "Valentine Box", "Snoop Dogg", "Swag Bag", "Snoop Cigar", "Low Rider",
  "Westside Sign", "Stellar Rocket", "Jolly Chimp", "Moon Pendant", "Ionic Dryer", "Input Key",
  "Mighty Arm", "Artisan Brick", "Clover Pin", "Sky Stilettos", "Fresh Socks", "Happy Brownie",
  "Ice Cream", "Spring Basket", "Instant Ramen", "Faith Amulet", "Mousse Cake", "Bling Binky",
  "Money Pot", "Pretty Posy", "Khabib's Papakha", "UFC Strike", "Victory Medal", "Rare Bird",
  "Mood Pack", "Pool Float", "Timeless Book", "Chill Flame", "Vice Cream", "Surge Board",
  "Liberty Figure"
] as const;

export const FLOOR_ESTIMATES: Record<string, number> = {
  "Plush Pepe": 186, "Durov's Cap": 120, "Diamond Ring": 85, "Precious Peach": 95,
  "Signet Ring": 45, "Liberty Figure": 3.16, "Lunar Snake": 2.46, "Evil Eye": 7.5,
  "Ginger Cookie": 6.85, "Spy Agaric": 3.95, "Chill Flame": 2.5, "Vice Cream": 2.99,
  "Joyful Bundle": 15, "Berry Box": 6.93, "Heart Locket": 8.2, "Pool Float": 4.1,
  "Homemade Cake": 12, "Eternal Rose": 14, "Jelly Bunny": 5.5, "Snoop Dogg": 22
};

export function estimateFloor(name: string) {
  if (FLOOR_ESTIMATES[name]) return FLOOR_ESTIMATES[name];
  return Number((2 + Math.random() * 12).toFixed(2));
}
