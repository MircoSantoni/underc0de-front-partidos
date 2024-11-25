import React from 'react';
import './ConfirmCancelModal.css';

const ConfirmCancelModal = ({ show, onCancel, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>¿Estás seguro de que quieres cancelar este partido?</h3>
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onCancel}>Cancelar</button>
          <button className="confirm-btn" onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCancelModal;
