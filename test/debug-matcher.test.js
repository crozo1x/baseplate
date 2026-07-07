const test = require('node:test');
const assert = require('node:assert/strict');
const { matchError } = require('../lib/debug-matcher');

test('matchError recognizes "attempt to index nil"', () => {
  const result = matchError('ServerScriptService.Leaderstats:5: attempt to index nil with \'Name\'');
  assert.equal(result.matched, true);
  assert.equal(result.pattern, 'index-nil');
});

test('matchError recognizes "is not a valid member of"', () => {
  const result = matchError('Workspace.Part is not a valid member of Model "Workspace"');
  assert.equal(result.matched, true);
  assert.equal(result.pattern, 'not-valid-member');
});

test('matchError recognizes "Infinite yield possible"', () => {
  const result = matchError('Infinite yield possible on \'ReplicatedStorage:WaitForChild("RemoteEvent")\'');
  assert.equal(result.matched, true);
  assert.equal(result.pattern, 'infinite-yield');
});

test('matchError recognizes RemoteEvent-related errors', () => {
  const result = matchError('attempt to call a nil value (RemoteEvent is not a valid member)');
  assert.equal(result.matched, true);
  assert.equal(result.pattern, 'remote-event');
});

test('matchError recognizes DataStore-related errors', () => {
  const result = matchError('DataStore request was added to queue and is throttled');
  assert.equal(result.matched, true);
  assert.equal(result.pattern, 'datastore');
});

test('matchError recognizes wrong-script-location errors', () => {
  const result = matchError('Players.LocalScript is not a valid Script');
  assert.equal(result.matched, true);
  assert.equal(result.pattern, 'wrong-script-location');
});

test('matchError falls back to a generic fix for unrecognized text', () => {
  const result = matchError('some completely unrelated custom error message');
  assert.equal(result.matched, false);
  assert.match(result.fix, /New Script/);
});

test('matchError falls back to a generic fix for empty input', () => {
  const result = matchError('');
  assert.equal(result.matched, false);
});
