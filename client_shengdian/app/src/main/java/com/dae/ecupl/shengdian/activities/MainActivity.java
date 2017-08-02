package com.dae.ecupl.shengdian.activities;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.support.design.widget.NavigationView;
import android.support.design.widget.TabLayout;
import android.support.v4.view.GravityCompat;
import android.support.v4.view.ViewPager;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;

import com.dae.ecupl.shengdian.R;
import com.dae.ecupl.shengdian.adapter.HomePagerAdapter;
import com.dae.ecupl.shengdian.engines.Engine;
import com.dae.ecupl.shengdian.fragment.CommunityFragment;
import com.dae.ecupl.shengdian.fragment.EventFragment;
import com.dae.ecupl.shengdian.fragment.HomeFragment;

import cn.bingoogolapple.bgabanner.BGABanner;

public class MainActivity extends AppCompatActivity
        implements NavigationView.OnNavigationItemSelectedListener {

    private static String TAG = "MainActivity";
    private RecyclerView mContentRv;
    private BGABanner mBanner;

    private Engine mEngine;
    private Boolean status = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
//        SharedPreferences sharedPreferences = getSharedPreferences("cookie", CONTEXT_IGNORE_SECURITY);
//        status = sharedPreferences.getBoolean("status", false);

        Toolbar mToolbar = (Toolbar) findViewById(R.id.toolbar);
        mToolbar.setTitleTextColor(Color.WHITE);//
        if(status){
            mToolbar.setNavigationIcon(R.drawable.ic_avatar_boy); //todo 获取头像并填充
            mToolbar.setTitle("nickname");
        }else {
            mToolbar.setNavigationIcon(R.drawable.ic_avatar_boy);
            mToolbar.setTitle("未登录");
        }

//10064847  12786991
        setSupportActionBar(mToolbar);

        Log.d(TAG, "onCreate: flag1");
        ViewPager mViewPager = (ViewPager) findViewById(R.id.viewpager);
        HomePagerAdapter viewPagerAdapter = new HomePagerAdapter(getSupportFragmentManager());
        viewPagerAdapter.addFragment(EventFragment.newInstance(), "活动");
        viewPagerAdapter.addFragment(CommunityFragment.newInstance(), "社团");//添加Fragment
        viewPagerAdapter.addFragment(HomeFragment.newInstance(), "推荐");
        mViewPager.setAdapter(viewPagerAdapter);//设置适配器

        TabLayout mTabLayout = (TabLayout) findViewById(R.id.tabLayout);
        mTabLayout.addTab(mTabLayout.newTab());//给TabLayout添加Tab
        mTabLayout.addTab(mTabLayout.newTab());
        mTabLayout.addTab(mTabLayout.newTab());
        mTabLayout.setupWithViewPager(mViewPager);//给TabLayout设置关联ViewPager，如果设置了ViewPager，那么ViewPagerAdapter中的getPageTitle()方法返回的就是Tab上的标题

        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);


    }


    @Override
    public void onBackPressed() {
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @SuppressWarnings("StatementWithEmptyBody")
    @Override
    public boolean onNavigationItemSelected(MenuItem item) {
        // Handle navigation view item clicks here.
        int id = item.getItemId();

        if (id == R.id.nav_user) {
            Intent i = new Intent(MainActivity.this, VideoActivity.class);
            startActivity(i);
        } else if (id == R.id.nav_collection) {

        }

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        drawer.closeDrawer(GravityCompat.START);
        return true;
    }

}
