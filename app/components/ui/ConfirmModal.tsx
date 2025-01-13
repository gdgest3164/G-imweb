import { Modal } from "./Modal";
import { Button } from "./Button";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type: "danger";
  confirmText: string;
  disabled?: boolean;
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, type, confirmText, disabled }: ConfirmModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button variant={type} onClick={handleConfirm} disabled={disabled}>
            {confirmText}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p>{message}</p>
      </div>
    </Modal>
  );
}
