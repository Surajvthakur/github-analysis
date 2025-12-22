"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ExportButtonProps {
  elementId?: string;
  filename?: string;
  title?: string;
}

export default function ExportButton({
  elementId = "dashboard",
  filename = "github-analytics",
  title = "GitHub Analytics Report",
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportAsImage = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        alert("Element not found for export");
        return;
      }

      const canvas = await html2canvas(element, {
        backgroundColor: "#111827",
        scale: 2,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = imgData;
      link.click();
    } catch (error) {
      console.error("Error exporting image:", error);
      alert("Failed to export image");
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsPDF = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        alert("Element not found for export");
        return;
      }

      const canvas = await html2canvas(element, {
        backgroundColor: "#111827",
        scale: 2,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${filename}.pdf`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={exportAsImage}
        disabled={isExporting}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isExporting ? (
          <>
            <span className="animate-spin">⏳</span>
            Exporting...
          </>
        ) : (
          <>
            📷 Export Image
          </>
        )}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={exportAsPDF}
        disabled={isExporting}
        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isExporting ? (
          <>
            <span className="animate-spin">⏳</span>
            Exporting...
          </>
        ) : (
          <>
            📄 Export PDF
          </>
        )}
      </motion.button>
    </div>
  );
}
