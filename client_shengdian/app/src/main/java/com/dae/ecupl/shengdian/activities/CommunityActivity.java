package com.dae.ecupl.shengdian.activities;

import android.graphics.Color;
import android.os.Bundle;
import android.support.design.widget.TabLayout;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.widget.Toast;

import com.dae.ecupl.shengdian.App;
import com.dae.ecupl.shengdian.R;
import com.dae.ecupl.shengdian.adapter.HomePagerAdapter;
import com.dae.ecupl.shengdian.engines.Engine;
import com.dae.ecupl.shengdian.fragment.CmuActFragment;
import com.dae.ecupl.shengdian.fragment.CmuMainFragment;
import com.dae.ecupl.shengdian.fragment.CmuMemFragment;
import com.dae.ecupl.shengdian.fragment.CmuVideoFragment;
import com.dae.ecupl.shengdian.models.CmuInfo;
import com.dae.ecupl.shengdian.models.EventModel;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Created by ASUS on 2017/6/22.
 */

public class CommunityActivity extends AppCompatActivity {
    private static final String TAG = "CommunityActivity";
    private static final String EVENTS = "events";
    private Engine mEngine;
    private String cid;
    public CmuInfo info;
    public List members;
    public List<EventModel> events;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_community);
        mEngine = App.getInstance().getEngine();
        cid = this.getIntent().getExtras().getString("cid");

        initView();
    }

    private void initView(){
        Toolbar mToolbar = (Toolbar) findViewById(R.id.toolbar_community);
        mToolbar.setTitleTextColor(Color.WHITE);//设置ToolBar的titl颜色
        setSupportActionBar(mToolbar);

        ViewPager mViewPager = (ViewPager) findViewById(R.id.viewpager_community);
        HomePagerAdapter viewPagerAdapter = new HomePagerAdapter(getSupportFragmentManager());
        viewPagerAdapter.addFragment(CmuMainFragment.newInstance(), "主页");//添加Fragment
        viewPagerAdapter.addFragment(CmuActFragment.newInstance(), "举办活动");
        viewPagerAdapter.addFragment(CmuMemFragment.newInstance(), "成员");
        viewPagerAdapter.addFragment(CmuVideoFragment.newInstance(), "活动视频");
        mViewPager.setAdapter(viewPagerAdapter);//设置适配器

        TabLayout mTabLayout = (TabLayout) findViewById(R.id.tabLayout_community);
        mTabLayout.addTab(mTabLayout.newTab());//给TabLayout添加Tab
        mTabLayout.addTab(mTabLayout.newTab());
        mTabLayout.addTab(mTabLayout.newTab());
        mTabLayout.addTab(mTabLayout.newTab());
        mTabLayout.setupWithViewPager(mViewPager);//给TabLayout设置关联ViewPager，如果设置了ViewPager，那么ViewPagerAdapter中的getPageTitle()方法返回的就是Tab上的标题

    }
}
