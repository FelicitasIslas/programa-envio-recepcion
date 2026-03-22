import { useEffect, useState } from 'react';
import api from './services/api';
import './index.css';

function App() {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
  });

  const [ubicacion, setUbicacion] = useState({
    latitud: null,
    longitud: null,
  });

  const [imagenBase64, setImagenBase64] = useState('');
  const [estadoRed, setEstadoRed] = useState(navigator.onLine ? 'en línea' : 'sin conexión');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    obtenerRegistros();

    const actualizarRed = () => {
      setEstadoRed(navigator.onLine ? 'en línea' : 'sin conexión');
    };

    window.addEventListener('online', actualizarRed);
    window.addEventListener('offline', actualizarRed);

    return () => {
      window.removeEventListener('online', actualizarRed);
      window.removeEventListener('offline', actualizarRed);
    };
  }, []);

  const obtenerRegistros = async () => {
    try {
      const res = await api.get('/api/registros');
      setRegistros(res.data.data || []);
    } catch (err) {
      console.error('Error obteniendo registros:', err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const obtenerUbicacion = () => {
    setError('');
    setMensaje('');

    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUbicacion({
          latitud: position.coords.latitude,
          longitud: position.coords.longitude,
        });
        setMensaje('Ubicación obtenida correctamente');
      },
      (err) => {
        setError(`No se pudo obtener la ubicación: ${err.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  const manejarImagen = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    if (!archivo.type.startsWith('image/')) {
      setError('Solo se permiten imágenes');
      return;
    }

    if (archivo.size > 2 * 1024 * 1024) {
      setError('La imagen no debe superar 2 MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagenBase64(reader.result);
    };
    reader.readAsDataURL(archivo);
  };

  const enviarDatos = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    if (form.nombre.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres');
      return;
    }

    if (form.descripcion.trim().length < 5) {
      setError('La descripción debe tener al menos 5 caracteres');
      return;
    }

    if (ubicacion.latitud === null || ubicacion.longitud === null) {
      setError('Debes obtener la ubicación antes de guardar');
      return;
    }

    try {
      setCargando(true);

      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        latitud: ubicacion.latitud,
        longitud: ubicacion.longitud,
        imagenBase64,
        estadoRed,
        origen: 'web-movil',
      };

      console.log('Enviando datos:', payload);
      console.log('URL API:', import.meta.env.VITE_API_URL);

      await api.post('/api/registros', payload);

      setMensaje('Datos enviados y guardados correctamente');
      setForm({ nombre: '', descripcion: '' });
      setUbicacion({ latitud: null, longitud: null });
      setImagenBase64('');
      await obtenerRegistros();
    } catch (err) {
      console.error('Error completo:', err);
      console.error('Respuesta del servidor:', err?.response?.data);
      console.error('Status:', err?.response?.status);
      console.error('Tamaño imagen:', imagenBase64?.length);
      console.error('URL API usada:', import.meta.env.VITE_API_URL);

      setError(
        `Error: ${err?.response?.status || ''} ${err?.response?.data?.mensaje || err?.message || 'Error al enviar datos'}`
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container">
      <h1>Programa de envío y recepción de datos</h1>
      <p className="subtitle">
        Captura información desde web o móvil y guárdala en MongoDB
      </p>

      <p style={{ fontSize: '12px', color: '#666', wordBreak: 'break-word' }}>
        API: {import.meta.env.VITE_API_URL || 'NO DEFINIDA'}
      </p>

      <div className="card">
        <form onSubmit={enviarDatos}>
          <label>Nombre del registro</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />

          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
          />

          <label>Foto</label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={manejarImagen}
          />

          <button type="button" onClick={obtenerUbicacion}>
            Obtener ubicación GPS
          </button>

          {ubicacion.latitud && (
            <div>
              <p>Lat: {ubicacion.latitud}</p>
              <p>Lng: {ubicacion.longitud}</p>
            </div>
          )}

          <p>Estado de red: {estadoRed}</p>

          <button type="submit">
            {cargando ? 'Guardando...' : 'Enviar y guardar'}
          </button>
        </form>

        {mensaje && <p className="success">{mensaje}</p>}
        {error && <p className="error">{error}</p>}
      </div>

      <div className="card">
        <h2>Registros</h2>
        {registros.map((item) => (
          <div key={item._id}>
            <h3>{item.nombre}</h3>
            <p>{item.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;