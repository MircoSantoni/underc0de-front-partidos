import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// Reusable UI Components
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';

function AdminDashboard() {
  const [admins, setAdmins] = useState([]);
  const [nuevoAdmin, setNuevoAdmin] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    alias: '',
    cvu: '',
    telefono: '',
    sadmin: false
  });
  const [adminEditando, setAdminEditando] = useState(null);
  const [errorMensaje, setErrorMensaje] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  const token = Cookies.get('authToken');


  // Configure axios headers for all requests
  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  useEffect(() => {
    cargarAdmins();
  }, []);

  console.log('Token:', token);
  const cargarAdmins = async () => {
    try {
      const response = await axios.get(
        'https://underc0departidos.up.railway.app/api/admin/obtener',
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response)
      setAdmins(response.data);
    } catch (error) {
      setErrorMensaje(
        error.response?.data?.message ||
        'No se pudieron cargar los administradores'
      );
      console.error('Error al cargar admins:', error);
    }
  };



  const handleCrearAdmin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'https://underc0departidos.up.railway.app/api/admin/registrar',
        nuevoAdmin,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      cargarAdmins();
      setNuevoAdmin({
        nombre: '', apellido: '', email: '', password: '',
        alias: '', cvu: '', telefono: '', sadmin: false
      });
      setErrorMensaje('');
      setModalType('registro');
      setIsModalOpen(true);
    } catch (error) {
      setErrorMensaje(
        error.response?.data?.msg ||
        'Error al crear admin'
      );
      console.error('Error al crear admin:', error);
    }
  };

  const handleEliminarAdmin = async (id) => {
    try {
      await axios.delete(
        `https://underc0departidos.up.railway.app/api/admin/eliminar/${id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      cargarAdmins();
      setErrorMensaje('');
      setIsModalOpen(false);
    } catch (error) {
      setErrorMensaje(
        error.response?.data?.message ||
        'Error al eliminar el administrador'
      );
      console.error('Error al eliminar admin:', error);
    }
  };

  const handleEditarAdmin = async (e) => {
    e.preventDefault();
    if (!adminEditando) return;

    try {
      await axios.put(
        `https://underc0departidos.up.railway.app/api/admin/editar/${adminEditando.idAdmin}`,
        adminEditando,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      cargarAdmins();
      setAdminEditando(null);
      setErrorMensaje('');
      setModalType('registro');
      setIsModalOpen(true);
    } catch (error) {
      setErrorMensaje(
        error.response?.data?.message ||
        'Error al editar el administrador'
      );
      console.error('Error al editar admin:', error);
    }
  };

  const handleLogout = () => {
    Cookies.remove('authToken');
    window.location.href = '/login';
  };

  return (
    <div className="admin-dashboard container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>

      {errorMensaje && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMensaje}
        </div>
      )}

      <form onSubmit={adminEditando ? handleEditarAdmin : handleCrearAdmin} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Input: Nombre de persona (texto, máximo 50 caracteres) */}
          <input
            type="text"
            placeholder="Nombre"
            value={adminEditando ? adminEditando.nombre : nuevoAdmin.nombre}
            onChange={(e) =>
              adminEditando
                ? setAdminEditando({ ...adminEditando, nombre: e.target.value })
                : setNuevoAdmin({ ...nuevoAdmin, nombre: e.target.value })
            }
            required
            maxLength={50}
            className="border p-2"
          />

          {/* Input: Apellido de persona (texto, máximo 50 caracteres) */}
          <input
            type="text"
            placeholder="Apellido"
            value={adminEditando ? adminEditando.apellido : nuevoAdmin.apellido}
            onChange={(e) =>
              adminEditando
                ? setAdminEditando({ ...adminEditando, apellido: e.target.value })
                : setNuevoAdmin({ ...nuevoAdmin, apellido: e.target.value })
            }
            required
            maxLength={50}
            className="border p-2"
          />

          {/* Input: Correo electrónico (email válido) */}
          <input
            type="email"
            placeholder="Email"
            value={adminEditando ? adminEditando.email : nuevoAdmin.email}
            onChange={(e) =>
              adminEditando
                ? setAdminEditando({ ...adminEditando, email: e.target.value })
                : setNuevoAdmin({ ...nuevoAdmin, email: e.target.value })
            }
            required
            className="border p-2"
          />

          {/* Input: Contraseña (solo para nuevo admin, texto seguro) */}
          {!adminEditando && (
            <input
              type="password"
              placeholder="Contraseña"
              value={nuevoAdmin.password}
              onChange={(e) => setNuevoAdmin({ ...nuevoAdmin, password: e.target.value })}
              required
              minLength={8}
              className="border p-2"
            />
          )}

          {/* Input: Alias o nombre de usuario (texto, máximo 30 caracteres) */}
          <input
            type="text"
            placeholder="Alias"
            value={adminEditando ? adminEditando.alias : nuevoAdmin.alias}
            onChange={(e) =>
              adminEditando
                ? setAdminEditando({ ...adminEditando, alias: e.target.value })
                : setNuevoAdmin({ ...nuevoAdmin, alias: e.target.value })
            }
            maxLength={30}
            className="border p-2"
          />

          {/* Input: CVU (Clave Virtual Uniforme, generalmente numérico de 22 dígitos) */}
          <input
            type="text"
            placeholder="CVU"
            value={adminEditando ? adminEditando.cvu : nuevoAdmin.cvu}
            onChange={(e) =>
              adminEditando
                ? setAdminEditando({ ...adminEditando, cvu: e.target.value })
                : setNuevoAdmin({ ...nuevoAdmin, cvu: e.target.value })
            }
            pattern="\d{22}"
            title="El CVU debe tener 22 dígitos"
            className="border p-2"
          />

          {/* Input: Teléfono (número de contacto, formato internacional) */}
          <input
            type="tel"
            placeholder="Teléfono"
            value={adminEditando ? adminEditando.telefono : nuevoAdmin.telefono}
            onChange={(e) =>
              adminEditando
                ? setAdminEditando({ ...adminEditando, telefono: e.target.value })
                : setNuevoAdmin({ ...nuevoAdmin, telefono: e.target.value })
            }
            pattern="[+]?[\d\s-]{10,}"
            title="Ingrese un número de teléfono válido"
            className="border p-2"
          />

          {/* Checkbox: Rol de Super Admin (booleano) */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={adminEditando ? adminEditando.sadmin : nuevoAdmin.sadmin}
              onChange={() =>
                adminEditando
                  ? setAdminEditando({ ...adminEditando, sadmin: !adminEditando.sadmin })
                  : setNuevoAdmin({ ...nuevoAdmin, sadmin: !nuevoAdmin.sadmin })
              }
              className="mr-2"
            />
            <label>Super Admin</label>
          </div>
        </div>
        <Button
          type="submit"
          variant="primary"
          className="mt-4"
        >
          {adminEditando ? 'Actualizar Admin' : 'Crear Admin'}
        </Button>
        {adminEditando && (
          <Button
            type="button"
            variant="secondary"
            className="mt-4 ml-2"
            onClick={() => setAdminEditando(null)}
          >
            Cancelar Edición
          </Button>
        )}
      </form>

      <div>
        <h2 className="text-xl mb-2">Lista de Admins</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Rol</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.idAdmin} className="hover:bg-gray-100">
                <td className="border p-2">{admin.nombre}</td>
                <td className="border p-2">{admin.email}</td>
                <td className="border p-2">{admin.sadmin ? 'Super Admin' : 'Admin'}</td>
                <td className="border p-2 text-center">
                  <Button
                    variant="secondary"
                    onClick={() => setAdminEditando(admin)}
                    className="mr-2"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setAdminEditando(admin);
                      setModalType('eliminar');
                      setIsModalOpen(true);
                    }}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <Button variant="danger" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setAdminEditando(null);
        }}
        title={
          modalType === 'eliminar' ? 'Confirmar Eliminación' : 'Registro Exitoso'
        }
      >
        {modalType === 'eliminar' ? (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <p className="bg-white p-6 rounded shadow-lg text-center">
              ¿Está seguro que desea eliminar al administrador {adminEditando?.nombre}?
            </p>
            <div className="mt-4 flex justify-center space-x-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  setAdminEditando(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={() => handleEliminarAdmin(adminEditando.idAdmin)}
              >
                Eliminar
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <p className="text-center">Administrador {adminEditando ? 'actualizado' : 'registrado'} exitosamente</p>
            <div className="mt-4 flex justify-center">
              <Button
                variant="primary"
                onClick={() => {
                  setIsModalOpen(false);
                  setAdminEditando(null);
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AdminDashboard;