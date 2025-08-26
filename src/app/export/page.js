import ExportForm from "../../../components/ExportForm";

export const metadata = {
  title: "Export Report",
};

export default function ExportPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Export Inventory Report</h1>
      <ExportForm />
    </div>
  );
}
