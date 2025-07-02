// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ListarLibros from './ListarLibros';
import ListarAutores from './ListarAutores';
import './App.css';

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <nav className="mb-4 d-flex gap-3">
          <Link to="/" className="btn btn-primary">📚 Libros</Link>
          <Link to="/autores" className="btn btn-secondary">✍️ Autores</Link>
        </nav>

        <Routes>
          <Route path="/" element={<ListarLibros />} />
          <Route path="/autores" element={<ListarAutores />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
