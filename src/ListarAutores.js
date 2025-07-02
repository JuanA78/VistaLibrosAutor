import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; // Reutiliza tus estilos

function ListarAutores() {
  const [autores, setAutores] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [autorGuid, setAutorGuid] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [autorEncontrado, setAutorEncontrado] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const API_URL = 'https://apiautor.onrender.com/api/autor';
// ajusta el puerto si cambia

  useEffect(() => {
    obtenerAutores();
  }, []);

  const obtenerAutores = async () => {
    try {
      const response = await axios.get(API_URL);
      setAutores(response.data);
    } catch (error) {
      console.error('Error al obtener autores:', error);
    }
  };

  const guardarAutor = async () => {
    if (!nombre || !apellido || !fechaNacimiento) {
      alert('Completa todos los campos');
      return;
    }

    try {
      await axios.post(API_URL, {
        nombre,
        apellido,
        fechaNacimiento: new Date(fechaNacimiento).toISOString()
      });
      alert('✅ Autor registrado correctamente');
      resetForm();
      obtenerAutores();
    } catch (error) {
      console.error('Error al guardar autor:', error);
      alert('Error al guardar autor.');
    }
  };

  const buscarAutorPorGuid = async () => {
    if (!busqueda) {
      alert('Ingresa un GUID');
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/guid/${busqueda}`);
      setAutorEncontrado(response.data);
    } catch (error) {
      alert('❌ Autor no encontrado');
      setAutorEncontrado(null);
    }
  };

  const buscarAutorPorNombre = async () => {
    if (!busqueda) {
      alert('Ingresa un nombre');
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/nombre/${busqueda}`);
      setAutorEncontrado(response.data);
    } catch (error) {
      alert('❌ Autor no encontrado');
      setAutorEncontrado(null);
    }
  };

  const resetForm = () => {
    setNombre('');
    setApellido('');
    setFechaNacimiento('');
    setAutorGuid('');
    setMostrarFormulario(false);
  };

  return (
    <div className="container mt-5 autor-container">
      <h1 className="titulo-principal">✍️ Gestión de Autores</h1>

      <div className="barra-principal d-flex justify-content-between align-items-center mb-4">
        <div className="buscador d-flex gap-2 align-items-center">
          <input
            type="text"
            placeholder="GUID o nombre del autor"
            className="input-buscador"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button className="btn buscar-btn" onClick={buscarAutorPorGuid}>Buscar por GUID</button>
          <button className="btn buscar-btn" onClick={buscarAutorPorNombre}>Buscar por Nombre</button>
        </div>

        <button className="btn nuevo-btn" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
          {mostrarFormulario ? '➖ Ocultar Formulario' : '➕ Nuevo Autor'}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="formulario-rustico p-4 mb-4">
          <h4 className="subtitulo-formulario">➕ Registrar Autor</h4>
          <input
            type="text"
            className="input-rustico"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="text"
            className="input-rustico"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
          <input
            type="date"
            className="input-rustico"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
          />
          <button className="btn btn-success btn-rustico mt-2" onClick={guardarAutor}>
            💾 Guardar Autor
          </button>
        </div>
      )}

      {autorEncontrado && (
        <div className="alerta-info-rustica">
          <strong>👤 Nombre:</strong> {autorEncontrado.nombre} {autorEncontrado.apellido} <br />
          <strong>🎂 Fecha Nacimiento:</strong> {new Date(autorEncontrado.fechaNacimiento).toLocaleDateString()} <br />
          <strong>🆔 GUID:</strong> {autorEncontrado.autorLibroGuid}
        </div>
      )}

      <div className="tabla-rustica p-4">
        <h4 className="subtitulo-tabla">📋 Lista de Autores</h4>
        <table className="tabla-libros">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Fecha de Nacimiento</th>
              <th>GUID</th>
            </tr>
          </thead>
          <tbody>
            {autores.map((autor, index) => (
              <tr key={index}>
                <td>{autor.nombre}</td>
                <td>{autor.apellido}</td>
                <td>{new Date(autor.fechaNacimiento).toLocaleDateString()}</td>
                <td>{autor.autorLibroGuid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListarAutores;
