"use client"

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReusableTable } from "@/components/ReusableTable";
import { Pencil, Trash2 } from "lucide-react";
import { InputGroupButton } from "@/components/ui/input-group";
import Link from "next/link";
import { useState, useEffect } from "react";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

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

const getStatusStyle = (status) => {
  return status === "Terisi"
    ? "bg-green-100 text-green-700 border-green-200"
    : "bg-gray-100 text-gray-500 border-gray-200";
};

export default function KelolaKamar() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dataKamar, setDataKamar] = useState([]);
  
  const debouncedSearch = useDebounce(searchQuery, 500);

  const fetchDataKamar = async (query = "") => {
    try {
      const dummyData = [
        { no: "1A", tipe: "Reguler", status: "Terisi", penghuni: "Yoga", kode: "1A-REHDB3" },
        { no: "1B", tipe: "Premium", status: "Terisi", penghuni: "Bagas", kode: "1A-REHDB3" },
        { no: "1C", tipe: "Premium", status: "Terisi", penghuni: "Iqbal", kode: "1A-REHDB3" },
        { no: "1C", tipe: "Deluxe", status: "Terisi", penghuni: "Nailah", kode: "1A-REHDB3" },
        { no: "1D", tipe: "Elite", status: "Terisi", penghuni: "Raka", kode: "1A-REHDB3" },
        { no: "2A", tipe: "Penthouse", status: "Kosong", penghuni: "-", kode: "1A-REHDB3" },
      ];

      if (query) {
        const lowerQuery = query.toLowerCase();
        const filteredData = dummyData.filter((kamar) =>
          kamar.no.toLowerCase().includes(lowerQuery) ||
          kamar.penghuni.toLowerCase().includes(lowerQuery)
        );
        setDataKamar(filteredData);
      } else {
        setDataKamar(dummyData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDataKamar(debouncedSearch);
  }, [debouncedSearch]);

  const handleDeleteClick = (room) => {
    setSelectedRoom(room);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRoom) return;
    try {
      const updatedData = dataKamar.filter((kamar) => kamar.no !== selectedRoom.no);
      setDataKamar(updatedData);
      setIsDeleteModalOpen(false);
      setSelectedRoom(null);
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      header: "Nomor Kamar",
      accessorKey: "no",
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
      header: "Status",
      render: (row) => (
        <span className={`px-2 py-1 text-xs font-medium border rounded-md ${getStatusStyle(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: "Penghuni",
      accessorKey: "penghuni",
    },
    {
      header: "Kode Kamar",
      accessorKey: "kode",
    },
    {
      header: "Aksi",
      render: (row) => (
        <div className="flex items-center gap-3">
          <button className="text-black hover:text-gray-700 transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="text-[#ef4444] hover:text-[#dc2626] transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <main className="flex flex-col px-10 py-2">
      <div className="flex flex-row gap-2 items-center">
        <Link href="/pemilik/kamar/create">
          <Button className="cursor-pointer" variant="default" size="lg">+ Tambah Kamar</Button>
        </Link>
        <Button variant="outline" size="lg">Kelola Tipe Kamar</Button>

        <div className="w-0.5 h-6 bg-gray-400"></div>

        <Field orientation="horizontal" className="flex flex-row gap-4">
          <Input 
            type="search" 
            placeholder="Cari nomor kamar atau nama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="default" size="default" onClick={() => fetchDataKamar(searchQuery)}>
            Search
          </Button>
        </Field>
      </div>

      <div className="py-8 space-y-4 bg-white min-h-screen">
        <ReusableTable columns={columns} data={dataKamar} />

        <DeleteConfirmModal 
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedRoom(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </main>
  );
}