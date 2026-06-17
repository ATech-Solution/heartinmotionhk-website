import * as migration_20260427_111435 from './20260427_111435';
import * as migration_20260427_112539 from './20260427_112539';
import * as migration_20260427_145715 from './20260427_145715';
import * as migration_20260427_145842 from './20260427_145842';
import * as migration_20260427_150000 from './20260427_150000';
import * as migration_20260428_000000 from './20260428_000000';
import * as migration_20260503_000000 from './20260503_000000';
import * as migration_20260514_000000 from './20260514_000000';
import * as migration_20260514_074519 from './20260514_074519';
import * as migration_20260514_074808 from './20260514_074808';
import * as migration_20260514_113135 from './20260514_113135';
import * as migration_20260604_052917 from './20260604_052917';
import * as migration_20260616_074245 from './20260616_074245';
import * as migration_20260617_000000_language_settings from './20260617_000000_language_settings';

export const migrations = [
  {
    up: migration_20260427_111435.up,
    down: migration_20260427_111435.down,
    name: '20260427_111435',
  },
  {
    up: migration_20260427_112539.up,
    down: migration_20260427_112539.down,
    name: '20260427_112539',
  },
  {
    up: migration_20260427_145715.up,
    down: migration_20260427_145715.down,
    name: '20260427_145715',
  },
  {
    up: migration_20260427_145842.up,
    down: migration_20260427_145842.down,
    name: '20260427_145842',
  },
  {
    up: migration_20260427_150000.up,
    down: migration_20260427_150000.down,
    name: '20260427_150000',
  },
  {
    up: migration_20260428_000000.up,
    down: migration_20260428_000000.down,
    name: '20260428_000000',
  },
  {
    up: migration_20260503_000000.up,
    down: migration_20260503_000000.down,
    name: '20260503_000000',
  },
  {
    up: migration_20260514_000000.up,
    down: migration_20260514_000000.down,
    name: '20260514_000000',
  },
  {
    up: migration_20260514_074519.up,
    down: migration_20260514_074519.down,
    name: '20260514_074519',
  },
  {
    up: migration_20260514_074808.up,
    down: migration_20260514_074808.down,
    name: '20260514_074808',
  },
  {
    up: migration_20260514_113135.up,
    down: migration_20260514_113135.down,
    name: '20260514_113135',
  },
  {
    up: migration_20260604_052917.up,
    down: migration_20260604_052917.down,
    name: '20260604_052917',
  },
  {
    up: migration_20260616_074245.up,
    down: migration_20260616_074245.down,
    name: '20260616_074245',
  },
  {
    up: migration_20260617_000000_language_settings.up,
    down: migration_20260617_000000_language_settings.down,
    name: '20260617_000000_language_settings',
  },
];
