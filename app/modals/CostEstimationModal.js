import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import generatePDF from "../utils/pdfGenerator";

const CostEstimationModal = ({ open, onClose, costData }) => {
  const breakdown = costData?.breakdown || {};
  const round = (val) => Number(val).toFixed(2);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Cost Estimation Summary</DialogTitle>
      <DialogContent>
        <Typography variant="h6">Breakdown:</Typography>
        <Table>
          <TableBody>
            {Object.entries(breakdown).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell sx={{ textTransform: "capitalize" }}>{key}</TableCell>
                <TableCell align="right">₹ {round(value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Typography variant="h6" mt={2}>
          Total Cost: ₹ {round(costData?.totalCost)}
        </Typography>
        <Typography variant="h6">
          Cost Per Box: ₹ {round(costData?.costPerBox)}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => generatePDF(costData)} variant="outlined">
          Download PDF
        </Button>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CostEstimationModal;
