import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputGroupButton } from "@/components/ui/input-group";

export default function KelolaPenghuni(){
    return (
        <main className="flex flex-col px-10 py-2">
            <div className="flex flex-row gap-2 items-center">
                <Field orientation="horizontal" className="flex flex-row gap-0">
                    <Input type="search" placeholder="Cari nomor kamar...">
                    </Input>
                    <Button variant="default" size="default">Search</Button>
                </Field>
            </div>
        </main>
    );
}