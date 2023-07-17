import { Dialog } from "@headlessui/react";

import "./modal.scss";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
};

const Modal = ({ open, onClose, children, title }: Props) => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <Dialog open={open} onClose={() => {}} className="modal">
      <div className="modal__content">
        <Dialog.Panel className="modal__panel">
          <button
            className="modal__closeButton"
            onClick={() => {
              onClose();
            }}
          >
            ✕
          </button>
          <Dialog.Title>{title}</Dialog.Title>
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default Modal;
