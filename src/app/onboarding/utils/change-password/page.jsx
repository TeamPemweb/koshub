import OnboardingTemplate from "@/components/templates/OnboardingTemplate";

export default function ChangePassword(){
    return(
        <>
        <OnboardingTemplate
        title="Ubah Password"
        caption="Masukkan email kamu untuk mengkonfirmasi. Link pengubahan password akan diberikan"
        children={
            <>
            <Field>
                
            </Field>
            </>
        }
        >

        </OnboardingTemplate>
        </>
    );
}