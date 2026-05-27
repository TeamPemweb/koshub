import { Button } from "@/components/ui/button";

export default function OnboardingTemplate({ title, caption, children, button, disabled, onSubmit }) {
    return (
        <div className="flex flex-col items-center justify-center gap-16">
        <div className="flex flex-col items-center justify-center gap-4 w-full">
            <img src="/logo_brand.png" alt="logo" className="w-24" draggable="false" />
            <h1 className="text-4xl font-black text-black tracking-tight">{title}</h1>
            <p className="text-gray-500 font-medium">{caption}</p>
        </div>

        <div className="flex flex-col items-center justify-center w-full gap-8">
            {children}
            <Button
                type="button"
                variant="default"
                size="lg"
                disabled={disabled}
                onClick={onSubmit}
                className="w-full"
            >
                {button}
            </Button>
        </div>
        </div>
    );
}