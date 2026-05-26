"use client"

import { useState, useEffect } from "react";
import { CircleDollarSign, User, Building, Megaphone, X, Check } from "lucide-react";
import Link from "next/link";
import { ReusableTable } from "@/components/ReusableTable";

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

const getStatusPembayaranStyle = (status) => {
  if (status === "Menunggu") return "bg-red-100 text-red-600 border-red-200";
  if (status === "Lewat Tenggat") return "bg-red-100 text-red-600 border-red-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
};

const KeluhanCard = ({ data, onResolve, onReject }) => {
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
      <div className="flex flex-row gap-4 ml-4 pt-4">
        <button onClick={() => onReject(data.id)} className="text-red-500 hover:text-red-700 transition-colors">
          <X className="w-6 h-6" strokeWidth={2} />
        </button>
        <button onClick={() => onResolve(data.id)} className="text-green-500 hover:text-green-700 transition-colors">
          <Check className="w-6 h-6" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalTagihan: 0,
    totalPenghuni: 0,
    totalKamar: 0,
    totalTipeKamar: 0,
    totalKeluhan: 0,
  });
  const [tagihan, setTagihan] = useState([]);
  const [keluhan, setKeluhan] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const dummyStats = {
        totalTagihan: 2,
        totalPenghuni: 2,
        totalKamar: 26,
        totalTipeKamar: 5,
        totalKeluhan: 2,
      };

      const dummyTagihan = [
        { id: 1, nama: "Bagas", kamar: "1B", tipe: "Premium", nominal: "Rp1.000.000", siklus: "3 bulan", jatuhTempo: "11/08/2026", status: "Menunggu" },
        { id: 2, nama: "Raka", kamar: "1D", tipe: "Elite", nominal: "Rp1.000.000", siklus: "1 tahun", jatuhTempo: "11/08/2027", status: "Lewat Tenggat" },
        { id: 3, nama: "Yoga", kamar: "1A", tipe: "Reguler", nominal: "Rp1.000.000", siklus: "1 bulan", jatuhTempo: "11/08/2026", status: "Menunggu" },
      ];

      const dummyKeluhan = [
        { id: 1, no: "1", kamar: "XX", nama: "Tobias Andra Valentino", teks: "Lorem ipsum dolor sit amet consectetur. Nisi pellentesque urna volutpat magna vitae sit sagittis in dolor. In integer facilisi risus diam adipiscing pulvinar in id varius. Purus viverra blandit et vestibulum orci morbi. Neque pretium vitae justo nisl." },
        { id: 2, no: "2", kamar: "XX", nama: "Tobias Andra Valentino", teks: "Lorem ipsum dolor sit amet consectetur. Nisi pellentesque urna volutpat magna vitae sit sagittis in dolor. In integer facilisi risus diam adipiscing pulvinar in id varius. Purus viverra blandit et vestibulum orci morbi. Neque pretium vitae justo nisl." },
        { id: 3, no: "3", kamar: "XX", nama: "Tobias Andra Valentino", teks: "Lorem ipsum dolor sit amet consectetur. Nisi pellentesque urna volutpat magna vitae sit sagittis in dolor. In integer facilisi risus diam adipiscing pulvinar in id varius. Purus viverra blandit et vestibulum orci morbi. Neque pretium vitae justo nisl." },
      ];

      setStats(dummyStats);
      setTagihan(dummyTagihan.slice(0, 2));
      setKeluhan(dummyKeluhan.slice(0, 2));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleResolveKeluhan = async (id) => {
    console.log("Resolve keluhan ID:", id);
  };

  const handleRejectKeluhan = async (id) => {
    console.log("Reject keluhan ID:", id);
  };

  const columns = [
    {
      header: "Nama Penghuni",
      render: (row) => (
        <Link href={`/pemilik/penghuni`} className="underline text-gray-600 hover:text-gray-900 transition-colors">
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
      header: "Siklus Pembayaran",
      accessorKey: "siklus",
    },
    {
      header: "Jatuh Tempo",
      accessorKey: "jatuhTempo",
    },
    {
      header: "Status Pembayaran",
      render: (row) => (
        <span className={`px-2 py-1 text-xs font-medium border rounded-md ${getStatusPembayaranStyle(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: "Aksi",
      render: (row) => (
        <Link href={`/pemilik/billing`} className="underline text-sm text-[#1a1a1a] hover:text-gray-600 transition-colors">
          {row.status === "Menunggu" ? "Tagih" : "Lihat Bukti"}
        </Link>
      ),
    },
  ];

  return (
    <main className="flex flex-col px-10 py-6 w-full max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center gap-2">
          <CircleDollarSign className="w-6 h-6 text-[#1a1a1a] mb-2" strokeWidth={1.5} />
          <span className="text-sm font-medium text-[#515151]">Total tagihan belum bayar</span>
          <span className="text-2xl font-bold text-[#1a1a1a]">{stats.totalTagihan}</span>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center gap-2">
          <User className="w-6 h-6 text-[#1a1a1a] mb-2" strokeWidth={1.5} />
          <span className="text-sm font-medium text-[#515151]">Total Penghuni</span>
          <span className="text-2xl font-bold text-[#1a1a1a]">{stats.totalPenghuni}</span>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center gap-2">
          <Building className="w-6 h-6 text-[#1a1a1a] mb-2" strokeWidth={1.5} />
          <span className="text-sm font-medium text-[#515151]">Total Kamar & Tipe Kamar</span>
          <span className="text-2xl font-bold text-[#1a1a1a]">{stats.totalKamar} kamar - {stats.totalTipeKamar} tipe</span>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center gap-2">
          <Megaphone className="w-6 h-6 text-[#1a1a1a] mb-2" strokeWidth={1.5} />
          <span className="text-sm font-medium text-[#515151]">Total Keluhan</span>
          <span className="text-2xl font-bold text-[#1a1a1a]">{stats.totalKeluhan}</span>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Penghuni Belum Bayar Tagihan</h2>
        <div className="bg-white rounded-md mb-4">
          <ReusableTable columns={columns} data={tagihan} />
        </div>
        <Link href="/pemilik/billing" className="text-sm font-medium text-[#1a1a1a] underline hover:text-gray-600 transition-colors">
          Lihat selengkapnya
        </Link>
      </div>

      <div>
        <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Daftar Keluhan Penghuni</h2>
        <div className="flex flex-col mb-4">
          {keluhan.map((k) => (
            <KeluhanCard 
              key={k.id} 
              data={k} 
              onResolve={handleResolveKeluhan}
              onReject={handleRejectKeluhan}
            />
          ))}
        </div>
        <Link href="/pemilik/keluhan" className="text-sm font-medium text-[#1a1a1a] underline hover:text-gray-600 transition-colors">
          Lihat selengkapnya
        </Link>
      </div>
    </main>
  );
}