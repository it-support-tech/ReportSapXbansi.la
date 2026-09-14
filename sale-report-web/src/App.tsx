import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { UploadPage } from "./pages/UploadPage";
import { LUBRICANT_API_ENDPOINTS } from "./constants/api";
import { LUBRICANT_PREVIEW_COLUMNS, LUBRICANT_SAP_DEBUG_COLUMNS } from "./constants/tableHeaders";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
