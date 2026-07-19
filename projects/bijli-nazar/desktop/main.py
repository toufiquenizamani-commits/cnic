#!/usr/bin/env python3
"""
Bijli Nazar - Desktop Wrapper and PDF Audit Report Exporter
Uses PyWebView for layout rendering and FPDF for exporting bill audit receipts.
"""

import os
import sys
import json

try:
    import webview
except ImportError:
    print("Error: 'pywebview' is not installed. Please run: pip install pywebview")
    sys.exit(1)

# PDF generation is optional
try:
    from fpdf import FPDF
    class AuditPDF(FPDF):
        def header(self):
            self.set_font('Arial', 'B', 14)
            self.cell(0, 10, 'BIJLI NAZAR - BILL AUDIT REPORT', 0, 1, 'C')
            self.set_font('Arial', 'I', 9)
            self.cell(0, 5, 'NEPRA Approved Tariff Compliance Verification', 0, 1, 'C')
            self.ln(10)
        def footer(self):
            self.set_y(-15)
            self.set_font('Arial', 'I', 8)
            self.cell(0, 10, 'Bijli Nazar Utility - Verified Offline', 0, 0, 'C')
except ImportError:
    FPDF = None


class DesktopAPI:
    def __init__(self):
        self.window = None

    def set_window(self, window):
        self.window = window

    def export_audit_pdf(self, data_json):
        """
        Generates a printable PDF bill audit certificate for consumers.
        """
        if FPDF is None:
            return {"status": "error", "message": "FPDF is not installed. Run: pip install fpdf"}

        try:
            data = json.loads(data_json)
            pdf = AuditPDF()
            pdf.add_page()
            
            pdf.set_font('Arial', 'B', 12)
            pdf.cell(0, 10, f"Utility Provider: {data.get('disco')}", 0, 1)
            pdf.ln(5)

            pdf.set_font('Arial', '', 10)
            pdf.cell(100, 8, f"Audited Units: {data.get('units')} kWh", 0, 1)
            pdf.cell(100, 8, f"Base Energy Charge: Rs. {data.get('base')}", 0, 1)
            pdf.cell(100, 8, f"Surcharges (FCA/QTA): Rs. {data.get('surcharges')}", 0, 1)
            pdf.cell(100, 8, f"Government Taxes: Rs. {data.get('taxes')}", 0, 1)
            pdf.ln(5)

            pdf.set_font('Arial', 'B', 10)
            pdf.cell(100, 8, f"Calculated Grand Total: Rs. {data.get('total')}", 0, 1)

            pdf_path = os.path.expanduser(f"~/Bill_Audit_{data.get('disco')}.pdf")
            pdf.output(pdf_path)
            return {"status": "success", "message": f"Bill audit PDF report saved at: {pdf_path}"}
        except Exception as e:
            return {"status": "error", "message": str(e)}


def main():
    assets_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../app/src/main/assets"))
    index_file = os.path.join(assets_dir, "index.html")

    if not os.path.exists(index_file):
        print(f"Error: Could not locate assets index: {index_file}")
        sys.exit(1)

    api = DesktopAPI()
    window = webview.create_window(
        title="Bijli Nazar - Electricity Watch",
        url=index_file,
        js_api=api,
        width=380,
        height=660,
        resizable=True
    )
    api.set_window(window)
    webview.start()


if __name__ == '__main__':
    main()
