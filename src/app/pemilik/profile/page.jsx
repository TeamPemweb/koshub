"use client"

import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    kosName: "",
    kosLocation: "",
    ownerName: "",
    email: "",
    phone: "",
    logoUrl: ""
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfileData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        credentials: "include"
      });
      
      if (res.ok) {
        const data = await res.json();
        setProfileData({
          kosName: data.nama_kos || "Nama Kos Belum Diatur",
          kosLocation: data.lokasi_kos || "Lokasi Belum Diatur",
          ownerName: data.nama || "Nama Belum Diatur",
          email: data.email || "",
          phone: data.nomor_telepon || "Nomor Belum Diatur",
          logoUrl: ""
        });
      } else {
        console.error("Gagal mengambil data profil");
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleEditKos = () => {
    router.push("/pemilik/profile/edit");
  };

  const handleLogout = async () => {
    try {
      // Panggil endpoint logout backend (opsional, jika ada)
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include"
      }).catch(e => console.error(e));

      // Hapus session NextAuth di frontend
      const { signOut } = await import("next-auth/react");
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error(error);
    }
  };

  const handleForgotPassword = () => {
    router.push("/onboarding/utils/forgot-password");
  };

  const handleDeleteAccount = async () => {
    if (isConfirmed) {
      try {
        router.push("/");
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (isLoading) {
    return (
      <main className="flex flex-col px-10 py-6 w-full max-w-5xl">
        <div className="animate-pulse flex flex-col gap-8">
          <div className="h-8 bg-gray-200 rounded w-32"></div>
          <div className="h-40 bg-gray-200 rounded-2xl w-full"></div>
          <div className="h-64 bg-gray-200 rounded-xl w-full"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col px-10 py-6 w-full">
      <div className="bg-[#435663] rounded-2xl p-8 flex items-center justify-between mb-8 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
            {profileData.logoUrl ? (
              <img src={profileData.logoUrl} alt="Logo Kos" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center text-[#435663]">
                <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-[10px] font-bold tracking-widest">COMPANY</span>
                <span className="text-[6px] tracking-widest">BUSINESS</span>
              </div>
            )}
          </div>
          <div className="flex flex-col text-white">
            <h2 className="text-2xl font-bold">{profileData.ownerName}</h2>
            <p className="text-sm text-gray-200 mt-1">{profileData.kosName} • {profileData.kosLocation}</p>
          </div>
        </div>
        <button 
          onClick={handleEditKos}
          className="cursor-pointer text-white hover:text-gray-200 transition-colors"
        >
          <Pencil className="w-6 h-6" strokeWidth={1.5} />
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
        <h3 className="text-xl font-bold text-[#1a1a1a] mb-8">Detail Profile</h3>
        
        <div className="flex flex-col gap-6">
          <div>
            <span className="block text-sm font-semibold text-[#515151] mb-1">Nama Pemilik</span>
            <span className="block text-base text-[#1a1a1a]">{profileData.ownerName}</span>
          </div>
          
          <div>
            <span className="block text-sm font-semibold text-[#515151] mb-1">Email</span>
            <span className="block text-base text-[#1a1a1a]">{profileData.email}</span>
          </div>
          
          <div>
            <span className="block text-sm font-semibold text-[#515151] mb-1">Nomor Telepon</span>
            <span className="block text-base text-[#1a1a1a]">{profileData.phone}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={handleLogout}
          className="px-6 py-2.5 text-sm font-medium text-[#1a1a1a] bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Log Out
        </button>
        <button 
          onClick={handleForgotPassword}
          className="px-6 py-2.5 text-sm font-medium text-[#1a1a1a] bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Lupa Password?
        </button>
        <button 
          onClick={handleDeleteAccount}
          className="px-6 py-2.5 text-sm font-medium text-white bg-[#ef4444] rounded-md hover:bg-[#dc2626] transition-colors"
        >
          Hapus Akun
        </button>
      </div>
    </main>
  );
}