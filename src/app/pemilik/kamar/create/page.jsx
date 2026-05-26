"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, Check, MoreVertical, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TambahKamarPage() {
  const router = useRouter();
  const dropdownRef = useRef(null);

  const [nomorKamar, setNomorKamar] = useState("");
  const [selectedTipe, setSelectedTipe] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [tipeKamarList, setTipeKamarList] = useState([
    { id: 1, name: "Reguler" },
    { id: 2, name: "Premium" },
    { id: 3, name: "Deluxe" },
    { id: 4, name: "Elite" },
    { id: 5, name: "Penthouse" },
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nomorKamar || !selectedTipe) return;

    setIsLoading(true);

    const payload = {
      nomorKamar: nomorKamar,
      tipeKamarId: selectedTipe.id,
    };

    try {
      const response = await fetch("/api/kamar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push("/kamar");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] w-full font-sans text-[#1a1a1a]">
      <main className="px-8 max-w-3xl">
        <button 
          onClick={() => router.back()} 
          className="flex items-center cursor-pointer gap-2 text-sm font-medium mb-8 hover:text-gray-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="nomorKamar" className="block text-sm font-medium text-[#1a1a1a]">
              Nomor kamar
            </label>
            <input
              id="nomorKamar"
              type="text"
              value={nomorKamar}
              onChange={(e) => setNomorKamar(e.target.value)}
              placeholder="Masukkan nomor kamar"
              className="w-full max-w-md px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#435663]/20 focus:border-[#435663] transition-all bg-white text-sm"
              required
            />
          </div>

          <div className="space-y-2 relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-[#1a1a1a]">
              Tipe Kamar
            </label>
            
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full max-w-md px-4 py-2.5 border border-gray-200 rounded-lg bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <span className={`text-sm ${selectedTipe ? "text-[#1a1a1a]" : "text-gray-400"}`}>
                {selectedTipe ? selectedTipe.name : "Luxury"}
              </span>
            </div>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full max-w-md mt-2 bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden py-2">
                <div className="px-4 py-2">
                  <span className="text-xs font-semibold text-[#1a1a1a] tracking-wider">
                    Tipe Kamar
                  </span>
                </div>
                
                <div className="max-h-60 overflow-y-auto">
                  {tipeKamarList.map((tipe) => (
                    <div
                      key={tipe.id}
                      onClick={() => {
                        setSelectedTipe(tipe);
                        setIsDropdownOpen(false);
                      }}
                      className={`flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm transition-colors ${
                        selectedTipe?.id === tipe.id 
                          ? "bg-[#f5f6f8] text-[#1a1a1a]" 
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 flex items-center justify-center">
                          {selectedTipe?.id === tipe.id && (
                            <Check className="w-4 h-4 text-[#1a1a1a]" />
                          )}
                        </div>
                        <span>{tipe.name}</span>
                      </div>
                      <button 
                        type="button" 
                        className="text-gray-400 hover:text-gray-600 p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 mt-2 pt-2">
                  <div className="px-4 py-2">
                    <span className="text-xs font-semibold text-[#1a1a1a] tracking-wider">
                      Pengaturan
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[#435663] hover:bg-gray-50 transition-colors text-left font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Tipe Kamar
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-normal hover:bg-blue-normal-hover cursor-pointer text-white px-5 py-2.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tambah Kamar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}