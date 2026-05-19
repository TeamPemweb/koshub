import { Button } from "@/components/ui/button";

export default function NotFound(){
    return(
        <>
        <div className="flex flex-col items-center justify-center min-h-screen gap-8">
            <img src="404.png" alt="404 Not Found" draggable={false} className="w-1/5 opacity-70" />

            <div className="flex flex-col text-center">
                <h1 className="font-extrabold text-6xl text-blue-normal">404</h1>
                <h2 className="font-semibold text-2xl">PAGE NOT FOUND</h2>
                <p className="mt-4">Halaman yang Anda cari tidak ditemukan!</p>
            </div>

            <Button type="button" variant="default" size="lg">Kembali ke Beranda</Button>
        </div>
        </>
    )
}