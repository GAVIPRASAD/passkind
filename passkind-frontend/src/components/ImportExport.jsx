import React from "react";
import { Download, Upload } from "lucide-react";
import api from "../utils/api";
import { API_ENDPOINTS } from "../utils/constants";

const ImportExport = () => {
  const handleExport = async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.USERS}/export`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "secrets.csv");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-xl hover:bg-gray-800 transition-colors"
      >
        <Download size={18} /> Export CSV
      </button>
      <button className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-xl hover:bg-gray-800 transition-colors opacity-50 cursor-not-allowed">
        <Upload size={18} /> Import CSV (Coming Soon)
      </button>
    </div>
  );
};

export default ImportExport;
