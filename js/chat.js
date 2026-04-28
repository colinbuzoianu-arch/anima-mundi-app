// ═══════════════════════════════════════════════════════
//  ANIMA MUNDI — Chat Logic & API
// ═══════════════════════════════════════════════════════
import { SYS_BASE } from './guides.js';
import { addAIMessage, addUserMessage, showThinking, removeThinking } from './ui.js';

let history = [];
let loading = false;

export function resetHistory() {
  history = [];
}

export function isLoading() {
  return loading;
}

export async function sendMessage(guide, text, onMessageSent) {
  if (!text || loading) return;
  loading = true;
  setSendDisabled(true);
  hidePrompts();

  addUserMessage(text);
  history.push({ role: 'user', content: text });
  showThinking(guide);

  // Fire the onMessageSent callback before awaiting the reply
  if (onMessageSent) onMessageSent(text);

  try {
    const sys = SYS_BASE + '\n\nYOUR PERSONA & STORY:\n' + guide.prompt;
    const r = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: sys,
        messages: history,
      }),
    });
    const data = await r.json();
    removeThinking();
    const reply = data.content?.map(b => b.text || '').join('') || 'I am here with you. Please try again.';
    addAIMessage(guide, reply);
    history.push({ role: 'assistant', content: reply });
  } catch {
    removeThinking();
    addAIMessage(guide, 'The connection was interrupted. I am still here — please try again.');
  }

  loading = false;
  setSendDisabled(false);
}

function setSendDisabled(disabled) {
  const btn = document.getElementById('sBtn');
  if (btn) btn.disabled = disabled;
}

function hidePrompts() {
  const qp = document.getElementById('qpRow');
  if (qp) qp.style.display = 'none';
}

export function showPrompts() {
  const qp = document.getElementById('qpRow');
  if (qp) qp.style.display = 'flex';
}
