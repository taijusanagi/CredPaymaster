import React from "react";

interface ErrorToastProps {
  message: string;
  className: string;
  onClose: () => void;
}

const ErrorToast: React.FC<ErrorToastProps> = ({ className, message, onClose }) => {
  return (
    <div
      className={`fixed top-4 right-4 w-96 bg-red-100 text-red-700 p-4 rounded-lg shadow-md z-50 transition-all duration-300 transform ease-in-out opacity-100 ${className}`}
    >
      {message}
    </div>
  );
};

export default ErrorToast;
