import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface ExportPdfOptions {
  caseNumber?: string
  date?: string
  action?: 'download' | 'preview'
}

/**
 * Exportador pericial a PDF A4 utilizando html2canvas y jsPDF.
 * Soporta paginación automática en múltiples hojas A4 y generación de BlobURL para vista previa en pestaña nueva.
 */
export async function exportReportToPdf(
  elementId = 'a4-report-canvas',
  options: ExportPdfOptions = {}
): Promise<void> {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error(`No se encontró el elemento con ID "${elementId}" para exportar a PDF.`)
  }

  const caseNum = (options.caseNumber || 'INC-2026').replace(/[^a-zA-Z0-9_-]/g, '_')
  const dateStr = (options.date || new Date().toISOString().split('T')[0]).replace(/[^a-zA-Z0-9_-]/g, '_')
  const fileName = `Informe_SOC_L2_${caseNum}_${dateStr}.pdf`

  // 1. Renderizar el elemento como canvas de alta resolución (scale 2 para nitidez vectorial de texto)
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
  })

  // 2. Dimensiones A4 estándar en milímetros
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = 210 // mm
  const pageHeight = 297 // mm

  const imgWidth = pageWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  let heightLeft = imgHeight
  let position = 0

  // 3. Primera página
  const imgData = canvas.toDataURL('image/png')
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
  heightLeft -= pageHeight

  // 4. Paginación automática si el contenido excede 1 página A4
  while (heightLeft > 0) {
    position = heightLeft - imgHeight
    pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
  }

  // 5. Acción solicitada: descargar o abrir en nueva pestaña
  if (options.action === 'preview') {
    const blobUrl = pdf.output('bloburl')
    window.open(blobUrl, '_blank')
  } else {
    pdf.save(fileName)
  }
}
