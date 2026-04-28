"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function PatientSelectorClient({
  patientCodes,
  selectedPatient,
}: {
  patientCodes: string[];
  selectedPatient: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(code: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (code) {
      params.set("patient", code);
    } else {
      params.delete("patient");
    }
    router.push(`?${params.toString()}`);
  }

  return (
    <select
      value={selectedPatient}
      onChange={(e) => handleChange(e.target.value)}
      className="h-9 rounded-md border border-input bg-white px-3 text-sm min-w-[200px]"
    >
      <option value="">— Sélectionner un patient —</option>
      {patientCodes.map((code) => (
        <option key={code} value={code}>
          {code}
        </option>
      ))}
    </select>
  );
}
