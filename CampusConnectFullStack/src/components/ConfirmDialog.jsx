import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', danger = false, onConfirm, onCancel }) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="confirm-text">{message}</p>
      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel}>Keep as is</Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
