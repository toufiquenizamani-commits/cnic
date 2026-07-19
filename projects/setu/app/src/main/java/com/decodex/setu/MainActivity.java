package com.decodex.setu;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private WebView mWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Initialize WebView directly as the content view for maximum layout efficiency
        mWebView = new WebView(this);
        setContentView(mWebView);

        // Configure WebView settings for standard modern local web apps
        WebSettings settings = mWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        
        // Critical for offline assets file loading
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        
        // Disable viewport zooming to keep native feel intact
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);

        // Force hardware rendering acceleration for smooth visual transitions
        mWebView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        
        // Enable Google Safe Browsing protection natively if supported on Android Oreo+
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WebView.startSafeBrowsing(this, new android.webkit.ValueCallback<Boolean>() {
                @Override
                public void onReceiveValue(Boolean success) {
                    android.util.Log.d("CNICDecodex_Native", "Safe Browsing initialized: " + success);
                }
            });
        }
        
        mWebView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(android.webkit.ConsoleMessage consoleMessage) {
                android.util.Log.d("CNICDecodex_Web", consoleMessage.message() + " -- From line "
                        + consoleMessage.lineNumber() + " of " + consoleMessage.sourceId());
                return true;
            }
        });
        
        // Add native bridge interface for Javascript to trigger haptics
        mWebView.addJavascriptInterface(new AndroidBridge(this), "AndroidBridge");
        
        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // Intercept SMS, calls, mail, and WhatsApp profile links to launch in native external apps
                if (url.startsWith("sms:") || url.startsWith("tel:") || url.startsWith("mailto:") || url.startsWith("https://wa.me") || url.startsWith("http://wa.me")) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true;
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                } 
                // Intercept web searches (Google OSINT) and render inside custom native In-App Web Inspector
                else if (url.startsWith("http://") || url.startsWith("https://")) {
                    showInAppBrowser(url);
                    return true;
                }
                return false;
            }
        });

        // Load the main entry HTML from the local Android assets directory
        mWebView.loadUrl("file:///android_asset/index.html");
    }

    /**
     * Native JavaScript Interface to bridge haptic vibration feedback.
     */
    public static class AndroidBridge {
        private final android.os.Vibrator vibrator;

        AndroidBridge(android.content.Context context) {
            vibrator = (android.os.Vibrator) context.getSystemService(android.content.Context.VIBRATOR_SERVICE);
        }

        @android.webkit.JavascriptInterface
        public void haptic(String type) {
            if (vibrator == null || !vibrator.hasVibrator()) return;

            switch (type) {
                case "light":
                    if (android.os.Build.VERSION.SDK_INT >= 26) {
                        vibrator.vibrate(android.os.VibrationEffect.createOneShot(12, android.os.VibrationEffect.DEFAULT_AMPLITUDE));
                    } else {
                        vibrator.vibrate(12);
                    }
                    break;
                case "medium":
                    if (android.os.Build.VERSION.SDK_INT >= 26) {
                        vibrator.vibrate(android.os.VibrationEffect.createOneShot(35, 120));
                    } else {
                        vibrator.vibrate(35);
                    }
                    break;
                case "heavy":
                    if (android.os.Build.VERSION.SDK_INT >= 26) {
                        vibrator.vibrate(android.os.VibrationEffect.createOneShot(65, 180));
                    } else {
                        vibrator.vibrate(65);
                    }
                    break;
                case "success":
                    long[] successPattern = {0, 25, 45, 25, 45, 45};
                    if (android.os.Build.VERSION.SDK_INT >= 26) {
                        vibrator.vibrate(android.os.VibrationEffect.createWaveform(successPattern, -1));
                    } else {
                        vibrator.vibrate(successPattern, -1);
                    }
                    break;
                case "error":
                    long[] errorPattern = {0, 80};
                    if (android.os.Build.VERSION.SDK_INT >= 26) {
                        vibrator.vibrate(android.os.VibrationEffect.createWaveform(errorPattern, -1));
                    } else {
                        vibrator.vibrate(errorPattern, -1);
                    }
                    break;
            }
        }
    }


    /**
     * Programmatically constructs and presents a fullscreen In-App Web Inspector sheet.
     * This avoids context switching and keeps the user engaged within the application.
     */
    private void showInAppBrowser(String url) {
        final android.app.Dialog dialog = new android.app.Dialog(this, android.R.style.Theme_DeviceDefault_Light_NoActionBar_Fullscreen);
        
        // Root container
        android.widget.LinearLayout root = new android.widget.LinearLayout(this);
        root.setOrientation(android.widget.LinearLayout.VERTICAL);
        root.setBackgroundColor(android.graphics.Color.parseColor("#010b06")); // OLED midnight green background
        
        // Custom Toolbar Header
        android.widget.LinearLayout toolbar = new android.widget.LinearLayout(this);
        toolbar.setOrientation(android.widget.LinearLayout.HORIZONTAL);
        toolbar.setBackgroundColor(android.graphics.Color.parseColor("#0c1e14")); // Surface panel green
        toolbar.setPadding(36, 24, 36, 24);
        toolbar.setGravity(android.view.Gravity.CENTER_VERTICAL);
        
        // Web Inspector title text
        android.widget.TextView title = new android.widget.TextView(this);
        title.setText("Web Search Inspector");
        title.setTextColor(android.graphics.Color.parseColor("#e8f5e9"));
        title.setTextSize(18);
        title.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        
        android.widget.LinearLayout.LayoutParams titleParams = new android.widget.LinearLayout.LayoutParams(
            0, android.widget.LinearLayout.LayoutParams.WRAP_CONTENT, 1.0f);
        title.setLayoutParams(titleParams);
        toolbar.addView(title);
        
        // Native close button on the right
        android.widget.Button closeBtn = new android.widget.Button(this);
        closeBtn.setText("Close");
        closeBtn.setTextColor(android.graphics.Color.parseColor("#ff5252"));
        closeBtn.setBackgroundColor(android.graphics.Color.TRANSPARENT);
        closeBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
            }
        });
        toolbar.addView(closeBtn);
        
        root.addView(toolbar);
        
        // Embedded WebView content browser
        WebView webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setSupportZoom(true);
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);
        
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });
        
        android.widget.LinearLayout.LayoutParams webViewParams = new android.widget.LinearLayout.LayoutParams(
            android.widget.LinearLayout.LayoutParams.MATCH_PARENT, 0, 1.0f);
        webView.setLayoutParams(webViewParams);
        root.addView(webView);
        
        dialog.setContentView(root);
        dialog.show();
        
        webView.loadUrl(url);
    }


    @Override
    public void onBackPressed() {
        // Intercept Android hardware Back button press: Go back in web view history if possible
        if (mWebView != null && mWebView.canGoBack()) {
            mWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
