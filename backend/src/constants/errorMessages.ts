export const ERROR_MESSAGES = {
  NO_FILES_UPLOADED: "ກະລຸນາອັບໂຫຼດໄຟລ໌ SAP B1 ແລະ ໄຟລ໌ ບັນຊີ.la ໃຫ້ຄົບທັງສອງໄຟລ໌",
  INVALID_FILE_TYPE: "ຮອງຮັບສະເພາະໄຟລ໌ Excel (.xlsx, .xls) ເທົ່ານັ້ນ",
  FILE_TOO_LARGE: "ຂະໜາດໄຟລ໌ໃຫຍ່ເກີນກຳນົດ",
  EMPTY_WORKBOOK: "ບໍ່ພົບ Sheet ຂໍ້ມູນຢູ່ໃນໄຟລ໌ທີ່ອັບໂຫຼດ",
  MISSING_INVOICE_COLUMN: "ບໍ່ພົບ Column ເລກທີ Invoice (invoice_number) ຢູ່ໃນໄຟລ໌",
  NO_MATCHING_ROWS: "ບໍ່ພົບຂໍ້ມູນທີ່ Match ກັນລະຫວ່າງສອງໄຟລ໌",
  PROCESSING_FAILED: "ເກີດຂໍ້ຜິດພາດໃນການປະມວນຜົນຂໍ້ມູນ",
  REPORT_GENERATION_FAILED: "ເກີດຂໍ້ຜິດພາດໃນການສ້າງໄຟລ໌ Report",
  INTERNAL_ERROR: "ເກີດຂໍ້ຜິດພາດພາຍໃນລະບົບ, ກະລຸນາລອງໃໝ່ອີກຄັ້ງ",
} as const;
