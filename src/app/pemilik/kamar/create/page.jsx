"use client"

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Check, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TambahKamarPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingTypes, setIsFetchingTypes] = useState(true);
  
  const [nomorKamar, setNomorKamar] = useState("");
  const [tipeKamarId, setTipeKamarId] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmittingType, setIsSubmittingType] = useState(false);
  const [newTypeData, setNewTypeData] = useState({
    nama_tipe: "",
    harga_per_bulan: "",
    siklus_bayar: 1
  });

  const fetchRoomTypes = async () => {
    setIsFetchingTypes(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/owner/room-types`, {
        credentials: "include"
      });
      
      if (res.ok) {
        const data = await res.json();
        const types = Array.isArray(data) ? data : (data.data || []);
        setRoomTypes(types);
      }
    } catch (error) {
      console.error("Gagal mengambil tipe kamar:", error);
    } finally {
      setIsFetchingTypes(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!tipeKamarId) {
      return;
    }

    setIsLoading(true);

    const payload = {
      tipe_kamar_id: Number(tipeKamarId),
      nomor_kamar: nomorKamar.trim()
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(`${apiUrl}/owner/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/pemilik/kamar"); 
      } else {
        console.error(data.message || "Terjadi kesalahan saat menambahkan kamar");
      }
    } catch (error) {
      console.error("Gagal terhubung ke server", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRoomType = async (e) => {
    e.preventDefault();
    setIsSubmittingType(true);

    const payload = {
      nama_tipe: newTypeData.nama_tipe,
      harga_per_bulan: Number(newTypeData.harga_per_bulan),
      siklus_bayar: Number(newTypeData.siklus_bayar)
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(`${apiUrl}/owner/room-types`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setIsModalOpen(false);
        setNewTypeData({ nama_tipe: "", harga_per_bulan: "", siklus_bayar: 1 });
        await fetchRoomTypes();
      } else {
        console.error(data.message || "Terjadi kesalahan saat menambahkan tipe kamar");
      }
    } catch (error) {
      console.error("Gagal terhubung ke server", error);
    } finally {
      setIsSubmittingType(false);
    }
  };

  const selectedType = roomTypes.find(t => t.ID === tipeKamarId);

  return (
    <main className="flex flex-col px-10 py-8 w-full max-w-4xl font-sans text-[#1a1a1a]">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a] hover:text-gray-600 transition-colors mb-8 w-fit"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#1a1a1a]">Nomor kamar</label>
          <input
            type="text"
            value={nomorKamar}
            onChange={(e) => setNomorKamar(e.target.value)}
            placeholder="Masukkan nomor kamar"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#435663]/20 focus:border-[#435663] transition-all text-sm"
            required
          />
        </div>

        <div className="space-y-2 relative" ref={dropdownRef}>
          <label className="text-sm font-bold text-[#1a1a1a]">Tipe Kamar</label>
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-gray-300 transition-all text-sm flex justify-between items-center"
          >
            <span className={selectedType ? "text-[#1a1a1a]" : "text-gray-400"}>
              {selectedType ? selectedType.NamaTipe : (isFetchingTypes ? "Memuat tipe kamar..." : "Pilih tipe kamar")}
            </span>
          </div>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden flex flex-col py-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500">Tipe Kamar</div>
              
              <div className="max-h-60 overflow-y-auto">
                {roomTypes.length === 0 && !isFetchingTypes && (
                  <div className="px-4 py-3 text-sm text-gray-500">Belum ada tipe kamar.</div>
                )}
                
                {roomTypes.map((type) => (
                  <div 
                    key={type.ID}
                    onClick={() => {
                      setTipeKamarId(type.ID);
                      setIsDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors ${tipeKamarId === type.ID ? 'bg-gray-50/80' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-4 flex justify-center">
                        {tipeKamarId === type.ID && <Check className="w-4 h-4 text-black" />}
                      </div>
                      <span className="text-sm font-medium">{type.NamaTipe}</span>
                    </div>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); }}
                      className="text-gray-400 hover:text-black transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 mt-2 pt-2 px-4 pb-2">
                <div className="text-xs font-semibold text-gray-500 mb-2">Pengaturan</div>
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="text-sm font-medium text-[#435663] hover:text-[#3c4d59] flex items-center transition-colors"
                >
                  + Tambah Tipe Kamar
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading || isFetchingTypes}
            className="px-6 py-2.5 text-sm font-medium text-white bg-[#435663] rounded-md hover:bg-[#3c4d59] transition-colors disabled:opacity-50"
          >
            {isLoading ? "Menyimpan..." : "Tambah Kamar"}
          </button>
        </div>
      </form>

      {/* MODAL TAMBAH TIPE KAMAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">Tambah Tipe Kamar</h2>
              <p className="text-sm text-gray-500 mb-6">
                Tuliskan tipe kamar dan harga per bulan. Anda dapat mengubahnya di lain waktu.
              </p>

              <form onSubmit={handleAddRoomType} className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-semibold text-[#1a1a1a] w-1/3">Nama Tipe</label>
                  <input
                    type="text"
                    value={newTypeData.nama_tipe}
                    onChange={(e) => setNewTypeData({ ...newTypeData, nama_tipe: e.target.value })}
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
                    value={newTypeData.harga_per_bulan}
                    onChange={(e) => setNewTypeData({ ...newTypeData, harga_per_bulan: e.target.value })}
                    placeholder="Contoh: 2300000"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#435663]/20"
                    required
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-sm font-semibold text-[#1a1a1a] w-1/3">Siklus bayar</label>
                  <select
                    value={newTypeData.siklus_bayar}
                    onChange={(e) => setNewTypeData({ ...newTypeData, siklus_bayar: e.target.value })}
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
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingType}
                    className="px-6 py-2 text-sm font-medium text-white bg-[#435663] rounded-md hover:bg-[#3c4d59] transition-colors disabled:opacity-50"
                  >
                    {isSubmittingType ? "Menyimpan..." : "Tambah"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}