export const MAX_NICKNAME_LENGTH = 20;

// Not exhaustive — just enough to block the obvious cases. Checked against
// the nickname with spaces/punctuation stripped, so simple spacing tricks
// ("f u c k") don't slip through.
const BLOCKED_WORDS = [
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'dick', 'pussy', 'cunt', 'cock',
  'nigger', 'nigga', 'fag', 'faggot', 'retard', 'whore', 'slut', 'rape',
  'nazi', 'hitler', 'kike', 'chink', 'spic', 'tranny',
];

export function sanitizeNickname(raw) {
  const trimmed = String(raw || '').trim().slice(0, MAX_NICKNAME_LENGTH);
  // strip anything that isn't a letter, number, space, or a few safe punctuation marks
  return trimmed.replace(/[^\p{L}\p{N} _\-'!?]/gu, '').trim();
}

export function normalizeNickname(nickname) {
  return nickname.toLowerCase().replace(/\s+/g, ' ').trim();
}

export function containsBlockedWord(nickname) {
  const stripped = nickname.toLowerCase().replace(/[^a-z0-9]/g, '');
  return BLOCKED_WORDS.some((word) => stripped.includes(word));
}

export const MEMBERS_KEY = 'leaderboard-members';
export const NICKNAME_INDEX_KEY = 'leaderboard-nickname-index'; // normalized nickname -> deviceId
export const BANNED_KEY = 'leaderboard-banned'; // deviceId -> nickname at time of ban
