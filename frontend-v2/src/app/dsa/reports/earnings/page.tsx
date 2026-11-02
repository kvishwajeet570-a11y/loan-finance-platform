import ReportDetailPage from "../../../../components/reports/ReportDetailPage";

export default function Page() {
  return (
    <ReportDetailPage
      title="Earnings Report"
      description="View your earnings summary and payout status."
      columns={["Month", "Total Earnings", "Paid", "Pending", "Status"]}
    />
  );
}
