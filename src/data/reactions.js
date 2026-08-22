export const reactions = [
  { id: 'like', emoji: '👍', label: 'Like', color: 'text-primary' },
  { id: 'love', emoji: '❤️', label: 'Love', color: 'text-[#E0245E]' },
  { id: 'celebrate', emoji: '👏', label: 'Celebrate', color: 'text-[#F7B928]' },
  { id: 'support', emoji: '🤝', label: 'Support', color: 'text-[#7FC15E]' },
  { id: 'insightful', emoji: '💡', label: 'Insightful', color: 'text-[#F7B928]' },
  { id: 'curious', emoji: '🤔', label: 'Curious', color: 'text-[#F7B928]' },
];

export const getReaction = (id) => reactions.find((r) => r.id === id);
