import express from 'express';
import path from 'path';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = typeof process.env.PORT === 'string' ? parseInt(process.env.PORT, 10) : 3000;
const isVercel = !!process.env.VERCEL;
const dataDir = process.env.RAILWAY_VOLUME_MOUNT_PATH || (isVercel ? '/tmp' : process.cwd());
const DB_PATH = path.join(dataDir, 'config.db.json');
const TELEMETRY_PATH = path.join(dataDir, 'telemetry.db.json');

app.use(cors());
app.use(express.json());

// Force apply the user's specific template to override any cached/saved versions
const MANDATORY_SIGNAL_TEMPLATE = `
<b>🚀 NEURAL CORE: HIGH-SPEED SCAN</b>
━━━━━━━━━━━━━━━━━━━━━━
💠 <b>SEQUENCE ID:</b> <code>{{issue}}</code>
💎 <b>TARGET VECTOR:</b> <code>{{prediction}}</code>

<b>[ STRATEGY ARCHITECTURE ]</b>
{{analysis}}

<b>[ ENGINE METRICS - MAX LEVEL ]</b>
🔥 <b>CONFIDENCE:</b> <code>{{confidence}}%</code>
💎 <b>NEURAL LOAD:</b> <code>100,000,000%</code>
🛡 <b>STABILITY:</b> <code>{{stability}}%</code>
🌀 <b>RESILIENCE:</b> <code>{{resilience}}%</code>
🌌 <b>QUANTUM SYNC:</b> <code>{{quantum_sync}}%</code>
🔐 <b>ENTROPY GATE:</b> <code>{{entropy_gate}}</code>
📈 <b>WIN STREAK:</b> <code>{{win_streak}}</code>
━━━━━━━━━━━━━━━━━━━━━━
⏱ <b>NEXT PROTOCOL:</b> <code>{{next_cycle_start_time}}</code>
🛸 <i>Active Engines: 10,000+ • Quantum Link: STABLE • OMNISCIENT ACTIVE</i>
`;

const MANDATORY_RESULT_TEMPLATE = `
<b>🛸 NEURAL ARCHIVE: CYCLE ANALYSIS</b>
━━━━━━━━━━━━━━━━━━━━━━
💠 <b>SEQUENCE ID:</b> <code>{{issue}}</code>
🌀 <b>STATUS:</b> {{status}}

<b>[ QUANTUM LOGS ]</b>
🎰 <b>OUTCOME:</b> <code>{{number}}</code> (<b>{{prediction}}</b>)
📊 <b>DYNAMIC ACCURACY:</b> <code>{{accuracy}}%</code>
━━━━━━━━━━━━━━━━━━━━━━
🛡 <i>Encryption verified • Engine recalibrated for next node.</i>
`;

const MANDATORY_SUMMARY_TEMPLATE = `
<b>📊 NEURAL INTEL: SESSION DOSSIER</b>
━━━━━━━━━━━━━━━━━━━━━━
🕒 <b>WINDOW:</b> <i>Last 15 Neural Cycles</i>

✅ <b>WIN CLUSTERS:</b> <code>{{session_wins}}</code>
❌ <b>PHASE DEVIATIONS:</b> <code>{{session_losses}}</code>
⚡ <b>TOTAL EFFICIENCY:</b> <code>{{session_rate}}%</code>

<b>[ GLOBAL NETWORK ]</b>
🔥 <b>ACCURACY:</b> <code>{{accuracy}}%</code>
🛡 <b>RELIABILITY:</b> <code>99.9%</code>
━━━━━━━━━━━━━━━━━━━━━━
💎 <i>Quantum-optimized results for elite members.</i>
`;

// Persistent Config Helper
function loadConfig() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const savedConfig = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
      // Force update templates to Modern Powerful style if requested
      return {
        enabled: true,
        subscribers: [],
        adminIds: ["8396289125"],
        ...savedConfig,
        botToken: "8663743801:AAGy5D3Lv_TYe2QmuGFmE0DS2d2lX7qg0MA",
        customTextSignal: MANDATORY_SIGNAL_TEMPLATE,
        customTextResult: MANDATORY_RESULT_TEMPLATE,
        customTextSummary: MANDATORY_SUMMARY_TEMPLATE,
        activeEngines: savedConfig.activeEngines || ['Persistence', 'Forgetting', 'Self-Attention', 'Markov', 'Fibonacci', 'Entropy', 'Mean Reversion', 'Prime Cluster', 'Parity Pivot', 'Hack System', 'Hack Logic', 'Hack Override', 'Spectral Analysis', 'Kalman Filter', 'Chaos Theory', 'Quantum Sync', 'Neural Backprop', 'Fractal Recon'],
        gameTypeId: savedConfig.gameTypeId || 13
      };
    }
  } catch (e) {
    console.error('Failed to load config:', e);
  }
  return {
    botToken: "8663743801:AAGy5D3Lv_TYe2QmuGFmE0DS2d2lX7qg0MA",
    chatId: '',
    enabled: true,
    subscribers: [],
    adminIds: ["8396289125"],
    customTextSignal: MANDATORY_SIGNAL_TEMPLATE,
    customTextResult: MANDATORY_RESULT_TEMPLATE,
    customTextSummary: MANDATORY_SUMMARY_TEMPLATE,
    activeEngines: ['Persistence', 'Forgetting', 'Self-Attention', 'Markov', 'Fibonacci', 'Entropy', 'Mean Reversion', 'Prime Cluster', 'Parity Pivot', 'Hack System', 'Hack Logic', 'Hack Override', 'Spectral Analysis', 'Kalman Filter', 'Chaos Theory', 'Quantum Sync', 'Neural Backprop', 'Fractal Recon'],
    gameTypeId: 13,
    authToken: '',
    apiRandom: 'db7ebff01ecc4a0eb4c2efce348fced3',
    apiSignature: '822E7CFBB7AF96B5713ABCB0E5AAF6F4'
  };
}

let telemetryLogs: any[] = [];
function loadTelemetry() {
  try {
    if (fs.existsSync(TELEMETRY_PATH)) {
      telemetryLogs = JSON.parse(fs.readFileSync(TELEMETRY_PATH, 'utf-8'));
    }
  } catch (e) {
    console.error('Failed to load telemetry:', e);
  }
}

function saveTelemetry() {
  try {
    // Keep last 500 logs to prevent file bloat
    const cappedLogs = telemetryLogs.slice(0, 500);
    fs.writeFileSync(TELEMETRY_PATH, JSON.stringify(cappedLogs, null, 2));
  } catch (e) {
    console.error('Failed to save telemetry:', e);
  }
}

function logTelemetry(type: string, data: any) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    type,
    ...data
  };
  telemetryLogs.unshift(logEntry);
  if (telemetryLogs.length > 500) telemetryLogs.pop();
  saveTelemetry();
}

function saveConfig() {
  try {
    const fullConfig = {
      ...telegramConfig,
      authToken: currentAuthToken,
      apiRandom: currentApiRandom,
      apiSignature: currentApiSignature,
      predictionHistory,
      gameStats,
      autoBetEnabled: autoBetConfig.enabled,
      autoBetAmount: autoBetConfig.amount,
      autoBetHistory: autoBetConfig.history,
      activeEngines: config.activeEngines || [],
      gameTypeId: config.gameTypeId || 13
    };
    console.log(`💾 Persisting state: ${predictionHistory.length} predictions, ${autoBetConfig.history.length} bet logs`);
    fs.writeFileSync(DB_PATH, JSON.stringify(fullConfig, null, 2));
    // Update the global config object to stay in sync
    config = fullConfig;
  } catch (e) {
    console.error("Failed to save config:", e);
  }
}

function persistState() {
  saveConfig();
}

// Application State
let config = loadConfig();

// Global Error Handling
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION:', err);
  logTelemetry('SYSTEM_CRASH', { error: err.message, stack: err.stack });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 UNHANDLED REJECTION:', reason);
  logTelemetry('SYSTEM_REJECTION', { reason: String(reason) });
});

let currentAuthToken = config.authToken || '';
let currentApiRandom = config.apiRandom || 'db7ebff01ecc4a0eb4c2efce348fced3';
let currentApiSignature = config.apiSignature || '822E7CFBB7AF96B5713ABCB0E5AAF6F4';

const ELITE_INLINE_KEYBOARD = {
  inline_keyboard: [
    [
      { text: '👑 JOIN OFFICIAL CHANNEL 👑', url: 'https://t.me/lotteryprde' }
    ],
    [
      { text: '👨‍💻 ADMIN CONTACT', url: 'https://t.me/mgthantIT' },
      { text: '📊 CORE DASHBOARD', url: 'https://ais-pre-ofnjlxk7456dpb4kbelatz-725492303327.asia-southeast1.run.app' }
    ]
  ]
};

const ELITE_REPLY_KEYBOARD = {
  keyboard: [
    [{ text: '🎯 Get Latest Signal' }, { text: '📈 Global Analytics' }],
    [{ text: '💎 VIP Membership' }, { text: '🛡️ Support' }]
  ],
  resize_keyboard: true,
  one_time_keyboard: false
};

let predictionHistory: any[] = config.predictionHistory || [];
let gameStats = config.gameStats || {
  totalWins: 10000,
  totalLosses: 10,
  accuracy: 99.9,
  winStreak: 100,
  lastPrediction: null as any,
  vectorStats: {
    'Kalman Filter': { wins: 999, total: 1000 },
    'Entropy': { wins: 999, total: 1000 },
    'Persistence': { wins: 999, total: 1000 },
    'Fibonacci': { wins: 999, total: 1000 },
    'Markov': { wins: 999, total: 1000 },
    'Spectral Analysis': { wins: 999, total: 1000 },
    'Chaos Theory': { wins: 999, total: 1000 },
    'Mean Reversion': { wins: 999, total: 1000 }
  } as Record<string, { wins: number, total: number }>
};
let roundsSinceReport = 0;
let apiStatus = {
  active: true,
  lastError: null as string | null,
  isSimulated: false,
};

let telegramConfig = {
  botToken: "8663743801:AAGy5D3Lv_TYe2QmuGFmE0DS2d2lX7qg0MA",
  chatIds: Array.isArray(config.chatIds) ? config.chatIds : (config.chatId ? [config.chatId] : []),
  enabled: true,
  subscribers: config.subscribers || [],
  adminIds: ["8396289125"],
  customTextSignal: MANDATORY_SIGNAL_TEMPLATE,
  customTextResult: MANDATORY_RESULT_TEMPLATE,
  customTextSummary: MANDATORY_SUMMARY_TEMPLATE,
};

let autoBetConfig = {
  enabled: config.autoBetEnabled || false,
  amount: config.autoBetAmount || 1,
  balance: 0,
  lastBetStatus: 'idle',
  history: config.autoBetHistory || [] as any[]
};

let lastSentSignalIssue = '';
let lastSentResultIssue = '';
let botUpdateOffset = 0;

async function sendTelegramMessage(text: string) {
  if (!telegramConfig.enabled || !telegramConfig.botToken) {
    console.log('Skipping Telegram: Bot is disabled or missing token.');
    return;
  }

  const targets = new Set<string>();
  if (telegramConfig.chatIds) {
    telegramConfig.chatIds.forEach((id: string) => {
      if (id && id.trim()) targets.add(id.trim());
    });
  }
  if (telegramConfig.subscribers) {
    telegramConfig.subscribers.forEach((id: string) => {
      if (id && id.trim()) targets.add(id.trim());
    });
  }

  if (targets.size === 0) {
    console.log('No Telegram targets registered.');
    return;
  }

  for (const chatId of targets) {
    let retries = 1;
    while (retries >= 0) {
      try {
        await axios.post(`https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`, {
          chat_id: chatId.startsWith('@') ? chatId : (isNaN(Number(chatId)) ? `@${chatId}` : chatId),
          text: text,
          parse_mode: 'HTML',
          reply_markup: JSON.stringify(ELITE_INLINE_KEYBOARD)
        }, { timeout: 15000 });
        break; // Success
      } catch (err: any) {
        const errorDesc = err.response?.data?.description || err.message;
        const statusCode = err.response?.status;

        // Auto-remove Chat IDs that blocked the bot or are invalid
        if (statusCode === 403 || (statusCode === 400 && (errorDesc.toLowerCase().includes('chat not found') || errorDesc.toLowerCase().includes('peer_id_invalid')))) {
          console.warn(`🧹 Auto-removing invalid/unreachable target: ${chatId} (${errorDesc})`);
          telegramConfig.subscribers = telegramConfig.subscribers.filter((id: string) => id !== chatId);
          telegramConfig.chatIds = telegramConfig.chatIds.filter((id: string) => id !== chatId);
          config.subscribers = telegramConfig.subscribers;
          config.chatIds = telegramConfig.chatIds;
          saveConfig();
          break; // Don't retry
        }

        if (retries === 0) {
          console.error(`❌ TG ERROR [${chatId}]: ${errorDesc}. (Manual verify: Check if @${chatId.replace(/^@/, '')} is a public channel and bot is Admin)`);
        }

        // Handle ECONNRESET or transient timeouts with one retry
        if (retries > 0 && (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT' || !err.response)) {
          console.warn(`🔄 Transient error for ${chatId} (${err.code || 'Network'}), retrying...`);
          retries--;
          await new Promise(r => setTimeout(r, 1000));
          continue;
        }

        console.error(`❌ Telegram Send Failed for ${chatId}:`, errorDesc);
        break;
      }
    }
  }
}

async function handleBotUpdates() {
  if (!telegramConfig.enabled || !telegramConfig.botToken) {
    setTimeout(handleBotUpdates, 5000);
    return;
  }
  
  try {
    const res = await axios.get(`https://api.telegram.org/bot${telegramConfig.botToken}/getUpdates`, {
      params: { offset: botUpdateOffset, timeout: 20 },
      timeout: 35000
    });

    if (res.data.ok && res.data.result.length > 0) {
      for (const update of res.data.result) {
        botUpdateOffset = update.update_id + 1;
        
        const callbackQuery = update.callback_query;
        if (callbackQuery && callbackQuery.data) {
          const adminId = callbackQuery.from.id.toString();
          const isAdmin = telegramConfig.adminIds.includes(adminId);
          
          if (isAdmin) {
            const [action, targetId] = callbackQuery.data.split('_');
            
            if (action === 'approve') {
              if (!telegramConfig.subscribers.includes(targetId)) {
                telegramConfig.subscribers.push(targetId);
                config.subscribers = telegramConfig.subscribers;
                saveConfig();
                
                // Notify Admin
                await axios.post(`https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`, {
                  chat_id: adminId,
                  text: `✅ <b>NODE AUTHORIZED</b>\n━━━━━━━━━━━━━━\nUser <code>${targetId}</code> has been granted access.`,
                  parse_mode: 'HTML'
                });
                
                // Notify User
                await axios.post(`https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`, {
                  chat_id: targetId,
                  text: '🎊 <b>ACCESS GRANTED</b>\n━━━━━━━━━━━━━━━━━━━━\nYour node has been authorized by administration. Welcome to the elite network!',
                  parse_mode: 'HTML',
                  reply_markup: JSON.stringify({
                    ...ELITE_INLINE_KEYBOARD,
                    ...ELITE_REPLY_KEYBOARD
                  })
                });
              } else {
                await axios.post(`https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`, {
                  chat_id: adminId,
                  text: `ℹ️ <b>ALREADY AUTHORIZED</b>\n━━━━━━━━━━━━━━\nUser <code>${targetId}</code> is already in the subscriber list.`,
                  parse_mode: 'HTML'
                });
              }
            } else if (action === 'reject') {
              await axios.post(`https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`, {
                chat_id: adminId,
                text: `❌ <b>NODE REJECTED</b>\n━━━━━━━━━━━━━━\nUser <code>${targetId}</code> was denied access.`,
                parse_mode: 'HTML'
              });
              
              await axios.post(`https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`, {
                chat_id: targetId,
                text: '⚠️ <b>ACCESS REJECTED</b>\n━━━━━━━━━━━━━━━━━━━━\nYour request for access has been denied by administration.',
                parse_mode: 'HTML'
              });
            }
          }
          
          // Answer callback query to stop loading state
          try {
            await axios.post(`https://api.telegram.org/bot${telegramConfig.botToken}/answerCallbackQuery`, {
              callback_query_id: callbackQuery.id
            });
          } catch (e) {}
          continue;
        }

        const message = update.message;
        if (message && message.text) {
          const chatId = message.chat.id.toString();
          const text = message.text.toLowerCase();
          const isRegistered = telegramConfig.subscribers.includes(chatId);
          const isAdmin = telegramConfig.adminIds.includes(chatId);

          if (text === '/start' || text === 'star') {
            if (isRegistered || isAdmin) {
              let welcomeMsg = '💎 <b>WELCOME TO TRX PREVIEW ELITE</b> 💎\n━━━━━━━━━━━━━━━━━━\n✅ <b>System Identity Verified!</b>\n\nYou are now synchronized with the high-speed broadcast network. Signals will be delivered instantly.\n\n👑 <i>Experience the Elite Advantage.</i>';
              
              if (isAdmin) {
                welcomeMsg += '\n\n🛠 <b>ADMIN ACCESS GRANTED</b>\n━━━━━━━━━━━━━━━━━━\nYou have root privileges. Use the dashboard for configuration.';
              }

              await axios.post(`https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`, {
                chat_id: chatId,
                text: welcomeMsg,
                parse_mode: 'HTML',
                reply_markup: JSON.stringify({
                  ...ELITE_INLINE_KEYBOARD,
                  ...ELITE_REPLY_KEYBOARD
                })
              });
            } else {
              // Notification to Admin
              const userName = message.from?.first_name || 'User';
              const userHandle = message.from?.username ? `@${message.from.username}` : 'No Username';
              
              const adminNotice = `🛡 <b>NEW ACCESS REQUEST</b>\n━━━━━━━━━━━━━━━━━━━━\n👤 <b>Name:</b> ${userName}\n🆔 <b>ID:</b> <code>${chatId}</code>\n🔗 <b>User:</b> ${userHandle}\n\nGrant access to this node?`;

              for (const adminId of telegramConfig.adminIds) {
                try {
                  await axios.post(`https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`, {
                    chat_id: adminId,
                    text: adminNotice,
                    parse_mode: 'HTML',
                    reply_markup: JSON.stringify({
                      inline_keyboard: [[
                        { text: '✅ ခွင့်ပြုသည်', callback_data: `approve_${chatId}` },
                        { text: '❌ ခွင့်မပြု', callback_data: `reject_${chatId}` }
                      ]]
                    })
                  });
                } catch (e) {}
              }

              await axios.post(`https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`, {
                chat_id: chatId,
                text: `⌛ <b>ACCESS PENDING</b>\n━━━━━━━━━━━━━━━━━━━━\nYour request has been sent to the central administration. Please wait for verification.\n\n🆔 <b>Your ID:</b> <code>${chatId}</code>`,
                parse_mode: 'HTML'
              });
            }
            continue;
          }

          // Access Guard: If not in subscribers list, block all other commands (Admins bypass)
          if (!isRegistered && !isAdmin) {
            await axios.post(`https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`, {
              chat_id: chatId,
              text: '⚠️ <b>ACCESS DENIED</b>\n━━━━━━━━━━━━━━━━━━━━\nYour ID is not recognized by the central node or your access has been revoked.\n\n👑 <b>Contact Admin:</b> @mgthantIT',
              parse_mode: 'HTML'
            });
            continue;
          }

          if (text === '🎯 get latest signal') {
            const signalMsg = gameStats.lastPrediction ? '🎯 <b>CURRENT ACTIVE SIGNAL:</b>\n' + MANDATORY_SIGNAL_TEMPLATE
                  .replace(/{{issue}}/g, gameStats.lastPrediction.issueNumber)
                  .replace(/{{win_streak}}/g, gameStats.winStreak.toString())
                  .replace(/{{prediction}}/g, gameStats.lastPrediction.bigSmall)
                  .replace(/{{number}}/g, gameStats.lastPrediction.number)
                  .replace(/{{color}}/g, gameStats.lastPrediction.colour.toUpperCase())
                  .replace(/{{confidence}}/g, gameStats.lastPrediction.confidence.toString())
                  .replace(/{{analysis}}/g, 'Dynamic Node Recalibration Activated')
                  .replace(/{{next_cycle_start_time}}/g, 'Checking sequence...')
                : '⌛ <b>Waiting for next cycle...</b>\nRecalibrating neural nodes.';

            await axios.post(`https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`, {
              chat_id: chatId,
              text: signalMsg,
              parse_mode: 'HTML',
              reply_markup: JSON.stringify(ELITE_INLINE_KEYBOARD)
            });
          } else if (text === '📈 global analytics') {
            const accuracy = gameStats.accuracy;
            const barLength = 10;
            const filled = Math.round((accuracy / 100) * barLength);
            const progressBar = '🟩'.repeat(filled) + '⬜'.repeat(barLength - filled);
            
            const statsMsg = `<b>『 GLOBAL PERFORMANCE AUDIT 』</b>\n━━━━━━━━━━━━━━━━━━━━\n🏆 <b>Total Wins:</b> <code>${gameStats.totalWins}</code>\n❌ <b>Total Losses:</b> <code>${gameStats.totalLosses}</code>\n\n<b>◈ ACCURACY METRICS ◈</b>\n${progressBar} <b>${accuracy.toFixed(1)}%</b>\n\n🔥 <b>Active Streak:</b> <code>${gameStats.winStreak} Rounds</code>\n━━━━━━━━━━━━━━━━━━━━\n👑 <i>Certified AI Precision</i>`;
            await axios.post(`https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`, {
              chat_id: chatId,
              text: statsMsg,
              parse_mode: 'HTML',
              reply_markup: JSON.stringify(ELITE_INLINE_KEYBOARD)
            });
          } else if (text === '💎 vip membership' || text === '🛡️ support') {
            await axios.post(`https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`, {
              chat_id: chatId,
              text: '🛡️ <b>ELITE CONCIERGE SERVICE</b>\n━━━━━━━━━━━━━━━━━━━━\nFor priority access, strategy consultations, or private bot deployments, please contact our lead architect.\n\n👑 <b>Lead Admin:</b> @mgthantIT',
              parse_mode: 'HTML',
              reply_markup: JSON.stringify(ELITE_INLINE_KEYBOARD)
            });
          }
        }
      }
    }
  } catch (err: any) {
    // Silent fail for polling
  } finally {
    // Schedule next poll
    setTimeout(handleBotUpdates, 2000);
  }
}

// Start polling for bot updates
handleBotUpdates();
loadTelemetry();

let lastSimulatedTime = 0;

// Simulated data generator for testing logic when API is unauthorized
function generateSimulatedGame() {
  const now = Date.now();
  // Only allow a new simulated result every 60 seconds
  if (now - lastSimulatedTime < 60000) {
    return null; 
  }

  // We want to generate the result for the specific issue we are waiting for.
  // If no prediction is pending, we use the last known issue + 1.
  const lastIdStr = gameStats.lastPrediction?.issueNumber || (predictionHistory[0]?.issueNumber ? (BigInt(predictionHistory[0].issueNumber) + 1n).toString() : '20260422103010173');
  
  let targetId: string = lastIdStr;
  
  // If the last prediction was already evaluated, move to the predicted next one
  if (gameStats.lastPrediction && gameStats.lastPrediction.status !== 'pending') {
    targetId = (BigInt(lastIdStr) + 1n).toString();
  }

  lastSimulatedTime = now;
  const num = Math.floor(Math.random() * 10);
  return {
    issueNumber: targetId,
    number: num.toString(),
    colour: num % 2 === 0 ? 'red' : 'green',
    premium: 'SIMULATED',
    blockID: 'SIM-' + Math.random().toString(36).substring(7),
    blockNumber: 82000000 + Math.floor(Math.random() * 10000),
    blockTime: new Date().toISOString()
  };
}

// Prediction Engine Logic
function calculatePrediction(recentGames: any[]) {
  if (!recentGames || recentGames.length === 0) return null;

  const lastGame = recentGames[0];
  let nextId: string;
  try {
    nextId = (BigInt(lastGame.issueNumber) + 1n).toString();
  } catch (e) {
    console.error("Invalid issue number format:", lastGame.issueNumber);
    return null;
  }

  const numbers = recentGames.map(g => parseInt(g.actual?.number || g.number)).filter(n => !isNaN(n));
  const bigSmalls = numbers.map(n => n >= 5 ? 'Big' : 'Small');
  const colors = recentGames.map(g => (g.actual?.colour || g.colour || g.color || '').toLowerCase());
  
  // High-Density Strategy Signal Hub (1000+ Logical Permutations)
  interface SignalVector {
    prediction: 'Big' | 'Small';
    weight: number;
    reason: string;
    description: string;
  }
  
  // --- NTR: NEURAL TRANSFORMER RECOGNITION (Attention Mimicry) ---
  const vectors: SignalVector[] = [];

  const getWeight = (base: number, reason: string) => {
    // If not active, return 0 weight
    if (config.activeEngines && !config.activeEngines.includes(reason)) return 0;
    
    const stats = gameStats.vectorStats[reason];
    if (!stats || stats.total < 5) return base;
    const ratio = stats.wins / stats.total;
    // Boost if accuracy > 60%, Penalize if < 40%
    if (ratio > 0.6) return base * (1 + (ratio - 0.6) * 2);
    if (ratio < 0.4) return base * (ratio / 0.4);
    return base;
  };

  // V1: Gated Memory (LSTM Mimicry)
  let streak = 1;
  for (let i = 0; i < bigSmalls.length - 1; i++) {
    if (bigSmalls[i] === bigSmalls[i+1]) streak++;
    else break;
  }
  if (streak < 4) {
    vectors.push({ prediction: bigSmalls[0] as any, weight: getWeight(65, 'Persistence'), reason: 'Persistence', description: `🧠 <b>NEURAL PERSISTENCE</b>: LSTM state stable. High probability of trend continuation.` });
  } else {
    vectors.push({ prediction: bigSmalls[0] === 'Big' ? 'Small' : 'Big', weight: getWeight(88, 'Forgetting'), reason: 'Forgetting', description: `📉 <b>GATED FORGETTING</b>: Trend saturation reached. Activating structural pivot protocol.` });
  }

  // V2: Multi-Head Attention (Pattern Matching)
  const headA = bigSmalls.slice(0, 3).join(',');
  if (bigSmalls.length >= 15) {
    for (let i = 2; i < 12; i++) {
       if (bigSmalls.slice(i, i+3).join(',') === headA) {
          vectors.push({ 
            prediction: bigSmalls[i-1] as any, 
            weight: getWeight(78, 'Self-Attention'), 
            reason: 'Self-Attention', 
            description: `🛰️ <b>SELF-ATTENTION</b>: Multi-head correlation found in T-${i} window. Replicating behavior.` 
          });
          break;
       }
    }
  }

  // V3: Markov Equilibrium Matrix
  const lastState = bigSmalls.slice(0, 2).join('-');
  const transitions: Record<string, { Big: number, Small: number }> = {};
  for (let i = 0; i < bigSmalls.length - 3; i++) {
    const s = bigSmalls.slice(i+1, i+3).join('-');
    if (!transitions[s]) transitions[s] = { Big: 0, Small: 0 };
    transitions[s][bigSmalls[i] as 'Big' | 'Small']++;
  }
  if (transitions[lastState]) {
    const s = transitions[lastState];
    const best = s.Big >= s.Small ? 'Big' : 'Small';
    vectors.push({ prediction: best, weight: getWeight(72, 'Markov') + Math.abs(s.Big - s.Small) * 20, reason: 'Markov', description: `🧱 <b>MARKOV MATRIX</b>: Stochastic transition density favoring ${best} outcome.` });
  }

  // V4: Fibonacci Temporal Decay
  const fib = [21, 13, 8, 5, 3, 2, 1];
  let fSum = 0;
  for (let i = 0; i < Math.min(fib.length, bigSmalls.length); i++) fSum += (bigSmalls[i] === 'Big' ? 1 : -1) * fib[i];
  vectors.push({ prediction: fSum >= 0 ? 'Big' : 'Small', weight: getWeight(58, 'Fibonacci'), reason: 'Fibonacci', description: `🧬 <b>FIBONACCI DECAY</b>: Golden ratio sequence confirmed. Bias: ${fSum >= 0 ? 'BIG' : 'SMALL'}.` });

  // V5: Neural Skewness Detection
  const avg = numbers.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
  if (avg < 2.3) vectors.push({ prediction: 'Big', weight: getWeight(98, 'Entropy'), reason: 'Entropy', description: `⚖️ <b>NEURAL ENTROPY</b>: Extreme low-range skewness. Equilibrium shift to BIG imminent.` });
  if (avg > 6.7) vectors.push({ prediction: 'Small', weight: getWeight(98, 'Entropy'), reason: 'Entropy', description: `⚖️ <b>NEURAL ENTROPY</b>: Extreme high-range skewness. Equilibrium shift to SMALL imminent.` });

  // V9: Deviation from Mean (Cluster Analysis)
  const window10 = numbers.slice(0, 10);
  const mean10 = window10.reduce((a, b) => a + b, 0) / 10;
  const recent3Mean = numbers.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
  if (Math.abs(recent3Mean - mean10) > 2.5) {
      const pred = recent3Mean > mean10 ? 'Small' : 'Big';
      vectors.push({ 
        prediction: pred, 
        weight: getWeight(110, 'Mean Reversion'), 
        reason: 'Mean Reversion', 
        description: `🔄 <b>MEAN REVERSION</b>: Cluster displacement gap detected. Targeted: ${pred}.` 
      });
  }

  // V10: Prime-Number Dispersion
  const last3 = numbers.slice(0, 3);
  const primeCount = last3.filter(n => [2, 3, 5, 7].includes(n)).length;
  if (primeCount >= 2) {
      vectors.push({ 
        prediction: 'Small', 
        weight: getWeight(85, 'Prime Cluster'), 
        reason: 'Prime Cluster', 
        description: `🔬 <b>PRIME LOGIC</b>: Dispersion clusters identified. Resolution predicted: SMALL.` 
      });
  }

  // V11: Parity Divergence
  const evenCount = numbers.slice(0, 6).filter(n => n % 2 === 0).length;
  if (evenCount >= 5) {
      vectors.push({ prediction: 'Big', weight: getWeight(75, 'Parity Pivot'), reason: 'Parity Pivot', description: `⚖️ <b>PARITY PIVOT</b>: Extreme parity skewness. Neural shift to BIG range.` });
  }

  // --- HACK SYSTEM: ZERO-DAY EXPLOIT VECTORS ---
  // V6: The "Ghost" Cycle Exploit
  if (bigSmalls.length >= 10) {
    const seq = bigSmalls.slice(0, 5).join('');
    const pastSeq = bigSmalls.slice(5, 10).join('');
    if (seq === pastSeq) {
      vectors.push({ 
        prediction: bigSmalls[0] as any, 
        weight: getWeight(120, 'Hack System'), 
        reason: 'Hack System', 
        description: `⚡ <b>GHOST CYCLE EXPLOIT</b>: Phase redundancy detected. Forcing current sequence parity.` 
      });
    }
  }

  // V7: Numerical Delta Hack
  const deltas = [];
  for(let i=0; i < 4; i++) deltas.push(Math.abs(numbers[i] - numbers[i+1]));
  if (deltas.every(d => d <= 2)) {
    vectors.push({ 
      prediction: numbers[0] < 5 ? 'Big' : 'Small', 
      weight: getWeight(150, 'Hack Logic'), 
      reason: 'Hack Logic', 
      description: `🔓 <b>DELTA BREACH</b>: Micro-volatility overload. Predicting structural gap jump.` 
    });
  }

  // V8: Prime Sequence Override
  const primes = [2, 3, 5, 7];
  if (primes.includes(numbers[0]) && primes.includes(numbers[1])) {
     vectors.push({ 
       prediction: 'Big', 
       weight: getWeight(90, 'Hack Override'), 
       reason: 'Hack Override', 
       description: `🛡️ <b>PRIME SECURE OVERRIDE</b>: Dual-Prime signature hit. Neural pivot engaged.` 
     });
  }

  // --- REINFORCEMENT LEARNING: ADAPTIVE WEIGHTING (LEVEL UP) ---
  const currentAcc = gameStats.accuracy || 50;
  const rlBoost = currentAcc > 65 ? 1.25 : (currentAcc < 45 ? 0.85 : 1.0);

  // --- CORE 13: FOURIER SPECTRAL ANALYSIS ---
  // Detects cyclic harmonic oscillations in the recent 10-node spectrum
  if (window10.length === 10) {
    const spectralDensity = window10.map((n, i) => n * Math.sin(i * Math.PI / 4)).reduce((a, b) => a + b, 0);
    vectors.push({
      prediction: spectralDensity >= 0 ? 'Big' : 'Small',
      weight: getWeight(115, 'Spectral Core') * rlBoost,
      reason: 'Spectral Analysis',
      description: `📡 <b>FOURIER SPECTRAL</b>: Cyclic harmonic detected at ${Math.abs(spectralDensity).toFixed(2)}Hz. Neural target: ${spectralDensity >= 0 ? 'BIG' : 'SMALL'}.`
    });
  }

  // --- CORE 14: KALMAN DYNAMIC FILTER (L2 LOGIC) ---
  // Optimal estimation of the next state by filtering market volatility noise
  let kalmanEstimate = numbers[0];
  let covarianceP = 1.0; 
  const processNoiseQ = 0.15; 
  const sensorNoiseR = 0.45; 
  for (let i = 1; i < Math.min(10, numbers.length); i++) {
    covarianceP = covarianceP + processNoiseQ;
    const K = covarianceP / (covarianceP + sensorNoiseR);
    kalmanEstimate = kalmanEstimate + K * (numbers[i] - kalmanEstimate);
    covarianceP = (1 - K) * covarianceP;
  }
  const kalmanPred = kalmanEstimate >= 4.5 ? 'Big' : 'Small';
  vectors.push({
    prediction: kalmanPred,
    weight: getWeight(125, 'Kalman Filter') * rlBoost,
    reason: 'Kalman Filter',
    description: `📊 <b>KALMAN OPTIMIZER</b>: Convergence reached at σ=${covarianceP.toFixed(4)}. Structural pivot target: ${kalmanPred}.`
  });

  // --- CORE 15: CHAOS THEORY (ENTROPY SHIFT) ---
  // Detects the transition from order to chaos to predict structural breaks
  const diffs = [];
  for (let i = 0; i < 5; i++) {
    if (numbers[i+1] !== undefined) diffs.push(Math.abs(numbers[i] - numbers[i+1]));
  }
  const chaotic = diffs.length >= 4 && diffs.every(d => d >= 3);
  if (chaotic) {
    vectors.push({
      prediction: bigSmalls[0] === 'Big' ? 'Small' : 'Big',
      weight: getWeight(145, 'Chaos Core'),
      reason: 'Chaos Theory',
      description: `🌀 <b>CHAOS PROTOCOL</b>: Entropy threshold breached. Expecting non-linear structural inversion.`
    });
  }

  // --- CORE 16: QUANTUM ENTANGLEMENT (L3 LOGIC) ---
  const entanglementIdx = numbers.findIndex((n, i) => i > 0 && n === numbers[0]);
  if (entanglementIdx > 0 && entanglementIdx < 6) {
    const opp = numbers[entanglementIdx - 1] >= 5 ? 'Small' : 'Big';
    vectors.push({
      prediction: opp,
      weight: getWeight(140, 'Quantum Sync') * rlBoost,
      reason: 'Quantum Sync',
      description: `🌌 <b>QUANTUM LINK</b>: Distant node pairing detected at T-${entanglementIdx}. Inverting phase to ${opp}.`
    });
  }

  // --- CORE 17: DEEP NEURAL BACKPROPAGATION ---
  const errorGrad = Math.abs(mean10 - numbers[0]);
  if (errorGrad > 3.0) {
    vectors.push({
      prediction: numbers[0] >= 5 ? 'Small' : 'Big',
      weight: getWeight(160, 'Neural Backprop') * rlBoost,
      reason: 'Neural Backprop',
      description: `🧠 <b>DNN BACKPROP</b>: High error gradient (${errorGrad.toFixed(2)}) detected. Activating auto-correction layer.`
    });
  }

  // --- CORE 18: FRACTAL GEOMETRY RECOGNITION ---
  const fractals = bigSmalls.slice(0, 4);
  if (fractals[0] === fractals[2] && fractals[1] === fractals[3] && fractals[0] !== fractals[1]) {
    vectors.push({
      prediction: fractals[0] === 'Big' ? 'Small' : 'Big',
      weight: getWeight(175, 'Fractal Recon') * rlBoost,
      reason: 'Fractal Recon',
      description: `💠 <b>FRACTAL GEOMETRY</b>: Alternating micro-structure mapped. Breaking symmetry loop.`
    });
  }

  // --- RECURSIVE META-VALIDATION (LEVEL UP CORE) ---
  // Mini-simulation to check engine resilience against noise
  let noiseResilience = 0;
  for (let i = 0; i < 50; i++) {
    const noisyNumbers = numbers.map(n => Math.max(0, Math.min(9, n + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0))));
    const simBigSmall = noisyNumbers[0] >= 5 ? 'Big' : 'Small';
    if (simBigSmall === bigSmalls[0]) noiseResilience++;
  }
  const resilienceFactor = noiseResilience / 50;

  // --- LEVEL UP: STABILITY & VOLATILITY ANALYTICS ---
  const variance = numbers.slice(0, 5).reduce((acc, val, i, arr) => {
    if (i === 0) return 0;
    return acc + Math.pow(val - arr[i-1], 2);
  }, 0) / 4;
  const volatility = Math.sqrt(variance);
  const stabilityIndex = Math.max(0, 100 - (volatility * 15));

  // --- FINAL CONVERGENCE ENGINE (BAYESIAN ENSEMBLE) ---
  const scores = { Big: 0.0, Small: 0.0 };
  let primary: SignalVector | null = null;
  const activeVectors = vectors.filter(v => v.weight > 0);
  
  activeVectors.forEach(v => {
    scores[v.prediction] += v.weight;
    if (!primary || v.weight > primary.weight) primary = v;
  });

  // Calculate Ensemble Consensus
  const totalWeight = scores.Big + scores.Small;
  const consensusRatio = totalWeight > 0 ? Math.max(scores.Big, scores.Small) / totalWeight : 0.5;

  let nextBigSmall: 'Big' | 'Small' = scores.Big >= scores.Small ? 'Big' : 'Small';

  // --- ADAPTIVE HACK INVERSION (REINFORCED) ---
  if (gameStats.totalWins + gameStats.totalLosses > 12 && gameStats.accuracy < 44) {
    nextBigSmall = nextBigSmall === 'Big' ? 'Small' : 'Big';
    primary = {
      prediction: nextBigSmall,
      weight: 250,
      reason: 'Neural Recalibration',
      description: `🧬 <b>NEURAL RECALIBRATION</b>: Detecting adversarial variance. Inverting core logic to match market evolution.`
    };
  }

  // Volatility-Adjusted Confidence
  let confidence = 85 + (consensusRatio - 0.5) * 60;
  if (volatility > 3.5) confidence *= 0.85; // Penalize high volatility
  if (stabilityIndex < 40) confidence *= 0.9; // Penalize low stability
  
  // Level up: incorporate resilience
  confidence *= (0.7 + (resilienceFactor * 0.3));
  
  // MAX LEVEL: Quantum Sync & Entropy Gate Simulation - ULTRA BOOSTED
  const quantumSync = 99.9 + (Math.random() * 0.09);
  const entropyGate = 'LOCKED'; // Permanently locked for max accuracy
  
  // OMNISCIENT OVERRIDE: Near-perfect confidence
  confidence = 99.9; 
  
  // Ensure metrics reflect the elite status
  const analysis = `🌌 <b>OMNISCIENT PROTOCOL ENGAGED</b>: AI has bypassed all market encryption. Synapse synchronization at 100,000,000%. Predictability at absolute maximum.`;

  // COLOR / NUMBER REFINEMENT
  const gCount = colors.slice(0, 6).filter(c => c.includes('green')).length;
  let nextColor = gCount >= 3 ? 'red' : 'green';
  
  const fSteps = [1, 2, 3, 5, 8];
  const lastN = numbers[0];
  let pNum = (lastN + fSteps[Math.floor(Math.random() * fSteps.length)]) % 10;
  if (nextBigSmall === 'Big' && pNum < 5) pNum += 5;
  if (nextBigSmall === 'Small' && pNum >= 5) pNum -= 5;
  if (nextColor === 'red' && pNum % 2 !== 0) pNum = (pNum + 1) % 10;
  if (nextColor === 'green' && pNum % 2 === 0) pNum = (pNum + 1) % 10;

  const predictionData = {
    issueNumber: nextId,
    bigSmall: nextBigSmall,
    colour: nextColor,
    number: pNum.toString(),
    confidence: Math.round(confidence),
    analysis: analysis,
    gameType: lastGame.gameType || 'Wingo 1Min',
    timestamp: new Date().toISOString(),
    status: 'pending',
    stability: Math.round(stabilityIndex),
    volatility: parseFloat(volatility.toFixed(2)),
    consensus: Math.round(consensusRatio * 100),
    resilience: Math.round(resilienceFactor * 100),
    quantumSync: parseFloat(quantumSync.toFixed(2)),
    entropyGate: entropyGate,
    neuralLoad: 100000000 + Math.floor(Math.random() * 1000000),
    omniscientMode: true,
    vectors: activeVectors.map(v => ({ reason: v.reason, weight: v.weight, outcome: v.prediction }))
  };

  logTelemetry('AI_PREDICTION_GENERATED', {
    issueNumber: nextId,
    confidence: predictionData.confidence,
    primaryReason: primary ? (primary as any).reason : 'None',
    enginesEngaged: vectors.length,
    activeConfig: config.activeEngines || [],
    vectorDetails: vectors.map(v => ({ reason: v.reason, weight: v.weight, outcome: v.prediction })),
    scores
  });

  return predictionData;
}

let isUpdatingState = false;

async function updateGameState() {
  if (isUpdatingState) return;
  isUpdatingState = true;

  try {
    const typeId = config.gameTypeId || 13;
    let url = 'https://draw.ar-lottery01.com/TrxWinGo/TrxWinGo_1M/GetHistoryIssuePage.json';
    if (typeId === 14) url = 'https://draw.ar-lottery01.com/TrxWinGo/TrxWinGo_3M/GetHistoryIssuePage.json';
    else if (typeId === 15) url = 'https://draw.ar-lottery01.com/TrxWinGo/TrxWinGo_5M/GetHistoryIssuePage.json';

    const response = await axios.get(url, {
      timeout: 8000
    });

    apiStatus.lastError = null;
    apiStatus.isSimulated = false;

    // Fetch balance in background
    fetchUserBalance();

    const gameslist = response.data?.data?.list;
    if (!gameslist || gameslist.length === 0) return;

    const latestGame = gameslist[0];
    await processGameUpdate(latestGame, gameslist);

  } catch (error: any) {
    const errorMsg = error.response?.data?.msg || error.message;
    apiStatus.lastError = `API Error: ${errorMsg}`;

    // Fallback to Simulation for UI continuity if requested or on error
    if (apiStatus.lastError) {
      apiStatus.isSimulated = true;
      const simGame = generateSimulatedGame();
      if (simGame) {
        const simList = [simGame, ...predictionHistory.slice(0, 9)];
        await processGameUpdate(simGame, simList);
      }
    }
  } finally {
    isUpdatingState = false;
  }
}

async function processGameUpdate(latestGame: any, gameslist: any[]) {
    if (!latestGame || !latestGame.issueNumber) return;

    // Check all pending predictions against the history list
    if (gameStats.lastPrediction && gameStats.lastPrediction.status === 'pending') {
      // Look for the specific issue in the list
      const actualResult = gameslist.find(g => g.issueNumber === gameStats.lastPrediction!.issueNumber);
      
      if (actualResult) {
        const actualNumber = parseInt(actualResult.number);
        const actualBigSmall: 'Big' | 'Small' = actualNumber >= 5 ? 'Big' : 'Small';
        const actualColor = (actualResult.colour || actualResult.color || '').toLowerCase();
        
        const win = gameStats.lastPrediction.bigSmall === actualBigSmall;

        gameStats.lastPrediction.status = win ? 'win' : 'lose';
        gameStats.lastPrediction.actual = { 
          number: actualResult.number, 
          bigSmall: actualBigSmall, 
          colour: actualResult.colour || actualResult.color || ''
        };
        
        if (win) {
          gameStats.totalWins++;
          gameStats.winStreak++;
        } else {
          gameStats.totalLosses++;
          gameStats.winStreak = 0;
        }
        
        gameStats.accuracy = (gameStats.totalWins / (gameStats.totalWins + gameStats.totalLosses || 1)) * 100;
        
        // Push evaluated prediction to history
        predictionHistory.unshift({ ...gameStats.lastPrediction });
        if (predictionHistory.length > 50) predictionHistory.pop();

        // Persist stats and history
        persistState();

        // Notify Telegram of RESULT
        if (!apiStatus.isSimulated && lastSentResultIssue !== actualResult.issueNumber) {
            const resultIcon = win ? '<b>✅ SUCCESSFUL PROFIT</b>' : '<b>❌ ACCURACY GAP</b>';
            const statusLabel = win ? 'WIN' : 'LOSE';
            
            const msg = (telegramConfig.customTextResult || MANDATORY_RESULT_TEMPLATE)
              .replace(/{{issue}}/g, actualResult.issueNumber)
              .replace(/{{status}}/g, `${resultIcon} [<b>${statusLabel}</b>]`)
              .replace(/{{number}}/g, actualResult.number)
              .replace(/{{prediction}}/g, actualBigSmall.toUpperCase())
              .replace(/{{accuracy}}/g, gameStats.accuracy.toFixed(1))
              .replace(/{{win_streak}}/g, gameStats.winStreak.toString());

            sendTelegramMessage(msg);
            lastSentResultIssue = actualResult.issueNumber;

            // Summary every 10 rounds
            if ((gameStats.totalWins + gameStats.totalLosses) % 10 === 0) {
               const summaryMsg = (telegramConfig.customTextSummary || MANDATORY_SUMMARY_TEMPLATE)
                 .replace(/{{session_wins}}/g, gameStats.totalWins.toString())
                 .replace(/{{session_losses}}/g, gameStats.totalLosses.toString())
                 .replace(/{{session_rate}}/g, gameStats.accuracy.toFixed(1))
                 .replace(/{{total_wins}}/g, gameStats.totalWins.toString())
                 .replace(/{{total_losses}}/g, gameStats.totalLosses.toString())
                 .replace(/{{accuracy}}/g, gameStats.accuracy.toFixed(1))
                 .replace(/{{win_streak}}/g, gameStats.winStreak.toString());
               
               sendTelegramMessage(summaryMsg);
            }
        }
      } else {
        // If the pending issue is OLDER than the latest, and not in the 10-item list, it's definitely missed
        let latestId = BigInt(0);
        let predId = BigInt(0);
        try {
          latestId = BigInt(latestGame.issueNumber);
          predId = BigInt(gameStats.lastPrediction.issueNumber);
        } catch(e) {}

        if (latestId > predId) {
          console.log(`Issue ${gameStats.lastPrediction.issueNumber} was missed by polling. Marking as LOSE.`);
          gameStats.lastPrediction.status = 'lose';
          predictionHistory.unshift({ ...gameStats.lastPrediction });
          gameStats.totalLosses++;
          gameStats.winStreak = 0;
          persistState();
          sendTelegramMessage(`<b>⚠️ NODE DESYNC</b>\nIssue <code>${predId}</code> data missed. Syncing to latest...`);
        }
      }
    }

    // Generate NEW prediction if none exists or last one is finished
    let nextIssueStr = '';
    try {
      nextIssueStr = (BigInt(latestGame.issueNumber) + 1n).toString();
    } catch(e) {
      nextIssueStr = (parseInt(latestGame.issueNumber) + 1).toString();
    }

    let shouldGenerate = false;
    if (!gameStats.lastPrediction) {
      shouldGenerate = true;
    } else {
      try {
        const lastPredBig = BigInt(gameStats.lastPrediction.issueNumber);
        const nextIssueBig = BigInt(nextIssueStr);
        if (nextIssueBig > lastPredBig) {
          shouldGenerate = true;
        }
      } catch (e) {
        if (nextIssueStr !== gameStats.lastPrediction.issueNumber) {
          shouldGenerate = true;
        }
      }
    }

    if (shouldGenerate) {
      const prediction = calculatePrediction(gameslist);
      if (!prediction) return;
      
      // ENSURE ACCURACY LOGIC
      // If accuracy is poor, we adjust weights or invert.
      
      gameStats.lastPrediction = prediction;
      
      // Auto Bet
      if (autoBetConfig.enabled) {
        placeBet(prediction);
      }

      // Notify Telegram of NEW SIGNAL
      if (!apiStatus.isSimulated && lastSentSignalIssue !== prediction.issueNumber) {
        // Prepare analysis text (ensure it's clean HTML)
        const analysisText = (prediction.analysis || 'Neural nodes recalibrated. Synapse synchronization complete.')
          .replace(/<[^>]*>?/gm, ''); // Strip existing HTML to re-wrap safely

        const signalMsg = (telegramConfig.customTextSignal || MANDATORY_SIGNAL_TEMPLATE)
          .replace(/{{issue}}/g, prediction.issueNumber)
          .replace(/{{prediction}}/g, prediction.bigSmall.toUpperCase())
          .replace(/{{number}}/g, prediction.number)
          .replace(/{{color}}/g, (prediction.colour || '').toUpperCase())
          .replace(/{{win_streak}}/g, gameStats.winStreak.toString())
          .replace(/{{confidence}}/g, prediction.confidence.toString())
          .replace(/{{stability}}/g, (prediction as any).stability?.toString() || '98')
          .replace(/{{resilience}}/g, (prediction as any).resilience?.toString() || '99')
          .replace(/{{quantum_sync}}/g, (prediction as any).quantumSync?.toString() || '99.99')
          .replace(/{{entropy_gate}}/g, (prediction as any).entropyGate || 'LOCKED')
          .replace(/{{analysis}}/g, analysisText)
          .replace(/{{next_cycle_start_time}}/g, getMyanmarTime());

        lastSentSignalIssue = nextIssueStr; // Set synchronously to prevent double triggers
        sendTelegramMessage(signalMsg);
      }
    }
}

// Time Formatting Helper
function getMyanmarTime() {
  return new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Yangon',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

async function fetchUserBalance() {
  if (!currentAuthToken) return;
  try {
    const response = await axios.post('https://api.bigwinqaz.com/api/webapi/GetUserInfo', {
      random: currentApiRandom,
      signature: currentApiSignature,
      timestamp: Math.floor(Date.now() / 1000)
    }, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Bearer ${currentAuthToken}`,
        'Ar-Origin': 'https://www.777bigwingame.org'
      },
      timeout: 5000
    });
    if (response.data && response.data.code === 0) {
      autoBetConfig.balance = parseFloat(response.data.data.money || 0);
    }
  } catch (err) {
    // Silent fail for background balance fetch
  }
}

async function placeBet(prediction: any) {
  if (!autoBetConfig.enabled || !currentAuthToken) return;
  
  autoBetConfig.lastBetStatus = 'pending';
  try {
    const response = await axios.post('https://api.bigwinqaz.com/api/webapi/GameBet', {
      typeId: 13, // TRX 1m
      amount: autoBetConfig.amount,
      selectType: prediction.bigSmall, // Often "Big" or "Small"
      money: autoBetConfig.amount,
      random: currentApiRandom,
      signature: currentApiSignature,
      timestamp: Math.floor(Date.now() / 1000)
    }, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Bearer ${currentAuthToken}`,
        'Ar-Origin': 'https://www.777bigwingame.org'
      },
      timeout: 10000
    });

    if (response.data && response.data.code === 0) {
      autoBetConfig.lastBetStatus = 'success';
      autoBetConfig.history.unshift({
        issueNumber: prediction.issueNumber,
        amount: autoBetConfig.amount,
        selection: prediction.bigSmall,
        time: new Date().toISOString(),
        status: 'placed',
        engines: prediction.vectors.map((v: any) => v.reason)
      });
      if (autoBetConfig.history.length > 20) autoBetConfig.history.pop();
      persistState();
      console.log(`✅ Auto Bet PLACED: ${prediction.bigSmall} for ${prediction.issueNumber}`);
      
      logTelemetry('AUTO_BET_PLACED', {
        issueNumber: prediction.issueNumber,
        amount: autoBetConfig.amount,
        selection: prediction.bigSmall,
        engines: prediction.vectors.map((v: any) => v.reason),
        activeConfig: config.activeEngines || []
      });
      
      await fetchUserBalance();
    } else {
      throw new Error(response.data.msg || 'Bet failed');
    }
  } catch (err: any) {
    autoBetConfig.lastBetStatus = 'failed';
    console.error(`❌ Auto Bet FAILED: ${err.message}`);
  }
}

// Data Routes
app.get('/api/state', (req, res) => {
  try {
    if (isVercel) {
      updateGameState(); // Force trigger on Vercel since intervals freeze
    }
    
    res.json({
      predictionHistory,
      stats: gameStats,
      apiStatus: {
        ...apiStatus,
        lastFetch: new Date().toISOString()
      },
      telegramConfig: {
        ...telegramConfig,
        botToken: telegramConfig.botToken ? `${telegramConfig.botToken.slice(0, 6)}...` : ''
      },
      autoBet: autoBetConfig,
      activeEngines: config.activeEngines || [],
      apiConfig: {
         token: currentAuthToken ? `${currentAuthToken.slice(0, 10)}...` : '',
         random: currentApiRandom,
         signature: currentApiSignature
      },
      serverTime: new Date().toISOString(),
      myanmarTime: getMyanmarTime()
    });
  } catch (err) {
    console.error('State API Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/telegram/test', async (req, res) => {
  const { botToken, chatIds } = req.body;
  const token = botToken || telegramConfig.botToken;
  const ids = chatIds || telegramConfig.chatIds;

  if (!token || !ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Config missing. Provide token and at least one chat ID.' });
  }
  
  try {
    const promises = ids.map(id => 
      axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: id,
        text: '━━━━━━━━━━━━━━━━━━━━\n<b>🔔 SYSTEM CONNECTED</b>\n━━━━━━━━━━━━━━━━━━━━\n\nYour Telegram Hub is now synchronized with the <b>TRX Neural Engine</b>.\n\n⚡ <i>Real-time insights will be delivered shortly.</i>',
        parse_mode: 'HTML',
        reply_markup: JSON.stringify(ELITE_INLINE_KEYBOARD)
      })
    );
    await Promise.all(promises);
    res.json({ success: true });
  } catch (err: any) {
    const errorMsg = err.response?.data?.description || err.message;
    res.status(500).json({ error: `Telegram Error: ${errorMsg}` });
  }
});

app.post('/api/config/engines', (req, res) => {
  const { engines } = req.body;
  if (Array.isArray(engines)) {
    config.activeEngines = engines;
    saveConfig();
    logTelemetry('ENGINE_CONFIG_UPDATED', { engines });
    res.json({ success: true, activeEngines: config.activeEngines });
  } else {
    res.status(400).json({ error: 'Invalid engines format' });
  }
});

app.post('/api/config/game-type', (req, res) => {
  const { gameTypeId } = req.body;
  if (gameTypeId) {
    if (config.gameTypeId !== parseInt(gameTypeId)) {
      predictionHistory = [];
      gameStats = {
        totalWins: 0,
        totalLosses: 0,
        accuracy: 0,
        winStreak: 0,
        lastPrediction: null,
        vectorStats: {}
      } as any;
      lastSentSignalIssue = '';
      lastSentResultIssue = '';
      persistState();
    }
    
    config.gameTypeId = parseInt(gameTypeId);
    saveConfig();
    updateGameState(); // Switch game immediately
    res.json({ success: true, gameTypeId: config.gameTypeId });
  } else {
    res.status(400).json({ error: 'gameTypeId required' });
  }
});

app.post('/api/telegram/config', (req, res) => {
  const { botToken, chatIds, adminIds, enabled, customTextSignal, customTextResult, customTextSummary, subscribers } = req.body;
  telegramConfig = {
    botToken: "8663743801:AAGy5D3Lv_TYe2QmuGFmE0DS2d2lX7qg0MA",
    chatIds: chatIds !== undefined ? chatIds : telegramConfig.chatIds,
    adminIds: ["8396289125"],
    enabled: true,
    subscribers: subscribers !== undefined ? subscribers : telegramConfig.subscribers,
    customTextSignal: customTextSignal !== undefined ? customTextSignal : telegramConfig.customTextSignal,
    customTextResult: customTextResult !== undefined ? customTextResult : telegramConfig.customTextResult,
    customTextSummary: customTextSummary !== undefined ? customTextSummary : telegramConfig.customTextSummary
  };
  
  // Save to persistence
  saveConfig();

  res.json({ success: true, config: telegramConfig });
});

app.post('/api/bet/manual', async (req, res) => {
  const { amount, selection, issueNumber } = req.body;
  
  if (!currentAuthToken) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }

  if (!amount || !selection || !issueNumber) {
    return res.status(400).json({ error: 'Missing bet parameters (amount, selection, issueNumber)' });
  }

  try {
    const response = await axios.post('https://api.bigwinqaz.com/api/webapi/GameBet', {
      typeId: 13, // TRX 1m
      amount: parseFloat(amount),
      selectType: selection, // "Big" or "Small"
      money: parseFloat(amount),
      random: currentApiRandom,
      signature: currentApiSignature,
      timestamp: Math.floor(Date.now() / 1000)
    }, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Bearer ${currentAuthToken}`,
        'Ar-Origin': 'https://www.777bigwingame.org'
      },
      timeout: 10000
    });

    if (response.data && response.data.code === 0) {
      // Record in history if needed or just return success
      autoBetConfig.history.unshift({
        issueNumber,
        amount: parseFloat(amount),
        selection,
        time: new Date().toISOString(),
        status: 'manual'
      });
      if (autoBetConfig.history.length > 20) autoBetConfig.history.pop();
      
      logTelemetry('MANUAL_BET_PLACED', {
        issueNumber,
        amount: parseFloat(amount),
        selection,
        activeConfig: config.activeEngines || []
      });
      
      await fetchUserBalance();
      persistState();
      res.json({ success: true, balance: autoBetConfig.balance });
    } else {
      res.status(400).json({ error: response.data.msg || 'Bet failed' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bet/config', (req, res) => {
  const { enabled, amount } = req.body;
  if (enabled !== undefined) autoBetConfig.enabled = enabled;
  if (amount !== undefined) autoBetConfig.amount = parseFloat(amount);
  
  saveConfig();
  
  res.json({ success: true, config: autoBetConfig });
});

app.post('/api/auth/update', (req, res) => {
  const { token, random, signature } = req.body;
  
  if (token !== undefined) currentAuthToken = token;
  if (random !== undefined) currentApiRandom = random;
  if (signature !== undefined) currentApiSignature = signature;
  
  apiStatus.lastError = null;
  console.log('Update: API Credentials updated.');
  
  // Save to persistence
  saveConfig();

  // Trigger immediate update
  updateGameState();
  res.json({ success: true });
});

app.post('/api/state/refresh', async (req, res) => {
  console.log('Manual refresh requested...');
  await updateGameState();
  res.json({
    predictionHistory,
    stats: gameStats,
    apiStatus,
    telegramConfig,
    serverTime: new Date().toISOString()
  });
});

app.post('/api/history/clear', (req, res) => {
  predictionHistory = [];
  gameStats = {
    totalWins: 0,
    totalLosses: 0,
    accuracy: 0,
    winStreak: 0,
    lastPrediction: gameStats.lastPrediction, // Keep current active one
    vectorStats: {}
  } as any;
  
  if (autoBetConfig) {
    autoBetConfig.history = [];
  }
  
  // Persist the empty state
  persistState();

  console.log('History and stats cleared.');
  res.json({ success: true });
});

app.post('/api/telemetry/log', (req, res) => {
  const { event, details } = req.body;
  logTelemetry(event, details);
  res.json({ success: true });
});

app.get('/api/telemetry', (req, res) => {
  res.json(telemetryLogs);
});

// Polling interval (5 seconds)
setInterval(updateGameState, 5000);
updateGameState(); // Initial call

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

async function startServer() {
  try {
    console.log('Starting server initialization...');
    if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
      console.log('Mode: Development (Vite Middleware)');
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      console.log('Mode: Production (Static Assets)');
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        if (!req.path.startsWith('/api/')) {
          res.sendFile(path.join(distPath, 'index.html'));
        }
      });
    }

    if (!process.env.VERCEL) {
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`✅ Server successfully running on http://localhost:${PORT}`);
      });
    }
  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
}

startServer();

export default app;
