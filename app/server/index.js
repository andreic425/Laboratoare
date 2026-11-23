import express from 'express'
import cors from 'cors'
import { pool } from './db.js'
import { jurnal } from './jurnal.js'
import statistici from './rute/statistici.js'
import jurnalRute from './rute/jurnal.js'

const app = express()

app.use((req, res, next) => {
  console.log(req.method, req.originalUrl)
  next()
})
app.use(cors())
app.use(express.json())
app.use(jurnal) // INTENȚIONAT după cors(): se mută la ex. 4d

const conv = (d) => ({ ...d, id: String(d.id), vizitat: Boolean(d.vizitat) })

app.get('/api/destinatii', async (req, res) => {
  const [randuri] = await pool.query(
    'SELECT id, oras, tara, zile, vizitat FROM destinatii ORDER BY id',
  )
  res.json(randuri.map(conv))
})

app.get('/api/destinatii/caut', async (req, res) => {
  const [randuri] = await pool.query(
    'SELECT id, oras, tara, zile, vizitat FROM destinatii WHERE oras = ?',
    [req.query.oras],
  )
  res.json(randuri.map(conv))
})

app.post('/api/destinatii', async (req, res) => {
  const { oras, tara, zile } = req.body
  const valid =
    typeof oras === 'string' && oras.trim() !== '' &&
    typeof tara === 'string' && tara.trim() !== '' &&
    Number.isInteger(zile) && zile >= 1 && zile <= 30
  if (!valid) {
    return res.status(400).json({ eroare: 'Date invalide.' })
  }

  const [rezultat] = await pool.query(
    'INSERT INTO destinatii (oras, tara, zile, vizitat) VALUES (?, ?, ?, ?)',
    [oras.trim(), tara.trim(), zile, false],
  )
  res.status(201).json({
    id: String(rezultat.insertId),
    oras: oras.trim(),
    tara: tara.trim(),
    zile,
    vizitat: false,
  })
})

app.patch('/api/destinatii/:id', async (req, res) => {
  const { vizitat } = req.body
  if (typeof vizitat !== 'boolean') {
    return res.status(400).json({ eroare: 'Câmpul vizitat trebuie să fie true sau false.' })
  }

  const [rezultat] = await pool.query('UPDATE destinatii SET vizitat = ? WHERE id = ?', [
    vizitat,
    req.params.id,
  ])
  if (rezultat.affectedRows === 0) {
    return res.status(404).json({ eroare: 'Destinația nu există.' })
  }

  const [randuri] = await pool.query(
    'SELECT id, oras, tara, zile, vizitat FROM destinatii WHERE id = ?',
    [req.params.id],
  )
  res.json(conv(randuri[0]))
})

app.delete('/api/destinatii/:id', async (req, res) => {
  const [rezultat] = await pool.query('DELETE FROM destinatii WHERE id = ?', [req.params.id])
  if (rezultat.affectedRows === 0) {
    return res.status(404).json({ eroare: 'Destinația nu există.' })
  }
  res.json({})
})

app.use('/api/statistici', statistici)
app.use('/api/jurnal', jurnalRute)

// rută temporară de ecou (punctul 1 din fișă)
app.all('/api/ecou/:id', (req, res) => {
  res.json({ params: req.params, query: req.query, body: req.body })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`API pornit pe http://localhost:${port}`)
})