import OnboardingTemplate from "@/components/templates/OnboardingTemplate";

export default function TenantOnboarding(){
    return (
        <main>
            <OnboardingTemplate
            title="Halo Penghuni Kos!"
            caption="Isi data dirimu dibawah ini."
            children={
                <>
                
                </>
            }
            button="Lanjut"
            disabled={false}
            >
            </OnboardingTemplate>
        </main>
    );
}