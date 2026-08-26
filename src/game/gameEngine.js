import { tileTypes } from '../data/tiles.js';

const BOARD_LAYOUT = [
  ...Array.from({length:36},(_,index)=>({layer:0,x:index%6,y:Math.floor(index/6)})),
  ...[1,3].flatMap(y=>[0.5,1.85,3.2,4.5].map(x=>({layer:1,x,y:y+0.28}))),
  ...[1.55,3.45].flatMap(x=>[1.72,3.56].map(y=>({layer:2,x,y})))
];

export function createBoard() {
  const tiles=tileTypes.flatMap(type=>[0,1,2,3].map(n=>({...type,uid:`${type.id}-${n}`})));
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
  return !board.some(other=>other.layer>tile.layer&&Math.abs(other.x-tile.x)<0.92&&Math.abs(other.y-tile.y)<0.92);
}
