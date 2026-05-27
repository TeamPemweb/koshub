"use client";

import { useState, useEffect } from "react";
import { DollarSign } from "lucide-react";
import Link from "next/link";

export default function PenghuniDashboard() {
  const [profileData, setProfileData] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [isLoadingRoom, setIsLoadingRoom] = useState(true);
  const [roomCode, setRoomCode] = useState("");
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);

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

  // Fetch room data
  const fetchRoom = async () => {
    setIsLoadingRoom(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/resident/my-room`, {
        credentials: "include"
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

  useEffect(() => {
    fetchRoom();
  }, []);

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
        // Reload seluruh halaman agar AppSidebar dan PenghuniDashboard memuat state terbaru (hasRoom = true)
        window.location.reload();
      } else {
        alert(data.message || "Kode kamar tidak valid atau gagal bergabung.");
      }
    } catch (error) {
      console.error("Gagal verifikasi kode:", error);
      alert("Terjadi kesalahan saat memproses permintaan.");
    } finally {
      setIsSubmittingCode(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === "Menunggu") {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-100 text-orange-600 rounded-md border border-orange-200 uppercase tracking-wider">
          Menunggu
        </span>
      );
    }
    if (status === "Lewat Tenggat") {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-600 rounded-md border border-red-200 uppercase tracking-wider">
          Lewat Tenggat
        </span>
      );
    }
    return null;
  };

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

          <div>
            <h2 className="text-lg font-bold mb-4">Tagihan Kamu</h2>
            <div className="flex flex-col gap-4">
              {/* Data tagihan masih dummy karena belum ada endpoint /resident/bills */}
              {[
                { id: 1, tanggal: "11/05/2026", nominal: "Rp1.000.000", status: "Menunggu" },
                { id: 2, tanggal: "11/05/2026", nominal: "Rp1.000.000", status: "Lewat Tenggat" }
              ].map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-col gap-3">
                    <div className="font-bold text-lg">{item.tanggal}</div>
                    <div className="flex items-center gap-2 text-[#435663] font-semibold">
                      <div className="w-5 h-5 rounded-full border-2 border-[#435663] flex items-center justify-center">
                        <DollarSign className="w-3 h-3" strokeWidth={3} />
                      </div>
                      {item.nominal}
                    </div>
                    <div>
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                  
                  <div>
                    <button className="px-6 py-2.5 bg-[#435663] hover:bg-[#3c4d59] text-white text-sm font-medium rounded-md transition-colors">
                      Upload bukti pembayaran
                    </button>
                  </div>
                </div>
              ))}
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
            <div className="flex w-full gap-2">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Masukkan kode yang diberikan"
                className="flex-1 border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#435663]/20 focus:border-[#435663] transition-colors"
                required
              />
              <button
                type="submit"
                disabled={isSubmittingCode}
                className="bg-[#435663] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#3c4d59] transition-colors disabled:opacity-50"
              >
                {isSubmittingCode ? "..." : "Cek"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
