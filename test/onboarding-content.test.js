const test = require('node:test');
const assert = require('node:assert');
const {
  SETUP_STEPS,
  GAME_IDEAS,
  ROBLOX_TERMS,
  SAFETY_NOTES,
  EMPTY_STATES,
  shouldShowOnboarding,
} = require('../renderer/lib/onboarding-content');

test('setup steps cover the folder → Claude → sync → play-test loop in order', () => {
  assert.deepStrictEqual(
    SETUP_STEPS.map((s) => s.id),
    ['set-folder', 'ask-claude', 'sync-studio', 'play-test']
  );
  for (const step of SETUP_STEPS) {
    assert.ok(step.title.length > 0, `step ${step.id} has a title`);
    assert.ok(step.detail.length > 0, `step ${step.id} has a detail`);
  }
});

test('game ideas include the five required genres', () => {
  assert.deepStrictEqual(
    GAME_IDEAS.map((g) => g.id).sort(),
    ['fighting-arena', 'obby', 'pet-game', 'simulator', 'tycoon']
  );
});

test('every game idea prompt names a Roblox service and asks for placement', () => {
  const services = ['Workspace', 'ReplicatedStorage', 'ServerScriptService', 'StarterGui', 'StarterPlayer'];
  for (const idea of GAME_IDEAS) {
    assert.ok(
      services.some((s) => idea.prompt.includes(s)),
      `${idea.id} prompt mentions a Roblox service`
    );
    assert.ok(
      idea.prompt.includes('where each script goes'),
      `${idea.id} prompt asks for Studio placement`
    );
    assert.ok(idea.prompt.includes('test'), `${idea.id} prompt asks how to test`);
  }
});

test('glossary covers the Roblox terms the UX requirements name', () => {
  const joined = ROBLOX_TERMS.map((t) => t.term + ' ' + t.tip).join(' ');
  for (const required of [
    'Workspace',
    'ReplicatedStorage',
    'ServerScriptService',
    'StarterGui',
    'StarterPlayer',
    'RemoteEvent',
    'Script',
    'LocalScript',
    'ModuleScript',
    'Luau',
  ]) {
    assert.ok(joined.includes(required), `glossary mentions ${required}`);
  }
});

test('safety notes cover client trust, server authority, and RemoteEvent validation', () => {
  const joined = SAFETY_NOTES.join(' ');
  assert.ok(joined.includes('Never trust the client'));
  assert.ok(joined.includes('ServerScriptService'));
  assert.ok(joined.includes('RemoteEvent'));
  assert.ok(SAFETY_NOTES.every((n) => n.length > 0));
});

test('empty states are actionable, not bare "empty" labels', () => {
  assert.ok(EMPTY_STATES.noSessions.includes('Ask Claude'));
  assert.ok(EMPTY_STATES.gitNoFolder.includes('project folder'));
});

test('shouldShowOnboarding: only when no folder is set and not skipped', () => {
  assert.strictEqual(shouldShowOnboarding({ projectFolder: null, skipped: false }), true);
  assert.strictEqual(shouldShowOnboarding({ projectFolder: 'C:\\game', skipped: false }), false);
  assert.strictEqual(shouldShowOnboarding({ projectFolder: null, skipped: true }), false);
  assert.strictEqual(shouldShowOnboarding({ projectFolder: 'C:\\game', skipped: true }), false);
  assert.strictEqual(shouldShowOnboarding(undefined), true);
});
