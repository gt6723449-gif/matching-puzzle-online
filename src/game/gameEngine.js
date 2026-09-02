import { tileTypes } from '../data/tiles.js';

const BOARD_LAYOUT = [
  // A tidy, symmetrical four-level pyramid: 36 + 20 + 12 + 4 tiles.
  ...Array.from({length:36},(_,index)=>({layer:0,x:index%6,y:Math.floor(index/6)})),
  ...Array.from({length:20},(_,index)=>({layer:1,x:(index%5)+0.5,y:Math.floor(index/5)+1})),
  ...Array.from({length:12},(_,index)=>({layer:2,x:(index%4)+1,y:Math.floor(index/4)+1.5})),
  ...Array.from({length:4},(_,index)=>({layer:3,x:(index%2)+2,y:Math.floor(index/2)+2}))
];

export function createBoard() {
  // Six of each picture gives three pairs per type and 72 tiles in total.
  const tiles=tileTypes.flatMap(type=>[0,1,2,3,4,5].map(n=>({...type,uid:`${type.id}-${n}`})));
  for (let i=tiles.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [tiles[i],tiles[j]]=[tiles[j],tiles[i]]; }
  return tiles.map((tile,index)=>({...tile,...BOARD_LAYOUT[index]}));
}

export function addToTray(tray, tile) {
  const next=[...tray,tile].sort((a,b)=>a.id.localeCompare(b.id));
  const matches=next.filter(x=>x.id===tile.id);
  return matches.length===2 ? next.filter(x=>x.id!==tile.id) : next;
}

export function preloadTileImages() {
  return Promise.all(tileTypes.map(type => new Promise(resolve => { const image=new Image(); image.onload=resolve; image.onerror=resolve; image.src=type.image; })));
}

export function isTileSelectable(board,tile) {
  return !board.some(other=>other.layer>tile.layer&&Math.abs(other.x-tile.x)<0.82&&Math.abs(other.y-tile.y)<0.82);
}
