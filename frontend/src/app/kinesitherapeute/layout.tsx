import { RoleStepper } from "@/components/role-stepper";
import { ROLES } from "@/lib/roles";

const role = ROLES.find((r) => r.id === "kinesitherapeute")!;

export default function KinesitherapeuteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-72 shrink-0 flex-col border-r border-border/50 bg-white/70 backdrop-blur lg:flex">
        <div className="sticky top-0 flex h-screen flex-col">
          <RoleStepper role={role} />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <RoleStepper role={role} />
        {children}
      </div>
    </div>
  );
}
