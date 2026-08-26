import { SCRIPT_URL } from '../config.js';

async function send(payload) {
  if (!SCRIPT_URL) throw new Error('VITE_GOOGLE_SCRIPT_URL is not configured');
  const response=await fetch(SCRIPT_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});
  if (!response.ok) throw new Error('Request failed');
  return response.json();
}
export const registerPlayer = (player) => send({action:'register',...player});
export const saveResult = (number,status) => send({action:'result',number,status,amount:status==='Won'?'100$':''});
