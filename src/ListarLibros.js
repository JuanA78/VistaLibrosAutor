import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';


function ListarLibros() {
  const [titulo, setTitulo] = useState('');
  const [fechaPublicacion, setFechaPublicacion] = useState('');
  const [autorLibro, setAutorLibro] = useState('');
  const [libros, setLibros] = useState([]);
  const [busquedaId, setBusquedaId] = useState('');
  const [libroEncontrado, setLibroEncontrado] = useState(null);
  const [libroNoEncontrado, setLibroNoEncontrado] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [buscadorExpandido, setBuscadorExpandido] = useState(false);

  const API_URL = 'https://apilibros-7h0j.onrender.com/api/libromaterial';


  useEffect(() => {
    obtenerLibros();
  }, []);

  const obtenerLibros = async () => {
    try {
      const response = await axios.get(API_URL);
      setLibros(response.data);
    } catch (error) {
      console.error('Error al obtener libros:', error);
    }
  };

  const esGUIDValido = (guid) => {
    const regexGUID =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return regexGUID.test(guid);
  };

  const resetForm = () => {
    setTitulo('');
    setFechaPublicacion('');
    setAutorLibro('');
    setBusquedaId('');
    setLibroEncontrado(null);
    setLibroNoEncontrado(false);
    setMostrarFormulario(false);
  };

  const guardarLibro = async () => {
    if (!titulo || !fechaPublicacion || !autorLibro) {
      alert('Completa todos los campos');
      return;
    }
    if (titulo.length > 35) {
      alert('El título no debe superar los 35 caracteres');
      return;
    }
    if (!esGUIDValido(autorLibro)) {
      alert('El ID del autor debe ser un GUID válido');
      return;
    }
    try {
      await axios.post(API_URL, {
        titulo,
        fechaPublicacion: new Date(fechaPublicacion).toISOString(),
        autorLibro
      });
      alert('✅ Libro creado exitosamente');
      resetForm();
      obtenerLibros();
    } catch (error) {
      console.error('Error al guardar libro:', error);
      alert('Error al guardar libro. Revisa los datos.');
    }
  };

  const actualizarLibro = async () => {
    const id = busquedaId.trim();

    if (!esGUIDValido(id)) {
      alert('ID inválido para actualizar');
      console.log('ID a actualizar inválido:', id);
      return;
    }
    if (!titulo || !fechaPublicacion || !autorLibro) {
      alert('Completa todos los campos');
      return;
    }
    if (titulo.length > 35) {
      alert('El título no debe superar los 35 caracteres');
      return;
    }
    if (!esGUIDValido(autorLibro)) {
      alert('El ID del autor debe ser un GUID válido');
      return;
    }

    try {
      await axios.put(`${API_URL}/${id}`, {
        titulo,
        fechaPublicacion: new Date(fechaPublicacion).toISOString(),
        autorLibro
      });
      alert('✅ Libro actualizado correctamente');
      resetForm();
      obtenerLibros();
    } catch (error) {
      console.error('Error al actualizar libro:', error.response?.data || error);
      alert('Error al actualizar libro. Revisa los datos.');
    }
  };

  const eliminarLibro = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este libro?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert('🗑️ Libro eliminado exitosamente');
      obtenerLibros();
    } catch (error) {
      console.error('Error al eliminar libro:', error);
      alert('Error al eliminar libro.');
    }
  };

  const buscarLibroPorId = async () => {
    const id = busquedaId.trim();
    if (!id) {
      alert('Ingresa un ID');
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/${id}`);
      setLibroEncontrado(response.data);
      setLibroNoEncontrado(false);
    } catch (error) {
      setLibroEncontrado(null);
      setLibroNoEncontrado(true);
      alert('❌ Libro no encontrado.');
    }
  };

  const llenarFormularioParaEditar = (libro) => {
    setTitulo(libro.titulo);
    const fecha = new Date(libro.fechaPublicacion);
    setFechaPublicacion(fecha.toISOString().slice(0, 16));
    setAutorLibro(libro.autorLibro);
    setBusquedaId(libro.libreriaMaterialId || libro.id || '');
    setMostrarFormulario(true);
  };

  const toggleBuscador = () => {
    setBuscadorExpandido(!buscadorExpandido);
    setBusquedaId('');
    setLibroEncontrado(null);
    setLibroNoEncontrado(false);
  };

  return (
    <div className="container mt-5 libro-container">
      <h1 className="titulo-principal">📚 El buen Lector</h1>

      <div className="barra-principal d-flex justify-content-between align-items-center mb-4">
        {/* Buscador a la izquierda */}
        <div className="buscador d-flex align-items-center gap-2">
          <button
            className="btn lupa-btn"
            onClick={toggleBuscador}
            aria-label="Toggle search"
          >
            🔍
          </button>

          {buscadorExpandido && (
            <>
              <input
                type="text"
                className="input-buscador"
                placeholder="ID del Libro"
                value={busquedaId}
                onChange={(e) => setBusquedaId(e.target.value)}
                style={{ width: '250px' }}
              />
              <button className="btn buscar-btn" onClick={buscarLibroPorId}>
                Buscar
              </button>
            </>
          )}
        </div>

        {/* Botón Nuevo Libro a la derecha */}
        <button
          className="btn nuevo-btn"
          onClick={() => {
            if (!busquedaId) setMostrarFormulario(!mostrarFormulario);
          }}
        >
          📂 {mostrarFormulario && !busquedaId ? 'Ocultar Formulario' : 'Nuevo Libro'}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="formulario-rustico p-4 mb-4">
          <h4 className="subtitulo-formulario">
            {busquedaId ? '✏️ Editar Libro' : '➕ Registrar Libro'}
          </h4>
          <input
            type="text"
            className="input-rustico"
            placeholder="Título (máx. 35 caracteres)"
            value={titulo}
            maxLength={35}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <input
            type="datetime-local"
            className="input-rustico"
            value={fechaPublicacion}
            onChange={(e) => setFechaPublicacion(e.target.value)}
          />
          <input
            type="text"
            className="input-rustico"
            placeholder="ID del autor (GUID)"
            value={autorLibro}
            onChange={(e) => setAutorLibro(e.target.value)}
          />
          <div className="botones-formulario d-flex gap-2 mt-3">
            <button
              className={`btn ${
                busquedaId ? 'btn-warning' : 'btn-success'
              } btn-rustico`}
              onClick={busquedaId ? actualizarLibro : guardarLibro}
            >
              {busquedaId ? '✏️ Actualizar Libro' : '💾 Guardar Libro'}
            </button>
            {busquedaId && (
              <button
                className="btn btn-secondary btn-rustico"
                onClick={resetForm}
              >
                ❌ Cancelar
              </button>
            )}
          </div>
        </div>
      )}

      {libroNoEncontrado && (
        <div className="alerta-rustica">❌ Libro no encontrado.</div>
      )}

      {libroEncontrado && (
        <div className="alerta-info-rustica">
          <strong>📘 Título:</strong> {libroEncontrado.titulo} <br />
          <strong>📅 Fecha:</strong>{' '}
          {new Date(libroEncontrado.fechaPublicacion).toLocaleString()} <br />
          <strong>🖋️ Autor:</strong> {libroEncontrado.autorLibro}
        </div>
      )}

      <div className="tabla-rustica p-4">
        <h4 className="subtitulo-tabla">📖 Lista de Libros</h4>
        <table className="tabla-libros">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Fecha de Publicación</th>
              <th>Autor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {libros.map((libro, index) => (
              <tr key={libro.libreriaMaterialId || libro.id || index}>
                <td>{libro.libreriaMaterialId || libro.id}</td>
                <td>{libro.titulo}</td>
                <td>{new Date(libro.fechaPublicacion).toLocaleString()}</td>
                <td>{libro.autorLibro}</td>
                <td>
                  <button
                    className="btn btn-editar"
                    onClick={() => llenarFormularioParaEditar(libro)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn btn-eliminar"
                    onClick={() =>
                      eliminarLibro(libro.libreriaMaterialId || libro.id)
                    }
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListarLibros;
