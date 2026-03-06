import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { CodeReviewAnalysisOutput } from "@/ai/flows/code-review-analysis";

export async function generateCodeAnalysisPDF(
  originalCode: string,
  analysis: CodeReviewAnalysisOutput | null,
  optimizedCode: string | null
) {
  // Create a container element to render the content
  const container = document.createElement("div");
  container.style.width = "210mm"; // A4 width
  container.style.padding = "20mm";
  container.style.backgroundColor = "white";
  container.style.color = "black";
  container.style.fontFamily = "Arial, sans-serif";
  container.style.lineHeight = "1.6";
  container.style.fontSize = "11px";

  // Helper function to add sections
  const addSection = (title: string, content: string) => {
    const section = document.createElement("div");
    section.style.marginBottom = "15mm";
    section.style.pageBreakInside = "avoid";

    const titleEl = document.createElement("h2");
    titleEl.style.fontSize = "16px";
    titleEl.style.fontWeight = "bold";
    titleEl.style.marginBottom = "5mm";
    titleEl.style.borderBottom = "2px solid #333";
    titleEl.style.paddingBottom = "3mm";
    titleEl.textContent = title;

    const contentEl = document.createElement("div");
    contentEl.style.whiteSpace = "pre-wrap";
    contentEl.style.wordWrap = "break-word";
    contentEl.innerHTML = content;

    section.appendChild(titleEl);
    section.appendChild(contentEl);
    return section;
  };

  // Header
  const header = document.createElement("div");
  header.style.textAlign = "center";
  header.style.marginBottom = "10mm";
  header.style.borderBottom = "3px solid #1f2937";
  header.style.paddingBottom = "8mm";

  const headerTitle = document.createElement("h1");
  headerTitle.style.fontSize = "24px";
  headerTitle.style.fontWeight = "bold";
  headerTitle.style.margin = "0 0 5mm 0";
  headerTitle.textContent = "CodeCanvas AI Analysis Report";

  const headerSubtitle = document.createElement("p");
  headerSubtitle.style.fontSize = "12px";
  headerSubtitle.style.color = "#666";
  headerSubtitle.style.margin = "0";
  headerSubtitle.textContent = "Detailed Code Review and Optimization Summary";

  const timestamp = document.createElement("p");
  timestamp.style.fontSize = "10px";
  timestamp.style.color = "#999";
  timestamp.style.margin = "5mm 0 0 0";
  timestamp.textContent = `Generated on ${new Date().toLocaleString()}`;

  header.appendChild(headerTitle);
  header.appendChild(headerSubtitle);
  header.appendChild(timestamp);
  container.appendChild(header);

  // Original Code Section
  const codeSection = document.createElement("div");
  codeSection.style.marginBottom = "15mm";
  codeSection.style.pageBreakInside = "avoid";

  const codeTitle = document.createElement("h2");
  codeTitle.style.fontSize = "16px";
  codeTitle.style.fontWeight = "bold";
  codeTitle.style.marginBottom = "5mm";
  codeTitle.style.borderBottom = "2px solid #333";
  codeTitle.style.paddingBottom = "3mm";
  codeTitle.textContent = "Original Source Code";

  const codePre = document.createElement("pre");
  codePre.style.backgroundColor = "#f3f4f6";
  codePre.style.padding = "8mm";
  codePre.style.borderRadius = "4px";
  codePre.style.border = "1px solid #d1d5db";
  codePre.style.fontSize = "9px";
  codePre.style.overflowX = "auto";
  codePre.style.whiteSpace = "pre-wrap";
  codePre.style.wordWrap = "break-word";
  codePre.textContent = originalCode;

  codeSection.appendChild(codeTitle);
  codeSection.appendChild(codePre);
  container.appendChild(codeSection);

  // Analysis Section
  if (analysis) {
    const analysisSection = document.createElement("div");
    analysisSection.style.marginBottom = "15mm";
    analysisSection.style.pageBreakInside = "avoid";

    const analysisTitle = document.createElement("h2");
    analysisTitle.style.fontSize = "16px";
    analysisTitle.style.fontWeight = "bold";
    analysisTitle.style.marginBottom = "5mm";
    analysisTitle.style.borderBottom = "2px solid #333";
    analysisTitle.style.paddingBottom = "3mm";
    analysisTitle.textContent = "Code Review Analysis";

    analysisSection.appendChild(analysisTitle);

    // Overall Summary
    const summaryDiv = document.createElement("div");
    summaryDiv.style.marginBottom = "8mm";

    const summaryLabel = document.createElement("h3");
    summaryLabel.style.fontSize = "12px";
    summaryLabel.style.fontWeight = "bold";
    summaryLabel.style.marginBottom = "3mm";
    summaryLabel.style.color = "#1f2937";
    summaryLabel.textContent = "Overall Summary";

    const summaryText = document.createElement("p");
    summaryText.style.margin = "0";
    summaryText.style.color = "#4b5563";
    summaryText.textContent = analysis.review.overallSummary;

    summaryDiv.appendChild(summaryLabel);
    summaryDiv.appendChild(summaryText);
    analysisSection.appendChild(summaryDiv);

    // Pros and Cons in two columns
    const prosConsContainer = document.createElement("div");
    prosConsContainer.style.display = "flex";
    prosConsContainer.style.gap = "10mm";
    prosConsContainer.style.marginBottom = "8mm";

    // Pros
    const prosDiv = document.createElement("div");
    prosDiv.style.flex = "1";

    const prosLabel = document.createElement("h3");
    prosLabel.style.fontSize = "12px";
    prosLabel.style.fontWeight = "bold";
    prosLabel.style.marginBottom = "3mm";
    prosLabel.style.color = "#059669";
    prosLabel.textContent = "Pros";

    const prosList = document.createElement("ul");
    prosList.style.margin = "0";
    prosList.style.paddingLeft = "20px";
    prosList.style.fontSize = "10px";

    analysis.review.pros.forEach((pro) => {
      const li = document.createElement("li");
      li.style.marginBottom = "2mm";
      li.style.color = "#4b5563";
      li.textContent = pro;
      prosList.appendChild(li);
    });

    prosDiv.appendChild(prosLabel);
    prosDiv.appendChild(prosList);

    // Cons
    const consDiv = document.createElement("div");
    consDiv.style.flex = "1";

    const consLabel = document.createElement("h3");
    consLabel.style.fontSize = "12px";
    consLabel.style.fontWeight = "bold";
    consLabel.style.marginBottom = "3mm";
    consLabel.style.color = "#dc2626";
    consLabel.textContent = "Cons";

    const consList = document.createElement("ul");
    consList.style.margin = "0";
    consList.style.paddingLeft = "20px";
    consList.style.fontSize = "10px";

    analysis.review.cons.forEach((con) => {
      const li = document.createElement("li");
      li.style.marginBottom = "2mm";
      li.style.color = "#4b5563";
      li.textContent = con;
      consList.appendChild(li);
    });

    consDiv.appendChild(consLabel);
    consDiv.appendChild(consList);

    prosConsContainer.appendChild(prosDiv);
    prosConsContainer.appendChild(consDiv);
    analysisSection.appendChild(prosConsContainer);

    // Improvements
    const improvementsDiv = document.createElement("div");

    const improvementsLabel = document.createElement("h3");
    improvementsLabel.style.fontSize = "12px";
    improvementsLabel.style.fontWeight = "bold";
    improvementsLabel.style.marginBottom = "3mm";
    improvementsLabel.style.color = "#1f2937";
    improvementsLabel.textContent = "Recommended Improvements";

    const improvementsTags = document.createElement("div");
    improvementsTags.style.display = "flex";
    improvementsTags.style.flexWrap = "wrap";
    improvementsTags.style.gap = "4mm";

    analysis.review.improvements.forEach((improvement) => {
      const tag = document.createElement("span");
      tag.style.backgroundColor = "#e0e7ff";
      tag.style.color = "#3730a3";
      tag.style.padding = "2mm 4mm";
      tag.style.borderRadius = "3px";
      tag.style.fontSize = "10px";
      tag.style.border = "1px solid #c4b5fd";
      tag.textContent = improvement;
      improvementsTags.appendChild(tag);
    });

    improvementsDiv.appendChild(improvementsLabel);
    improvementsDiv.appendChild(improvementsTags);
    analysisSection.appendChild(improvementsDiv);

    container.appendChild(analysisSection);
  }

  // Optimized Code Section
  if (optimizedCode) {
    const optimizedSection = document.createElement("div");
    optimizedSection.style.marginBottom = "15mm";
    optimizedSection.style.pageBreakInside = "avoid";

    const optimizedTitle = document.createElement("h2");
    optimizedTitle.style.fontSize = "16px";
    optimizedTitle.style.fontWeight = "bold";
    optimizedTitle.style.marginBottom = "5mm";
    optimizedTitle.style.borderBottom = "2px solid #333";
    optimizedTitle.style.paddingBottom = "3mm";
    optimizedTitle.textContent = "AI Optimized Version";

    const optimizedPre = document.createElement("pre");
    optimizedPre.style.backgroundColor = "#f3f4f6";
    optimizedPre.style.padding = "8mm";
    optimizedPre.style.borderRadius = "4px";
    optimizedPre.style.border = "1px solid #d1d5db";
    optimizedPre.style.fontSize = "9px";
    optimizedPre.style.overflowX = "auto";
    optimizedPre.style.whiteSpace = "pre-wrap";
    optimizedPre.style.wordWrap = "break-word";
    optimizedPre.textContent = optimizedCode;

    optimizedSection.appendChild(optimizedTitle);
    optimizedSection.appendChild(optimizedPre);
    container.appendChild(optimizedSection);
  }

  // Footer
  const footer = document.createElement("div");
  footer.style.textAlign = "center";
  footer.style.borderTop = "1px solid #d1d5db";
  footer.style.paddingTop = "5mm";
  footer.style.marginTop = "10mm";
  footer.style.fontSize = "9px";
  footer.style.color = "#999";
  footer.textContent = `Generated by CodeCanvas AI Platform © ${new Date().getFullYear()}`;

  container.appendChild(footer);

  // Append to body temporarily
  document.body.appendChild(container);

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20; // 10mm margins on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pageHeightAvailable = pageHeight - 20; // 10mm top and bottom margins

    let heightLeft = imgHeight;
    let position = 10; // Start with 10mm top margin
    let canvasYOffset = 0;

    // Add image to PDF, handling page breaks
    const imgData = canvas.toDataURL("image/png");

    while (heightLeft > 0) {
      const imgHeightForPage = Math.min(heightLeft, pageHeightAvailable);

      // Calculate the portion of the original canvas to use
      const sourceY = (canvasYOffset / imgHeight) * canvas.height;
      const sourceHeight = (imgHeightForPage / imgHeight) * canvas.height;

      // Create a temporary canvas for this page's content
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = sourceHeight;

      const ctx = pageCanvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(
          canvas,
          0,
          sourceY,
          canvas.width,
          sourceHeight,
          0,
          0,
          canvas.width,
          sourceHeight
        );
      }

      const pageImgData = pageCanvas.toDataURL("image/png");
      pdf.addImage(pageImgData, "PNG", 10, position, imgWidth, imgHeightForPage);

      heightLeft -= imgHeightForPage;
      canvasYOffset += imgHeightForPage;

      if (heightLeft > 0) {
        pdf.addPage();
        position = 10;
      }
    }

    // Download PDF
    const timestamp = new Date().toISOString().slice(0, 10);
    pdf.save(`CodeCanvas-Analysis-Report-${timestamp}.pdf`);
  } finally {
    // Remove temporary container
    document.body.removeChild(container);
  }
}
