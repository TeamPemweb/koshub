"use client";

import { useState, useEffect } from "react";
import { CircleDollarSign, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function PenghuniDashboard() {
  const [profileData, setProfileData] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [isLoadingRoom, setIsLoadingRoom] = useState(true);
  const [roomCode, setRoomCode] = useState("");
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);
  const [errorCode, setErrorCode] = useState("");

  // Fetch real profile name
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${apiUrl}/auth/profile`, {
          credentials: "include"
        });
        if (res.ok) {
          const data = await res.json();
          setProfileData(data);
        }
      } catch (error) {
        console.error("Gagal mengambil profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const [billingsData, setBillingsData] = useState([]);
  const [isLoadingBillings, setIsLoadingBillings] = useState(true);

  const fetchRoom = async () => {
    setIsLoadingRoom(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/resident/my-room?t=${Date.now()}`, {
        credentials: "include",
        cache: "no-store"
      });
      if (res.ok) {
        const data = await res.json();
        // Cek jika data valid dan memiliki ID
        if (data && data.ID) {
          setRoomData(data);
        } else {
          setRoomData(null);
        }
      } else {
        setRoomData(null);
      }
    } catch (error) {
      console.error("Gagal mengambil data kamar:", error);
      setRoomData(null);
    } finally {
      setIsLoadingRoom(false);
    }
  };

  // Fetch billings data
  const fetchBillings = async () => {
    setIsLoadingBillings(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/resident/my-billings?t=${Date.now()}`, {
        credentials: "include",
        cache: "no-store"
      });
      if (res.ok) {
        const data = await res.json();
        setBillingsData(Array.isArray(data) ? data : (data?.data || []));
      } else {
        setBillingsData([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data tagihan:", error);
      setBillingsData([]);
    } finally {
      setIsLoadingBillings(false);
    }
  };

  useEffect(() => {
    fetchRoom();
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

  const handleCheckCode = async (e) => {
    e.preventDefault();
    if (!roomCode.trim()) return;
    
    setIsSubmittingCode(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/resident/rooms/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ kode_kamar: roomCode.trim() })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setErrorCode("");
        window.location.reload();
      } else {
        setErrorCode(data.message || "Kode tidak sesuai.");
      }
    } catch (error) {
      console.error("Gagal verifikasi kode:", error);
      setErrorCode("Terjadi kesalahan saat memproses permintaan.");
    } finally {
      setIsSubmittingCode(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : "";
    if (s === "menunggu") {
      return (
        <span className="px-3 py-1 text-[11px] font-medium bg-orange-100 text-orange-600 rounded-full border border-orange-200">
          Menunggu
        </span>
      );
    }
    if (s === "lewat tenggat" || s === "terlambat") {
      return (
        <span className="px-3 py-1 text-[11px] font-medium bg-red-100 text-red-600 rounded-full border border-red-200">
          Lewat Tenggat
        </span>
      );
    }
    if (s === "lunas") {
      return (
        <span className="px-3 py-1 text-[11px] font-medium bg-green-100 text-green-600 rounded-full border border-green-200">
          Lunas
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-[11px] font-medium bg-gray-100 text-gray-600 rounded-full border border-gray-200">
        {status}
      </span>
    );
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

  const activeBillings = billingsData.filter(b => b.status_pembayaran?.toLowerCase() !== "lunas");

  return (
    <main className="flex flex-col px-10 w-full font-sans text-[#1a1a1a] min-h-full">
      {isLoadingRoom ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Memuat data kamar...</p>
        </div>
      ) : roomData ? (
        // STATE: KAMAR TERSEDIA
        <>
          <div className="mb-10">
            <h2 className="text-lg font-bold mb-4">Detail Kamar Kamu</h2>
            <div className="bg-[#f0f2f5] rounded-xl p-6 shadow-sm border border-gray-100 w-full">
              <h3 className="text-[#435663] font-bold text-lg">Kamar No. {roomData.NomorKamar || "..."}</h3>
              <p className="text-[#64748b] text-sm font-medium mt-1">
                Tipe {roomData.TipeKamar?.NamaTipe || "..."}
              </p>
              <div className="text-[#435663] font-bold text-2xl mt-6">
                Rp{(roomData.TipeKamar?.HargaPerBulan || 0).toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          <div className="mb-10 w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Tagihan Kamu</h2>
              <Link href="/penghuni/billing" className="text-sm font-medium text-[#435663] hover:underline">
                Lihat Semua
              </Link>
            </div>
            
            <div className="flex flex-col gap-4">
              {isLoadingBillings ? (
                <div className="text-gray-500 text-sm">Memuat tagihan...</div>
              ) : activeBillings.length === 0 ? (
                <div className="text-gray-500 italic text-sm">Tidak ada tagihan aktif.</div>
              ) : (
                activeBillings.slice(0, 3).map((item) => (
                  <div key={item.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-4">
                      <div className="font-bold text-lg">{formatDate(item.jatuh_tempo)}</div>
                      <div className="flex items-center gap-2 text-sm text-[#1a1a1a] font-medium">
                        <CircleDollarSign className="w-5 h-5 text-gray-800" strokeWidth={2} />
                        {formatRupiah(item.nominal)}
                      </div>
                      <div className="flex items-center">
                        {getStatusBadge(item.status_pembayaran)}
                      </div>
                    </div>
                    
                    <div>
                      <a 
                        href={`https://wa.me/${(roomData?.TipeKamar?.Pemilik?.NomorTelepon || "6285362310682").replace(/^0/, '62').replace(/\D/g, '')}?text=${encodeURIComponent(`Halo! Saya, ${profileData?.nama || 'Penghuni'} dengan nomor kamar ${roomData?.NomorKamar || '-'}, ingin memberikan bukti pembayaran untuk tagihan bulan ini.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handlePayBilling(item.id)}
                        className="px-6 py-2.5 bg-[#435663] hover:bg-[#3c4d59] text-white text-sm font-medium rounded-lg transition-colors inline-block"
                      >
                        Upload bukti pembayaran
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center pb-20">
          <img 
            src="/404.png" 
            alt="Ilustrasi belum ada kamar" 
            className="w-64 h-auto object-contain mb-6 opacity-80"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          
          <h2 className="text-xl font-bold text-[#1a1a1a] mb-2 text-center">
            Kamu belum masuk ke kamar.
          </h2>
          <p className="text-sm text-gray-500 mb-8 text-center max-w-sm">
            Tanyakan kode kamar ke pemilik kos kamu untuk menggunakan fitur KosHub.
          </p>

          <form onSubmit={handleCheckCode} className="flex flex-col items-start w-full max-w-[320px]">
            <label className="text-xs font-semibold mb-1.5 text-[#1a1a1a]">Kode</label>
            <div className="flex w-full gap-2 mb-4">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value);
                  setErrorCode("");
                }}
                placeholder="Masukkan kode yang diberikan"
                className="flex-1 border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#435663]/20 focus:border-[#435663] transition-colors"
                required
              />
              <button
                type="submit"
                disabled={isSubmittingCode || !roomCode.trim()}
                className="bg-[#435663] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#3c4d59] transition-colors disabled:opacity-50"
              >
                {isSubmittingCode ? "..." : "Cek"}
              </button>
            </div>
            
            {errorCode && (
              <div className="w-full flex items-center justify-center gap-2 border border-red-100 rounded-xl py-3 px-4">
                <AlertTriangle className="w-5 h-5 text-red-500" strokeWidth={2.5} />
                <span className="text-[14px] text-red-500 font-medium">{errorCode}</span>
              </div>
            )}
          </form>
        </div>
      )}
    </main>
  );
}
