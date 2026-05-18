import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <main className="w-full min-h-screen lg:grid lg:grid-cols-2">
      
      <section className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col w-full max-w-[400px] gap-8">
          <div className="flex flex-col gap-2 text-center lg:text-center">
            <h1 className="text-4xl font-extrabold tracking-tight">Login</h1>
            <p className="text-muted-foreground">Masuk dengan akun KosHub Anda</p>
          </div>

          <form className="flex flex-col gap-5 w-full">
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" placeholder="Masukkan username" required />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Masukkan password" required />
            </div>

            <Button type="submit" className="w-full mt-2" size="lg">
              Login
            </Button>
          </form>

          <div className="flex justify-center text-sm lg:justify-start">
            <p className="text-muted-foreground">
              Belum punya akun?{" "}
              <a href="#" className="font-semibold text-primary hover:underline">
                Daftar di sini
              </a>
            </p>
          </div>
        </div>
      </section>


      <section className="hidden lg:block bg-muted relative">
        <img 
          src="/auth.png" 
          alt="Ilustrasi KosHub" 
          className="absolute inset-0 h-full w-full object-cover"
        />
      </section>

    </main>
  );
}