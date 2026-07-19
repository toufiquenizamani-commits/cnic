#!/usr/bin/env python3
"""
Safar Saathi Pro - Desktop Wrapper and Trip Postcard Exporter
Uses PyWebView for layout rendering and FPDF for exporting travel itineraries.
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
    class TravelPostcardPDF(FPDF):
        def header(self):
            self.set_fill_color(10, 30, 18) # Forest Green
            self.rect(0, 0, 210, 40, 'F')
            self.set_text_color(212, 175, 55) # Gold
            self.set_font('Arial', 'B', 16)
            self.cell(0, 15, 'SAFAR SAATHI PRO - ROAD TRIP POSTCARD', 0, 1, 'C')
            self.set_font('Arial', 'I', 10)
            self.cell(0, 5, 'Your Personalized Road Trip Travelogue & Itinerary', 0, 1, 'C')
            self.ln(20)
        def footer(self):
            self.set_y(-15)
            self.set_font('Arial', 'I', 8)
            self.cell(0, 10, 'Safar Saathi Pro - Drive Safe, Explore More', 0, 0, 'C')
except ImportError:
    FPDF = None


class DesktopAPI:
    def __init__(self):
        self.window = None

    def set_window(self, window):
        self.window = window

    def export_trip_postcard(self, data_json):
        """
        Generates a printable travel postcard containing itinerary stats.
        """
        if FPDF is None:
            return {"status": "error", "message": "FPDF is not installed. Run: pip install fpdf"}

        try:
            data = json.loads(data_json)
            pdf = TravelPostcardPDF()
            pdf.add_page()
            
            pdf.set_text_color(17, 33, 23)
            pdf.set_font('Arial', 'B', 12)
            pdf.cell(0, 10, f"Route Name: {data.get('routeName')}", 0, 1)
            pdf.cell(0, 10, f"Selected Car: {data.get('car')}", 0, 1)
            pdf.ln(5)

            # Draw a stats box
            pdf.set_fill_color(244, 248, 245)
            pdf.rect(10, 75, 190, 35, 'F')
            pdf.set_font('Arial', 'B', 11)
            pdf.cell(0, 10, '  TRIP STATS SUMMARY', 0, 1)
            pdf.set_font('Arial', '', 10)
            pdf.cell(0, 8, f"  - Total Highway Distance: {data.get('distance')}", 0, 1)
            pdf.cell(0, 8, f"  - Estimated Travel Duration: {data.get('eta')}", 0, 1)
            pdf.cell(0, 8, f"  - Projected Fuel Outflow: Rs. {data.get('fuelCost')}", 0, 1)

            pdf_path = os.path.expanduser(f"~/Safar_Trip_Postcard.pdf")
            pdf.output(pdf_path)
            return {"status": "success", "message": f"Travel Postcard successfully saved at: {pdf_path}"}
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
        title="Safar Saathi Pro - Trip Planner",
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
