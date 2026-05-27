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

const RiwayatModal = ({ isOpen, onClose, dataPenghuni, fullDataBilling = [] }) => {
  const [dataRiwayat, setDataRiwayat] = useState([]);

  useEffect(() => {
    if (isOpen && dataPenghuni) {
      const history = fullDataBilling.filter(b => b.nama === dataPenghuni.nama && b.kamar === dataPenghuni.kamar);
      setDataRiwayat(history);
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
  const [fullDataBilling, setFullDataBilling] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPenghuni, setSelectedPenghuni] = useState(null);
  
  const debouncedSearch = useDebounce(searchQuery, 500);

  const fetchBillingData = async (query = "", status = "") => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/owner/billings?t=${Date.now()}`, {
        credentials: "include",
        cache: "no-store"
      });

      if (!res.ok) {
        console.error("Gagal mengambil data billing");
        return;
      }

      const backendData = await res.json();

      let mappedData = backendData.map(b => {
        // Handle various response structures
        const nominal = b.nominal || b.Nominal || 0;
        const formattedNominal = `Rp ${nominal.toLocaleString('id-ID')}`;
        
        const dateStr = b.jatuh_tempo || b.JatuhTempo || b.jatuhTempo;
        const dateObj = new Date(dateStr);
        const formattedDate = !isNaN(dateObj) && dateStr
          ? `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`
          : "-";

        const tbStr = b.tanggal_bayar || b.TanggalBayar || b.tanggalBayar;
        const tbObj = new Date(tbStr);
        const formattedTb = !isNaN(tbObj) && tbStr
          ? `${tbObj.getDate().toString().padStart(2, '0')}/${(tbObj.getMonth() + 1).toString().padStart(2, '0')}/${tbObj.getFullYear()}`
          : "-";

        const statusRaw = b.status_pembayaran || b.StatusPembayaran || b.status || "";
        const statusMap = {
          "menunggu": "Menunggu",
          "lewat tenggat": "Lewat Tenggat",
          "lunas": "Lunas",
          "belum bayar": "Belum Bayar",
          "menunggu pembayaran": "Menunggu"
        };

        return {
          id: b.billing_id || b.id || b.ID,
          nama: b.nama_penghuni || b.Penghuni?.Nama || b.nama || "-",
          kamar: b.nomor_kamar || b.Kamar?.NomorKamar || b.kamar || "-",
          tipe: b.nama_tipe || b.Kamar?.TipeKamar?.NamaTipe || "-",
          nominal: formattedNominal,
          siklus: b.siklus_bayar || b.SiklusBayar || "-",
          jatuhTempo: formattedDate,
          tanggalBayar: formattedTb,
          status: statusMap[statusRaw.toLowerCase()] || "Menunggu"
        };
      });

      setFullDataBilling(mappedData);

      if (query) {
        const lowerQuery = query.toLowerCase();
        mappedData = mappedData.filter((b) =>
          b.nama.toLowerCase().includes(lowerQuery) ||
          b.kamar.toLowerCase().includes(lowerQuery)
        );
      }

      if (status) {
        mappedData = mappedData.filter((b) => b.status === status);
      }

      setDataBilling(mappedData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBillingData(debouncedSearch, statusFilter);
  }, [debouncedSearch, statusFilter]);

  const handleKonfirmasiPembayaran = async (id) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/owner/billings/${id}`, {
        method: "PUT",
        credentials: "include"
      });
      if (res.ok) {
        fetchBillingData(searchQuery, statusFilter);
      } else {
        console.error("Gagal konfirmasi pembayaran");
      }
    } catch (error) {
      console.error(error);
    }
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
        <span className={`px-2 py-1 text-xs font-medium border rounded-md ${getStatusStyle(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: "Aksi",
      render: (row) => {
        if (row.status === "Lunas") {
          return (
            <Link href={`/pemilik/billing/bukti/${row.id}`} className="underline text-sm font-medium text-[#1a1a1a] hover:text-gray-600 transition-colors">
              Lihat Bukti
            </Link>
          );
        } else if (row.status === "Menunggu") {
          return (
            <button 
              onClick={() => handleKonfirmasiPembayaran(row.id)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#435663] rounded hover:bg-[#3c4d59] transition-colors"
            >
              Konfirmasi
            </button>
          );
        }
        return null;
      },
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
    <main className="flex flex-col px-10 w-full">
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
        fullDataBilling={fullDataBilling}
      />
    </main>
  );
}