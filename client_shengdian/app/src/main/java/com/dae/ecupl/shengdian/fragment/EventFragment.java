package com.dae.ecupl.shengdian.fragment;

import android.content.Intent;
import android.graphics.Rect;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.dae.ecupl.shengdian.App;
import com.dae.ecupl.shengdian.R;
import com.dae.ecupl.shengdian.activities.EventDetailActivity;
import com.dae.ecupl.shengdian.engines.Engine;
import com.dae.ecupl.shengdian.models.BannerModel;
import com.dae.ecupl.shengdian.models.EventModel;
import com.facebook.drawee.view.SimpleDraweeView;

import java.util.ArrayList;
import java.util.List;

import cn.bingoogolapple.androidcommon.adapter.BGAOnRVItemClickListener;
import cn.bingoogolapple.androidcommon.adapter.BGARecyclerViewAdapter;
import cn.bingoogolapple.androidcommon.adapter.BGAViewHolderHelper;
import cn.bingoogolapple.bgabanner.BGABanner;
import cn.bingoogolapple.bgabanner.BGABannerUtil;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Created by ASUS on 2017/4/26.
 * 首页活动页
 */

public class EventFragment extends Fragment implements SwipeRefreshLayout.OnRefreshListener,
        BGABanner.Adapter<ImageView, String>, BGABanner.Delegate<ImageView, String>{
    private static final String TAG = "EventFragment";
    private SwipeRefreshLayout lay_fresh;
    private RecyclerView mContentRv;
    private ContentAdapter mContentAdapter;
    private BGABanner mBanner;
    private Engine mEngine;
    private ArrayList<String> aidArray = new ArrayList<>();



    public static EventFragment newInstance() {
        EventFragment fragment = new EventFragment();
        return fragment;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_event, container, false);
        mContentRv = (RecyclerView) v.findViewById(R.id.event_recyclerView);
        mEngine = App.getInstance().getEngine();
        initRecyclerView();

        loadBannerData();
        loadContentData();
        return v;
    }


    /**
     * 初始化RecyclerView
     */
    private void initRecyclerView() {
        // 初始化适配器
        mContentAdapter = new EventFragment.ContentAdapter(mContentRv);
        Log.d(TAG, "initRecyclerView: "+mContentAdapter);
        // 测试 item 点击事件
        mContentAdapter.setOnRVItemClickListener(new BGAOnRVItemClickListener() {
            @Override
            public void onRVItemClick(ViewGroup parent, View itemView, int position) {
                // 注意：即使加了 HeaderView，这里返回的 position 也是从 0 开始的，在 BGARecyclerViewAdapter 的内部已经帮开发者减去了 HeaderView
                // TODO: 2017/5/30
                //Toast.makeText(itemView.getContext(), "position = " + position + " " + mContentAdapter.getItem(position).title, Toast.LENGTH_SHORT).show();
                Intent i = new Intent(getActivity(), EventDetailActivity.class);
                i.putExtra("aid", aidArray.get(position));
                startActivity(i);
            }
        });
        // 添加 HeaderView
        mContentAdapter.addHeaderView(getHeaderView());

        RecyclerView.LayoutManager layoutManager;

        // 测试 LinearLayoutManager 的情况
//        layoutManager = new LinearLayoutManager(this);

        // 测试 GridLayoutManager 的情况
        layoutManager = new GridLayoutManager(getActivity(), 2);

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
        View headerView = View.inflate(getActivity(), R.layout.layout_header, null);
        mBanner = (BGABanner) headerView.findViewById(R.id.banner);
        mBanner.setAdapter(this);
        mBanner.setDelegate(this);
        return headerView;
    }



    @Override
    public void onBannerItemClick(BGABanner banner, ImageView imageView, String model, int position) {
        Toast.makeText(getActivity(), "点击了第" + (position + 1) + "页", Toast.LENGTH_SHORT).show();
    }

    /**
     * 加载头部广告条的数据
     */
    private void loadBannerData() {
        mEngine.fetchItemsWithItemCount().enqueue(new Callback<BannerModel>() {
            @Override
            public void onResponse(Call<BannerModel> call, Response<BannerModel> response) {
                BannerModel bannerModel = response.body();
                if(bannerModel != null){
                    mBanner.setData(bannerModel.imgs, bannerModel.tips);
                }
            }

            @Override
            public void onFailure(Call<BannerModel> call, Throwable t) {
                Toast.makeText(App.getInstance(), "加载推荐活动数据失败", Toast.LENGTH_SHORT).show();
            }
        });
    }

    /**
     * 加载内容列表数据
     */
    private void loadContentData() {
        Log.d(TAG, "loadContentData: called");
        mEngine.loadContentData("http://106.14.250.168/api/activity/list").enqueue(new Callback<List<EventModel>>() {
            @Override
            public void onResponse(Call<List<EventModel>> call, Response<List<EventModel>> response) {
                List<EventModel> list = response.body();
                if(list != null){
                    for(EventModel e : list){
                        aidArray.add(e.aid);
                    }
                }
                mContentAdapter.setData(response.body());
            }

            @Override
            public void onFailure(Call<List<EventModel>> call, Throwable t) {
                Toast.makeText(App.getInstance(), "加载内容数据失败", Toast.LENGTH_SHORT).show();
            }
        });
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

    @Override
    public void onRefresh() {
        Toast.makeText(App.getInstance(), "加载内容", Toast.LENGTH_SHORT).show();
    }

    // TODO: 2017/5/29   there is a bug in here,but i haven't time to debug it
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


    private class ContentAdapter extends BGARecyclerViewAdapter<EventModel> {

        public ContentAdapter(RecyclerView recyclerView) {
            super(recyclerView, R.layout.item_event);
        }

        @Override
        protected void fillData(BGAViewHolderHelper helper, int position, EventModel model) {
            helper.setText(R.id.tv_event_title, model.title);
            if(model.illustration != null){
                Uri uri = Uri.parse("http://106.14.250.168/"+model.illustration);
                SimpleDraweeView draweeView = helper.getView(R.id.sdv_event_ilt);
                draweeView.setImageURI(uri);
            }
        }
    }
}
