import { tileTypes } from '../data/tiles.js';

const BOARD_LAYOUT = [
  // A centered four-tier pyramid: 30 + 20 + 12 + 6 tiles.
  ...Array.from({length:30},(_,index)=>({layer:0,x:index%6,y:Math.floor(index/6)+0.5})),
  ...Array.from({length:20},(_,index)=>({layer:1,x:(index%5)+0.5,y:Math.floor(index/5)+1})),
  ...Array.from({length:12},(_,index)=>({layer:2,x:(index%4)+1,y:Math.floor(index/4)+1.5})),
  ...Array.from({length:6},(_,index)=>({layer:3,x:(index%3)+1.5,y:Math.floor(index/3)+2}))
];

export function createBoard() {
  // Four of each of the 17 pictures gives 34 pairs and 68 tiles in total.
  const tiles=tileTypes.flatMap(type=>[0,1,2,3].map(n=>({...type,uid:`${type.id}-${n}`})));
  for (let i=tiles.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [tiles[i],tiles[j]]=[tiles[j],tiles[i]]; }
  const topStart=BOARD_LAYOUT.findIndex(position=>position.layer===3);
  const topIds=tiles.slice(topStart).map(tile=>tile.id);
  const topHasPair=topIds.some((id,index)=>topIds.indexOf(id)!==index);
  if (!topHasPair) {
    const matchingIndex=tiles.findIndex((tile,index)=>index<topStart&&tile.id===tiles[topStart].id);
    [tiles[topStart+1],tiles[matchingIndex]]=[tiles[matchingIndex],tiles[topStart+1]];
  }
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
