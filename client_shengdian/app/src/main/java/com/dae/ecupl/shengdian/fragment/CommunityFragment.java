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
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import com.dae.ecupl.shengdian.App;
import com.dae.ecupl.shengdian.R;
import com.dae.ecupl.shengdian.activities.CommunityActivity;
import com.dae.ecupl.shengdian.engines.Engine;
import com.dae.ecupl.shengdian.models.CmuList;
import com.facebook.drawee.view.SimpleDraweeView;

import java.util.ArrayList;
import java.util.List;

import cn.bingoogolapple.androidcommon.adapter.BGAOnRVItemClickListener;
import cn.bingoogolapple.androidcommon.adapter.BGARecyclerViewAdapter;
import cn.bingoogolapple.androidcommon.adapter.BGAViewHolderHelper;
import cn.bingoogolapple.bgabanner.BGABannerUtil;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Created by ASUS on 2017/4/26.
 */

public class CommunityFragment extends Fragment {
    private static final String TAG = "CommunityFragment";
    private SwipeRefreshLayout lay_fresh;
    private RecyclerView mContentRv;
    private CommunityFragment.ContentAdapter mContentAdapter;
    private Engine mEngine;
    private ArrayList<String> cidArray = new ArrayList<>();
    public static CommunityFragment newInstance() {
        CommunityFragment fragment = new CommunityFragment();
        return fragment;
    }
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_community, container, false);
        /*initBase();*/
        mContentRv = (RecyclerView) v.findViewById(R.id.community_recyclerView);
        mEngine = App.getInstance().getEngine();

        initRecyclerView();
        loadContentData();
        return v;
    }
    /**
     * 初始化RecyclerView
     */
    private void initRecyclerView() {
        // 初始化适配器
        mContentAdapter = new CommunityFragment.ContentAdapter(mContentRv);
        Log.d(TAG, "initRecyclerView: "+mContentAdapter);
        // 测试 item 点击事件
        mContentAdapter.setOnRVItemClickListener(new BGAOnRVItemClickListener() {
            @Override
            public void onRVItemClick(ViewGroup parent, View itemView, int position) {
                // 注意：即使加了 HeaderView，这里返回的 position 也是从 0 开始的，在 BGARecyclerViewAdapter 的内部已经帮开发者减去了 HeaderView
                // TODO: 2017/5/30
                //Toast.makeText(itemView.getContext(), "position = " + position + " " + mContentAdapter.getItem(position).title, Toast.LENGTH_SHORT).show();
                Intent i = new Intent(getActivity(), CommunityActivity.class);
                i.putExtra("cid", cidArray.get(position));
                startActivity(i);
            }
        });
        RecyclerView.LayoutManager layoutManager;

        // 测试 LinearLayoutManager 的情况
//        layoutManager = new LinearLayoutManager(this);

        // 测试 GridLayoutManager 的情况
        layoutManager = new GridLayoutManager(getActivity(), 3);

        mContentRv.setLayoutManager(layoutManager);

        // 测试添加分割间隙
        mContentRv.addItemDecoration(new RecyclerView.ItemDecoration() {
            @Override
            public void getItemOffsets(Rect outRect, View view, RecyclerView parent, RecyclerView.State state) {
                int position = parent.getChildAdapterPosition(view);
                // 注意：由于加了一个  ，所以是大于 0 时才加分隔间隙。onCanvas 就不演示了
                if (position > 0) {
                    int halfPadding = BGABannerUtil.dp2px(view.getContext(), 4);
                    //Log.d(TAG, "getItemOffsets: halfPadding: "+ halfPadding);
                    //outRect.set(halfPadding, halfPadding, halfPadding, halfPadding);
                    outRect.set(1, 1, 1, 1);
                }
            }
        });

        // 注意：这里调用了 getHeaderAndFooterAdapter 方法
        mContentRv.setAdapter(mContentAdapter.getHeaderAndFooterAdapter());
    }

    private void loadContentData() {
        Log.d(TAG, "loadContentData: called");
        mEngine.loadComunitiesList().enqueue(new Callback<List<CmuList>>() {
            @Override
            public void onResponse(Call<List<CmuList>> call, Response<List<CmuList>> response) {
                Log.d(TAG, "onResponse: response->" + response.body());
                Log.d(TAG, "onResponse: response->" + response.raw());
                Log.d(TAG, "onResponse: error->" + response.errorBody());
                List<CmuList> list = response.body();
                if(list != null){
                    for(CmuList r : list){
                        cidArray.add(r.cid);
                    }
                }
                mContentAdapter.setData(response.body());
            }

            @Override
            public void onFailure(Call<List<CmuList>> call, Throwable t) {
                Toast.makeText(App.getInstance(), "加载内容数据失败", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private class ContentAdapter extends BGARecyclerViewAdapter<CmuList> {

        public ContentAdapter(RecyclerView recyclerView) {
            super(recyclerView, R.layout.item_community);
        }

        @Override
        protected void fillData(BGAViewHolderHelper helper, int position, CmuList model) {
            helper.setText(R.id.tv_community_name, model.cname);
            if(model.avatar != null){
                Uri uri = Uri.parse("http://106.14.250.168"+model.avatar);
                //Uri uri = Uri.parse("http://106.14.250.168/avatar/community/70aa50a2014f38b35bf870021374eb06.jpg");
                SimpleDraweeView draweeView = helper.getView(R.id.sdv_community_item);
                draweeView.setImageURI(uri);
            }
        }
    }
 

}
