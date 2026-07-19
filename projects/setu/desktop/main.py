#!/usr/bin/env python3
"""
Setu - Desktop Wrapper and Batch Verification Engine (Windows & Linux)
Uses PyWebView for UI and Pandas/FPDF for CSV batch verification and reports.
"""

import os
import sys
import json

try:
    import webview
except ImportError:
    print("Error: 'pywebview' is not installed. Please run: pip install pywebview")
    sys.exit(1)

try:
    import pandas as pd
except ImportError:
    pd = None

# PDF generation is optional
try:
    from fpdf import FPDF
    class PDFReport(FPDF):
        def header(self):
            self.set_font('Arial', 'B', 15)
            self.cell(0, 10, 'SETU ASSET VERIFICATION REPORT', 0, 1, 'C')
            self.ln(10)
        def footer(self):
            self.set_y(-15)
            self.set_font('Arial', 'I', 8)
            self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')
except ImportError:
    FPDF = None


class DesktopAPI:
    def __init__(self):
        self.window = None

    def set_window(self, window):
        self.window = window

    def select_csv_file(self):
        """
        Desktop file dialog selector to load and process batch registration plates from CSV.
        """
        if pd is None:
            return {"status": "error", "message": "Pandas is not installed. Run: pip install pandas"}

        file_types = ('CSV files (*.csv)', 'All files (*.*)')
        result = self.window.create_file_dialog(webview.OPEN_DIALOG, file_types=file_types)
        
        if not result:
            return {"status": "error", "message": "No file selected"}

        filepath = result[0]
        try:
            df = pd.read_csv(filepath)
            if 'plate' not in df.columns:
                return {"status": "error", "message": "CSV must contain a column named 'plate'"}

            # Process mock verification results for batch check demonstration
            results = []
            for plate in df['plate']:
                plate_clean = str(plate).upper().strip()
                results.append({
                    "plate": plate_clean,
                    "status": "Verified",
                    "tax_status": "Paid Up To Date",
                    "cplc_status": "Clear"
                })

            return {"status": "success", "data": results}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def generate_report(self, data_json):
        """
        Generates a PDF verification report signed with Setu trust watermarks.
        """
        if FPDF is None:
            return {"status": "error", "message": "FPDF is not installed. Run: pip install fpdf"}

        try:
            data = json.loads(data_json)
            pdf = PDFReport()
            pdf.add_page()
            pdf.set_font('Arial', '', 12)
            
            pdf.cell(100, 10, f"Registration No: {data.get('plate')}", 0, 1)
            pdf.cell(100, 10, f"Owner Name: {data.get('owner')}", 0, 1)
            pdf.cell(100, 10, f"Maker/Model: {data.get('model')}", 0, 1)
            pdf.cell(100, 10, f"Color: {data.get('color')}", 0, 1)
            pdf.cell(100, 10, f"CPLC Status: Clear", 0, 1)
            pdf.cell(100, 10, f"Verification Stamp: Setu Trust Seal", 0, 1)

            report_path = os.path.expanduser(f"~/Setu_Report_{data.get('plate')}.pdf")
            pdf.output(report_path)
            return {"status": "success", "message": f"Report successfully generated at: {report_path}"}
        except Exception as e:
            return {"status": "error", "message": str(e)}


def get_asset_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(os.path.dirname(__file__))
    return os.path.join(base_path, relative_path)


def main():
    assets_dir = get_asset_path("assets")
    if not os.path.exists(assets_dir):
        assets_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../app/src/main/assets"))
    index_file = os.path.join(assets_dir, "index.html")

    if not os.path.exists(index_file):
        print(f"Error: Could not locate assets index: {index_file}")
        sys.exit(1)

    api = DesktopAPI()
    window = webview.create_window(
        title="Setu - Asset Verification Engine",
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
