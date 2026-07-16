import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

export function generateResultPdf(data) {
  const isPassed = (data.result || "").toUpperCase() === "PASSED";

  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Clean, elegant font setup (Helvetica standard)
    doc.setFont("Helvetica", "normal");

    // 1. Sleek Minimal Header Panel (Independent design, no official banners)
    doc.setFillColor(15, 23, 42); // slate-900 matching minimalist dark themes
    doc.rect(0, 0, 210, 38, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.text("SSC RESULT REPORT", 15, 16);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(156, 163, 175); // gray-400

    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 27);

    // 2. Student Metadata Cards Structure
    doc.setTextColor(31, 41, 55); // dark gray-800
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("STUDENT PROFILE", 15, 52);

    // Horizontal Divider rule
    doc.setDrawColor(229, 231, 235); // gray-200
    doc.setLineWidth(0.3);
    doc.line(15, 55, 195, 55);

    // Grid Info block fields
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128); // Label color (gray-500)
    doc.text("Name of Student:", 15, 63);
    doc.text("Father's Name:", 15, 70);
    doc.text("Mother's Name:", 15, 77);
    doc.text("Institution:", 15, 84);

    doc.setTextColor(17, 24, 39); // Value color (gray-900)
    doc.setFont("Helvetica", "bold");
    doc.text(String(data.name || "N/A"), 48, 63);
    doc.text(String(data.father_name || "N/A"), 48, 70);
    doc.text(String(data.mother_name || "N/A"), 48, 77);
    doc.text(String(data.institute || "N/A"), 48, 84);

    // Right Column Metadata
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text("Roll Number:", 125, 63);
    doc.text("Registration No:", 125, 70);
    doc.text("Board & Group:", 125, 77);
    doc.text("Result Status:", 125, 84);

    doc.setTextColor(17, 24, 39);
    doc.setFont("Helvetica", "bold");
    doc.text(String(data.roll || "N/A"), 155, 63);
    doc.text(String(data.reg || "N/A"), 155, 70);
    doc.text(`${data.board} • ${data.group}`, 155, 77);

    const statusText = isPassed ? "PASSED" : "FAILED";
    if (isPassed) {
      doc.setTextColor(5, 150, 105);
    } else {
      doc.setTextColor(220, 38, 38);
    }
    doc.text(statusText, 155, 84);

    // GPA badge block
    doc.setFillColor(243, 244, 246); // Light slate/gray
    doc.roundedRect(15, 92, 180, 14, 2, 2, "F");
    doc.setFontSize(11);
    doc.setTextColor(31, 41, 55);
    doc.setFont("Helvetica", "bold");
    doc.text("OVERALL GRADE POINT AVERAGE (GPA):", 22, 101);
    doc.setFontSize(14);
    doc.setTextColor(16, 185, 129); // emerald-500
    doc.text(String(data.gpa || "0.00"), 188, 101, { align: "right" });

    // 3. Subject Grades Table (utilizing jspdf-autotable)
    const tableHeaders = [["Code", "Subject Description", "Grade Obtained"]];
    const tableRows = (data.grades || []).map((g) => [
      g.code,
      g.subject,
      g.grade,
    ]);

    autoTable(doc, {
      startY: 114,
      head: tableHeaders,
      body: tableRows,
      theme: "striped",
      headStyles: {
        fillColor: [31, 41, 55], // dark zinc headers
        textColor: [249, 250, 251],
        fontStyle: "bold",
        fontSize: 9,
        halign: "left",
      },
      columnStyles: {
        0: { cellWidth: 25, halign: "center" },
        2: { cellWidth: 35, halign: "center", fontStyle: "bold" },
      },
      styles: {
        font: "Helvetica",
        fontSize: 9,
        cellPadding: 3.5,
      },
      margin: { left: 15, right: 15 },
    });

    // 4. Clean Footer / Strict Unofficial Warning Section (Stretched dynamically below table)
    const finalY = doc.lastAutoTable.finalY || 240;
    doc.setFillColor(254, 243, 199); // soft amber warn bg
    doc.setDrawColor(245, 158, 11); // amber stroke border
    const disclaimer = doc.splitTextToSize(
      "This PDF is generated from publicly available result data and is not an official document. It is not intended to replace the original result or serve as a legal document. This copy is provided for reference purposes only.",
      170,
    );
    const boxHeight = 18 + disclaimer.length * 4;

    doc.roundedRect(15, finalY + 12, 180, boxHeight, 1.5, 1.5, "FD");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(146, 64, 14); // Dark Amber Text
    doc.text("REFERENCE COPY", 20, finalY + 18);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(180, 83, 9);

    doc.text(disclaimer, 20, finalY + 23);

    doc.text(
      "For the original official result, visit: https://www.educationboardresults.gov.bd",
      20,
      finalY + 23 + disclaimer.length * 4,
    );

    // Output Document Safely
    doc.save(`SSC_Result_${data.roll || "Download"}.pdf`);
    toast.success("PDF ডাউনলোড করা হয়েছে!");
  } catch (err) {
    toast.error("PDF তৈরি করা সম্ভব হয়নি।");
    console.error(err);
  }
}
