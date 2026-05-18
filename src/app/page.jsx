import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen lg:flex-row justify-center items-center">
      
      <section>
        <div className="flex flex-col gap-1 ">
          <h1 className="text-5xl font-extrabold">Login</h1>
          <p className="text-lg">Silahkan login dengan akun KosHub</p>
        </div>

        <div>
          
        </div>

        <div className="flex flex-row gap-2">
          <p>Belum punya akun? Daftar</p>
        </div>

      </section>

      <section className="bg-black">
        <div></div>
      </section>

    </main>
  );
}