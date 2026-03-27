import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import type { InspeccionDetalle } from "@/lib/api";
import {
  CABEZOTE_ITEMS,
  REMOLQUE_ESTRUCTURA_ITEMS,
  REMOLQUE_LUCES_ITEMS,
  KIT_DERRAMES_ITEMS,
  KIT_CARRETERA_ITEMS,
  BOTIQUIN_ITEMS,
  EPP_ITEMS,
  REQUISITOS_DESPACHO_ITEMS,
  DOCS_CARGA_ITEMS
} from "./constants";

const getStatusLabel = (code?: string | null) => {
  if (code === "B") return "Bueno";
  if (code === "M") return "Malo";
  if (code === "NA") return "N/A";
  return "-";
};

export function generateInspectionPDF(inspeccion: InspeccionDetalle) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0, 118, 182); // SafeNode Blue
  doc.text("SAFENODE S.A.S", pageWidth / 2, 20, { align: "center" });
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("INSPECCIÓN PREOPERACIONAL DE VEHÍCULOS", pageWidth / 2, 28, { align: "center" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`ID Registro: #${inspeccion.id} | Fecha: ${format(new Date(inspeccion.fecha), "dd/MM/yyyy")}`, pageWidth / 2, 34, { align: "center" });

  let startY = 45;

  // General Info Table
  autoTable(doc, {
    startY,
    theme: 'grid',
    headStyles: { fillColor: [0, 118, 182], textColor: 255, halign: 'center' },
    bodyStyles: { textColor: 50 },
    columnStyles: { 0: { fontStyle: 'bold', fillColor: [240, 244, 248] }, 2: { fontStyle: 'bold', fillColor: [240, 244, 248] } },
    body: [
      ["Manifiesto", inspeccion.manifiesto, "Fecha", format(new Date(inspeccion.fecha), "dd/MM/yyyy")],
      ["Conductor", inspeccion.conductor_nombre, "Documento", `${inspeccion.tipo_documento} ${inspeccion.conductor_documento}`],
      ["Placa Vehículo", inspeccion.vehiculo_placa, "Clase Vehículo", inspeccion.clase_vehiculo],
      ["Kilometraje", inspeccion.kilometraje.toString(), "Modalidad", inspeccion.modalidad],
    ],
  });

  let currentY = (doc as any).lastAutoTable.finalY + 10;

  // Helper to draw sections
  const drawSection = (title: string, itemsList: string[], valuesObj?: Record<string, any>) => {
    if (currentY > 260) {
      doc.addPage();
      currentY = 20;
    }

    const body = itemsList.map(item => [item, getStatusLabel(valuesObj?.[item])]);

    autoTable(doc, {
      startY: currentY,
      theme: 'grid',
      head: [[title, 'Estado']],
      headStyles: { fillColor: [111, 26, 182], textColor: 255 }, // Purple header for sections
      columnStyles: { 1: { halign: 'center', fontStyle: 'bold' } },
      body: body,
      didParseCell: function(data) {
        if (data.section === 'body' && data.column.index === 1) {
          if (data.cell.raw === 'Bueno') data.cell.styles.textColor = [39, 174, 96]; // Green
          if (data.cell.raw === 'Malo') data.cell.styles.textColor = [231, 76, 60]; // Red
        }
      }
    });
    currentY = (doc as any).lastAutoTable.finalY + 10;
  };

  drawSection("INSPECCIÓN CABEZOTE", CABEZOTE_ITEMS, inspeccion.cabezote);

  if (inspeccion.aplica_remolque) {
    doc.setFont("helvetica", "bold");
    doc.text(`N° Remolque: ${inspeccion.n_remolque || 'N/A'}`, 14, currentY);
    currentY += 5;
    drawSection("REMOLQUE - ESTRUCTURA", REMOLQUE_ESTRUCTURA_ITEMS, inspeccion.remolque_estructura);
    drawSection("REMOLQUE - LUCES", REMOLQUE_LUCES_ITEMS, inspeccion.remolque_luces);
  }

  if (inspeccion.aplica_kit_derrames) {
    drawSection("KIT DE DERRAMES", KIT_DERRAMES_ITEMS, inspeccion.kit_derrames);
  }

  drawSection("KIT DE CARRETERA", KIT_CARRETERA_ITEMS, inspeccion.kit_carretera);
  drawSection("VERIFICACIÓN BOTIQUÍN", BOTIQUIN_ITEMS, inspeccion.botiquin);
  drawSection("VERIFICACIÓN EPP", EPP_ITEMS, inspeccion.epp);
  drawSection("REQUISITOS PARA EL DESPACHO", REQUISITOS_DESPACHO_ITEMS, inspeccion.requisitos_despacho);
  drawSection("DOCUMENTOS DE CARGA", DOCS_CARGA_ITEMS, inspeccion.documentos_carga);

  // Observations
  if (inspeccion.observaciones) {
    if (currentY > 250) { doc.addPage(); currentY = 20; }
    doc.setFont("helvetica", "bold");
    doc.text("OBSERVACIONES:", 14, currentY);
    doc.setFont("helvetica", "normal");
    const splitText = doc.splitTextToSize(inspeccion.observaciones, pageWidth - 28);
    doc.text(splitText, 14, currentY + 7);
    currentY += 10 + (splitText.length * 5);
  }

  // Signatures
  if (currentY > 220) { doc.addPage(); currentY = 20; }
  
  doc.setFont("helvetica", "bold");
  doc.text("FIRMAS DE RESPONSABILIDAD", pageWidth / 2, currentY, { align: "center" });
  currentY += 15;

  if (inspeccion.firma_conductor) {
    doc.text("Conductor:", 20, currentY);
    doc.addImage(inspeccion.firma_conductor, "PNG", 20, currentY + 5, 60, 30);
    doc.line(20, currentY + 35, 80, currentY + 35);
    doc.setFont("helvetica", "normal");
    doc.text(inspeccion.conductor_nombre, 20, currentY + 40);
  }

  if (inspeccion.firma_inspector) {
    doc.setFont("helvetica", "bold");
    doc.text("Inspector / Despachador:", 120, currentY);
    doc.addImage(inspeccion.firma_inspector, "PNG", 120, currentY + 5, 60, 30);
    doc.line(120, currentY + 35, 180, currentY + 35);
  }

  doc.save(`Inspeccion_${inspeccion.vehiculo_placa}_${format(new Date(inspeccion.fecha), "yyyyMMdd")}.pdf`);
}
