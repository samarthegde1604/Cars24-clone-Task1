type MaintenanceTag = "Low Maintenance Expected" | "Medium Maintenance Expected" | "High Maintenance Expected";

export type MaintenanceInputs = {
  brand: string;
  model: string;
  ageYears: number;
  kmDriven: number;
};

export type MaintenanceResult = {
  tag: MaintenanceTag;
  monthlyCost: number;
  yearlyCost: number;
  insights: string[];
};

const brandBaseCost: Record<string, number> = {
  maruti: 900,
  suzuki: 900,
  hyundai: 1100,
  tata: 1200,
  mahindra: 1300,
  honda: 1250,
  toyota: 1400,
  kia: 1250,
  renault: 1200,
  volkswagen: 1700,
  skoda: 1750,
  ford: 1400,
  bmw: 4500,
  audi: 5000,
  mercedes: 5200,
};

function normalize(s: string) {
  return (s || "").trim().toLowerCase();
}

export function estimateMaintenance(inputs: MaintenanceInputs): MaintenanceResult {
  const brand = normalize(inputs.brand);
  const base = brandBaseCost[brand] ?? 1500; // default for unknown brand

  // multipliers
  const age = Math.max(0, inputs.ageYears);
  const km = Math.max(0, inputs.kmDriven);

  const ageMultiplier =
    age <= 2 ? 1.0 :
    age <= 5 ? 1.2 :
    age <= 8 ? 1.45 :
    1.7;

  const kmMultiplier =
    km < 30000 ? 1.0 :
    km < 60000 ? 1.15 :
    km < 90000 ? 1.35 :
    1.6;

  const monthlyCost = Math.round(base * ageMultiplier * kmMultiplier);

  // maintenance tag
  let tag: MaintenanceTag = "Low Maintenance Expected";
  if (age >= 6 || km >= 80000) tag = "Medium Maintenance Expected";
  if (age >= 8 || km >= 100000 || (age >= 6 && km >= 80000)) tag = "High Maintenance Expected";

  // insights
  const insights: string[] = [];

  // major service logic (simple heuristic)
  const nextMajorServiceKm = 10000 - (km % 10000);
  insights.push(`Next major service due in ${nextMajorServiceKm.toLocaleString()} km`);

  if (km >= 35000) insights.push("Brake pads likely to need replacement soon");
  if (km >= 45000) insights.push("Tire replacement expected in the near future");
  if (age >= 5) insights.push("Battery health should be checked (older than 5 years)");

  return {
    tag,
    monthlyCost,
    yearlyCost: monthlyCost * 12,
    insights,
  };
}