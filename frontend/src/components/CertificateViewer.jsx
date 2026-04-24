import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Formats a date string to "15th March 2024" style
const formatCertDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-IN", { month: "long" });
  const year = date.getFullYear();

  // Add ordinal suffix: 1st, 2nd, 3rd, 4th...
  const suffix = ["th", "st", "nd", "rd"];
  const v = day % 100;
  const ordinal = suffix[(v - 20) % 10] || suffix[v] || suffix[0];

  return `${day}${ordinal} ${month} ${year}`;
};

// Map course titles to matching icons for the certificate seal area
const courseIcons = {
  "Budgeting Basics": "💰",
  "Saving Habits & Emergency Fund": "🏦",
  "Understanding EMI & Loans": "🧾",
  "Credit Score Basics": "📊",
  "Digital Payment Safety & Fraud Awareness": "🔒",
};

function CertificateViewer({ certificate }) {
  const certRef = useRef(null); // ref to the certificate div we will screenshot
  const [downloading, setDownloading] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState("");

  const { student_name, course_title, issued_at, id } = certificate;
  const courseIcon = courseIcons[course_title] || "🎓";
  const formattedDate = formatCertDate(issued_at);

  // ── Download as PDF ───────────────────────────────────────────
  const handleDownload = async () => {
    if (!certRef.current || downloading) return;
    setDownloading(true);
    setDownloadMsg("");

    try {
      // Step 1: Use html2canvas to capture the certificate div as a canvas
      const canvas = await html2canvas(certRef.current, {
        scale: 2, // 2x resolution for crisp PDF output
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      // Step 2: Get image data from canvas
      const imgData = canvas.toDataURL("image/png");

      // Step 3: Create a PDF in landscape A4 format
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4", // 297mm × 210mm
      });

      // Step 4: Calculate dimensions to fit the image into the PDF page
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const finalW = imgWidth * ratio;
      const finalH = imgHeight * ratio;
      const offsetX = (pdfWidth - finalW) / 2;
      const offsetY = (pdfHeight - finalH) / 2;

      // Step 5: Add the image to the PDF and save
      pdf.addImage(imgData, "PNG", offsetX, offsetY, finalW, finalH);

      // Filename: FinLearn_Certificate_CourseName_StudentName.pdf
      const safeName = student_name.replace(/\s+/g, "_");
      const safeCourse = course_title
        .replace(/[^a-zA-Z0-9]/g, "_")
        .substring(0, 30);
      pdf.save(`FinLearn_Certificate_${safeCourse}_${safeName}.pdf`);

      setDownloadMsg("✅ Certificate downloaded successfully!");
    } catch (err) {
      console.error("PDF download error:", err);
      setDownloadMsg("❌ Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      {/* ── Action Buttons Row ────────────────────────────── */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <button
          className="btn btn-primary"
          onClick={handleDownload}
          disabled={downloading}
          style={{ padding: "0.65rem 1.5rem", fontSize: "0.95rem" }}
        >
          {downloading ? "⏳ Generating PDF..." : "⬇️ Download PDF"}
        </button>
        <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
          Certificate ID: #{String(id).padStart(6, "0")}
        </span>
      </div>

      {/* Download status message */}
      {downloadMsg && (
        <div
          className={`alert ${downloadMsg.includes("✅") ? "alert-success" : "alert-error"}`}
          style={{ marginBottom: "1rem" }}
        >
          {downloadMsg}
        </div>
      )}

      {/* ── Certificate Preview Wrapper ───────────────────── */}
      {/* This outer div handles overflow for small screens */}
      <div style={{ overflowX: "auto", paddingBottom: "0.5rem" }}>
        {/* ── THE ACTUAL CERTIFICATE ────────────────────────
            html2canvas will screenshot everything inside certRef.
            Inline styles are mandatory here — html2canvas does not
            reliably read external CSS classes.
        ─────────────────────────────────────────────────── */}
        <div
          ref={certRef}
          style={{
            width: "800px", // fixed width for consistent PDF output
            minHeight: "560px",
            backgroundColor: "#ffffff",
            position: "relative",
            fontFamily: "Georgia, serif",
            overflow: "hidden",
            boxShadow: "0 4px 30px rgba(0,0,0,0.15)",
          }}
        >
          {/* ── Outer decorative border ─────────────────── */}
          <div
            style={{
              position: "absolute",
              inset: "12px",
              border: "3px solid #1e3a5f",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />

          {/* ── Inner decorative border ─────────────────── */}
          <div
            style={{
              position: "absolute",
              inset: "18px",
              border: "1px solid #2563eb",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />

          {/* ── Top gold bar ────────────────────────────── */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "8px",
              background: "linear-gradient(90deg, #1e3a5f, #2563eb, #1e3a5f)",
              zIndex: 2,
            }}
          />

          {/* ── Bottom gold bar ─────────────────────────── */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "8px",
              background: "linear-gradient(90deg, #1e3a5f, #2563eb, #1e3a5f)",
              zIndex: 2,
            }}
          />

          {/* ── Left side bar ───────────────────────────── */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: "8px",
              background: "linear-gradient(180deg, #1e3a5f, #2563eb, #1e3a5f)",
              zIndex: 2,
            }}
          />

          {/* ── Right side bar ──────────────────────────── */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "8px",
              background: "linear-gradient(180deg, #1e3a5f, #2563eb, #1e3a5f)",
              zIndex: 2,
            }}
          />

          {/* ── Background watermark pattern ────────────── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(37,99,235,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(30,58,95,0.04) 0%, transparent 50%)",
              zIndex: 0,
            }}
          />

          {/* ── Main Certificate Content ─────────────────── */}
          <div
            style={{
              position: "relative",
              zIndex: 3,
              padding: "50px 70px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              minHeight: "560px",
              justifyContent: "space-between",
            }}
          >
            {/* Top section */}
            <div style={{ width: "100%" }}>
              {/* Organization name */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  marginBottom: "6px",
                }}
              >
                <span style={{ fontSize: "22px" }}>💰</span>
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#1e3a5f",
                    letterSpacing: "3px",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  FINLEARN
                </span>
                <span style={{ fontSize: "22px" }}>💰</span>
              </div>
              <p
                style={{
                  fontSize: "11px",
                  color: "#6b7280",
                  letterSpacing: "2px",
                  margin: "0 0 24px",
                  fontFamily: "Arial, sans-serif",
                  textTransform: "uppercase",
                }}
              >
                Financial Literacy Education Platform
              </p>

              {/* Decorative divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "linear-gradient(90deg, transparent, #2563eb)",
                  }}
                />
                <span style={{ color: "#2563eb", fontSize: "16px" }}>✦</span>
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "linear-gradient(90deg, #2563eb, transparent)",
                  }}
                />
              </div>

              {/* Certificate of Completion heading */}
              <p
                style={{
                  fontSize: "13px",
                  letterSpacing: "4px",
                  color: "#6b7280",
                  margin: "0 0 4px",
                  fontFamily: "Arial, sans-serif",
                  textTransform: "uppercase",
                }}
              >
                Certificate of Completion
              </p>
              <h1
                style={{
                  fontSize: "40px",
                  color: "#1e3a5f",
                  margin: "0 0 20px",
                  fontWeight: "400",
                  fontStyle: "italic",
                  lineHeight: "1.2",
                }}
              >
                This is to certify that
              </h1>
            </div>

            {/* Student name — the centrepiece */}
            <div style={{ width: "100%", margin: "0 0 16px" }}>
              <div
                style={{
                  borderBottom: "2px solid #1e3a5f",
                  borderTop: "2px solid #1e3a5f",
                  padding: "12px 0",
                  margin: "0 40px",
                }}
              >
                <h2
                  style={{
                    fontSize: "42px",
                    color: "#1e3a5f",
                    margin: 0,
                    fontWeight: "700",
                    letterSpacing: "1px",
                    lineHeight: "1.1",
                  }}
                >
                  {student_name}
                </h2>
              </div>
            </div>

            {/* Middle section text */}
            <div style={{ width: "100%" }}>
              <p
                style={{
                  fontSize: "16px",
                  color: "#374151",
                  margin: "0 0 12px",
                  lineHeight: "1.6",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                has successfully completed the course
              </p>

              {/* Course name */}
              <div
                style={{
                  backgroundColor: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: "8px",
                  padding: "14px 30px",
                  margin: "0 40px 20px",
                  display: "inline-block",
                  minWidth: "400px",
                }}
              >
                <span style={{ fontSize: "22px", marginRight: "10px" }}>
                  {courseIcon}
                </span>
                <span
                  style={{
                    fontSize: "22px",
                    color: "#1e40af",
                    fontWeight: "700",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {course_title}
                </span>
              </div>

              <p
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  margin: "0 0 24px",
                  fontFamily: "Arial, sans-serif",
                  lineHeight: "1.5",
                }}
              >
                demonstrating knowledge in personal financial literacy and
                practical money management skills
              </p>

              {/* Decorative divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "linear-gradient(90deg, transparent, #e5e7eb)",
                  }}
                />
                <span style={{ color: "#9ca3af", fontSize: "12px" }}>
                  ✦ ✦ ✦
                </span>
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "linear-gradient(90deg, #e5e7eb, transparent)",
                  }}
                />
              </div>
            </div>

            {/* Bottom: Date + Signature area */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                width: "100%",
                paddingTop: "8px",
              }}
            >
              {/* Issue date */}
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "#1e3a5f",
                    margin: "0 0 4px",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {formattedDate}
                </p>
                <div
                  style={{
                    width: "120px",
                    height: "1px",
                    backgroundColor: "#9ca3af",
                    margin: "4px auto 4px",
                  }}
                />
                <p
                  style={{
                    fontSize: "10px",
                    color: "#9ca3af",
                    margin: 0,
                    letterSpacing: "1px",
                    fontFamily: "Arial, sans-serif",
                    textTransform: "uppercase",
                  }}
                >
                  Date of Issue
                </p>
              </div>

              {/* Centre seal */}
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    border: "3px solid #2563eb",
                    backgroundColor: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 6px",
                    fontSize: "30px",
                  }}
                >
                  🏅
                </div>
                <p
                  style={{
                    fontSize: "9px",
                    color: "#6b7280",
                    margin: 0,
                    fontFamily: "Arial, sans-serif",
                    letterSpacing: "1px",
                  }}
                >
                  CERTIFIED
                </p>
              </div>

              {/* Certificate ID + signature line */}
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "#1e3a5f",
                    margin: "0 0 4px",
                    fontFamily: "Georgia, serif",
                    fontStyle: "italic",
                  }}
                >
                  FinLearn Academy
                </p>
                <div
                  style={{
                    width: "120px",
                    height: "1px",
                    backgroundColor: "#9ca3af",
                    margin: "4px auto 4px",
                  }}
                />
                <p
                  style={{
                    fontSize: "10px",
                    color: "#9ca3af",
                    margin: 0,
                    letterSpacing: "1px",
                    fontFamily: "Arial, sans-serif",
                    textTransform: "uppercase",
                  }}
                >
                  Authorized by
                </p>
              </div>
            </div>

            {/* Certificate ID footer */}
            <div
              style={{ width: "100%", textAlign: "center", marginTop: "12px" }}
            >
              <p
                style={{
                  fontSize: "9px",
                  color: "#d1d5db",
                  margin: 0,
                  fontFamily: "Arial, sans-serif",
                  letterSpacing: "1px",
                }}
              >
                Certificate ID: FL-{String(id).padStart(6, "0")} · finlearn.app
                · Issued via FinLearn Education Platform
              </p>
            </div>
          </div>
          {/* End certificate content */}
        </div>
        {/* End certRef div */}
      </div>
      {/* End overflow wrapper */}
    </div>
  );
}

export default CertificateViewer;
