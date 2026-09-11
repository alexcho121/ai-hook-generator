export function randomPicker_pickOne(randomPicker_items) {
  const randomPicker_randomIndex = Math.floor(
    Math.random() * randomPicker_items.length
  );

  return randomPicker_items[randomPicker_randomIndex];
}