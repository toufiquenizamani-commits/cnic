#!/bin/bash
# 🛠️ Pakistani App Suite - Standalone Desktop Compiler Script
# Automatically configures a sandboxed virtual environment, resolves assets,
# and packages each project into a single-file executable for Linux.

set -e

WORKSPACE_DIR="$(pwd)"
BUILD_ENV="$WORKSPACE_DIR/build_env"

echo "=========================================================="
echo "🚀 Starting Standalone Desktop Compilation Pipeline"
echo "=========================================================="

# 1. Setup Virtual Environment
if [ ! -d "$BUILD_ENV" ]; then
    echo "📦 Creating sandboxed build virtual environment..."
    python3 -m venv "$BUILD_ENV"
fi

echo "🔄 Activating build virtual environment..."
source "$BUILD_ENV/bin/activate"

echo "📥 Installing required compiler dependencies..."
pip install --upgrade pip
pip install pyinstaller pywebview fpdf pandas openpyxl

# 2. Compile Individual Projects
compile_project() {
    local name="$1"
    local path="$2"
    echo ""
    echo "----------------------------------------------------------"
    echo "⚡ Compiling Application: $name..."
    echo "----------------------------------------------------------"
    
    cd "$WORKSPACE_DIR/$path"
    
    # Run PyInstaller bundling the Android assets directory directly into the binary
    pyinstaller --clean --noconsole --onefile \
        --add-data "app/src/main/assets:assets" \
        --name="$name" \
        desktop/main.py
        
    echo "✅ Successfully compiled $name!"
    echo "📦 Binary output: $WORKSPACE_DIR/$path/dist/$name"
}

compile_project "bijli-nazar" "projects/bijli-nazar"
compile_project "setu" "projects/setu"
compile_project "mandi-matrix" "projects/mandi-matrix"
compile_project "safar-saathi" "projects/safar-saathi"

# 3. Clean up
echo ""
echo "=========================================================="
echo "🧹 Cleaning up compiler environment..."
deactivate
echo "🎉 All applications successfully compiled into standalone binaries!"
echo "=========================================================="
