"use client"

import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    kosName: "",
    ownerName: "",
    location: "",
    phone: ""
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      const initialData = {
        kosName: "Kos Rukita",
        ownerName: "Joshua Nathanael Purba",
        location: "Malang, Jawa Timur",
        phone: "08123456789"
      };
      setFormData(initialData);
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
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push("/pemilik/profile");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col px-10 py-8 w-full max-w-4xl font-sans text-[#1a1a1a]">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold">Edit Profile</h1>
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
          <label className="text-sm font-bold text-[#1a1a1a]">Nama Kos</label>
          <input
            type="text"
            name="kosName"
            value={formData.kosName}
            onChange={handleChange}
            placeholder="Masukkan nama kos"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#435663]/20 focus:border-[#435663] transition-all text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#1a1a1a]">Nama Pemilik Kos</label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            placeholder="Masukkan nama pemilik kos"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#435663]/20 focus:border-[#435663] transition-all text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#1a1a1a]">Lokasi Kos</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Masukkan lokasi kos"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#435663]/20 focus:border-[#435663] transition-all text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#1a1a1a]">Nomor Telepon</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Masukkan nomor telepon"
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