import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

router.get('/', async (req, res) => {
  const prag = Number(req.query.prag)
  const tara = req.query.tara ?? ''

  if (!Number.isInteger(prag) || prag < 1) {
    return res.status(400).json({ eroare: 'Pragul trebuie să fie un întreg pozitiv.' })
  }

  let sql = `SELECT COUNT(*) AS destinatii, COALESCE(SUM(zile), 0) AS zile
             FROM destinatii
             WHERE zile >= ?`
  const valori = [prag]

  if (tara !== '') {
    sql += ' AND tara = ?'
    valori.push(tara)
  }

  const [randuri] = await pool.query(sql, valori)
  const destinatii = Number(randuri[0].destinatii)
  const zile = Number(randuri[0].zile)

  res.json({
    destinatii,
    zile,
    medie: destinatii === 0 ? 0 : Number((zile / destinatii).toFixed(1)),
  })
})

export default router