const mapFormValuesToBackend = (values) => {
  const normalizeKey = (str) =>
    str.replace(/\s+/g, "").replace(/^\w/, (c) => c.toUpperCase());

  // 1. Material mapping
  const material = {};
  values.materialTypes.forEach((item) => {
    material[normalizeKey(item.type)] = {
      costPerKg: Number(item.costPerKg),
      unit: item.unit,
    };
  });

  // 2. Lamination mapping
  const lamination = {};
  values.laminationRates.forEach((item) => {
    lamination[item.finishType.toLowerCase()] = {
      coldGlue: Number(item.coldGlueRate),
      thermal: Number(item.thermalRate),
      unit: item.unit,
    };
  });

  // 3. Finishing mapping
  const finishing = {};
  Object.entries(values.finishingRates).forEach(([key, val]) => {
    finishing[key] = {
      defaultRate: Number(val),
      unit: "INR/100 sq.inch (approx)", // Hardcoded as per backend structure
    };
  });

  // 4. Final payload
  return {
    material,
    printing: {
      cmyk: {
        ratePer1000Sheets: Number(values.cmykRate) * 100,
        unit: "INR/1000 sheets per color",
      },
      pantone: {
        ratePer1000Sheets: Number(values.pantoneRate) * 100,
        unit: "INR/1000 sheets per color",
      },
      minCharge: {
        thresholdSheets: Number(values.cmykMinSheets),
        minAmount: Number(values.pantoneMinAmount),
        unit: "INR",
      },
    },
    lamination,
    finishing,
    punching: {
      ratePerSheet: Number(values.punching.ratePerSheet),
      unit: "INR/sheet",
    },
    pasting: {
      sidePasting: Number(values.pastingRates.sidePasting),
      bottomPasting: Number(values.pastingRates.bottomPasting),
      taping: Number(values.pastingRates.taping),
      unit: "INR/box",
    },
    machine: {
      speed: Number(values.machineConfig.speed),
      costPerHour: Number(values.machineConfig.costPerHour),
      unit: {
        speed: "sheets/hour",
        cost: "INR/hour",
      },
    },
    dieCutting: {
      ratePerSheet: Number(values.dieCutting.ratePerSheet),
    },
  };
};
export default mapFormValuesToBackend;
