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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      
      const [resRooms, resResidents] = await Promise.all([
        fetch(`${apiUrl}/owner/rooms`, { credentials: "include" }),
        fetch(`${apiUrl}/owner/residents`, { credentials: "include" })
      ]);
      
      if (!resRooms.ok) {
        console.error("Gagal mengambil data kamar");
        return;
      }

      const backendData = await resRooms.json();
      
      let residentsData = [];
      if (resResidents.ok) {
        try {
          residentsData = await resResidents.json();
        } catch (e) {
          console.warn("Format data residents tidak valid", e);
        }
      }
      
      const mappedData = backendData.map(room => {
        const resident = residentsData.find(r => r.kamar_id === room.ID);
        const tenantName = resident ? resident.nama_penghuni : null;
        
        return {
          id: room.ID,
          no: room.NomorKamar,
          tipe: room.TipeKamar?.NamaTipe || room.tipe_kamar?.nama_tipe || "-",
          status: room.Status === "kosong" || room.status === "kosong" ? "Kosong" : "Terisi",
          penghuni: tenantName ? tenantName : (room.PenghuniID || room.penghuni_id ? "Ada Penghuni" : "-"),
          kode: room.KodeKamar || room.kode_kamar
        };
      });

      if (query) {
        const lowerQuery = query.toLowerCase();
        const filteredData = mappedData.filter((kamar) =>
          kamar.no.toLowerCase().includes(lowerQuery) ||
          kamar.penghuni.toLowerCase().includes(lowerQuery) ||
          kamar.kode.toLowerCase().includes(lowerQuery)
        );
        setDataKamar(filteredData);
      } else {
        setDataKamar(mappedData);
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/owner/rooms/${selectedRoom.id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (res.ok) {
        // Refetch after deletion
        fetchDataKamar(debouncedSearch);
        setIsDeleteModalOpen(false);
        setSelectedRoom(null);
      } else {
        const errorData = await res.text();
        console.log("Gagal menghapus kamar:", errorData);
        // Menutup modal agar tidak macet
        setIsDeleteModalOpen(false);
        setSelectedRoom(null);
      }
    } catch (error) {
      console.log("Error:", error);
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
          <Link href={`/pemilik/kamar/edit/${row.id}`} className="text-black hover:text-gray-700 transition-colors">
            <Pencil className="w-4 h-4" />
          </Link>
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
    <main className="flex flex-col px-10">
      <div className="flex flex-row gap-2 items-center">
        <Link href="/pemilik/kamar/create">
          <Button className="cursor-pointer" variant="default" size="lg">+ Tambah Kamar</Button>
        </Link>
        <Link href="/pemilik/kamar/kelola">
          <Button variant="outline" size="lg">Kelola Tipe Kamar</Button>
        </Link>

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