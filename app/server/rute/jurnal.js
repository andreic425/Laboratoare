import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

router.get('/raport', async (req, res) => {
  const metoda = req.query.metoda

  let sql = `SELECT metoda, cale, COUNT(*) AS cereri, ROUND(AVG(durata_ms), 1) AS medie_ms
             FROM jurnal`
  if (metoda) {
    sql += ` WHERE metoda = '${metoda}'` // LIPIT, se corectează la punctul 4 al fișei
  }
  sql += ' GROUP BY metoda, cale ORDER BY cereri DESC LIMIT 10'

  const [randuri] = await pool.query(sql)
  res.json(
    randuri.map((r) => ({ ...r, cereri: Number(r.cereri), medie_ms: Number(r.medie_ms) })),
  )
})

export default router