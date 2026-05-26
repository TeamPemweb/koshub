import OnboardingTemplate from "@/components/templates/OnboardingTemplate";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";

export default function TenantOnboarding(){
    return (
        <main>
            <OnboardingTemplate
            title="Data Diri"
            caption="Isi data dirimu dibawah ini."
            children={
                <>
                <div className="grid grid-cols gap-6 w-[150%] h-fit text-left">
                    <Field orientation="vertical">
                        <FieldLabel htmlFor="nama_lengkap">Nama Lengkap</FieldLabel>
                        <FieldContent>
                            <Input type="text" id="nama_lengkap" placeholder="Masukkan nama lengkap Anda" />
                        </FieldContent>
                    </Field>

                    <Field orientation="vertical">
                        <FieldLabel htmlFor="no_telp">No. Telepon</FieldLabel>
                        <FieldContent>
                            <Input type="text" id="no_telp" placeholder="Masukkan nomor telepon aktif" />
                        </FieldContent>
                    </Field>
                </div>
                </>
            }
            button="Lanjut"
            disabled={false}
            >
            </OnboardingTemplate>
        </main>
    );
}