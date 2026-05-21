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
                <div className="grid grid-cols gap-6 w-full text-left">
                    <Field orientation="vertical">
                        <FieldLabel htmlFor="firstName">Nama Lengkap</FieldLabel>
                        <FieldContent>
                            <Input type="text" id="firstName" placeholder="Masukkan nama lengkap Anda" />
                        </FieldContent>
                    </Field>

                    <Field orientation="vertical">
                        <FieldLabel htmlFor="phone">No. Telepon</FieldLabel>
                        <FieldContent>
                            <Input type="text" id="phone" placeholder="Masukkan nomor telepon aktif" />
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