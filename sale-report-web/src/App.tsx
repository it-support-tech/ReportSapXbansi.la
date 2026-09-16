import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { UploadPage } from "./pages/UploadPage";
import { LUBRICANT_API_ENDPOINTS, SUMMARY_INVOICE_API_ENDPOINTS } from "./constants/api";
import {
  LUBRICANT_PREVIEW_COLUMNS,
  LUBRICANT_SAP_DEBUG_COLUMNS,
  SUMMARY_INVOICE_PREVIEW_COLUMNS,
  SUMMARY_INVOICE_SAP_DEBUG_COLUMNS,
} from "./constants/tableHeaders";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="min-w-0 flex-1">
            <Routes>
              <Route path="/" element={<UploadPage />} />
              <Route
                path="/lubricant"
                element={
                  <UploadPage
                    title="Sap Business One X Bansi.la (ນ້ຳມັນເຄື່ອງ)"
                    subtitle="ອັບໂຫຼດໄຟລ໌ Export ນ້ຳມັນເຄື່ອງຈາກ SAP Business One ແລະ ໄຟລ໌ຈາກ ບັນຊີ.la ລະບົບຈະ Match ຂໍ້ມູນຕາມເລກ Invoice"
                    endpoints={LUBRICANT_API_ENDPOINTS}
                    previewColumns={LUBRICANT_PREVIEW_COLUMNS}
                    debugColumns={LUBRICANT_SAP_DEBUG_COLUMNS}
                    debugModalTitle="ຂໍ້ມູນທີ່ດຶງໄດ້ຈາກ SAP B1 ນ້ຳມັນເຄື່ອງ (ບໍ່ໄດ້ match ກັບ ບັນຊີ.la)"
                  />
                }
              />
              <Route
                path="/summary-invoice"
                element={
                  <UploadPage
                    title="Sap Business One X Bansi.la (Summary Invoice)"
                    subtitle="ອັບໂຫຼດໄຟລ໌ Export ຈາກ SAP Business One ແລະ ໄຟລ໌ຈາກ ບັນຊີ.la ລະບົບຈະ Match ຂໍ້ມູນຕາມເລກ Invoice ແລະ ແຍກ Summary Invoice ອອກຕໍ່ 1 ລູກຄ້າ"
                    endpoints={SUMMARY_INVOICE_API_ENDPOINTS}
                    previewColumns={SUMMARY_INVOICE_PREVIEW_COLUMNS}
                    debugColumns={SUMMARY_INVOICE_SAP_DEBUG_COLUMNS}
                    debugModalTitle="ຂໍ້ມູນທີ່ດຶງໄດ້ຈາກ SAP B1 Summary Invoice (ບໍ່ໄດ້ match ກັບ ບັນຊີ.la)"
                  />
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
