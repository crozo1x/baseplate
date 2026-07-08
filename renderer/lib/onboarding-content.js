// Beginner-facing copy for the first-run experience. Kept in one testable
// module so the onboarding panel, empty states, and any future builder
// screens (Idea tab prompt chips) pull from the same source.

const SETUP_STEPS = [
  {
    id: 'set-folder',
    title: 'Set your project folder',
    detail:
      'Pick or create an empty folder for this game. Claude Code, Rojo, and Git all run inside it.',
    actionLabel: 'Set Project Folder',
  },
  {
    id: 'ask-claude',
    title: 'Ask Claude to build one system',
    detail:
      'Ask Claude opens a Claude Code session in your project folder. Describe one system at a time — start from a game idea below.',
  },
  {
    id: 'sync-studio',
    title: 'Sync to Studio',
    detail:
      'Sync to Studio runs rojo serve. In Roblox Studio, install the Rojo plugin and click Connect — your scripts land in ServerScriptService, ReplicatedStorage, and StarterPlayer automatically.',
  },
  {
    id: 'play-test',
    title: 'Play test in Studio',
    detail:
      'Play / Test opens your place file in Roblox Studio. Test after each system before adding the next one.',
  },
];

const GAME_IDEAS = [
  {
    id: 'simulator',
    label: 'Simulator',
    prompt:
      'Build a simulator starter: leaderstats with a Coins value, a clickable part in Workspace that awards coins through a Script in ServerScriptService, and a ModuleScript in ReplicatedStorage with upgrade prices. Tell me exactly where each script goes in Roblox Studio and how to test it.',
  },
  {
    id: 'obby',
    label: 'Obby',
    prompt:
      'Build an obby starter: checkpoint parts in Workspace, a Script in ServerScriptService that saves each player’s checkpoint and respawns them there, and a kill-brick script. Tell me exactly where each script goes in Roblox Studio and how to test it.',
  },
  {
    id: 'tycoon',
    label: 'Tycoon',
    prompt:
      'Build a tycoon starter: a money-per-second dropper, a collector part, and a buy-button that unlocks the next dropper. Keep all money logic in Scripts in ServerScriptService and shared config in a ModuleScript in ReplicatedStorage. Tell me where each script goes in Roblox Studio and how to test it.',
  },
  {
    id: 'pet-game',
    label: 'Pet Game',
    prompt:
      'Build a pet game starter: an egg part in Workspace, a server Script in ServerScriptService that hatches a random pet and parents it to the player, and a RemoteEvent in ReplicatedStorage the client fires to request a hatch (validated on the server). Tell me where each script goes in Roblox Studio and how to test it.',
  },
  {
    id: 'fighting-arena',
    label: 'Fighting Arena',
    prompt:
      'Build a fighting arena starter: a sword Tool players get on spawn, a Script in ServerScriptService that handles damage and knockouts with leaderstats for Wins, and a lobby-to-arena teleport. Keep damage checks on the server. Tell me where each script goes in Roblox Studio and how to test it.',
  },
];

const ROBLOX_TERMS = [
  { term: 'Workspace', tip: 'The 3D world — parts and models players can see and touch.' },
  {
    term: 'ReplicatedStorage',
    tip: 'Shared storage the server and every client can read. Put RemoteEvents and shared ModuleScripts here.',
  },
  {
    term: 'ServerScriptService',
    tip: 'Server-only Scripts. Money, data, and game rules belong here, where players can’t tamper with them.',
  },
  { term: 'StarterGui', tip: 'UI (ScreenGuis) copied to each player when they join.' },
  {
    term: 'StarterPlayer',
    tip: 'LocalScripts that run on each player’s device (StarterPlayerScripts / StarterCharacterScripts).',
  },
  {
    term: 'Script / LocalScript / ModuleScript',
    tip: 'A Script runs on the server. A LocalScript runs on the player’s device. A ModuleScript is shared Luau code either side can require().',
  },
  {
    term: 'RemoteEvent',
    tip: 'How client and server talk to each other. Keep them in ReplicatedStorage, e.g. in a Remotes folder.',
  },
  { term: 'Luau', tip: 'Roblox’s scripting language — the code Claude writes for you.' },
];

const SAFETY_NOTES = [
  'Never trust the client. Anything a LocalScript sends can be faked by an exploiter — check every request on the server before acting on it.',
  'Keep money, data, and rewards in Scripts in ServerScriptService. A LocalScript should only ask; the server decides.',
  'When a LocalScript fires a RemoteEvent, the server handler must validate it: who sent it, is it allowed right now, and is the amount sane.',
];

const EMPTY_STATES = {
  noSessions: 'No sessions open. Ask Claude starts a Claude Code session in your project folder.',
  noSessionsHint: 'Keep Sync to Studio running while you build so Roblox Studio stays up to date.',
  gitNoFolder: 'Set a project folder to see Git status.',
  sessionsNoFolder: 'Sessions you open will show up here.',
};

function shouldShowOnboarding(state) {
  return !(state && state.projectFolder) && !(state && state.skipped);
}

const OnboardingContent = {
  SETUP_STEPS,
  GAME_IDEAS,
  ROBLOX_TERMS,
  SAFETY_NOTES,
  EMPTY_STATES,
  shouldShowOnboarding,
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = OnboardingContent;
} else {
  window.BuildCenter = window.BuildCenter || {};
  window.BuildCenter.onboardingContent = OnboardingContent;
}
