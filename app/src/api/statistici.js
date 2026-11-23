const API_URL = 'http://localhost:3000/api'

export async function getStatistici(prag, tara) {
  const adresa = new URL(`${API_URL}/statistici`)
  adresa.searchParams.set('prag', prag)
  if (tara !== '') {
    adresa.searchParams.set('tara', tara)
  }

  const response = await fetch(adresa)
  if (!response.ok) {
    throw new Error(`Serverul a răspuns cu ${response.status}`)
  }
  return response.json()
}