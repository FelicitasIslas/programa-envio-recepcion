import { useState } from 'react';
import API from '../services/api';

function RegistroForm({ onRegistroGuardado }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [imagen, setImagen] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [tipoModulo, setTipoModulo] = useState('');

  const obtenerUbicacion = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitud(pos.coords.latitude.toString());
        setLongitud(pos.coords.longitude.toString());
        setMensaje('Ubicación obtenida correctamente');
      },
      () => {
        setMensaje('Error al obtener ubicación');
      }
    );
  };

  const enviarDatos = async (e) => {
    e.preventDefault();

    if (!nombre || !descripcion || !latitud || !longitud || !tipoModulo) {
      setMensaje('Completa todos los campos');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('descripcion', descripcion);
      formData.append('latitud', latitud);
      formData.append('longitud', longitud);
      formData.append('tipoModulo', tipoModulo);

      if (imagen) {
        formData.append('imagen', imagen);
      }

      await API.post('/registros', formData);

      setMensaje('Guardado correctamente');
      setNombre('');
      setDescripcion('');
      setLatitud('');
      setLongitud('');
      setTipoModulo('');
      setImagen(null);

      onRegistroGuardado();
    } catch {
      setMensaje('Error al guardar');
    }
  };

  return (
    <form onSubmit={enviarDatos} className="registro-form">
      <h2 className="section-title">Registrar datos</h2>

      <div className="form-grid">
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            placeholder="Ej. Foto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            placeholder="Ej. Captura realizada desde cámara del dispositivo"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Tipo de módulo</label>
          <select
            value={tipoModulo}
            onChange={(e) => setTipoModulo(e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            <option value="GPS">GPS</option>
            <option value="Camara">Cámara</option>
            <option value="Sensor Simulado">Sensor Simulado</option>
            <option value="Red">Red</option>
          </select>
        </div>

        <div className="form-group button-group">
          <label>&nbsp;</label>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={obtenerUbicacion}
          >
            Obtener GPS
          </button>
        </div>

        <div className="form-group">
          <label>Latitud</label>
          <input type="text" value={latitud} readOnly placeholder="Latitud" />
        </div>

        <div className="form-group">
          <label>Longitud</label>
          <input type="text" value={longitud} readOnly placeholder="Longitud" />
        </div>

        <div className="form-group">
          <label>Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
          />
        </div>

        <div className="form-group button-group">
          <label>&nbsp;</label>
          <button type="submit" className="btn btn-primary">
            Guardar
          </button>
        </div>
      </div>

      {mensaje && <p className="mensaje">{mensaje}</p>}
    </form>
  );
}

export default RegistroForm;