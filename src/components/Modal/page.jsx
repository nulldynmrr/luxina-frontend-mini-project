import React from "react";

const Modal = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Ya",
  cancelText = "Batal",
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-[#232323] rounded-xl p-8 shadow-lg w-full max-w-sm text-center">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-[#4A2075] text-white rounded font-semibold"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded font-semibold"
            onClick={onCancel}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
