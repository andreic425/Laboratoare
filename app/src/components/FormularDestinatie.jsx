import { useState } from 'react';

export function valideaza(valori) {
  const erori = {};
  if (valori.oras.trim().length < 2) {
    erori.oras = 'Orașul are cel puțin două caractere.';
  }
  if (!valori.tara.trim()) {
    erori.tara = 'Țara este obligatorie.';
  }
  const zileNumar = Number(valori.zile);
  if (!valori.zile || Number.isNaN(zileNumar) || zileNumar < 1 || zileNumar > 30) {
    erori.zile = 'Numărul de zile este între 1 și 30.';
  }
  return erori;
}

export default function FormularDestinatie({ onAdd, seTrimite }) {
  const [valori, setValori] = useState({ oras: '', tara: '', zile: '' });
  const [erori, setErori] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setValori((curent) => ({ ...curent, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const rezValidare = valideaza(valori);
    if (Object.keys(rezValidare).length > 0) {
      setErori(rezValidare);
      return;
    }
    setErori({});
    onAdd({
      oras: valori.oras.trim(),
      tara: valori.tara.trim(),
      zile: Number(valori.zile),
      vizitat: false,
    });
    setValori({ oras: '', tara: '', zile: '' });
  }

  return (
    <form className="formular" onSubmit={handleSubmit} noValidate>
      <div className="camp">
        <input
          name="oras"
          placeholder="Oraș"
          value={valori.oras}
          onChange={handleChange}
          className={erori.oras ? 'invalid' : ''}
        />
        {erori.oras && <p className="eroare-camp">{erori.oras}</p>}
      </div>

      <div className="camp">
        <input
          name="tara"
          placeholder="Țară"
          value={valori.tara}
          onChange={handleChange}
          className={erori.tara ? 'invalid' : ''}
        />
        {erori.tara && <p className="eroare-camp">{erori.tara}</p>}
      </div>

      <div className="camp">
        <input
          type="number"
          name="zile"
          placeholder="Zile"
          value={valori.zile}
          onChange={handleChange}
          className={erori.zile ? 'invalid' : ''}
        />
        {erori.zile && <p className="eroare-camp">{erori.zile}</p>}
      </div>

      <button type="submit" disabled={seTrimite}>
        {seTrimite ? 'Se trimite...' : 'Adaugă'}
      </button>
    </form>
  );
}