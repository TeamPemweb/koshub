"use client";

import { useState, useEffect } from "react";
import { CircleDollarSign } from "lucide-react";

export default function BillingPenghuni() {
  const [activeBillings, setActiveBillings] = useState([]);
  const [historyBillings, setHistoryBillings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasRoom, setHasRoom] = useState(true);
  const [roomData, setRoomData] = useState(null);
  const [profileData, setProfileData] = useState(null);

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
      setRoomData(dataRoom);

      // Fetch Profile
      const resProfile = await fetch(`${apiUrl}/auth/profile`, { credentials: "include" });
      if (resProfile.ok) {
        setProfileData(await resProfile.json());
      }
      const resActive = await fetch(`${apiUrl}/resident/my-billings?t=${Date.now()}`, {
        credentials: "include",
        cache: "no-store"
      });
      
      const resHistory = await fetch(`${apiUrl}/resident/my-billings/history?t=${Date.now()}`, {
        credentials: "include",
        cache: "no-store"
      });
      
      if (resActive.ok) {
        const data = await resActive.json();
        setActiveBillings(Array.isArray(data) ? data : (data?.data || []));
      } else {
        console.error("Gagal mengambil daftar tagihan");
      }

      if (resHistory.ok) {
        const data = await resHistory.json();
        setHistoryBillings(Array.isArray(data) ? data : (data?.data || []));
      } else {
        console.error("Gagal mengambil riwayat tagihan");
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

  const handlePayBilling = async (id) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      await fetch(`${apiUrl}/resident/my-billings/${id}/pay`, {
        method: "POST",
        credentials: "include"
      });
      fetchBillings();
    } catch (error) {
      console.error("Gagal update status pembayaran:", error);
    }
  };



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
        {isHistory ? (
          <></>
        ) : (
          <a 
            href={`https://wa.me/${(roomData?.TipeKamar?.Pemilik?.NomorTelepon || "6285362310682").replace(/^0/, '62').replace(/\D/g, '')}?text=${encodeURIComponent(`Halo! Saya, ${profileData?.nama || 'Penghuni'} dengan nomor kamar ${roomData?.NomorKamar || '-'}, ingin memberikan bukti pembayaran untuk tagihan bulan ini.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handlePayBilling(data.id)}
            className="px-6 py-2.5 bg-[#435663] text-white text-sm font-medium rounded-lg hover:bg-[#3c4d59] transition-colors inline-block"
          >
            Upload bukti pembayaran
          </a>
        )}
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
    <main className="flex flex-col px-10 mb-10 w-full text-[#1a1a1a]">
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
