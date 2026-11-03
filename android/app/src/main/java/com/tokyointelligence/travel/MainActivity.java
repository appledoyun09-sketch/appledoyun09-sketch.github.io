package com.tokyointelligence.travel;

import android.Manifest;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.GeolocationPermissions;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.JavascriptInterface;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import androidx.webkit.WebViewAssetLoader;

public class MainActivity extends Activity {
    private static final String HOME = "https://appassets.androidplatform.net/assets/index.html";
    private static final String HOST = "appassets.androidplatform.net";
    private static final int SELECT_JSON = 202;
    private static final int LOCATION_REQUEST = 203;
    private static final int EXPORT_JSON = 204;
    private String pendingBackup = null;
    private WebView web;
    private ValueCallback<Uri[]> fileCallback;
    private GeolocationPermissions.Callback locationCallback;
    private String locationOrigin;

    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(Color.rgb(8, 22, 41));
        getWindow().setNavigationBarColor(Color.rgb(8, 22, 41));
        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();
        web = new WebView(this);
        web.setBackgroundColor(Color.rgb(7, 18, 31));
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true);
        web.getSettings().setAllowContentAccess(false);
        web.getSettings().setAllowFileAccess(false);
        web.getSettings().setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        web.getSettings().setMediaPlaybackRequiresUserGesture(true);
        web.getSettings().setGeolocationEnabled(true);
        web.getSettings().setJavaScriptCanOpenWindowsAutomatically(false);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) web.getSettings().setSafeBrowsingEnabled(true);
        web.addJavascriptInterface(new BackupBridge(), "AndroidBridge");
        web.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (uri == null) return true;
                if ("https".equals(uri.getScheme()) && HOST.equals(uri.getHost())) return false;
                if ("https".equals(uri.getScheme()) || "geo".equals(uri.getScheme())) {
                    try { startActivity(new Intent(Intent.ACTION_VIEW, uri)); } catch (ActivityNotFoundException ignored) {}
                }
                return true;
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                Uri uri = Uri.parse(origin);
                if (!HOST.equals(uri.getHost())) {callback.invoke(origin, false, false);return;}
                locationOrigin = origin; locationCallback = callback;
                if (checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED || checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                    callback.invoke(origin, true, false); locationCallback = null;
                } else requestPermissions(new String[]{Manifest.permission.ACCESS_COARSE_LOCATION, Manifest.permission.ACCESS_FINE_LOCATION}, LOCATION_REQUEST);
            }
            @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                Intent pick = new Intent(Intent.ACTION_GET_CONTENT);
                pick.setType("application/json"); pick.addCategory(Intent.CATEGORY_OPENABLE);
                try {startActivityForResult(Intent.createChooser(pick, "JSON 백업 선택"), SELECT_JSON); return true;}
                catch (ActivityNotFoundException ex) { fileCallback = null; callback.onReceiveValue(null); return false; }
            }
        });
        setContentView(web);
        web.loadUrl(HOME);
    }
    private class BackupBridge {
        @JavascriptInterface public void saveBackup(String content) {
            if (content == null || content.length() > 2_000_000) return;
            runOnUiThread(() -> {
                pendingBackup = content;
                Intent save = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                save.addCategory(Intent.CATEGORY_OPENABLE);
                save.setType("application/json");
                save.putExtra(Intent.EXTRA_TITLE, "tokyo-intelligence-backup.json");
                try {startActivityForResult(save, EXPORT_JSON);} catch (ActivityNotFoundException ignored) { pendingBackup = null; }
            });
        }
    }
    @Override public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] results) {
        super.onRequestPermissionsResult(requestCode, permissions, results);
        if (requestCode == LOCATION_REQUEST && locationCallback != null) {
            boolean ok = false;
            for (int value : results) if (value == PackageManager.PERMISSION_GRANTED) ok = true;
            locationCallback.invoke(locationOrigin, ok, false);
            locationCallback = null;
        }
    }
    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == EXPORT_JSON) {
            if (pendingBackup != null && resultCode == Activity.RESULT_OK && data != null && data.getData() != null) {
                try (OutputStream output = getContentResolver().openOutputStream(data.getData())) {
                    if (output != null) output.write(pendingBackup.getBytes(StandardCharsets.UTF_8));
                } catch (Exception ignored) { }
            }
            pendingBackup = null;
            return;
        }
        if (requestCode == SELECT_JSON && fileCallback != null) {
            Uri chosen = resultCode == Activity.RESULT_OK && data != null ? data.getData() : null;
            fileCallback.onReceiveValue(chosen == null ? null : new Uri[]{chosen});
            fileCallback = null;
        }
    }
    @Override public void onBackPressed() {
        if (web != null && web.canGoBack()) web.goBack(); else super.onBackPressed();
    }
    @Override protected void onDestroy() {
        if (web != null) {web.destroy(); web = null;}
        super.onDestroy();
    }
}