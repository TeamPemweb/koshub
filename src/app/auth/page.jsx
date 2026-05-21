import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";

export default function SignUp() {
    return (
        <main className="w-full h-screen overflow-hidden lg:grid lg:grid-cols-2">
            <section className="hidden lg:block relative p-4 lg:p-6 bg-background">
                <div className="relative h-full w-full overflow-hidden rounded-[2rem]">
                    <img
                        src="/auth.png"
                        alt="Ilustrasi KosHub"
                        className="absolute inset-0 h-full w-full object-cover"
                        draggable="false"
                    />
                    <div className="absolute inset-0 bg-black/10"></div>

                    <img src="/logo_white.png" alt="Logo KosHub" className="absolute top-16 left-12" draggable="false" />

                    <div className="absolute bottom-16 left-12 right-12 z-10 text-right tracking-wider">
                        <p className="text-white text-5xl font-bold mb-4 drop-shadow-lg">Selamat Datang!</p>
                        <p className="text-white text-xl drop-shadow-lg font-medium">Pantau pembayaran, kelola penghuni, dan optimalkan operasional kos</p>
                    </div>
                </div>
            </section>

            <section className="flex items-center justify-center h-full overflow-y-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col w-full max-w-[400px] gap-8 py-10">
                    <div className="flex flex-col gap-2 text-center lg:text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight">Sign Up</h1>
                        <p className="text-muted-foreground">Daftar dengan akun KosHub</p>
                    </div>

                    <form className="flex flex-col gap-5 w-full">

                        <Field orientation="vertical">
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <FieldContent>
                                <Input type="email" id="email" placeholder="Masukkan email Anda" required />
                            </FieldContent>
                        </Field>

                        <Field orientation="vertical">
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <FieldContent>
                                <Input type="password" id="password" placeholder="Masukkan password Anda" required />
                            </FieldContent>
                        </Field>

                        <Field orientation="vertical">
                            <FieldLabel htmlFor="konfirmasiPassword">Konfirmasi Password</FieldLabel>
                            <FieldContent>
                                <Input type="password" id="konfirmasiPassword" placeholder="Masukkan password Anda" required />
                            </FieldContent>
                        </Field>

                        <Button type="submit" className="w-full mt-2" size="lg">
                            Daftar
                        </Button>
                    </form>

                    <div className="flex justify-center text-sm">
                        <p className="text-muted-foreground">
                            Sudah punya akun?{" "}
                            <a href="#" className="font-semibold text-primary hover:underline">
                                Login di sini
                            </a>
                        </p>
                    </div>
                </div>
            </section>

        </main>
    );
}
