import OnboardingTemplate from "@/components/templates/OnboardingTemplate";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";

export default function ForgotPassword(){
    return(
        <main>
            <OnboardingTemplate
            title="Lupa Password?"
            caption="Masukkan email kamu untuk mengkonfirmasi. Link pengubahan password akan diberikan"
            children={
                <div className="grid grid-cols gap-6 w-full text-left">
                    <Field orientation="vertical">
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <FieldContent>
                            <Input type="email" id="email" placeholder="Masukkan email Anda" required />
                        </FieldContent>
                    </Field>
                </div>
            }
            button="Kirim Link"
            disabled={false}
            >
            </OnboardingTemplate>
        </main>
    );
}
