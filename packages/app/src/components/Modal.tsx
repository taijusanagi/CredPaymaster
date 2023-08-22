import React from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, title, children, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="relative z-10 bg-white py-4  px-6 rounded-xl shadow-lg max-w-xl w-full mx-4">
        <header className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-3xl text-gray-400 hover:text-gray-500">
            &times;
          </button>
        </header>
        <div className="mt-4">{children}</div>
      </div>
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
    </div>
  );
};
