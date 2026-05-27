"use client"

import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    nama: "",
    nomor_telepon: "",
    nama_kos: "",
    lokasi_kos: ""
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${apiUrl}/auth/profile?t=${Date.now()}`, {
          credentials: "include",
          cache: "no-store"
        });
        
        if (res.ok) {
          const data = await res.json();
          setFormData({
            nama: data.nama || "",
            nomor_telepon: data.nomor_telepon || "",
            nama_kos: data.nama_kos || "",
            lokasi_kos: data.lokasi_kos || ""
          });
        }
      } catch (error) {
        console.error("Gagal mengambil data profile:", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchInitialData();
  }, []);

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

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(`${apiUrl}/auth/profile/setup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Redirect kembali ke halaman profile
        router.push("/pemilik/profile");
        router.refresh(); // Refresh route to update profile header if any
      } else {
        console.error("Gagal memperbarui profile");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <main className="flex flex-col px-10 py-8 w-full">
        <p className="text-gray-500">Memuat data profil...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col px-10 py-8 w-full max-w-4xl font-sans text-[#1a1a1a]">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a] hover:text-gray-600 transition-colors mb-8 w-fit"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#1a1a1a]">Nama Pemilik Kos</label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            placeholder="Contoh: Ahmad Subarjo"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#435663]/20 focus:border-[#435663] transition-all text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#1a1a1a]">Nomor Telepon</label>
          <input
            type="text"
            name="nomor_telepon"
            value={formData.nomor_telepon}
            onChange={handleChange}
            placeholder="Contoh: 08123456789"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#435663]/20 focus:border-[#435663] transition-all text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#1a1a1a]">Nama Kos</label>
          <input
            type="text"
            name="nama_kos"
            value={formData.nama_kos}
            onChange={handleChange}
            placeholder="Contoh: Kos SinggahSini"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#435663]/20 focus:border-[#435663] transition-all text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#1a1a1a]">Lokasi Kos</label>
          <input
            type="text"
            name="lokasi_kos"
            value={formData.lokasi_kos}
            onChange={handleChange}
            placeholder="Contoh: Jl. Sigura-gura No. 10, Malang"
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
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </main>
  );
}