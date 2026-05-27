"use client"

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ReusableTable } from "@/components/ReusableTable";
import { Eye, ChevronDown } from "lucide-react";
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

const getStatusStyle = (status) => {
  if (status === "Lunas") return "bg-[#bbf7d0] text-[#166534] border-[#86efac]";
  if (status === "Menunggu") return "bg-[#fed7aa] text-[#c2410c] border-[#fdba74]";
  if (status === "Lewat Tenggat" || status === "Belum Bayar") return "bg-[#fecaca] text-[#b91c1c] border-[#fca5a5]";
  return "bg-gray-100 text-gray-700 border-gray-200";
};

const RiwayatModal = ({ isOpen, onClose, dataPenghuni }) => {
  const [dataRiwayat, setDataRiwayat] = useState([]);

  useEffect(() => {
    if (isOpen && dataPenghuni) {
      const dummyRiwayat = [
        { id: 1, jatuhTempo: "11/05/2026", tanggalBayar: "11/05/2026", status: "Lunas" },
        { id: 2, jatuhTempo: "11/08/2026", tanggalBayar: "11/08/2026", status: "Belum Bayar" },
        { id: 3, jatuhTempo: "11/08/2026", tanggalBayar: "11/08/2026", status: "Lunas" },
        { id: 4, jatuhTempo: "11/08/2027", tanggalBayar: "11/08/2027", status: "Lunas" },
        { id: 5, jatuhTempo: "11/08/2027", tanggalBayar: "11/08/2027", status: "Belum Bayar" },
        { id: 6, jatuhTempo: "11/08/2031", tanggalBayar: "11/08/2031", status: "Menunggu" },
      ];
      setDataRiwayat(dummyRiwayat);
    }
  }, [isOpen, dataPenghuni]);

  if (!isOpen || !dataPenghuni) return null;

  const riwayatColumns = [
    {
      header: "Jatuh Tempo",
      accessorKey: "jatuhTempo",
    },
    {
      header: "Tanggal Bayar",
      accessorKey: "tanggalBayar",
    },
    {
      header: "Status Pembayaran",
      render: (row) => (
        <span className={`px-2 py-1 text-xs font-medium border rounded-md ${getStatusStyle(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: "Aksi",
      render: (row) => (
        row.status === "Lunas" ? (
          <Link href={`/pemilik/billing/bukti/${row.id}`} className="underline text-sm font-medium text-[#1a1a1a] hover:text-gray-600 transition-colors">
            Lihat Bukti
          </Link>
        ) : null
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#1a1a1a]">
            Riwayat Pembayaran {dataPenghuni.nama}
          </h2>
          <p className="text-[#64748b] text-base mt-1">
            Kamar {dataPenghuni.kamar} | Tipe {dataPenghuni.tipe}
          </p>
        </div>
        
        <div className="flex-1 overflow-auto border border-gray-200 rounded-lg">
          <ReusableTable columns={riwayatColumns} data={dataRiwayat} />
        </div>
        
        <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-[#1a1a1a] bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-white bg-[#435663] rounded-lg hover:bg-[#3c4d59] transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default function KelolaBilling() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dataBilling, setDataBilling] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPenghuni, setSelectedPenghuni] = useState(null);
  
  const debouncedSearch = useDebounce(searchQuery, 500);

  const fetchBillingData = async (query = "", status = "") => {
    try {
      const dummyData = [
        { id: 1, nama: "Yoga", kamar: "1A", tipe: "Reguler", nominal: "Rp1.000.000", siklus: "1 bulan", jatuhTempo: "11/05/2026", status: "Lunas" },
        { id: 2, nama: "Bagas", kamar: "1B", tipe: "Premium", nominal: "Rp1.000.000", siklus: "3 bulan", jatuhTempo: "11/08/2026", status: "Menunggu" },
        { id: 3, nama: "Iqbal", kamar: "1C", tipe: "Premium", nominal: "Rp1.000.000", siklus: "3 bulan", jatuhTempo: "11/08/2026", status: "Lunas" },
        { id: 4, nama: "Nailah", kamar: "1C", tipe: "Deluxe", nominal: "Rp1.000.000", siklus: "1 tahun", jatuhTempo: "11/08/2027", status: "Lunas" },
        { id: 5, nama: "Raka", kamar: "1D", tipe: "Elite", nominal: "Rp1.000.000", siklus: "1 tahun", jatuhTempo: "11/08/2027", status: "Lewat Tenggat" },
        { id: 6, nama: "Prima", kamar: "2A", tipe: "Penthouse", nominal: "Rp1.000.000", siklus: "5 tahun", jatuhTempo: "11/08/2031", status: "Lunas" },
      ];

      let filteredData = dummyData;

      if (query) {
        const lowerQuery = query.toLowerCase();
        filteredData = filteredData.filter((b) =>
          b.nama.toLowerCase().includes(lowerQuery) ||
          b.kamar.toLowerCase().includes(lowerQuery)
        );
      }

      if (status) {
        filteredData = filteredData.filter((b) => b.status === status);
      }

      setDataBilling(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBillingData(debouncedSearch, statusFilter);
  }, [debouncedSearch, statusFilter]);

  const handleUpdateStatus = async (id, newStatus) => {
    setDataBilling((prev) => 
      prev.map((item) => item.id === id ? { ...item, status: newStatus } : item)
    );
  };

  const handleOpenRiwayat = (penghuni) => {
    setSelectedPenghuni(penghuni);
    setIsModalOpen(true);
  };

  const columns = [
    {
      header: "Nama Penghuni",
      render: (row) => (
        <Link href={`/pemilik/penghuni/${row.id}`} className="underline text-gray-600 hover:text-gray-900 transition-colors">
          {row.nama}
        </Link>
      ),
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
      header: "Nominal",
      accessorKey: "nominal",
    },
    {
      header: "Siklus Bayar",
      accessorKey: "siklus",
    },
    {
      header: "Jatuh Tempo",
      accessorKey: "jatuhTempo",
    },
    {
      header: "Status Pembayaran",
      render: (row) => (
        <div className="relative inline-block w-36">
          <select
            value={row.status}
            onChange={(e) => handleUpdateStatus(row.id, e.target.value)}
            className={`appearance-none w-full px-3 py-1 pr-8 text-xs font-medium border rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-300 ${getStatusStyle(row.status)}`}
          >
            <option value="Lunas">Lunas</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Lewat Tenggat">Lewat Tenggat</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current">
            <ChevronDown className="w-4 h-4 opacity-70" />
          </div>
        </div>
      ),
    },
    {
      header: "Aksi",
      render: (row) => (
        row.status === "Lunas" ? (
          <Link href={`/pemilik/billing/bukti/${row.id}`} className="underline text-sm font-medium text-[#1a1a1a] hover:text-gray-600 transition-colors">
            Lihat Bukti
          </Link>
        ) : null
      ),
    },
    {
      header: "Riwayat",
      render: (row) => (
        <button onClick={() => handleOpenRiwayat(row)} className="flex justify-center items-center text-[#1a1a1a] hover:text-gray-600 transition-colors w-full cursor-pointer">
          <Eye className="w-5 h-5" />
        </button>
      ),
    },
  ];

  return (
    <main className="flex flex-col px-10 py-6 w-full">
      <div className="mb-8">
        <Field orientation="horizontal" className="flex flex-row gap-4 w-full">
          <Input 
            type="search" 
            placeholder="Cari Nama Penghuni atau Nomor Kamar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-white"
          />
          <Button variant="default" size="default" onClick={() => fetchBillingData(searchQuery, statusFilter)} className="bg-[#435663] hover:bg-[#3c4d59]">
            Search
          </Button>
        </Field>
      </div>

      <div className="mb-6">
        <div className="relative inline-block w-64">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none w-full bg-white border border-gray-200 text-[#1a1a1a] text-sm rounded-md px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-[#435663]/20 focus:border-[#435663] cursor-pointer"
          >
            <option value="">Filter berdasarkan status pembayaran</option>
            <option value="Lunas">Lunas</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Lewat Tenggat">Lewat Tenggat</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md min-h-screen">
        <ReusableTable columns={columns} data={dataBilling} />
      </div>

      <RiwayatModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPenghuni(null);
        }} 
        dataPenghuni={selectedPenghuni} 
      />
    </main>
  );
}