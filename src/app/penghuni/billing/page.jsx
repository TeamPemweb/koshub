"use client";

import { useState, useEffect } from "react";
import { CircleDollarSign } from "lucide-react";

export default function BillingPenghuni() {
  const [billings, setBillings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasRoom, setHasRoom] = useState(true);

  const fetchBillings = async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      
      // Check room first
      const resRoom = await fetch(`${apiUrl}/resident/my-room?t=${Date.now()}`, {
        credentials: "include",
        cache: "no-store"
      });
      if (!resRoom.ok) {
        setHasRoom(false);
        setIsLoading(false);
        return;
      }
      const dataRoom = await resRoom.json();
      if (!dataRoom || Object.keys(dataRoom).length === 0 || !dataRoom.ID) {
        setHasRoom(false);
        setIsLoading(false);
        return;
      }
      const res = await fetch(`${apiUrl}/resident/my-billings?t=${Date.now()}`, {
        credentials: "include",
        cache: "no-store"
      });
      
      if (res.ok) {
        const data = await res.json();
        setBillings(Array.isArray(data) ? data : (data?.data || []));
      } else {
        console.error("Gagal mengambil daftar tagihan");
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBillings();
  }, []);

  const activeBillings = billings.filter(b => b.status_pembayaran?.toLowerCase() !== "lunas");
  const historyBillings = billings.filter(b => b.status_pembayaran?.toLowerCase() === "lunas");

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(number);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : "";
    if (s === "menunggu") {
      return <span className="px-3 py-1 text-[11px] font-medium bg-orange-100 text-orange-600 rounded-full border border-orange-200">Menunggu</span>;
    }
    if (s === "lewat tenggat" || s === "terlambat") {
      return <span className="px-3 py-1 text-[11px] font-medium bg-red-100 text-red-600 rounded-full border border-red-200">Lewat Tenggat</span>;
    }
    if (s === "lunas") {
      return <span className="px-3 py-1 text-[11px] font-medium bg-green-100 text-green-600 rounded-full border border-green-200">Lunas</span>;
    }
    return <span className="px-3 py-1 text-[11px] font-medium bg-gray-100 text-gray-600 rounded-full border border-gray-200">{status}</span>;
  };

  const BillingCard = ({ data, isHistory }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-row items-center justify-between shadow-sm mb-4">
      <div className="flex flex-col gap-4">
        <div className="text-lg font-bold text-[#1a1a1a]">
          {formatDate(data.jatuh_tempo)}
        </div>
        <div className="flex items-center gap-2 text-sm text-[#1a1a1a] font-medium">
          <CircleDollarSign className="w-5 h-5 text-gray-800" strokeWidth={2} />
          {formatRupiah(data.nominal)}
        </div>
        <div className="flex items-center">
          {getStatusBadge(data.status_pembayaran)}
        </div>
      </div>
      <div>
        <button className="px-6 py-2.5 bg-[#435663] text-white text-sm font-medium rounded-lg hover:bg-[#3c4d59] transition-colors">
          {isHistory ? "Lihat bukti pembayaran" : "Upload bukti pembayaran"}
        </button>
      </div>
    </div>
  );

  if (!hasRoom && !isLoading) {
    return (
      <main className="flex flex-col items-center justify-center px-10 py-20 w-full text-[#1a1a1a] h-full">
        <h2 className="text-xl font-bold mb-2">Akses Ditolak</h2>
        <p className="text-sm text-gray-500">Kamu belum masuk ke kamar. Silakan ke halaman Home untuk memasukkan kode kamar.</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col px-10 w-full text-[#1a1a1a]">
      <div className="mb-10 w-full max-w-5xl">
        <h2 className="text-base font-bold text-gray-900 mb-4">Tagihan Kamu</h2>
        {isLoading ? (
          <div className="text-gray-500 text-sm">Memuat tagihan...</div>
        ) : activeBillings.length === 0 ? (
          <div className="text-gray-500 italic text-sm">Tidak ada tagihan aktif.</div>
        ) : (
          <div className="flex flex-col">
            {activeBillings.map(b => <BillingCard key={b.id} data={b} isHistory={false} />)}
          </div>
        )}
      </div>

      <div className="w-full max-w-5xl">
        <h2 className="text-base font-bold text-gray-900 mb-4">Riwayat Tagihan</h2>
        {isLoading ? (
          <div className="text-gray-500 text-sm">Memuat riwayat...</div>
        ) : historyBillings.length === 0 ? (
          <div className="text-gray-500 italic text-sm">Belum ada riwayat pembayaran.</div>
        ) : (
          <div className="flex flex-col">
            {historyBillings.map(b => <BillingCard key={b.id} data={b} isHistory={true} />)}
          </div>
        )}
      </div>
    </main>
  );
}
