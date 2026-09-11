const mainSlideBackground_pinkColors = [
  "rgba(255, 198, 220, 0.62)",
  "rgba(255, 214, 232, 0.58)",
  "rgba(248, 200, 220, 0.6)",
];

const mainSlideBackground_mintColors = [
  "rgba(184, 234, 217, 0.58)",
  "rgba(216, 243, 220, 0.62)",
  "rgba(198, 239, 224, 0.56)",
];

const mainSlideBackground_yellowColors = [
  "rgba(255, 241, 168, 0.52)",
  "rgba(255, 246, 199, 0.58)",
  "rgba(255, 232, 163, 0.48)",
];

const mainSlideBackground_lavenderColors = [
  "rgba(220, 201, 245, 0.56)",
  "rgba(230, 220, 255, 0.54)",
  "rgba(213, 205, 255, 0.5)",
];

const mainSlideBackground_peachColors = [
  "rgba(255, 214, 186, 0.54)",
  "rgba(255, 225, 204, 0.58)",
  "rgba(255, 205, 178, 0.48)",
];

const mainSlideBackground_ivoryColors = [
  "#fffdf5",
  "#fff8e7",
  "#fdf6ec",
];

const mainSlideBackground_positions = [
  "12% 18%",
  "18% 72%",
  "78% 18%",
  "86% 68%",
  "50% 86%",
  "35% 30%",
  "70% 44%",
];

function mainSlideBackground_pickRandomItem(mainSlideBackground_items) {
  const mainSlideBackground_randomIndex = Math.floor(
    Math.random() * mainSlideBackground_items.length
  );

  return mainSlideBackground_items[mainSlideBackground_randomIndex];
}

function mainSlideBackground_shuffleArray(mainSlideBackground_items) {
  return [...mainSlideBackground_items].sort(() => Math.random() - 0.5);
}

export function mainSlideBackground_createRandomStyle() {
  const mainSlideBackground_shuffledPositions = mainSlideBackground_shuffleArray(
    mainSlideBackground_positions
  );

  const mainSlideBackground_centerColor = mainSlideBackground_pickRandomItem(
    mainSlideBackground_ivoryColors
  );

  return {
    "--mainSlide_bgCenter": mainSlideBackground_centerColor,

    "--mainSlide_bgPink": mainSlideBackground_pickRandomItem(
      mainSlideBackground_pinkColors
    ),
    "--mainSlide_bgMint": mainSlideBackground_pickRandomItem(
      mainSlideBackground_mintColors
    ),
    "--mainSlide_bgYellow": mainSlideBackground_pickRandomItem(
      mainSlideBackground_yellowColors
    ),
    "--mainSlide_bgLavender": mainSlideBackground_pickRandomItem(
      mainSlideBackground_lavenderColors
    ),
    "--mainSlide_bgPeach": mainSlideBackground_pickRandomItem(
      mainSlideBackground_peachColors
    ),

    "--mainSlide_posPink": mainSlideBackground_shuffledPositions[0],
    "--mainSlide_posMint": mainSlideBackground_shuffledPositions[1],
    "--mainSlide_posYellow": mainSlideBackground_shuffledPositions[2],
    "--mainSlide_posLavender": mainSlideBackground_shuffledPositions[3],
    "--mainSlide_posPeach": mainSlideBackground_shuffledPositions[4],
  };
}