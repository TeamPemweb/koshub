"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, MoreVertical, DollarSign, User, Calendar, Edit2, Trash2, ChevronLeft } from "lucide-react";

export default function KelolaTipeKamar() {
  const router = useRouter();

  const [roomTypes, setRoomTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({
    nama_tipe: "",
    harga_per_bulan: "",
    siklus_bayar: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchRoomTypes = async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const [resTypes, resResidents] = await Promise.all([
        fetch(`${apiUrl}/owner/room-types?t=${Date.now()}`, { credentials: "include", cache: "no-store" }),
        fetch(`${apiUrl}/owner/residents?t=${Date.now()}`, { credentials: "include", cache: "no-store" })
      ]);

      if (resTypes.ok) {
        const data = await resTypes.json();
        const typesData = Array.isArray(data) ? data : (data.data || []);
        
        let residentCounts = {};
        if (resResidents.ok) {
          const residentsData = await resResidents.json();
          const rData = Array.isArray(residentsData) ? residentsData : (residentsData.data || []);
          rData.forEach(r => {
            const tName = r.nama_tipe || r.Kamar?.TipeKamar?.NamaTipe;
            if (tName) {
              residentCounts[tName] = (residentCounts[tName] || 0) + 1;
            }
          });
        }

        const enrichedTypes = typesData.map(type => {
          const typeName = type.NamaTipe || type.nama_tipe;
          return {
            ...type,
            total_penghuni: residentCounts[typeName] || 0
          };
        });

        setRoomTypes(enrichedTypes);
      } else {
        console.error("Gagal mengambil data tipe kamar");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const handleOpenAddModal = () => {
    setFormData({ nama_tipe: "", harga_per_bulan: "", siklus_bayar: 1 });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (type) => {
    setSelectedType(type);
    setFormData({
      nama_tipe: type.NamaTipe || type.nama_tipe,
      harga_per_bulan: type.HargaPerBulan || type.harga_per_bulan,
      siklus_bayar: type.SiklusBayar || type.siklus_bayar || 1
    });
    setOpenDropdownId(null);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (type) => {
    setSelectedType(type);
    setOpenDropdownId(null);
    setIsDeleteModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const payload = {
        nama_tipe: formData.nama_tipe,
        harga_per_bulan: Number(formData.harga_per_bulan),
        siklus_bayar: Number(formData.siklus_bayar)
      };
      
      const res = await fetch(`${apiUrl}/owner/room-types`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsAddModalOpen(false);
        fetchRoomTypes();
      } else {
        console.error("Gagal menambah tipe kamar");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const payload = {
        nama_tipe: formData.nama_tipe,
        harga_per_bulan: Number(formData.harga_per_bulan),
        siklus_bayar: Number(formData.siklus_bayar)
      };
      
      const res = await fetch(`${apiUrl}/owner/room-types/${selectedType.ID || selectedType.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsEditModalOpen(false);
        fetchRoomTypes();
      } else {
        console.error("Gagal mengedit tipe kamar");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/owner/room-types/${selectedType.ID || selectedType.id}`, {
        method: "DELETE",
        credentials: "include"
      });
      
      if (res.ok) {
        setIsDeleteModalOpen(false);
        fetchRoomTypes();
      } else {
        console.error("Gagal menghapus tipe kamar");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number);
  };

  return (
    <main className="flex flex-col px-10 py-6 w-full text-[#1a1a1a]">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a] hover:text-gray-600 transition-colors mb-8 w-fit"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      {isLoading ? (
        <div className="text-gray-500">Memuat tipe kamar...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {roomTypes.map((type) => (
            <div key={type.ID || type.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative flex flex-col justify-between min-h-[160px]">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg">{type.NamaTipe || type.nama_tipe}</h3>
                  <div className="relative">
                    <button 
                      onClick={() => setOpenDropdownId(openDropdownId === (type.ID || type.id) ? null : (type.ID || type.id))}
                      className="text-gray-400 hover:text-gray-700 p-1 rounded-full transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    
                    {openDropdownId === (type.ID || type.id) && (
                      <div ref={dropdownRef} className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden z-10">
                        <button 
                          onClick={() => handleOpenEditModal(type)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button 
                          onClick={() => handleOpenDeleteModal(type)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center text-sm font-medium">
                    <DollarSign className="w-4 h-4 mr-3 text-gray-600" />
                    {formatRupiah(type.HargaPerBulan || type.harga_per_bulan)}
                  </div>
                  <div className="flex items-center text-sm font-medium">
                    <User className="w-4 h-4 mr-3 text-gray-600" />
                    {type.total_penghuni || 0} orang
                  </div>
                  <div className="flex items-center text-sm font-medium">
                    <Calendar className="w-4 h-4 mr-3 text-gray-600" />
                    Setiap {type.SiklusBayar || type.siklus_bayar} bulan
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Type Card */}
          <button 
            onClick={handleOpenAddModal}
            className="bg-[#435663] text-white rounded-xl p-5 shadow-sm min-h-[160px] flex flex-col items-center justify-center hover:bg-[#3c4d59] transition-colors gap-3"
          >
            <PlusCircle className="w-8 h-8" strokeWidth={1.5} />
            <span className="font-medium text-sm">Tambah Tipe Baru</span>
          </button>
        </div>
      )}

      {/* Modal Tambah Tipe Kamar */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">Tambah Tipe Kamar</h2>
            <p className="text-[#64748b] text-sm mb-6">Tambahkan tipe kamar baru untuk properti Anda.</p>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-[#1a1a1a] w-1/3">Nama Tipe</label>
                <input
                  type="text"
                  value={formData.nama_tipe}
                  onChange={(e) => setFormData({ ...formData, nama_tipe: e.target.value })}
                  placeholder="Contoh: Elite"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#435663]/20"
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-[#1a1a1a] w-1/3">Harga per bulan</label>
                <input
                  type="number"
                  min="0"
                  value={formData.harga_per_bulan}
                  onChange={(e) => setFormData({ ...formData, harga_per_bulan: e.target.value })}
                  placeholder="Contoh: 2300000"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#435663]/20"
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-[#1a1a1a] w-1/3">Siklus bayar</label>
                <select
                  value={formData.siklus_bayar}
                  onChange={(e) => setFormData({ ...formData, siklus_bayar: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#435663]/20 bg-white"
                >
                  <option value={1}>1 bulan</option>
                  <option value={3}>3 bulan</option>
                  <option value={6}>6 bulan</option>
                  <option value={12}>1 tahun</option>
                  <option value={60}>5 tahun</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 mt-8 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-2.5 text-sm font-medium text-[#1a1a1a] bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-[#435663] rounded-lg hover:bg-[#3c4d59] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Tipe Kamar */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">Edit Tipe Kamar</h2>
            <p className="text-[#64748b] text-sm mb-6">Ubah data tipe kamar ini.</p>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-[#1a1a1a] w-1/3">Nama Tipe</label>
                <input
                  type="text"
                  value={formData.nama_tipe}
                  onChange={(e) => setFormData({ ...formData, nama_tipe: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#435663]/20"
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-[#1a1a1a] w-1/3">Harga per bulan</label>
                <input
                  type="number"
                  min="0"
                  value={formData.harga_per_bulan}
                  onChange={(e) => setFormData({ ...formData, harga_per_bulan: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#435663]/20"
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-[#1a1a1a] w-1/3">Siklus bayar</label>
                <select
                  value={formData.siklus_bayar}
                  onChange={(e) => setFormData({ ...formData, siklus_bayar: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#435663]/20 bg-white"
                >
                  <option value={1}>1 bulan</option>
                  <option value={3}>3 bulan</option>
                  <option value={6}>6 bulan</option>
                  <option value={12}>1 tahun</option>
                  <option value={60}>5 tahun</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 mt-8 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2.5 text-sm font-medium text-[#1a1a1a] bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-[#435663] rounded-lg hover:bg-[#3c4d59] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Hapus Tipe Kamar */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-[480px] bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">
              Hapus tipe kamar {selectedType?.NamaTipe || selectedType?.nama_tipe}?
            </h2>
            <p className="text-[#64748b] text-base mb-8">
              Penghapusan tipe kamar tidak dapat dikembalikan dan mungkin memengaruhi data kamar yang ada.
            </p>
            
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-2.5 text-sm font-medium text-[#1a1a1a] bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isSubmitting}
                className="px-6 py-2.5 text-sm font-medium text-white bg-[#ef4444] rounded-lg hover:bg-[#dc2626] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
