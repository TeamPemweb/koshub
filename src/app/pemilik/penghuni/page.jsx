"use client"

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ReusableTable } from "@/components/ReusableTable";
import { Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";

const getTipeKamarStyle = (tipe) => {
  const styles = {
    Reguler: "bg-purple-100 text-purple-700 border-purple-200",
    Premium: "bg-green-100 text-green-700 border-green-200",
    Deluxe: "bg-yellow-100 text-yellow-700 border-yellow-300",
    Elite: "bg-pink-100 text-pink-700 border-pink-200",
    Penthouse: "bg-cyan-100 text-cyan-700 border-cyan-200",
  };
  // Fallback styling using substring match if exact match fails
  const matchedKey = Object.keys(styles).find(key => tipe?.toLowerCase().includes(key.toLowerCase()));
  return matchedKey ? styles[matchedKey] : "bg-gray-100 text-gray-700 border-gray-200";
};

// Helper function to calculate stay duration
function calculateStayDuration(startDateString) {
  if (!startDateString) return "-";
  const start = new Date(startDateString);
  const now = new Date();
  
  if (isNaN(start.getTime())) return "-";
  
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  
  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  let result = [];
  if (years > 0) result.push(`${years} tahun`);
  if (months > 0) result.push(`${months} bulan`);
  if (days > 0) result.push(`${days} hari`);
  
  if (result.length === 0) return "Baru saja masuk";
  return result.join(", ");
}

export default function KelolaPenghuni() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dataPenghuni, setDataPenghuni] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPenghuni, setSelectedPenghuni] = useState(null);
  
  const debouncedSearch = useDebounce(searchQuery, 500);

  const fetchDataPenghuni = async (query = "") => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/owner/residents`, {
        credentials: "include"
      });

      if (!res.ok) {
        console.error("Gagal mengambil data penghuni");
        return;
      }

      const backendData = await res.json();

      const mappedData = backendData.map(resident => ({
        id: resident.kamar_id, 
        nama: resident.nama_penghuni,
        telepon: resident.nomor_telepon || "-",
        kamar: resident.nomor_kamar,
        tipe: resident.nama_tipe,
        lama: calculateStayDuration(resident.tanggal_masuk)
      }));

      if (query) {
        const lowerQuery = query.toLowerCase();
        const filteredData = mappedData.filter((penghuni) =>
          penghuni.nama.toLowerCase().includes(lowerQuery) ||
          penghuni.kamar.toLowerCase().includes(lowerQuery)
        );
        setDataPenghuni(filteredData);
      } else {
        setDataPenghuni(mappedData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDataPenghuni(debouncedSearch);
  }, [debouncedSearch]);

  const handleAkhiriSewaClick = (penghuni) => {
    setSelectedPenghuni(penghuni);
    setIsModalOpen(true);
  };

  const handleConfirmAkhiriSewa = () => {
    // Placeholder untuk endpoint akhiri sewa nantinya
    alert(`Mensimulasikan pengakhiran sewa untuk ${selectedPenghuni?.nama}. Endpoint belum tersedia.`);
    setIsModalOpen(false);
    setSelectedPenghuni(null);
  };

  const columns = [
    {
      header: "Nama Penghuni",
      render: (row) => (
        <span className="font-medium text-gray-900">
          {row.nama}
        </span>
      ),
    },
    {
      header: "Nomor Telepon",
      accessorKey: "telepon",
    },
    {
      header: "Nomor Kamar",
      accessorKey: "kamar",
    },
    {
      header: "Tipe Kamar",
      render: (row) => (
        <span className={`px-2 py-1 text-xs font-medium border rounded-md ${getTipeKamarStyle(row.tipe)}`}>
          {row.tipe}
        </span>
      ),
    },
    {
      header: "Lama menetap",
      accessorKey: "lama",
    },
    {
      header: "Aksi",
      render: (row) => (
        <div className="flex items-center gap-4">
          <button className="text-black hover:text-gray-700 transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAkhiriSewaClick(row)}
            className="px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-100 border border-red-200 rounded-md hover:bg-red-200 transition-colors"
          >
            Akhiri Sewa
          </button>
        </div>
      ),
    },
  ];

  return (
    <main className="flex flex-col px-10 w-full">
      <div className="mb-6">
        <Field orientation="horizontal" className="flex flex-row gap-4 w-full">
          <Input 
            type="search" 
            placeholder="Cari nama penghuni atau kamar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 max-w-full bg-white"
          />
          <Button variant="default" size="default" onClick={() => fetchDataPenghuni(searchQuery)} className="bg-[#435663] hover:bg-[#3c4d59]">
            Search
          </Button>
        </Field>
      </div>

      <div className="bg-white rounded-md min-h-screen">
        <ReusableTable columns={columns} data={dataPenghuni} />
      </div>

      {/* Modal Konfirmasi Akhiri Sewa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div 
            className="w-full max-w-[480px] bg-white rounded-xl shadow-lg p-8 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">
              Akhiri Sewa {selectedPenghuni?.nama}?
            </h2>
            
            <p className="text-[#64748b] text-base mb-8">
              Tindakan ini akan mengeluarkan penghuni dari kamar {selectedPenghuni?.kamar} dan kamar tersebut akan kembali berstatus Kosong.
            </p>
            
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedPenghuni(null);
                }}
                className="px-6 py-2.5 text-sm font-medium text-[#1a1a1a] bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmAkhiriSewa}
                className="px-6 py-2.5 text-sm font-medium text-white bg-[#ef4444] rounded-lg hover:bg-[#dc2626] transition-colors"
              >
                Akhiri Sewa
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}