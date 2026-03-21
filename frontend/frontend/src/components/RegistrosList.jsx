function RegistrosList({ registros }) {
  return (
    <div>
      <h2 className="section-title">Registros</h2>

      {registros.length === 0 ? (
        <p className="sin-registros">No hay registros todavía</p>
      ) : (
        <div className="registros-grid">
          {registros.map((r) => (
            <div key={r._id} className="registro-card">
              <p><strong>Nombre:</strong> {r.nombre}</p>
              <p><strong>Descripción:</strong> {r.descripcion}</p>
              <p><strong>Tipo de módulo:</strong> {r.tipoModulo}</p>
              <p><strong>Latitud:</strong> {r.latitud}</p>
              <p><strong>Longitud:</strong> {r.longitud}</p>
              {r.fecha && (
                <p>
                  <strong>Fecha:</strong>{' '}
                  {new Date(r.fecha).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RegistrosList;