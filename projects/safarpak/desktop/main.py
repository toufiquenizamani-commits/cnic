#!/usr/bin/env python3
"""
Safar Suitcase - Desktop Wrapper and PDF Customs Declaration Exporter
Uses PyWebView for layout rendering and FPDF for exporting declaration receipts.
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
    class CustomsPDF(FPDF):
        def header(self):
            self.set_font('Arial', 'B', 14)
            self.cell(0, 10, 'FBR BORDER CUSTOMS DECLARATION RECEIPT', 0, 1, 'C')
            self.set_font('Arial', 'I', 9)
            self.cell(0, 5, 'Official Self-Declaration Travel Record', 0, 1, 'C')
            self.ln(10)
        def footer(self):
            self.set_y(-15)
            self.set_font('Arial', 'I', 8)
            self.cell(0, 10, 'Safar Suitcase Utility - Generated Offline', 0, 0, 'C')
except ImportError:
    FPDF = None


class DesktopAPI:
    def __init__(self):
        self.window = None

    def set_window(self, window):
        self.window = window

    def export_declaration_pdf(self, data_json):
        """
        Generates a printable FBR Customs Checklist PDF for travelers.
        """
        if FPDF is None:
            return {"status": "error", "message": "FPDF is not installed. Run: pip install fpdf"}

        try:
            data = json.loads(data_json)
            pdf = CustomsPDF()
            pdf.add_page()
            
            pdf.set_font('Arial', 'B', 12)
            pdf.cell(0, 10, f"Border Crossing: {data.get('border')}", 0, 1)
            pdf.ln(5)

            pdf.set_font('Arial', '', 10)
            pdf.cell(100, 8, f"Gold Declared: {data.get('gold')} grams", 0, 1)
            pdf.cell(100, 8, f"Cash Declared (USD): ${data.get('cash')}", 0, 1)
            pdf.cell(100, 8, f"Mobile Phones Quantity: {data.get('phones')}", 0, 1)
            pdf.ln(5)

            pdf.set_font('Arial', 'B', 10)
            pdf.cell(100, 8, f"Estimated Duty Tax: Rs. {data.get('tax')}", 0, 1)

            pdf_path = os.path.expanduser(f"~/Customs_Declaration_{data.get('border')}.pdf")
            pdf.output(pdf_path)
            return {"status": "success", "message": f"Customs declaration PDF saved at: {pdf_path}"}
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
        title="Safar Suitcase - Travel & Cargo Guide",
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
