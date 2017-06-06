package com.dae.ecupl.shengdian.activities;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.dae.ecupl.shengdian.R;

/**
 * Created by ASUS on 2017/5/30.
 */

public class EventDetailActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_event_detial);
        String aid = this.getIntent().getExtras().getString("aid");

        WebView webView = (WebView) findViewById(R.id.webv_event_detial);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl("http://106.14.250.168/tdetail.html?aid=" + aid);

    }

}
