"use client";

import { useState, useEffect } from "react";

export default function KeluhanPenghuni() {
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/resident/my-complaints?t=${Date.now()}`, {
        credentials: "include",
        cache: "no-store"
      });
      
      if (res.ok) {
        const data = await res.json();
        // Fallback to empty array if response is null or not an array
        setComplaints(Array.isArray(data) ? data : (data?.data || []));
      } else {
        console.error("Gagal mengambil riwayat keluhan");
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComplaint.trim()) return;
    
    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/resident/my-complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isi_keluhan: newComplaint })
      });
      
      if (res.ok) {
        setNewComplaint(""); // Reset input field
        fetchComplaints(); // Refresh list immediately after posting
      } else {
        console.error("Gagal mengirim keluhan");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col px-10 w-full text-[#1a1a1a]">
      <div className="mb-10 w-full">
        <label className="block text-sm font-semibold text-gray-800 mb-2">Tulis keluhan Anda disini</label>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input 
            type="text" 
            value={newComplaint}
            onChange={(e) => setNewComplaint(e.target.value)}
            placeholder="Keran air kos saya bocor..."
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#435663]/30 text-sm"
          />
          <button 
            type="submit" 
            disabled={isSubmitting || !newComplaint.trim()}
            className="px-8 py-2.5 bg-[#435663] text-white text-sm font-medium rounded-lg hover:bg-[#3c4d59] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Mengirim..." : "Kirim"}
          </button>
        </form>
      </div>

      <div className="w-full max-w-4xl">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Riwayat Keluhan</h2>
        
        {isLoading ? (
          <div className="text-gray-500 text-sm">Memuat riwayat keluhan...</div>
        ) : complaints.length === 0 ? (
          <div className="text-gray-500 italic text-sm">Belum ada keluhan yang diajukan.</div>
        ) : (
          <div className="space-y-4">
            {complaints.map((item, index) => (
              <div key={item.id || item.ID || index} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm flex items-start gap-6">
                <div className="text-lg font-bold text-[#435663] pt-1">
                  #{item.id || item.ID || (index + 1)}
                </div>
                
                <div className="flex-1">
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 font-medium mb-0.5">
                      {item.nomor_kamar ? `Kamar ${item.nomor_kamar}` : "Informasi Kamar"}
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {item.nama_penghuni || item.penghuni?.nama || item.User?.nama || "Anda"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-1">Keluhan</div>
                    <div className="text-sm text-gray-800 leading-relaxed">
                      {item.isi_keluhan}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
