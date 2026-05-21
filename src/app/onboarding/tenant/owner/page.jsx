import OnboardingTemplate from "@/components/templates/OnboardingTemplate";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";

export default function OwnerOnboarding(){
    return (
        <main>
            <OnboardingTemplate
            title="Halo Pemilik Kos!"
            caption="Isi data dirimu dibawah ini."
            children={
                <>
                <div className="grid grid-cols gap-6 w-full text-left">
                    <Field orientation="vertical">
                        <FieldLabel htmlFor="firstName">Nama Lengkap</FieldLabel>
                        <FieldContent>
                            <Input type="text" id="firstName" placeholder="Masukkan nama depan" />
                        </FieldContent>
                    </Field>

                    <Field orientation="vertical">
                        <FieldLabel htmlFor="location">Lokasi Kos</FieldLabel>
                        <FieldContent>
                            <Input type="text" id="location" placeholder="Masukkan lokasi kos" />
                        </FieldContent>
                    </Field>

                    <Field orientation="vertical">
                        <FieldLabel htmlFor="phone">No. Telepon</FieldLabel>
                        <FieldContent>
                            <Input type="text" id="phone" placeholder="Masukkan nomor telepon" />
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