/**
 * lib/db.ts – Neon serverless Postgres + auto-migration
 */
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)
let migrated = false

export async function getDB() {
  if (!migrated) {
    await sql`CREATE TABLE IF NOT EXISTS journey_blogs (id TEXT PRIMARY KEY, data JSONB NOT NULL, created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000)`
    await sql`CREATE TABLE IF NOT EXISTS journey_certificates (id TEXT PRIMARY KEY, data JSONB NOT NULL, created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000)`
    await sql`CREATE TABLE IF NOT EXISTS chat_analytics (id TEXT PRIMARY KEY, question TEXT NOT NULL, intent TEXT NOT NULL DEFAULT 'general', session_id TEXT NOT NULL DEFAULT '', created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000)`
    await sql`CREATE TABLE IF NOT EXISTS chatbot_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL DEFAULT '')`
    migrated = true
  }
  return sql
}

export async function dbGetBlogs() {
  const db = await getDB()
  const rows = await db`SELECT data FROM journey_blogs ORDER BY created_at DESC`
  return rows.map((r: any) => r.data)
}
export async function dbSaveBlog(post: any) {
  const db = await getDB()
  await db`INSERT INTO journey_blogs (id, data, created_at) VALUES (${post.id}, ${JSON.stringify(post)}, ${post.createdAt}) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`
}
export async function dbDeleteBlog(id: string) {
  const db = await getDB()
  await db`DELETE FROM journey_blogs WHERE id = ${id}`
}

export async function dbGetCertificates() {
  const db = await getDB()
  const rows = await db`SELECT data FROM journey_certificates ORDER BY created_at DESC`
  return rows.map((r: any) => r.data)
}
export async function dbSaveCertificate(cert: any) {
  const db = await getDB()
  await db`INSERT INTO journey_certificates (id, data, created_at) VALUES (${cert.id}, ${JSON.stringify(cert)}, ${cert.createdAt}) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`
}
export async function dbDeleteCertificate(id: string) {
  const db = await getDB()
  await db`DELETE FROM journey_certificates WHERE id = ${id}`
}

export async function dbSaveAnalytic(entry: { id: string; question: string; intent: string; session_id: string; created_at: number }) {
  const db = await getDB()
  await db`INSERT INTO chat_analytics (id, question, intent, session_id, created_at) VALUES (${entry.id}, ${entry.question}, ${entry.intent}, ${entry.session_id}, ${entry.created_at}) ON CONFLICT (id) DO NOTHING`
}
export async function dbGetTopQuestions(limit = 50) {
  const db = await getDB()
  return db`SELECT question, intent, COUNT(*) as count, MAX(created_at) as last_asked FROM chat_analytics GROUP BY question, intent ORDER BY count DESC, last_asked DESC LIMIT ${limit}`
}
export async function dbGetAnalyticsSummary() {
  const db = await getDB()
  const total   = await db`SELECT COUNT(*) as count FROM chat_analytics`
  const today   = await db`SELECT COUNT(*) as count FROM chat_analytics WHERE created_at > EXTRACT(EPOCH FROM NOW() - INTERVAL '1 day') * 1000`
  const intents = await db`SELECT intent, COUNT(*) as count FROM chat_analytics GROUP BY intent ORDER BY count DESC`
  const recent  = await db`SELECT question, intent, created_at FROM chat_analytics ORDER BY created_at DESC LIMIT 20`
  return { total: parseInt(total[0]?.count||'0'), today: parseInt(today[0]?.count||'0'), intents, recent }
}

export async function dbGetSettings(): Promise<Record<string,string>> {
  const db = await getDB()
  const rows = await db`SELECT key, value FROM chatbot_settings`
  return Object.fromEntries(rows.map((r: any) => [r.key, r.value]))
}
export async function dbSetSettings(settings: Record<string,string>) {
  const db = await getDB()
  for (const [key, value] of Object.entries(settings)) {
    await db`INSERT INTO chatbot_settings (key, value) VALUES (${key}, ${value}) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`
  }
}
