package com.dae.ecupl.shengdian.activities;

import android.content.Intent;
import android.graphics.Rect;
import android.os.Bundle;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.dae.ecupl.shengdian.App;

import com.dae.ecupl.shengdian.R;
import com.dae.ecupl.shengdian.engines.Engine;
import com.dae.ecupl.shengdian.models.BannerModel;
import com.dae.ecupl.shengdian.models.RefreshModel;

import java.util.List;

import cn.bingoogolapple.androidcommon.adapter.BGAOnRVItemClickListener;
import cn.bingoogolapple.androidcommon.adapter.BGARecyclerViewAdapter;
import cn.bingoogolapple.androidcommon.adapter.BGAViewHolderHelper;
import cn.bingoogolapple.bgabanner.BGABanner;
import cn.bingoogolapple.bgabanner.BGABannerUtil;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity
        implements NavigationView.OnNavigationItemSelectedListener, BGABanner.Adapter<ImageView, String>, BGABanner.Delegate<ImageView, String> {

    private RecyclerView mContentRv;
    private BGABanner mBanner;
    private ContentAdapter mContentAdapter;

    private Engine mEngine;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mContentRv = (RecyclerView) findViewById(R.id.content_main);

        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);

        mEngine = App.getInstance().getEngine();
        initRecyclerView();

        loadBannerData();
        loadContentData();


    }
    /**
     * 初始化RecyclerView
     */
    private void initRecyclerView() {
        // 初始化适配器
        mContentAdapter = new MainActivity.ContentAdapter(mContentRv);
        // 测试 item 点击事件
        mContentAdapter.setOnRVItemClickListener(new BGAOnRVItemClickListener() {
            @Override
            public void onRVItemClick(ViewGroup parent, View itemView, int position) {
                // 注意：即使加了 HeaderView，这里返回的 position 也是从 0 开始的，在 BGARecyclerViewAdapter 的内部已经帮开发者减去了 HeaderView
                Toast.makeText(itemView.getContext(), "position = " + position + " " + mContentAdapter.getItem(position).title, Toast.LENGTH_SHORT).show();
            }
        });
        // 添加 HeaderView
        mContentAdapter.addHeaderView(getHeaderView());

        RecyclerView.LayoutManager layoutManager;

        // 测试 LinearLayoutManager 的情况
//        layoutManager = new LinearLayoutManager(this);

        // 测试 GridLayoutManager 的情况
        layoutManager = new GridLayoutManager(this, 2);

        mContentRv.setLayoutManager(layoutManager);

        // 测试添加分割间隙
        mContentRv.addItemDecoration(new RecyclerView.ItemDecoration() {
            @Override
            public void getItemOffsets(Rect outRect, View view, RecyclerView parent, RecyclerView.State state) {
                int position = parent.getChildAdapterPosition(view);
                // 注意：由于加了一个  ，所以是大于 0 时才加分隔间隙。onCanvas 就不演示了
                if (position > 0) {
                    int halfPadding = BGABannerUtil.dp2px(view.getContext(), 4);
                    outRect.set(halfPadding, halfPadding, halfPadding, halfPadding);
                }
            }
        });

        // 注意：这里调用了 getHeaderAndFooterAdapter 方法
        mContentRv.setAdapter(mContentAdapter.getHeaderAndFooterAdapter());
    }

    /**
     * 初始化 HeaderView
     *
     * @return
     */
    private View getHeaderView() {
        View headerView = View.inflate(this, R.layout.layout_header, null);
        mBanner = (BGABanner) headerView.findViewById(R.id.banner);
        mBanner.setAdapter(this);
        mBanner.setDelegate(this);
        return headerView;
    }

    @Override
    public void fillBannerItem(BGABanner banner, ImageView itemView, String model, int position) {
        Glide.with(this)
                .load(model)
                .placeholder(R.drawable.p1)
                .error(R.drawable.p1)
                .dontAnimate()
                .centerCrop()
                .into(itemView);
    }

    @Override
    public void onBannerItemClick(BGABanner banner, ImageView imageView, String model, int position) {
        Toast.makeText(this, "点击了第" + (position + 1) + "页", Toast.LENGTH_SHORT).show();
    }

    /**
     * 加载头部广告条的数据
     */
    private void loadBannerData() {
        mEngine.fetchItemsWithItemCount(5).enqueue(new Callback<BannerModel>() {
            @Override
            public void onResponse(Call<BannerModel> call, Response<BannerModel> response) {
                BannerModel bannerModel = response.body();
                mBanner.setData(bannerModel.imgs, bannerModel.tips);
            }

            @Override
            public void onFailure(Call<BannerModel> call, Throwable t) {
                Toast.makeText(App.getInstance(), "加载广告条数据失败", Toast.LENGTH_SHORT).show();
            }
        });
    }

    /**
     * 加载内容列表数据
     */
    private void loadContentData() {
        mEngine.loadContentData("http://7xk9dj.com1.z0.glb.clouddn.com/refreshlayout/api/defaultdata.json").enqueue(new Callback<List<RefreshModel>>() {
            @Override
            public void onResponse(Call<List<RefreshModel>> call, Response<List<RefreshModel>> response) {
                mContentAdapter.setData(response.body());
            }

            @Override
            public void onFailure(Call<List<RefreshModel>> call, Throwable t) {
                Toast.makeText(App.getInstance(), "加载内容数据失败", Toast.LENGTH_SHORT).show();
            }
        });
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

        if (id == R.id.nav_camera) {

        } else if (id == R.id.nav_gallery) {

        } else if (id == R.id.nav_slideshow) {

        } else if (id == R.id.nav_manage) {

        } else if (id == R.id.nav_share) {

        } else if (id == R.id.nav_send) {

        }

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        drawer.closeDrawer(GravityCompat.START);
        return true;
    }

    private class ContentAdapter extends BGARecyclerViewAdapter<RefreshModel> {

        public ContentAdapter(RecyclerView recyclerView) {
            super(recyclerView, R.layout.item_normal);
        }

        @Override
        protected void fillData(BGAViewHolderHelper helper, int position, RefreshModel model) {
            helper.setText(R.id.tv_item_normal_title, model.title).setText(R.id.tv_item_normal_detail, model.detail);
        }
    }
}
