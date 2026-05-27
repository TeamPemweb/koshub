"use client"

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { X, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

const KeluhanCard = ({ data, isActive, onResolve, onReject }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-row gap-6 items-start shadow-sm mb-4">
      <div className="text-xl font-bold text-[#1a1a1a] pt-1">
        #{data.no}
      </div>
      
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <div className="text-xs font-semibold text-[#1a1a1a]">Kamar {data.kamar}</div>
          <div className="text-sm text-[#1a1a1a]">{data.nama}</div>
        </div>
        
        <div>
          <div className="text-xs font-semibold text-[#1a1a1a]">Keluhan</div>
          <div className="text-sm text-[#515151] mt-1 leading-relaxed">
            {data.teks}
          </div>
        </div>
      </div>

      {isActive && (
        <div className="flex flex-row gap-4 ml-4 pt-4">
          <button 
            onClick={() => onReject(data.id)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <X className="w-6 h-6" strokeWidth={2} />
          </button>
          <button 
            onClick={() => onResolve(data.id)}
            className="text-green-500 hover:text-green-700 transition-colors"
          >
            <Check className="w-6 h-6" strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
};

export default function KeluhanKos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [keluhanAktif, setKeluhanAktif] = useState([]);
  const [riwayatKeluhan, setRiwayatKeluhan] = useState([]);
  
  const debouncedSearch = useDebounce(searchQuery, 500);

  const fetchDataKeluhan = async (query = "") => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/owner/complaints?t=${Date.now()}`, {
        credentials: "include",
        cache: "no-store"
      });

      if (!res.ok) {
        console.error("Gagal mengambil data keluhan");
        return;
      }

      const data = await res.json();
      const complaintsData = Array.isArray(data) ? data : (data.data || []);

      let allComplaints = complaintsData.map((item, index) => ({
        id: item.ID || item.id,
        no: item.ID || item.id || (index + 1),
        kamar: item.nomor_kamar || item.kamar?.nomor_kamar || "XX",
        nama: item.nama_penghuni || item.penghuni?.nama || item.User?.nama || "Penghuni",
        teks: item.isi_keluhan,
        status: item.status || item.Status || "pending"
      }));

      if (query) {
        const lowerQuery = query.toLowerCase();
        allComplaints = allComplaints.filter(k => 
          k.nama.toLowerCase().includes(lowerQuery) || 
          k.teks.toLowerCase().includes(lowerQuery) ||
          k.kamar.toLowerCase().includes(lowerQuery)
        );
      }

      // Aktif hanya yang pending
      const aktif = allComplaints.filter(k => k.status.toLowerCase() === "pending" || k.status.toLowerCase() === "menunggu");
      // Riwayat adalah yang proses, selesai, atau declined
      const riwayat = allComplaints.filter(k => k.status.toLowerCase() !== "pending" && k.status.toLowerCase() !== "menunggu");

      setKeluhanAktif(aktif);
      setRiwayatKeluhan(riwayat);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  useEffect(() => {
    fetchDataKeluhan(debouncedSearch);
  }, [debouncedSearch]);

  const handleResolve = async (id) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/owner/complaints/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status_keluhan: "proses" })
      });
      if (res.ok) {
        fetchDataKeluhan(searchQuery);
      } else {
        console.error("Gagal memperbarui status keluhan");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (id) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/owner/complaints/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status_keluhan: "declined" })
      });
      if (res.ok) {
        fetchDataKeluhan(searchQuery);
      } else {
        console.error("Gagal memperbarui status keluhan");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex flex-col px-10 w-full">
      <div className="mb-8">
        <Field orientation="horizontal" className="flex flex-row gap-4 w-full">
          <Input 
            type="search" 
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-white"
          />
          <Button variant="default" size="default" onClick={() => fetchDataKeluhan(searchQuery)} className="bg-[#435663] hover:bg-[#3c4d59]">
            Search
          </Button>
        </Field>
      </div>

      <div className="mb-10">
        <h2 className="text-base font-bold text-[#1a1a1a] mb-4">Keluhan Aktif</h2>
        <div className="flex flex-col">
          {keluhanAktif.length > 0 ? (
            keluhanAktif.map((keluhan) => (
              <KeluhanCard 
                key={keluhan.id} 
                data={keluhan} 
                isActive={true} 
                onResolve={handleResolve}
                onReject={handleReject}
              />
            ))
          ) : (
            <div className="text-sm text-gray-500 py-4">Tidak ada keluhan aktif.</div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-base font-bold text-[#1a1a1a] mb-4">Riwayat Keluhan</h2>
        <div className="flex flex-col">
          {riwayatKeluhan.length > 0 ? (
            riwayatKeluhan.map((keluhan) => (
              <KeluhanCard 
                key={keluhan.id} 
                data={keluhan} 
                isActive={false} 
              />
            ))
          ) : (
            <div className="text-sm text-gray-500 py-4">Tidak ada riwayat keluhan.</div>
          )}
        </div>
      </div>
    </main>
  );
}