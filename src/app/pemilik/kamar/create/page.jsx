"use client"

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TambahTipeKamarPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nama_tipe: "",
    harga_per_bulan: "",
    siklus_bayar: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      nama_tipe: formData.nama_tipe,
      harga_per_bulan: Number(formData.harga_per_bulan),
      siklus_bayar: Number(formData.siklus_bayar)
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(`${apiUrl}/owner/room-types`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Tipe kamar berhasil ditambahkan");
        router.push("/pemilik/kamar/kelola");
      } else {
        alert(data.message || "Terjadi kesalahan saat menambahkan tipe kamar");
      }
    } catch (error) {
      console.error(error);
      alert("Gagal terhubung ke server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col px-10 py-8 w-full max-w-4xl font-sans text-[#1a1a1a]">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold">Tambah Tipe Kamar</h1>
      </div>

      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a] hover:text-gray-600 transition-colors mb-8 w-fit"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#1a1a1a]">Nama Tipe Kamar</label>
          <input
            type="text"
            name="nama_tipe"
            value={formData.nama_tipe}
            onChange={handleChange}
            placeholder="Contoh: Reguler Ekonomi"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#435663]/20 focus:border-[#435663] transition-all text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#1a1a1a]">Harga per Bulan (Rp)</label>
          <input
            type="number"
            name="harga_per_bulan"
            value={formData.harga_per_bulan}
            onChange={handleChange}
            placeholder="Contoh: 800000"
            min="0"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#435663]/20 focus:border-[#435663] transition-all text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#1a1a1a]">Siklus Bayar (Bulan)</label>
          <input
            type="number"
            name="siklus_bayar"
            value={formData.siklus_bayar}
            onChange={handleChange}
            placeholder="Contoh: 1"
            min="1"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#435663]/20 focus:border-[#435663] transition-all text-sm"
            required
          />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-2.5 text-sm font-medium text-[#1a1a1a] bg-[#e6e6e6] rounded-md hover:bg-gray-300 transition-colors"
          >
            Batalkan
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-2.5 text-sm font-medium text-white bg-[#435663] rounded-md hover:bg-[#3c4d59] transition-colors disabled:opacity-50"
          >
            {isLoading ? "Menyimpan..." : "Simpan Tipe Kamar"}
          </button>
        </div>
      </form>
    </main>
  );
}