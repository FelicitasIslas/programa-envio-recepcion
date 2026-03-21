import { useEffect, useState } from 'react';
import API from './services/api';
import RegistroForm from './components/RegistroForm';
import RegistrosList from './components/RegistrosList';
import './index.css';

function App() {
  const [registros, setRegistros] = useState([]);

  const cargarRegistros = async () => {
    try {
      const res = await API.get('/registros');
      setRegistros(res.data);
    } catch (error) {
      console.error('Error al cargar registros:', error);
    }
  };

  useEffect(() => {
    let activo = true;

    const obtenerRegistros = async () => {
      try {
        const res = await API.get('/registros');
        if (activo) {
          setRegistros(res.data);
        }
      } catch (error) {
        console.error('Error al cargar registros:', error);
      }
    };

    obtenerRegistros();

    return () => {
      activo = false;
    };
  }, []);

  return (
    <div className="app-bg">
      <div className="app-container">
        <header className="app-header">
          <h1>Envío y recepción de datos</h1>
          <p>
            Registro y consulta de información obtenida desde módulos del dispositivo
          </p>
        </header>

        <section className="card">
          <RegistroForm onRegistroGuardado={cargarRegistros} />
        </section>

        <section className="card">
          <RegistrosList registros={registros} />
        </section>
      </div>
    </div>
  );
}

export default App;