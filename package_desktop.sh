#!/bin/bash
# 📦 Standalone App Suite - Debian Package (.deb) Builder Script
# Structures compiled binaries into standard Debian installer formats,
# registers OS app shortcuts, and builds ready-to-install packages.

set -e

WORKSPACE_DIR="$(pwd)"
PACKAGES_OUT="$WORKSPACE_DIR/packages"
mkdir -p "$PACKAGES_OUT"

echo "=========================================================="
echo "🚀 Starting Debian Packaging Pipeline"
echo "=========================================================="

build_deb_package() {
    local name="$1"
    local path="$2"
    local version="1.0.0"
    local desc="$3"
    local category="$4"
    
    echo "📦 Structuring debian files for: $name..."
    
    local pkg_dir="$WORKSPACE_DIR/$path/build/${name}-debian"
    rm -rf "$pkg_dir"
    
    # 1. Create directory structure
    mkdir -p "$pkg_dir/DEBIAN"
    mkdir -p "$pkg_dir/usr/bin"
    mkdir -p "$pkg_dir/usr/share/applications"
    
    # 2. Copy compiled binary
    local binary_src="$WORKSPACE_DIR/$path/dist/$name"
    if [ ! -f "$binary_src" ]; then
        echo "❌ Error: Could not find compiled binary at $binary_src. Did you run compile_desktop.sh?"
        exit 1
    fi
    cp "$binary_src" "$pkg_dir/usr/bin/$name"
    chmod 755 "$pkg_dir/usr/bin/$name"
    
    # 3. Create Control metadata file
    cat <<EOF > "$pkg_dir/DEBIAN/control"
Package: $name
Version: $version
Section: utils
Priority: optional
Architecture: amd64
Depends: webkit2gtk, libgirepository-1.0-1
Maintainer: Toufique Nizamanai <toufiquenizamani@domain.com>
Description: $desc
EOF

    # 4. Create Desktop entry launcher shortcut
    cat <<EOF > "$pkg_dir/usr/share/applications/${name}.desktop"
[Desktop Entry]
Name=$(echo "$name" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1')
Comment=$desc
Exec=/usr/bin/$name
Icon=utilities-system-monitor
Terminal=false
Type=Application
Categories=$category;Utility;
EOF
    chmod 644 "$pkg_dir/usr/share/applications/${name}.desktop"

    # 5. Compile DEB package
    echo "⚡ Building Debian Package..."
    dpkg-deb --build "$pkg_dir" "$PACKAGES_OUT/${name}_${version}_amd64.deb"
    echo "✅ Successfully built: $PACKAGES_OUT/${name}_${version}_amd64.deb"
}

build_deb_package "bijli-nazar" "projects/bijli-nazar" "Audit electricity bill slabs and compliance thresholds offline." "Office"
build_deb_package "setu" "projects/setu" "Excise MTMIS vehicle card scanner and stolen license plates verifier." "Network"
build_deb_package "mandi-matrix" "projects/mandi-matrix" "Agricultural commodities wholesales price logs chalkboard." "Office"
build_deb_package "safar-saathi" "projects/safar-saathi" "Highway trip navigator, fuel optimizer, and drive HUD." "Maps"

echo ""
echo "=========================================================="
echo "🎉 Debian packages generated successfully inside $PACKAGES_OUT/"
echo "=========================================================="
