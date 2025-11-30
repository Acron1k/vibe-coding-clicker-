# Vibecode-Clicker | Техническая Архитектура

## 📁 Структура Проекта

```
vibecode-clicker/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│       ├── sprites/          # AI-сгенерированные спрайты
│       │   ├── tools/        # Иконки инструментов
│       │   ├── buttons/      # Кнопки и UI элементы
│       │   └── effects/      # Частицы и эффекты
│       └── sounds/           # Звуковые эффекты (опционально)
├── src/
│   ├── main.tsx              # Точка входа
│   ├── App.tsx               # Корневой компонент
│   ├── index.css             # Глобальные стили + Tailwind
│   │
│   ├── components/           # React компоненты
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   └── ResponsiveContainer.tsx
│   │   ├── game/
│   │   │   ├── ClickButton.tsx       # Главная кнопка клика
│   │   │   ├── CurrencyDisplay.tsx   # Отображение валют
│   │   │   ├── ToolCard.tsx          # Карточка инструмента
│   │   │   ├── ToolList.tsx          # Список инструментов
│   │   │   ├── SubscriptionPanel.tsx # Панель подписок
│   │   │   ├── UpgradePanel.tsx      # Панель апгрейдов
│   │   │   ├── MilestoneTracker.tsx  # Трекер достижений
│   │   │   └── PrestigeModal.tsx     # Модалка престижа
│   │   ├── effects/
│   │   │   ├── ParticleSystem.tsx    # Система частиц
│   │   │   ├── FloatingNumber.tsx    # Всплывающие числа
│   │   │   └── BackgroundMatrix.tsx  # Фоновая анимация
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       ├── ProgressBar.tsx
│   │       ├── Tooltip.tsx
│   │       └── Modal.tsx
│   │
│   ├── store/                # Zustand состояние
│   │   ├── index.ts          # Экспорт всех stores
│   │   ├── gameStore.ts      # Основной игровой store
│   │   ├── toolStore.ts      # Состояние инструментов
│   │   ├── subscriptionStore.ts # Состояние подписок
│   │   ├── upgradeStore.ts   # Состояние апгрейдов
│   │   └── milestoneStore.ts # Состояние достижений
│   │
│   ├── engine/               # Игровой движок
│   │   ├── GameLoop.ts       # Основной игровой цикл
│   │   ├── CalculationEngine.ts # Расчеты производства
│   │   ├── PrestigeSystem.ts # Система престижа
│   │   └── OfflineProgress.ts # Расчет офлайн прогресса
│   │
│   ├── data/                 # Игровые данные
│   │   ├── tools.ts          # Конфигурация инструментов
│   │   ├── subscriptions.ts  # Уровни подписок
│   │   ├── upgrades.ts       # Апгрейды
│   │   └── milestones.ts     # Майлстоуны
│   │
│   ├── services/             # Сервисы
│   │   ├── StorageService.ts # LocalStorage/IndexedDB
│   │   ├── SaveManager.ts    # Автосохранение
│   │   └── EventEmitter.ts   # Система событий
│   │
│   ├── hooks/                # Кастомные хуки
│   │   ├── useGameLoop.ts
│   │   ├── useAutoSave.ts
│   │   ├── useOfflineProgress.ts
│   │   └── useResponsive.ts
│   │
│   ├── utils/                # Утилиты
│   │   ├── formatters.ts     # Форматирование чисел
│   │   ├── calculations.ts   # Математические функции
│   │   └── constants.ts      # Константы игры
│   │
│   └── types/                # TypeScript типы
│       ├── game.types.ts
│       ├── tool.types.ts
│       ├── subscription.types.ts
│       └── upgrade.types.ts
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## 🔷 TypeScript Интерфейсы

### Основные типы данных

```typescript
// types/game.types.ts

// Валюты
interface Currencies {
  vibeCodes: number;      // VB - основная валюта
  devPoints: number;      // DP - премиум валюта
  promptTokens: number;   // PT - супер-премиум валюта
}

// Статистика игрока
interface PlayerStats {
  totalClicks: number;
  totalVibeCodesEarned: number;
  totalPrestigeCount: number;
  projectTokens: number;  // Токены престижа (перманентный бонус)
  playTime: number;       // В секундах
  lastOnlineTime: number; // Unix timestamp
}

// Игровое состояние
interface GameState {
  currencies: Currencies;
  stats: PlayerStats;
  settings: GameSettings;
  lastSaveTime: number;
}

interface GameSettings {
  soundEnabled: boolean;
  particlesEnabled: boolean;
  autoSaveInterval: number; // В секундах
  theme: 'dark' | 'synthwave' | 'matrix';
}
```

### Типы инструментов

```typescript
// types/tool.types.ts

type ToolTier = 1 | 2 | 3; // Уровень инструмента

interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  detailedDescription: string;
  tier: ToolTier;
  baseCost: number;           // Базовая стоимость в VB
  baseProduction: number;     // Базовое производство VB/сек
  unlockCondition: UnlockCondition;
  iconPath: string;
}

interface UnlockCondition {
  type: 'clicks' | 'vibeCodes' | 'toolPurchased' | 'toolCount' | 'always';
  value?: number;
  toolId?: string;
}

// Состояние купленного инструмента
interface OwnedTool {
  toolId: string;
  count: number;              // Количество купленных
  subscriptionTier: SubscriptionTier;
  totalProduced: number;      // Всего произведено этим инструментом
}
```

### Типы подписок

```typescript
// types/subscription.types.ts

type SubscriptionTier = 'free' | 'pro' | 'proPlus' | 'max' | 'ultra';

interface SubscriptionDefinition {
  tier: SubscriptionTier;
  displayName: string;
  dpCostPerMonth: number;     // 0 для free
  vbMultiplier: number;       // 1x, 1.5x, 2.5x, 4x, 6x
  ptBonusPerSec: number;      // 0, 0, 5, 15, 30
  critChance: number;         // 0%, 0%, 0%, 1%, 3%
  features: string[];
}

// Активная подписка на инструмент
interface ActiveSubscription {
  toolId: string;
  tier: SubscriptionTier;
  activatedAt: number;        // Unix timestamp
  expiresAt: number;          // Unix timestamp (для будущего)
}
```

### Типы апгрейдов

```typescript
// types/upgrade.types.ts

type UpgradeCategory = 'click' | 'aiMultiplier' | 'idle';

interface UpgradeDefinition {
  id: string;
  name: string;
  description: string;
  category: UpgradeCategory;
  cost: number;               // В VB
  effect: UpgradeEffect;
  unlockCondition?: UnlockCondition;
}

interface UpgradeEffect {
  type: 'clickMultiplier' | 'productionMultiplier' | 'offlineMultiplier';
  value: number;              // Процент или множитель
  isAdditive: boolean;        // true = +X%, false = xX
}

interface OwnedUpgrade {
  upgradeId: string;
  purchasedAt: number;
}
```

### Типы майлстоунов

```typescript
// types/milestone.types.ts

interface MilestoneDefinition {
  id: string;
  name: string;
  description: string;
  condition: MilestoneCondition;
  rewards: MilestoneReward[];
}

interface MilestoneCondition {
  type: 'vibeCodes' | 'toolCount' | 'subscriptionCount' | 'clicks' | 'custom';
  value: number;
  customCheck?: () => boolean;
}

interface MilestoneReward {
  type: 'vibeCodes' | 'devPoints' | 'promptTokens' | 'unlock' | 'multiplier';
  value: number;
  unlockId?: string;
}

interface CompletedMilestone {
  milestoneId: string;
  completedAt: number;
}
```

---

## 🗄️ Zustand Store Архитектура

### Главный игровой Store

```typescript
// store/gameStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface GameStore {
  // Состояние
  currencies: Currencies;
  stats: PlayerStats;
  settings: GameSettings;
  isInitialized: boolean;
  
  // Действия с валютами
  addVibeCodes: (amount: number) => void;
  spendVibeCodes: (amount: number) => boolean;
  addDevPoints: (amount: number) => void;
  spendDevPoints: (amount: number) => boolean;
  addPromptTokens: (amount: number) => void;
  
  // Действия со статистикой
  incrementClicks: () => void;
  addPlayTime: (seconds: number) => void;
  setLastOnlineTime: (time: number) => void;
  
  // Настройки
  updateSettings: (settings: Partial<GameSettings>) => void;
  
  // Инициализация и сброс
  initialize: () => void;
  resetGame: () => void;
  prestigeReset: () => { projectTokens: number };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      currencies: { vibeCodes: 0, devPoints: 0, promptTokens: 0 },
      stats: {
        totalClicks: 0,
        totalVibeCodesEarned: 0,
        totalPrestigeCount: 0,
        projectTokens: 0,
        playTime: 0,
        lastOnlineTime: Date.now(),
      },
      settings: {
        soundEnabled: true,
        particlesEnabled: true,
        autoSaveInterval: 5,
        theme: 'dark',
      },
      isInitialized: false,

      addVibeCodes: (amount) => {
        set((state) => ({
          currencies: {
            ...state.currencies,
            vibeCodes: state.currencies.vibeCodes + amount,
          },
          stats: {
            ...state.stats,
            totalVibeCodesEarned: state.stats.totalVibeCodesEarned + amount,
          },
        }));
      },

      spendVibeCodes: (amount) => {
        const { currencies } = get();
        if (currencies.vibeCodes >= amount) {
          set((state) => ({
            currencies: {
              ...state.currencies,
              vibeCodes: state.currencies.vibeCodes - amount,
            },
          }));
          return true;
        }
        return false;
      },

      // ... остальные методы
    }),
    {
      name: 'vibecode-game-state',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

### Store инструментов

```typescript
// store/toolStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ToolStore {
  ownedTools: Map<string, OwnedTool>;
  unlockedToolIds: Set<string>;
  
  // Действия
  purchaseTool: (toolId: string) => boolean;
  upgradeSubscription: (toolId: string, tier: SubscriptionTier) => boolean;
  unlockTool: (toolId: string) => void;
  checkUnlocks: (state: GameState) => void;
  
  // Геттеры
  getToolCount: (toolId: string) => number;
  getTotalProduction: () => number;
  getToolProduction: (toolId: string) => number;
  getCurrentCost: (toolId: string) => number;
}

// Формула стоимости: baseCost * (1.15 ^ count)
const calculateToolCost = (baseCost: number, owned: number): number => {
  return Math.floor(baseCost * Math.pow(1.15, owned));
};

// Формула производства с учетом подписки
const calculateToolProduction = (
  baseProduction: number,
  count: number,
  subscriptionMultiplier: number,
  globalMultiplier: number
): number => {
  return baseProduction * count * subscriptionMultiplier * globalMultiplier;
};
```

---

## ⚙️ Игровой Движок

### Game Loop

```typescript
// engine/GameLoop.ts

export class GameLoop {
  private lastTick: number = 0;
  private tickInterval: number = 100; // 100ms = 10 тиков/сек
  private isRunning: boolean = false;
  private animationFrameId: number | null = null;

  private onTick: (deltaTime: number) => void;

  constructor(onTick: (deltaTime: number) => void) {
    this.onTick = onTick;
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTick = performance.now();
    this.loop();
  }

  stop(): void {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private loop = (): void => {
    if (!this.isRunning) return;

    const now = performance.now();
    const deltaTime = now - this.lastTick;

    if (deltaTime >= this.tickInterval) {
      this.onTick(deltaTime / 1000); // Передаем в секундах
      this.lastTick = now;
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  };
}
```

### Calculation Engine

```typescript
// engine/CalculationEngine.ts

import { SUBSCRIPTION_MULTIPLIERS } from '../data/subscriptions';

export class CalculationEngine {
  
  // Расчет дохода за клик
  static calculateClickIncome(
    baseClick: number = 1,
    clickUpgrades: OwnedUpgrade[],
    projectTokens: number
  ): number {
    let multiplier = 1;
    
    // Применяем апгрейды кликов
    clickUpgrades.forEach(upgrade => {
      const def = getUpgradeDefinition(upgrade.upgradeId);
      if (def.effect.isAdditive) {
        multiplier += def.effect.value / 100;
      } else {
        multiplier *= def.effect.value;
      }
    });
    
    // Применяем бонус престижа (+10% за каждый Project Token)
    multiplier *= (1 + projectTokens * 0.1);
    
    return Math.floor(baseClick * multiplier);
  }

  // Расчет пассивного дохода в секунду
  static calculatePassiveIncome(
    ownedTools: Map<string, OwnedTool>,
    productionUpgrades: OwnedUpgrade[],
    projectTokens: number
  ): { vibeCodes: number; promptTokens: number } {
    let totalVB = 0;
    let totalPT = 0;

    ownedTools.forEach((owned, toolId) => {
      const toolDef = getToolDefinition(toolId);
      const subMultiplier = SUBSCRIPTION_MULTIPLIERS[owned.subscriptionTier];
      const ptBonus = SUBSCRIPTION_PT_BONUS[owned.subscriptionTier];

      // VB производство
      totalVB += toolDef.baseProduction * owned.count * subMultiplier.vbMultiplier;
      
      // PT производство (только Pro+ и выше)
      totalPT += ptBonus * owned.count;
    });

    // Глобальные множители от апгрейдов
    let globalMultiplier = 1;
    productionUpgrades.forEach(upgrade => {
      const def = getUpgradeDefinition(upgrade.upgradeId);
      if (def.effect.type === 'productionMultiplier') {
        if (def.effect.isAdditive) {
          globalMultiplier += def.effect.value / 100;
        } else {
          globalMultiplier *= def.effect.value;
        }
      }
    });

    // Бонус престижа
    const prestigeMultiplier = 1 + projectTokens * 0.1;

    return {
      vibeCodes: totalVB * globalMultiplier * prestigeMultiplier,
      promptTokens: totalPT * globalMultiplier,
    };
  }

  // Расчет крита (для Ultra подписок)
  static rollCrit(ownedTools: Map<string, OwnedTool>): number {
    let maxCritChance = 0;
    
    ownedTools.forEach((owned) => {
      const critChance = SUBSCRIPTION_MULTIPLIERS[owned.subscriptionTier].critChance;
      maxCritChance = Math.max(maxCritChance, critChance);
    });

    if (Math.random() < maxCritChance) {
      return 2; // x2 множитель при крите
    }
    return 1;
  }

  // Расчет офлайн прогресса
  static calculateOfflineProgress(
    lastOnlineTime: number,
    currentTime: number,
    passiveIncome: { vibeCodes: number; promptTokens: number },
    offlineMultiplier: number = 0.5, // 50% по умолчанию
    maxOfflineHours: number = 2
  ): { vibeCodes: number; promptTokens: number; timePassed: number } {
    const timePassed = Math.min(
      (currentTime - lastOnlineTime) / 1000,
      maxOfflineHours * 3600
    );

    return {
      vibeCodes: Math.floor(passiveIncome.vibeCodes * timePassed * offlineMultiplier),
      promptTokens: Math.floor(passiveIncome.promptTokens * timePassed * offlineMultiplier),
      timePassed,
    };
  }

  // Расчет престижа
  static calculatePrestigeReward(totalVibeCodes: number): {
    projectTokens: number;
    canPrestige: boolean;
  } {
    const PRESTIGE_THRESHOLD = 100000;
    const TOKENS_PER_10K = 1;

    if (totalVibeCodes < PRESTIGE_THRESHOLD) {
      return { projectTokens: 0, canPrestige: false };
    }

    const tokens = Math.floor(totalVibeCodes / 10000) * TOKENS_PER_10K;
    return { projectTokens: tokens, canPrestige: true };
  }
}
```

---

## 💾 Система Сохранения

### Storage Service

```typescript
// services/StorageService.ts

const STORAGE_KEYS = {
  GAME_STATE: 'vibecode-game-state',
  TOOLS: 'vibecode-tools',
  UPGRADES: 'vibecode-upgrades',
  MILESTONES: 'vibecode-milestones',
  VERSION: 'vibecode-save-version',
};

const CURRENT_SAVE_VERSION = 1;

export class StorageService {
  
  // Сохранение всего состояния
  static saveAll(
    gameState: GameState,
    tools: OwnedTool[],
    upgrades: OwnedUpgrade[],
    milestones: CompletedMilestone[]
  ): void {
    try {
      localStorage.setItem(STORAGE_KEYS.VERSION, String(CURRENT_SAVE_VERSION));
      localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(gameState));
      localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(tools));
      localStorage.setItem(STORAGE_KEYS.UPGRADES, JSON.stringify(upgrades));
      localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(milestones));
    } catch (e) {
      console.error('Failed to save game state:', e);
      // Fallback к IndexedDB при переполнении localStorage
      this.saveToIndexedDB({ gameState, tools, upgrades, milestones });
    }
  }

  // Загрузка состояния
  static loadAll(): SaveData | null {
    try {
      const version = localStorage.getItem(STORAGE_KEYS.VERSION);
      
      if (!version) return null;
      
      // Миграция при необходимости
      if (Number(version) < CURRENT_SAVE_VERSION) {
        return this.migrateSaveData(Number(version));
      }

      return {
        gameState: JSON.parse(localStorage.getItem(STORAGE_KEYS.GAME_STATE) || 'null'),
        tools: JSON.parse(localStorage.getItem(STORAGE_KEYS.TOOLS) || '[]'),
        upgrades: JSON.parse(localStorage.getItem(STORAGE_KEYS.UPGRADES) || '[]'),
        milestones: JSON.parse(localStorage.getItem(STORAGE_KEYS.MILESTONES) || '[]'),
      };
    } catch (e) {
      console.error('Failed to load game state:', e);
      return null;
    }
  }

  // Экспорт сейва (для бэкапа)
  static exportSave(): string {
    const data = this.loadAll();
    return btoa(JSON.stringify(data));
  }

  // Импорт сейва
  static importSave(encoded: string): boolean {
    try {
      const data = JSON.parse(atob(encoded));
      this.saveAll(data.gameState, data.tools, data.upgrades, data.milestones);
      return true;
    } catch (e) {
      console.error('Failed to import save:', e);
      return false;
    }
  }

  // IndexedDB fallback
  private static async saveToIndexedDB(data: SaveData): Promise<void> {
    // Реализация IndexedDB для больших сохранений
  }

  private static migrateSaveData(fromVersion: number): SaveData | null {
    // Миграции между версиями сохранений
    return null;
  }
}

interface SaveData {
  gameState: GameState;
  tools: OwnedTool[];
  upgrades: OwnedUpgrade[];
  milestones: CompletedMilestone[];
}
```

---

## 🎨 Система Компонентов

### Иерархия компонентов

```
App
├── MainLayout
│   ├── Header
│   │   ├── CurrencyDisplay (VB)
│   │   ├── CurrencyDisplay (DP)
│   │   ├── CurrencyDisplay (PT)
│   │   └── SettingsButton
│   │
│   ├── GameArea (центральная часть)
│   │   ├── ClickButton
│   │   │   ├── ParticleSystem
│   │   │   └── FloatingNumber[]
│   │   ├── PassiveIncomeDisplay
│   │   └── PrestigeButton (когда доступен)
│   │
│   ├── ToolPanel (левая/нижняя панель)
│   │   └── ToolList
│   │       └── ToolCard[]
│   │           ├── ToolIcon
│   │           ├── ToolInfo
│   │           ├── SubscriptionBadge
│   │           └── BuyButton
│   │
│   ├── SidePanel (правая панель)
│   │   ├── TabContainer
│   │   │   ├── SubscriptionPanel
│   │   │   │   └── SubscriptionCard[]
│   │   │   ├── UpgradePanel
│   │   │   │   └── UpgradeCard[]
│   │   │   └── MilestoneTracker
│   │   │       └── MilestoneCard[]
│   │
│   └── BackgroundMatrix
│
├── Modals
│   ├── PrestigeModal
│   ├── SettingsModal
│   ├── MilestonePopup
│   └── OfflineProgressModal
│
└── ToastContainer (уведомления)
```

### Пример ключевого компонента

```tsx
// components/game/ClickButton.tsx
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { useToolStore } from '../../store/toolStore';
import { CalculationEngine } from '../../engine/CalculationEngine';
import { ParticleSystem } from '../effects/ParticleSystem';
import { FloatingNumber } from '../effects/FloatingNumber';

export const ClickButton: React.FC = () => {
  const { addVibeCodes, incrementClicks, stats } = useGameStore();
  const { ownedTools } = useToolStore();
  const [particles, setParticles] = useState<ParticleData[]>([]);
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumberData[]>([]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const clickValue = CalculationEngine.calculateClickIncome(
      1,
      upgradeStore.getClickUpgrades(),
      stats.projectTokens
    );
    
    // Проверка крита
    const critMultiplier = CalculationEngine.rollCrit(ownedTools);
    const finalValue = clickValue * critMultiplier;
    
    addVibeCodes(finalValue);
    incrementClicks();
    
    // Спавн визуальных эффектов
    spawnParticles(e.clientX, e.clientY);
    spawnFloatingNumber(e.clientX, e.clientY, finalValue, critMultiplier > 1);
  }, [addVibeCodes, incrementClicks, ownedTools, stats.projectTokens]);

  return (
    <motion.button
      className="relative w-48 h-48 md:w-64 md:h-64 rounded-full 
                 bg-gradient-to-br from-cyan-400 to-purple-600
                 shadow-[0_0_60px_rgba(0,217,255,0.5)]
                 hover:shadow-[0_0_80px_rgba(0,217,255,0.7)]
                 active:scale-95 transition-all"
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      aria-label="Click to generate Vibe Codes"
    >
      <span className="text-white text-2xl font-bold">VIBE</span>
      <ParticleSystem particles={particles} />
      {floatingNumbers.map(fn => (
        <FloatingNumber key={fn.id} {...fn} />
      ))}
    </motion.button>
  );
};
```

---

## 📊 Данные игры

### Конфигурация инструментов

```typescript
// data/tools.ts

export const TOOLS: ToolDefinition[] = [
  // Уровень 1: Базовые (0-100 VB)
  {
    id: 'claude-baseline',
    name: 'Claude',
    description: 'Базовое промптерование - простой Claude без оптимизаций',
    detailedDescription: 'AI-помощник от Anthropic для веб-разработки. Поддерживает длинные контексты и extended thinking.',
    tier: 1,
    baseCost: 10,
    baseProduction: 0.1,
    unlockCondition: { type: 'always' },
    iconPath: '/assets/sprites/tools/claude.png',
  },
  {
    id: 'chatgpt-4-mini',
    name: 'ChatGPT 4 Mini',
    description: 'Быстрый помощник для фронтенда',
    detailedDescription: 'OpenAI GPT-4 Mini - оптимизированная версия для быстрых задач разработки.',
    tier: 1,
    baseCost: 50,
    baseProduction: 0.5,
    unlockCondition: { type: 'clicks', value: 30 },
    iconPath: '/assets/sprites/tools/chatgpt.png',
  },
  {
    id: 'gemini-cli',
    name: 'Gemini CLI',
    description: 'Google\'s мощный многомодальный генератор',
    detailedDescription: 'Многомодальный AI от Google, интегрированный с Google Workspace.',
    tier: 1,
    baseCost: 100,
    baseProduction: 1,
    unlockCondition: { type: 'vibeCodes', value: 200 },
    iconPath: '/assets/sprites/tools/gemini.png',
  },
  
  // Уровень 2: IDE (100-1000 VB)
  {
    id: 'cursor-ide',
    name: 'Cursor IDE',
    description: 'VS Code на стероидах с AI-автодополнением',
    detailedDescription: 'IDE с встроенным AI на базе Claude, популярен среди разработчиков.',
    tier: 2,
    baseCost: 200,
    baseProduction: 2,
    unlockCondition: { type: 'toolPurchased', toolId: 'gemini-cli' },
    iconPath: '/assets/sprites/tools/cursor.png',
  },
  // ... остальные инструменты
];

export const getToolDefinition = (id: string): ToolDefinition | undefined => {
  return TOOLS.find(t => t.id === id);
};
```

### Конфигурация подписок

```typescript
// data/subscriptions.ts

export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, SubscriptionDefinition> = {
  free: {
    tier: 'free',
    displayName: 'Free',
    dpCostPerMonth: 0,
    vbMultiplier: 1,
    ptBonusPerSec: 0,
    critChance: 0,
    features: ['Базовые промпты'],
  },
  pro: {
    tier: 'pro',
    displayName: 'Pro',
    dpCostPerMonth: 10,
    vbMultiplier: 1.5,
    ptBonusPerSec: 0,
    critChance: 0,
    features: ['Длинные контексты', 'Приоритет'],
  },
  proPlus: {
    tier: 'proPlus',
    displayName: 'Pro+',
    dpCostPerMonth: 25,
    vbMultiplier: 2.5,
    ptBonusPerSec: 5,
    critChance: 0,
    features: ['Extended thinking', 'API улучшения', '+5 PT/сек'],
  },
  max: {
    tier: 'max',
    displayName: 'Max',
    dpCostPerMonth: 50,
    vbMultiplier: 4,
    ptBonusPerSec: 15,
    critChance: 0.01,
    features: ['Все плюсы Pro+', 'Приоритет обновлений', '+15 PT/сек', '1% крит'],
  },
  ultra: {
    tier: 'ultra',
    displayName: 'Ultra',
    dpCostPerMonth: 100,
    vbMultiplier: 6,
    ptBonusPerSec: 30,
    critChance: 0.03,
    features: ['Ранний доступ', '+30 PT/сек', '3% крит x2'],
  },
};
```

---

## 📱 Адаптивная Верстка

### Tailwind конфигурация

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00D9FF',      // Неоновый голубой
        secondary: '#C904ED',    // Неоновый пурпур
        accent: '#00FF41',       // Неоновый зеленый
        dark: {
          bg: '#0A0E27',
          surface: '#12183B',
          border: '#1E2654',
        },
        text: {
          primary: '#E8F0FF',
          secondary: '#8B9DC3',
        },
      },
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'matrix-fall': 'matrix-fall 10s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 217, 255, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 217, 255, 0.8)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
```

### Layout компонент

```tsx
// components/layout/MainLayout.tsx
import { useResponsive } from '../../hooks/useResponsive';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary">
      <Header />
      
      {isDesktop && (
        <div className="grid grid-cols-[300px_1fr_350px] gap-4 p-4 h-[calc(100vh-64px)]">
          <aside className="overflow-y-auto">
            <ToolPanel />
          </aside>
          <main className="flex items-center justify-center">
            <GameArea />
          </main>
          <aside className="overflow-y-auto">
            <SidePanel />
          </aside>
        </div>
      )}

      {isTablet && (
        <div className="flex flex-col h-[calc(100vh-64px)]">
          <main className="flex-shrink-0 h-[40vh] flex items-center justify-center p-4">
            <GameArea />
          </main>
          <div className="flex-1 overflow-y-auto p-4">
            <TabContainer tabs={['Инструменты', 'Подписки', 'Апгрейды']}>
              <ToolPanel />
              <SubscriptionPanel />
              <UpgradePanel />
            </TabContainer>
          </div>
        </div>
      )}

      {isMobile && (
        <div className="flex flex-col h-[calc(100vh-56px)]">
          <main className="flex-shrink-0 h-[35vh] flex items-center justify-center p-2">
            <GameArea compact />
          </main>
          <nav className="flex-shrink-0 border-b border-dark-border">
            <TabNavigation />
          </nav>
          <div className="flex-1 overflow-y-auto">
            <MobileTabContent />
          </div>
        </div>
      )}
      
      <BackgroundMatrix />
    </div>
  );
};
```

---

## 🔄 Производительность

### Оптимизации

```typescript
// hooks/useGameLoop.ts
import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { useToolStore } from '../store/toolStore';
import { CalculationEngine } from '../engine/CalculationEngine';

export const useGameLoop = () => {
  const lastTickRef = useRef<number>(Date.now());
  const accumulatorRef = useRef<number>(0);
  const TICK_RATE = 100; // ms

  const { addVibeCodes, addPromptTokens, addPlayTime } = useGameStore();
  const { ownedTools } = useToolStore();
  const upgradeStore = useUpgradeStore();
  const stats = useGameStore((s) => s.stats);

  // Мемоизированный расчет дохода
  const passiveIncome = useMemo(() => {
    return CalculationEngine.calculatePassiveIncome(
      ownedTools,
      upgradeStore.getProductionUpgrades(),
      stats.projectTokens
    );
  }, [ownedTools, stats.projectTokens]);

  const tick = useCallback(() => {
    const now = Date.now();
    const delta = now - lastTickRef.current;
    lastTickRef.current = now;
    
    accumulatorRef.current += delta;
    
    while (accumulatorRef.current >= TICK_RATE) {
      const secondsFraction = TICK_RATE / 1000;
      
      // Добавляем доход
      const vbEarned = passiveIncome.vibeCodes * secondsFraction;
      const ptEarned = passiveIncome.promptTokens * secondsFraction;
      
      if (vbEarned > 0) addVibeCodes(vbEarned);
      if (ptEarned > 0) addPromptTokens(ptEarned);
      
      addPlayTime(secondsFraction);
      accumulatorRef.current -= TICK_RATE;
    }
  }, [passiveIncome, addVibeCodes, addPromptTokens, addPlayTime]);

  useEffect(() => {
    const intervalId = setInterval(tick, TICK_RATE);
    return () => clearInterval(intervalId);
  }, [tick]);
};
```

### React оптимизации

```tsx
// Мемоизация тяжелых компонентов
export const ToolCard = React.memo<ToolCardProps>(({ tool, owned }) => {
  // ...
}, (prev, next) => {
  return prev.tool.id === next.tool.id && 
         prev.owned?.count === next.owned?.count &&
         prev.owned?.subscriptionTier === next.owned?.subscriptionTier;
});

// Виртуализация списков при большом количестве элементов
import { FixedSizeList } from 'react-window';

export const ToolList: React.FC = () => {
  const tools = useToolStore((s) => s.getUnlockedTools());
  
  if (tools.length > 20) {
    return (
      <FixedSizeList
        height={600}
        width="100%"
        itemCount={tools.length}
        itemSize={120}
      >
        {({ index, style }) => (
          <div style={style}>
            <ToolCard tool={tools[index]} />
          </div>
        )}
      </FixedSizeList>
    );
  }
  
  return (
    <div className="space-y-2">
      {tools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
    </div>
  );
};
```

---

## ♿ Доступность (a11y)

```tsx
// Пример доступного компонента
export const ToolCard: React.FC<ToolCardProps> = ({ tool, owned }) => {
  const canAfford = useGameStore((s) => s.currencies.vibeCodes >= getCurrentCost(tool.id));
  
  return (
    <article
      className="..."
      role="article"
      aria-labelledby={`tool-${tool.id}-name`}
      aria-describedby={`tool-${tool.id}-desc`}
    >
      <h3 id={`tool-${tool.id}-name`}>{tool.name}</h3>
      <p id={`tool-${tool.id}-desc`}>{tool.description}</p>
      
      <div aria-live="polite" aria-atomic="true">
        Производит: {getToolProduction(tool.id).toFixed(1)} VB/сек
      </div>
      
      <button
        onClick={() => purchaseTool(tool.id)}
        disabled={!canAfford}
        aria-label={`Купить ${tool.name} за ${getCurrentCost(tool.id)} Vibe Codes`}
        aria-disabled={!canAfford}
      >
        {canAfford ? `Купить (${formatNumber(getCurrentCost(tool.id))} VB)` : 'Недостаточно VB'}
      </button>
    </article>
  );
};
```

---

## 🔢 Форматирование чисел

```typescript
// utils/formatters.ts

export const formatNumber = (num: number): string => {
  if (num < 1000) return num.toFixed(num % 1 === 0 ? 0 : 1);
  if (num < 1_000_000) return (num / 1000).toFixed(1) + 'K';
  if (num < 1_000_000_000) return (num / 1_000_000).toFixed(2) + 'M';
  if (num < 1_000_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
  return (num / 1_000_000_000_000).toFixed(2) + 'T';
};

export const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${Math.floor(seconds)}с`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}м ${Math.floor(seconds % 60)}с`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}ч ${minutes}м`;
};

export const formatPerSecond = (rate: number): string => {
  return `${formatNumber(rate)}/сек`;
};
```
