package com.dae.ecupl.shengdian.activities;

/**
 * Created by ASUS on 2017/8/2.
 */
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import cn.bingoogolapple.bgabanner.BGABanner;
import com.dae.ecupl.shengdian.R;

public class GuideActivity extends Activity {
    private static final String TAG = GuideActivity.class.getSimpleName();
    private BGABanner mBackgroundBanner;
    private BGABanner mForegroundBanner;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        initView();
        setListener();
        processLogic();
    }

    private void initView() {
        setContentView(R.layout.activity_guide);
        mBackgroundBanner = (BGABanner) findViewById(R.id.banner_guide_background);
        mForegroundBanner = (BGABanner) findViewById(R.id.banner_guide_foreground);
    }

    private void setListener() {
        /**
         * 设置进入按钮和跳过按钮控件资源 id 及其点击事件
         * 如果进入按钮和跳过按钮有一个不存在的话就传 0
         * 在 BGABanner 里已经帮开发者处理了防止重复点击事件
         * 在 BGABanner 里已经帮开发者处理了「跳过按钮」和「进入按钮」的显示与隐藏
         */
        mForegroundBanner.setEnterSkipViewIdAndDelegate(R.id.btn_guide_enter, R.id.tv_guide_skip, new BGABanner.GuideDelegate() {
            @Override
            public void onClickEnterOrSkip() {
                startActivity(new Intent(GuideActivity.this, MainActivity.class));
                finish();
            }
        });
    }

    private void processLogic() {
        // 设置数据源
        mBackgroundBanner.setData(R.drawable.guide_bg_a, R.drawable.guide_bg_b);

        mForegroundBanner.setData(R.drawable.guide_bg_a, R.drawable.guide_bg_b);
    }

    @Override
    protected void onResume() {
        super.onResume();

        mBackgroundBanner.setBackgroundResource(android.R.color.white);
    }
}