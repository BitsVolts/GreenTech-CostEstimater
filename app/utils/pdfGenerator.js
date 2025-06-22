import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const generatePDF = (costData) => {
  const doc = new jsPDF();
  const round = (val) => Number(val).toFixed(2);

  const breakdown = costData.breakdown || {};

  doc.setFontSize(18);
  doc.text("Cost Estimation Report", 14, 20);

  const tableBody = Object.entries(breakdown).map(([key, value]) => [
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase()),
    `Rs ${round(value)}`
  ]);

  autoTable(doc, {
    head: [["Component", "Cost"]],
    body: tableBody,
    startY: 30,
  });

  autoTable(doc, {
    head: [["Total Cost", "Cost Per Box"]],
    body: [[`Rs ${round(costData.totalCost)}`, `Rs ${round(costData.costPerBox)}`]],
    startY: doc.lastAutoTable.finalY + 10,
  });

  doc.save("Cost_Estimation_Report.pdf");
};
 
export default generatePDF;