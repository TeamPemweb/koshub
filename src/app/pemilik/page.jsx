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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      
      const [resProfile, resUnpaid, resComplaints, resRooms, resRoomTypes] = await Promise.all([
        fetch(`${apiUrl}/auth/profile`, { credentials: "include", cache: "no-store" }),
        fetch(`${apiUrl}/owner/dashboard/unpaid-residents`, { credentials: "include", cache: "no-store" }),
        fetch(`${apiUrl}/owner/complaints`, { credentials: "include", cache: "no-store" }).catch(() => null),
        fetch(`${apiUrl}/owner/rooms`, { credentials: "include", cache: "no-store" }),
        fetch(`${apiUrl}/owner/room-types`, { credentials: "include", cache: "no-store" })
      ]);

      const profileData = resProfile.ok ? await resProfile.json() : {};
      const unpaidData = resUnpaid.ok ? await resUnpaid.json() : [];
      let complaintsData = [];
      if (resComplaints && resComplaints.ok) {
        try { complaintsData = await resComplaints.json(); } catch(e) {}
      }
      const roomsData = resRooms.ok ? await resRooms.json() : [];
      const roomTypesData = resRoomTypes.ok ? await resRoomTypes.json() : [];

      const statsProfile = profileData.stats || {};
      
      setStats({
        totalTagihan: Array.isArray(unpaidData) ? unpaidData.length : 0,
        totalPenghuni: statsProfile.total_kamar_terisi || 0,
        totalKamar: Array.isArray(roomsData) ? roomsData.length : 0,
        totalTipeKamar: Array.isArray(roomTypesData) ? roomTypesData.length : 0,
        totalKeluhan: statsProfile.total_komplain_pending || 0,
      });

      // format tagihan (max 5)
      const mappedTagihan = (Array.isArray(unpaidData) ? unpaidData : []).slice(0, 5).map(b => {
        const formattedNominal = `Rp ${(b.nominal || 0).toLocaleString('id-ID')}`;
        const dateObj = new Date(b.jatuh_tempo);
        const formattedDate = !isNaN(dateObj) 
          ? `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}` 
          : "-";
        
        const statusMap = {
          "menunggu": "Menunggu",
          "lewat tenggat": "Lewat Tenggat",
          "lunas": "Lunas",
          "belum bayar": "Belum Bayar"
        };

        return {
          id: b.billing_id,
          nama: b.nama_penghuni,
          kamar: b.nomor_kamar,
          tipe: b.nama_tipe || "-", 
          nominal: formattedNominal,
          siklus: "-", 
          jatuhTempo: formattedDate,
          status: statusMap[b.status_pembayaran?.toLowerCase()] || "Menunggu"
        };
      });
      setTagihan(mappedTagihan);

      // format keluhan (max 5)
      const mappedKeluhan = (Array.isArray(complaintsData) ? complaintsData : []).slice(0, 5).map((item, index) => ({
        id: item.ID || item.id,
        no: item.ID || item.id || (index + 1),
        kamar: item.nomor_kamar || item.kamar?.nomor_kamar || "XX",
        nama: item.nama_penghuni || item.penghuni?.nama || item.User?.nama || "Penghuni",
        teks: item.isi_keluhan
      }));
      setKeluhan(mappedKeluhan);

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
    <main className="flex flex-col px-10 w-full">
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