import { app } from 'electron'
import Database from 'better-sqlite3'
import path from 'path'

const DB_NAME = 'castle.db'
const DB_VERSION = 1

export type RawAppItem = {
  id: string
  data: string
}

const schema = `
CREATE TABLE IF NOT EXISTS app_items (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS library_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
  app_id TEXT NOT NULL,
  tag TEXT NOT NULL,
  PRIMARY KEY (app_id, tag)
);

CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  item_ids TEXT NOT NULL
);
` 

let database: Database.Database | null = null

function getDatabase(): Database.Database {
  if (database) return database

  const userDataPath = app.getPath('userData')
  const dbPath = path.join(userDataPath, DB_NAME)
  database = new Database(dbPath)
  database.exec(schema)
  database.pragma('journal_mode = WAL')
  database.pragma('synchronous = NORMAL')
  database.pragma('recursive_triggers = ON')
  return database
}

export function getLibraryMeta<T = Record<string, unknown>>(defaultValue: T): T {
  const db = getDatabase()
  const row = db.prepare('SELECT value FROM library_meta WHERE key = ?').get('libraryMeta') as { value?: string } | undefined
  if (!row || typeof row.value !== 'string') return defaultValue
  try {
    return JSON.parse(row.value) as T
  } catch {
    return defaultValue
  }
}

export function setLibraryMeta(meta: unknown) {
  const db = getDatabase()
  const value = JSON.stringify(meta)
  db.prepare('INSERT OR REPLACE INTO library_meta (key, value) VALUES (?, ?)').run('libraryMeta', value)
  return meta
}

export function getAllAppItems(): RawAppItem[] {
  const db = getDatabase()
  return db.prepare('SELECT id, data FROM app_items ORDER BY updated_at DESC').all() as RawAppItem[]
}

export function saveAppItem(id: string, data: unknown) {
  const db = getDatabase()
  db.prepare('INSERT OR REPLACE INTO app_items (id, data, updated_at) VALUES (?, ?, ?)').run(id, JSON.stringify(data), Date.now())
}

export function saveAppItems(items: { id: string; data: unknown }[]) {
  const db = getDatabase()
  const stmt = db.prepare('INSERT OR REPLACE INTO app_items (id, data, updated_at) VALUES (?, ?, ?)')
  const transaction = db.transaction((rows: { id: string; data: unknown }[]) => {
    for (const row of rows) {
      stmt.run(row.id, JSON.stringify(row.data), Date.now())
    }
  })
  transaction(items)
}
