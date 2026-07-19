#!/usr/bin/env python3
"""
Mandi Matrix - Desktop Wrapper and PDF Rate List Exporter (Windows & Linux)
Uses PyWebView for UI rendering and FPDF for exporting daily commodity charts.
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
    class MandiPDF(FPDF):
        def header(self):
            self.set_font('Arial', 'B', 14)
            self.cell(0, 10, 'DAILY MANDI MATRIX RATE SHEET', 0, 1, 'C')
            self.set_font('Arial', 'I', 9)
            self.cell(0, 5, 'Official Wholesale vs Retail Market Index', 0, 1, 'C')
            self.ln(10)
        def footer(self):
            self.set_y(-15)
            self.set_font('Arial', 'I', 8)
            self.cell(0, 10, 'Mandi Matrix Utility - 100% Offline pricing audit data', 0, 0, 'C')
except ImportError:
    FPDF = None


class DesktopAPI:
    def __init__(self):
        self.window = None

    def set_window(self, window):
        self.window = window

    def export_rates_pdf(self, city, crops_json):
        """
        Generates a printable PDF rate card for retailers and grocers.
        """
        if FPDF is None:
            return {"status": "error", "message": "FPDF is not installed. Run: pip install fpdf"}

        try:
            crops = json.loads(crops_json)
            pdf = MandiPDF()
            pdf.add_page()
            
            pdf.set_font('Arial', 'B', 12)
            pdf.cell(0, 10, f"Region: {city}", 0, 1)
            pdf.ln(5)

            # Table Header
            pdf.set_font('Arial', 'B', 10)
            pdf.cell(60, 8, 'Commodity Name', 1)
            pdf.cell(60, 8, 'Wholesale (Mandi) Rate', 1)
            pdf.cell(60, 8, 'Retail (Mohalla) Rate', 1)
            pdf.ln()

            pdf.set_font('Arial', '', 10)
            for crop_name, details in crops.items():
                pdf.cell(60, 8, crop_name, 1)
                pdf.cell(60, 8, f"Rs. {details['wholesale']}/{details['unit']}", 1)
                pdf.cell(60, 8, f"Rs. {details['retail']}/{details['unit']}", 1)
                pdf.ln()

            pdf_path = os.path.expanduser(f"~/Mandi_Rates_{city}.pdf")
            pdf.output(pdf_path)
            return {"status": "success", "message": f"Daily Rate list successfully saved at: {pdf_path}"}
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
        title="Mandi Matrix - Agricultural Price Board",
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
 Maroon
