export const tileTypes = [
  ['gem','💎'],['star','⭐'],['rocket','🚀'],['flower','🌸'],['crown','👑'],['heart','💖'],['moon','🌙'],['rainbow','🌈'],['balloon','🎈'],['shell','🐚'],['cherry','🍒'],['gift','🎁']
].map(([id,emoji]) => ({id,emoji,image:`/tiles/${id}.svg`}));
