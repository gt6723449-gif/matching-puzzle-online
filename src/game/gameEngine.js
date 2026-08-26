import { tileTypes } from '../data/tiles.js';

export function createBoard() {
  const doubled = tileTypes.flatMap((type) => [0,1].map(n => ({...type, uid:`${type.id}-${n}`})));
  for (let i=doubled.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [doubled[i],doubled[j]]=[doubled[j],doubled[i]]; }
  return doubled;
}

export function addToTray(tray, tile) {
  const next=[...tray,tile].sort((a,b)=>a.id.localeCompare(b.id));
  const matches=next.filter(x=>x.id===tile.id);
  return matches.length===2 ? next.filter(x=>x.id!==tile.id) : next;
}

export function preloadTileImages() {
  return Promise.all(tileTypes.map(type => new Promise(resolve => { const image=new Image(); image.onload=resolve; image.onerror=resolve; image.src=type.image; })));
}
