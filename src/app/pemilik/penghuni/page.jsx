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
  return styles[tipe] || "bg-gray-100 text-gray-700 border-gray-200";
};

export default function KelolaPenghuni() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dataPenghuni, setDataPenghuni] = useState([]);
  
  const debouncedSearch = useDebounce(searchQuery, 500);

  const fetchDataPenghuni = async (query = "") => {
    try {
      const dummyData = [
        { id: 1, nama: "Yoga", telepon: "08123456789", email: "yoga@example.com", kamar: "1A", tipe: "Reguler", lama: "2 bulan, 3 hari" },
        { id: 2, nama: "Bagas", telepon: "08123456789", email: "bagas@example.com", kamar: "1B", tipe: "Premium", lama: "2 tahun, 3 bulan, 11 hari" },
        { id: 3, nama: "Iqbal", telepon: "08123456789", email: "iqbal@example.com", kamar: "1C", tipe: "Premium", lama: "2 tahun, 3 bulan, 12 hari" },
        { id: 4, nama: "Nailah", telepon: "08123456789", email: "nailah@example.com", kamar: "1C", tipe: "Deluxe", lama: "2 tahun, 3 bulan, 16 hari" },
        { id: 5, nama: "Raka", telepon: "08123456789", email: "raka@example.com", kamar: "1D", tipe: "Elite", lama: "2 tahun, 3 bulan, 13 hari" },
        { id: 6, nama: "Prima", telepon: "08123456789", email: "prima@example.com", kamar: "2A", tipe: "Penthouse", lama: "2 tahun, 3 bulan, 15 hari" },
      ];

      if (query) {
        const lowerQuery = query.toLowerCase();
        const filteredData = dummyData.filter((penghuni) =>
          penghuni.nama.toLowerCase().includes(lowerQuery) ||
          penghuni.email.toLowerCase().includes(lowerQuery)
        );
        setDataPenghuni(filteredData);
      } else {
        setDataPenghuni(dummyData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDataPenghuni(debouncedSearch);
  }, [debouncedSearch]);

  const handleAkhiriSewa = (penghuni) => {
    console.log("Akhiri sewa untuk:", penghuni.nama);
  };

  const columns = [
    {
      header: "Nama Penghuni",
      render: (row) => (
        <Link href={`/penghuni/${row.id}`} className="underline text-gray-600 hover:text-gray-900 transition-colors">
          {row.nama}
        </Link>
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
            onClick={() => handleAkhiriSewa(row)}
            className="px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-100 border border-red-200 rounded-md hover:bg-red-200 transition-colors"
          >
            Akhiri Sewa
          </button>
        </div>
      ),
    },
  ];

  return (
    <main className="flex flex-col px-10 py-6 w-full max-w-7xl">
      <div className="mb-6">
        <Field orientation="horizontal" className="flex flex-row gap-4 w-full">
          <Input 
            type="search" 
            placeholder="Cari nama penghuni..."
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
    </main>
  );
}