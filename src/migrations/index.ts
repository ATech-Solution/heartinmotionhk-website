import * as migration_20260503_000000 from './20260503_000000';
import * as migration_20260427_111435 from './20260427_111435';
import * as migration_20260427_112539 from './20260427_112539';
import * as migration_20260427_145715 from './20260427_145715';
import * as migration_20260427_145842 from './20260427_145842';
import * as migration_20260427_150000 from './20260427_150000';
import * as migration_20260428_000000 from './20260428_000000';

export const migrations = [
  {
    up: migration_20260427_111435.up,
    down: migration_20260427_111435.down,
    name: '20260427_111435',
  },
  {
    up: migration_20260503_000000.up,
    down: migration_20260503_000000.down,
    name: '20260503_000000',
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
];
