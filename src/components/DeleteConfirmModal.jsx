import React from "react";

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="w-full max-w-[480px] bg-white rounded-xl shadow-lg p-8 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">
          Yakin ingin menghapus kamar?
        </h2>
        
        <p className="text-[#64748b] text-base mb-8">
          Penghapusan kamar tidak dapat dikembalikan.
        </p>
        
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-[#1a1a1a] bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 text-sm font-medium text-white bg-[#ef4444] rounded-lg hover:bg-[#dc2626] transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}