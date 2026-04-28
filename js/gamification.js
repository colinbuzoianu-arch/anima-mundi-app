// ═══════════════════════════════════════════════════════
//  ANIMA MUNDI — Gamification Engine
//  XP · Soul Levels · Quests · Quizzes · Unlocks
// ═══════════════════════════════════════════════════════

// ─── XP thresholds per level ───────────────────────────
const LEVELS = [
  { level: 1, title: 'Seeker',       xpNeeded: 0,    icon: '◌' },
  { level: 2, title: 'Pilgrim',      xpNeeded: 100,  icon: '◎' },
  { level: 3, title: 'Initiate',     xpNeeded: 250,  icon: '◉' },
  { level: 4, title: 'Contemplative',xpNeeded: 500,  icon: '✦' },
  { level: 5, title: 'Mystic',       xpNeeded: 900,  icon: '✧' },
  { level: 6, title: 'Sage',         xpNeeded: 1400, icon: '❋' },
  { level: 7, title: 'Illumined',    xpNeeded: 2100, icon: '✺' },
];

// ─── Quest definitions ─────────────────────────────────
export const QUESTS = [
  {
    id: 'first_words',
    title: 'First Words',
    desc: 'Send your first message to any guide.',
    icon: '💬',
    xp: 20,
    condition: (s) => s.totalMessages >= 1,
    category: 'journey',
  },
  {
    id: 'deep_dialogue',
    title: 'Deep Dialogue',
    desc: 'Exchange 10 messages in a single session.',
    icon: '🌊',
    xp: 40,
    condition: (s) => s.sessionMessages >= 10,
    category: 'journey',
  },
  {
    id: 'all_guides',
    title: 'The Grand Pilgrimage',
    desc: 'Speak with all six sacred guides.',
    icon: '🗺️',
    xp: 80,
    condition: (s) => s.guidesSpokenTo.length >= 6,
    category: 'exploration',
  },
  {
    id: 'three_guides',
    title: 'Three Traditions',
    desc: 'Speak with three different guides.',
    icon: '🌐',
    xp: 35,
    condition: (s) => s.guidesSpokenTo.length >= 3,
    category: 'exploration',
  },
  {
    id: 'grief_seeker',
    title: 'The Grief Bearer',
    desc: 'Ask about grief, loss, or pain.',
    icon: '🕯️',
    xp: 25,
    condition: (s) => s.topicsExplored.includes('grief'),
    category: 'wisdom',
  },
  {
    id: 'death_question',
    title: 'The Great Question',
    desc: 'Ask what happens after death.',
    icon: '🌙',
    xp: 30,
    condition: (s) => s.topicsExplored.includes('death'),
    category: 'wisdom',
  },
  {
    id: 'stillness_seeker',
    title: 'Seeker of Stillness',
    desc: 'Ask about inner peace or meditation.',
    icon: '🧘',
    xp: 25,
    condition: (s) => s.topicsExplored.includes('stillness'),
    category: 'wisdom',
  },
  {
    id: 'lore_reader',
    title: 'Keeper of Stories',
    desc: 'Read the sacred origins of any guide.',
    icon: '📖',
    xp: 20,
    condition: (s) => s.loreRead.length >= 1,
    category: 'lore',
  },
  {
    id: 'all_lore',
    title: 'The Living Archive',
    desc: 'Read the sacred origins of all six guides.',
    icon: '📜',
    xp: 60,
    condition: (s) => s.loreRead.length >= 6,
    category: 'lore',
  },
  {
    id: 'quiz_first',
    title: 'The First Test',
    desc: 'Complete your first wisdom quiz.',
    icon: '⚡',
    xp: 30,
    condition: (s) => s.quizzesCompleted >= 1,
    category: 'quiz',
  },
  {
    id: 'quiz_master',
    title: 'Oracle of Traditions',
    desc: 'Complete 5 wisdom quizzes.',
    icon: '🏛️',
    xp: 75,
    condition: (s) => s.quizzesCompleted >= 5,
    category: 'quiz',
  },
  {
    id: 'perfect_quiz',
    title: 'The Flawless Mind',
    desc: 'Score 100% on any wisdom quiz.',
    icon: '🌟',
    xp: 50,
    condition: (s) => s.perfectQuizzes >= 1,
    category: 'quiz',
  },
  {
    id: 'veteran',
    title: 'The Long Road',
    desc: 'Return on 3 different days.',
    icon: '🔥',
    xp: 45,
    condition: (s) => s.daysVisited >= 3,
    category: 'journey',
  },
];

// ─── Quiz bank ─────────────────────────────────────────
export const QUIZZES = [
  {
    id: 'q_ubuntu',
    tradition: 'African Wisdom',
    guideId: 'african',
    question: 'What does the Ubuntu philosophy "Umuntu ngumuntu ngabantu" mean?',
    answers: [
      { text: 'I am because we are', correct: true },
      { text: 'The elder knows the way', correct: false },
      { text: 'Strength comes from the ancestors', correct: false },
      { text: 'Silence is the highest wisdom', correct: false },
    ],
    explanation: 'Ubuntu is a Nguni Bantu philosophy meaning "I am because we are" — the idea that a person is only a person through their relationship with others.',
    xp: 15,
  },
  {
    id: 'q_tao',
    tradition: 'Taoism',
    guideId: 'eastern',
    question: 'What does "Wu Wei" (無為) mean in Taoist philosophy?',
    answers: [
      { text: 'The eternal void', correct: false },
      { text: 'Effortless action / non-striving', correct: true },
      { text: 'The way of the warrior', correct: false },
      { text: 'Inner silence', correct: false },
    ],
    explanation: 'Wu Wei is a central Taoist concept meaning acting in harmony with the natural flow of the universe, without force or resistance — effortless action.',
    xp: 15,
  },
  {
    id: 'q_vedanta',
    tradition: 'Vedanta',
    guideId: 'southasian',
    question: 'What does "Tat Tvam Asi" (तत् त्वम् असि) mean?',
    answers: [
      { text: 'The path leads inward', correct: false },
      { text: 'Consciousness is all', correct: false },
      { text: 'That thou art', correct: true },
      { text: 'The self dissolves in God', correct: false },
    ],
    explanation: '"Tat Tvam Asi" is one of the mahavakyas (great sayings) of the Upanishads, from the Chandogya Upanishad. It means "That thou art" — the individual self (Atman) is identical with Brahman, ultimate reality.',
    xp: 15,
  },
  {
    id: 'q_stoic',
    tradition: 'Stoicism',
    guideId: 'nordic',
    question: 'Which Stoic emperor wrote "Meditations" as a private journal?',
    answers: [
      { text: 'Epictetus', correct: false },
      { text: 'Seneca', correct: false },
      { text: 'Marcus Aurelius', correct: true },
      { text: 'Cicero', correct: false },
    ],
    explanation: 'Marcus Aurelius (121–180 AD), Roman Emperor, wrote his Meditations in Greek as a private philosophical diary — never intended for publication. It remains one of the greatest works of Stoic philosophy.',
    xp: 15,
  },
  {
    id: 'q_sufi',
    tradition: 'Sufism',
    guideId: 'mediterranean',
    question: 'Rumi\'s Masnavi begins with a famous metaphor. What instrument represents the soul\'s longing for God?',
    answers: [
      { text: 'The oud (lute)', correct: false },
      { text: 'The ney (reed flute)', correct: true },
      { text: 'The tabla (drum)', correct: false },
      { text: 'The sitar', correct: false },
    ],
    explanation: 'Rumi opens the Masnavi with the image of the ney (reed flute) crying because it was cut from the reed bed — a metaphor for the soul\'s separation from its divine source and its constant longing to return.',
    xp: 15,
  },
  {
    id: 'q_shaman',
    tradition: 'Shamanic Traditions',
    guideId: 'shaman',
    question: 'In shamanic cosmology, what is the "World Tree" (Axis Mundi) a symbol of?',
    answers: [
      { text: 'The sacred grove where ancestors rest', correct: false },
      { text: 'The connection between upper, middle, and lower worlds', correct: true },
      { text: 'The first tree that taught humans medicine', correct: false },
      { text: 'The tree of life in the afterlife', correct: false },
    ],
    explanation: 'The World Tree or Axis Mundi appears across Siberian, Norse (Yggdrasil), and many Indigenous traditions. It represents the cosmic axis connecting the three realms — the heavens, the middle world of humans, and the underworld.',
    xp: 15,
  },
  {
    id: 'q_kabbalah',
    tradition: 'Kabbalah',
    guideId: 'mediterranean',
    question: 'In Kabbalistic tradition, what is the "Ein Sof"?',
    answers: [
      { text: 'The highest of the ten Sefirot', correct: false },
      { text: 'The written Torah\'s hidden dimension', correct: false },
      { text: 'The infinite, boundless divine reality before creation', correct: true },
      { text: 'The spark of God within every soul', correct: false },
    ],
    explanation: 'Ein Sof (אין סוף) means "without end" or "the infinite" in Kabbalah. It refers to the divine reality as it is in itself, before any emanation or creation — utterly beyond human comprehension.',
    xp: 20,
  },
  {
    id: 'q_buddhism',
    tradition: 'Buddhism',
    guideId: 'eastern',
    question: 'What are the "Three Marks of Existence" in Buddhist teaching?',
    answers: [
      { text: 'Birth, suffering, and death', correct: false },
      { text: 'Impermanence, suffering, and non-self', correct: true },
      { text: 'Desire, attachment, and ignorance', correct: false },
      { text: 'Body, mind, and spirit', correct: false },
    ],
    explanation: 'The Three Marks of Existence (Trilakshana) are: Anicca (impermanence), Dukkha (suffering/unsatisfactoriness), and Anatta (non-self). Understanding these is central to the Buddhist path of liberation.',
    xp: 20,
  },
];

// ─── State management ──────────────────────────────────
const STORAGE_KEY = 'animamundi_player';

function defaultState() {
  return {
    xp: 0,
    completedQuests: [],
    quizzesCompleted: 0,
    perfectQuizzes: 0,
    totalMessages: 0,
    sessionMessages: 0,
    guidesSpokenTo: [],
    topicsExplored: [],
    loreRead: [],
    daysVisited: [],
    seenNotifications: [],
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

// ─── XP & level helpers ────────────────────────────────
export function getLevelInfo(xp) {
  let current = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.xpNeeded) current = l;
    else break;
  }
  const nextIdx = LEVELS.indexOf(current) + 1;
  const next = LEVELS[nextIdx] || null;
  const xpInLevel = xp - current.xpNeeded;
  const xpForNext = next ? next.xpNeeded - current.xpNeeded : null;
  const progress = xpForNext ? Math.min(1, xpInLevel / xpForNext) : 1;
  return { current, next, xpInLevel, xpForNext, progress };
}

// ─── Core engine ────────────────────────────────────────
export class GamificationEngine {
  constructor(onNotify, onXPUpdate) {
    this.state = loadState();
    this.onNotify = onNotify;   // fn(type, data)
    this.onXPUpdate = onXPUpdate; // fn(state)
    this._recordDay();
  }

  _recordDay() {
    const today = new Date().toISOString().slice(0, 10);
    if (!this.state.daysVisited.includes(today)) {
      this.state.daysVisited.push(today);
      this.save();
    }
  }

  save() {
    saveState(this.state);
    if (this.onXPUpdate) this.onXPUpdate(this.state);
  }

  addXP(amount, reason) {
    const prev = getLevelInfo(this.state.xp);
    this.state.xp += amount;
    const next = getLevelInfo(this.state.xp);
    this.save();
    this.onNotify('xp', { amount, reason });
    // Level up?
    if (next.current.level > prev.current.level) {
      setTimeout(() => {
        this.onNotify('levelup', { level: next.current });
      }, 600);
    }
  }

  checkQuests() {
    const newlyCompleted = [];
    for (const q of QUESTS) {
      if (this.state.completedQuests.includes(q.id)) continue;
      if (q.condition(this.state)) {
        this.state.completedQuests.push(q.id);
        newlyCompleted.push(q);
        this.addXP(q.xp, q.title);
      }
    }
    if (newlyCompleted.length) this.save();
    return newlyCompleted;
  }

  // ── Event hooks ──────────────────────────────────────

  onMessage(guideId, messageText) {
    this.state.totalMessages++;
    this.state.sessionMessages++;

    if (!this.state.guidesSpokenTo.includes(guideId)) {
      this.state.guidesSpokenTo.push(guideId);
    }

    // Topic detection
    const t = messageText.toLowerCase();
    if (/grief|loss|mourn|bereave|death|died|dead/.test(t)) this._addTopic('grief');
    if (/death|die|afterlife|what happens|beyond/.test(t)) this._addTopic('death');
    if (/still|peace|calm|meditat|quiet|silence/.test(t)) this._addTopic('stillness');
    if (/suffer|pain|hurt|wound|ache/.test(t)) this._addTopic('suffering');
    if (/love|heart|longing|yearn/.test(t)) this._addTopic('love');

    this.save();
    return this.checkQuests();
  }

  _addTopic(topic) {
    if (!this.state.topicsExplored.includes(topic)) {
      this.state.topicsExplored.push(topic);
    }
  }

  onLoreRead(guideId) {
    if (!this.state.loreRead.includes(guideId)) {
      this.state.loreRead.push(guideId);
      this.save();
    }
    return this.checkQuests();
  }

  onNewSession() {
    this.state.sessionMessages = 0;
  }

  onQuizComplete(score, total, quizId) {
    this.state.quizzesCompleted++;
    const xpEarned = Math.round((score / total) * 30);
    if (score === total) this.state.perfectQuizzes++;
    this.save();
    this.addXP(xpEarned, `Quiz: ${Math.round((score / total) * 100)}% correct`);
    return this.checkQuests();
  }

  getQuestProgress() {
    return QUESTS.map(q => ({
      ...q,
      completed: this.state.completedQuests.includes(q.id),
    }));
  }

  getStats() {
    return {
      xp: this.state.xp,
      level: getLevelInfo(this.state.xp),
      totalMessages: this.state.totalMessages,
      guidesSpokenTo: this.state.guidesSpokenTo.length,
      quizzesCompleted: this.state.quizzesCompleted,
      questsCompleted: this.state.completedQuests.length,
      daysVisited: this.state.daysVisited.length,
    };
  }

  resetAll() {
    this.state = defaultState();
    this.save();
  }
}
