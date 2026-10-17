import { safetyRules, systemPrompt } from '@/lib/ai/prompts';
import { Harshness, Persona } from '@/lib/ai/schema';

describe('systemPrompt', () => {
  const combinations = Persona.options.flatMap((persona) =>
    Harshness.options.map((harshness) => [persona, harshness] as const),
  );

  it.each(combinations)('includes the safety rules for %s / %s', (persona, harshness) => {
    expect(systemPrompt(persona, harshness)).toContain(safetyRules);
  });

  it('differs per persona', () => {
    const prompts = new Set(Persona.options.map((persona) => systemPrompt(persona, 'durust')));
    expect(prompts.size).toBe(Persona.options.length);
  });
});
