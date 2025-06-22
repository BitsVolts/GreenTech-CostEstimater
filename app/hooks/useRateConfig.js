import { useEffect, useState } from "react";

const userateConfigInitialValues = () => {
  const [rateConfigInitialValues, setRateConfigInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchrateConfigInitialValues = async () => {
    try {
      const res = await fetch(
        "https://greentech-api.bitsandvolts.in/api/get-rates"
      );
      if (!res.ok)
        throw new Error(`Failed to fetch rate config: ${res.status}`);
      const data = await res.json();
      console.log(data);

      // Format the backend data
      const formattedData = {
        materialTypes: Object.entries(data.material).map(([type, details]) => ({
          type: formatMaterialName(type),
          costPerKg: details.costPerKg.toString(),
          unit: details.unit,
        })),
        cmykRate: (data.printing.cmyk.ratePer1000Sheets / 100).toString(),
        cmykMinSheets: data.printing.minCharge.thresholdSheets.toString(),
        pantoneRate: (data.printing.pantone.ratePer1000Sheets / 100).toString(),
        pantoneMinAmount: data.printing.minCharge.minAmount.toString(),
        laminationRates: Object.entries(data.lamination).map(
          ([finishType, rates]) => ({
            finishType: capitalize(finishType),
            coldGlueRate: rates.coldGlue.toString(),
            thermalRate: rates.thermal.toString(),
            unit: rates.unit,
          })
        ),
        finishingRates: Object.fromEntries(
          Object.entries(data.finishing).map(([key, val]) => [
            key,
            val.defaultRate.toString(),
          ])
        ),
        punching: {
          ratePerSheet: data.punching.ratePerSheet.toString(),
        },

        dieCutting: {
          ratePerSheet: data.dieCutting.ratePerSheet.toString(),
        },
        pastingRates: {
          sidePasting: data.pasting.sidePasting.toString(),
          bottomPasting: data.pasting.bottomPasting.toString(),
          taping: data.pasting.taping.toString(),
        },
        machineConfig: {
          speed: data.machine.speed.toString(),
          costPerHour: data.machine.costPerHour.toString(),
        },
      };

      setRateConfigInitialValues(formattedData);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching rate config:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load on mount
  useEffect(() => {
    fetchrateConfigInitialValues();
  }, []);

  return { rateConfigInitialValues, loading, error };
};

// Helper functions
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const formatMaterialName = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();

export default userateConfigInitialValues;
