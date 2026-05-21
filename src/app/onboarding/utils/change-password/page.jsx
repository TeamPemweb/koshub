import OnboardingTemplate from "@/components/templates/OnboardingTemplate";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";

export default function ChangePassword(){
    return(
        <main>
            <OnboardingTemplate
            title="Ubah Password"
            caption="Masukkan password baru dan konfirmasi password baru Anda"
            children={
                <div className="grid grid-cols gap-6 w-full text-left">
                    <Field orientation="vertical">
                        <FieldLabel htmlFor="passwordBaru">Masukkan Password Baru</FieldLabel>
                        <FieldContent>
                            <Input type="password" id="passwordBaru" placeholder="Masukkan password baru Anda" required />
                        </FieldContent>
                    </Field>

                    <Field orientation="vertical">
                        <FieldLabel htmlFor="konfirmasiPasswordBaru">Konfirmasi Password Baru</FieldLabel>
                        <FieldContent>
                            <Input type="password" id="konfirmasiPasswordBaru" placeholder="Masukkan password baru Anda" required />
                        </FieldContent>
                    </Field>
                </div>
            }
            button="Ubah Password"
            disabled={false}
            >
            </OnboardingTemplate>
        </main>
    );
}