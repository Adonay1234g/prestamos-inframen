
import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'prestamos_inframen';

const formularioVacio = {
  estudiante: '',
  herramienta: '',
  cantidad: '',
  fecha: '',
};

function App() {
  const [prestamos, setPrestamos] = useState([]);
  const [formData, setFormData] = useState(formularioVacio);
  const [editandoId, setEditandoId] = useState(null);

  // Cargar los préstamos guardados en este navegador
  useEffect(() => {
    try {
      const guardados = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || '[]'
      );
      setPrestamos(Array.isArray(guardados) ? guardados : []);
    } catch (error) {
      console.error('Error al cargar los préstamos:', error);
      setPrestamos([]);
    }
  }, []);

  // Guardar la lista en el navegador
  const guardarLista = (lista) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
      setPrestamos(lista);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('No se pudieron guardar los datos en este navegador.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((actual) => ({
      ...actual,
      [name]: value,
    }));
  };

  // Registrar un préstamo nuevo o guardar una edición
  const handleSubmit = (e) => {
    e.preventDefault();

    const estudiante = formData.estudiante.trim();
    const herramienta = formData.herramienta.trim();
    const cantidad = Number(formData.cantidad);
    const fecha = formData.fecha;

    if (
      !estudiante ||
      !herramienta ||
      !fecha ||
      !Number.isInteger(cantidad) ||
      cantidad < 1
    ) {
      alert('Completa todos los campos correctamente.');
      return;
    }

    if (editandoId !== null) {
      const actualizados = prestamos.map((p) =>
        p.id === editandoId
          ? { ...p, estudiante, herramienta, cantidad, fecha }
          : p
      );

      guardarLista(actualizados);
      alert('¡Préstamo actualizado correctamente!');
    } else {
      const nuevoPrestamo = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        estudiante,
        herramienta,
        cantidad,
        fecha,
      };

      guardarLista([nuevoPrestamo, ...prestamos]);
      alert('¡Préstamo registrado exitosamente!');
    }

    setFormData(formularioVacio);
    setEditandoId(null);
  };

  // Cargar los datos en el formulario para editarlos
  const editarPrestamo = (prestamo) => {
    setFormData({
      estudiante: prestamo.estudiante,
      herramienta: prestamo.herramienta,
      cantidad: String(prestamo.cantidad),
      fecha: prestamo.fecha,
    });

    setEditandoId(prestamo.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Eliminar un préstamo
  const eliminarPrestamo = (id) => {
    const confirmar = window.confirm(
      '¿Estás seguro de que deseas eliminar este préstamo?'
    );

    if (!confirmar) return;

    guardarLista(prestamos.filter((p) => p.id !== id));

    if (editandoId === id) {
      setFormData(formularioVacio);
      setEditandoId(null);
    }
  };

  const cancelarEdicion = () => {
    setFormData(formularioVacio);
    setEditandoId(null);
  };

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #cbd5e1',
  };

  const buttonStyle = {
    border: 'none',
    borderRadius: '5px',
    padding: '9px 12px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  return (
    <main
      style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        color: '#1f2937',
      }}
    >
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#1e3a8a' }}>
          Sistema de Control de Préstamos
        </h1>
        <p style={{ color: '#4b5563' }}>
          INFRAMEN - Desarrollo de Software
        </p>
      </header>

      <div
        style={{
          background: '#eff6ff',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          fontSize: '14px',
        }}
      >
        Modo de demostración: los registros se guardan en este navegador y
        no se comparten automáticamente con otros dispositivos.
      </div>

      <section
        style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px #00000012',
          marginBottom: '25px',
        }}
      >
        <h2>
          {editandoId !== null
            ? 'Editar préstamo'
            : 'Registrar nuevo préstamo'}
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '15px',
            marginTop: '18px',
          }}
        >
          <label>
            Estudiante
            <input
              style={inputStyle}
              name="estudiante"
              value={formData.estudiante}
              onChange={handleInputChange}
              maxLength={100}
              required
            />
          </label>

          <label>
            Herramienta / Equipo
            <input
              style={inputStyle}
              name="herramienta"
              value={formData.herramienta}
              onChange={handleInputChange}
              maxLength={100}
              required
            />
          </label>

          <label>
            Cantidad
            <input
              style={inputStyle}
              type="number"
              name="cantidad"
              min="1"
              step="1"
              value={formData.cantidad}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Fecha
            <input
              style={inputStyle}
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              required
            />
          </label>

          <div
            style={{
              gridColumn: '1 / -1',
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="submit"
              style={{
                ...buttonStyle,
                background: '#2563eb',
                color: '#fff',
              }}
            >
              {editandoId !== null
                ? 'Guardar cambios'
                : 'Guardar registro'}
            </button>

            {editandoId !== null && (
              <button
                type="button"
                onClick={cancelarEdicion}
                style={{
                  ...buttonStyle,
                  background: '#e5e7eb',
                  color: '#111827',
                }}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </section>

      <section
        style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px #00000012',
        }}
      >
        <h2>Historial de préstamos ({prestamos.length})</h2>

        {prestamos.length === 0 ? (
          <p style={{ padding: '20px 0', color: '#64748b' }}>
            No hay registros todavía.
          </p>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: '15px' }}>
            <table
              style={{
                width: '100%',
                minWidth: '720px',
                borderCollapse: 'collapse',
              }}
            >
              <thead>
                <tr
                  style={{
                    background: '#1e3a8a',
                    color: '#fff',
                    textAlign: 'left',
                  }}
                >
                  {[
                    'ID',
                    'Estudiante',
                    'Herramienta',
                    'Cantidad',
                    'Fecha',
                    'Acciones',
                  ].map((titulo) => (
                    <th key={titulo} style={{ padding: '12px 10px' }}>
                      {titulo}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {prestamos.map((p) => (
                  <tr
                    key={p.id}
                    style={{ borderBottom: '1px solid #e5e7eb' }}
                  >
                    <td style={{ padding: '10px' }}>
                      #{String(p.id).slice(-6)}
                    </td>
                    <td style={{ padding: '10px' }}>{p.estudiante}</td>
                    <td style={{ padding: '10px' }}>{p.herramienta}</td>
                    <td style={{ padding: '10px' }}>{p.cantidad}</td>
                    <td style={{ padding: '10px' }}>{p.fecha}</td>
                    <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                      <button
                        type="button"
                        onClick={() => editarPrestamo(p)}
                        style={{
                          ...buttonStyle,
                          background: '#fef3c7',
                          color: '#92400e',
                          marginRight: '6px',
                        }}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => eliminarPrestamo(p.id)}
                        style={{
                          ...buttonStyle,
                          background: '#fee2e2',
                          color: '#991b1b',
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer
        style={{
          textAlign: 'center',
          color: '#64748b',
          fontSize: '13px',
          marginTop: '20px',
        }}
      >
        INFRAMEN · Sistema de demostración local
      </footer>
    </main>
  );
}

export default App;
