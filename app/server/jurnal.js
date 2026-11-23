import { pool } from './db.js'

export function jurnal(req, res, next) {
  const inceput = process.hrtime.bigint()
  const metoda = req.method
  const cale = req.originalUrl // reținut acum: req.path se schimbă în routere

  res.on('finish', async () => {
    const durata = Math.round(Number(process.hrtime.bigint() - inceput) / 1e6)
    try {
      await pool.query(
        'INSERT INTO jurnal (metoda, cale, status, durata_ms) VALUES (?, ?, ?, ?)',
        [metoda, cale, res.statusCode, durata],
      )
    } catch (e) {
      console.error('Jurnal:', e.message)
    }
  })
  next()
}