import { SCRIPT_URL } from '../config.js';

async function send(payload) {
  if (!SCRIPT_URL) throw new Error('VITE_GOOGLE_SCRIPT_URL is not configured');
  const response=await fetch(SCRIPT_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});
  if (!response.ok) throw new Error('Request failed');
  const result = await response.json();
  if (!result.ok) throw new Error(result.error || 'Google Sheets request failed');
  return result;
}
export const registerPlayer = (player) => send({action:'register',...player});
export async function saveResult(number, status) {
  const payload = {action:'result', number, status, amount:status==='Won'?'100$':''};
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await send(payload);
    } catch (error) {
      lastError = error;
      if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 700 * (attempt + 1)));
    }
  }
  throw lastError;
}
