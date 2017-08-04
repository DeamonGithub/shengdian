package com.dae.ecupl.shengdian.fragment;

import android.content.Intent;
import android.graphics.Rect;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import com.dae.ecupl.shengdian.App;
import com.dae.ecupl.shengdian.R;
import com.dae.ecupl.shengdian.activities.EventDetailActivity;
import com.dae.ecupl.shengdian.engines.Engine;
import com.dae.ecupl.shengdian.models.CmuInfo;
import com.dae.ecupl.shengdian.models.EventModel;
import com.dae.ecupl.shengdian.models.Video;
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
 * Created by ASUS on 2017/7/5.
 * 社团视频页
 */

public class CmuVideoFragment extends Fragment{

    private static final String TAG = "CmuActFragment";
    private RecyclerView mContentRv;
    private CmuVideoFragment.ContentAdapter mContentAdapter;
    private String cid;
    private Engine mEngine;
    private Video info;
    private ArrayList<String> vidArray = new ArrayList<>();
    private ArrayList<String> uriArray = new ArrayList<>();

    public static CmuActFragment newInstance() {
        CmuActFragment fragment = new CmuActFragment();
        return fragment;
    }
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        Log.d(TAG, "onCreateView: called!");
        View v = inflater.inflate(R.layout.pager_cmu_video, container, false);
        mEngine = App.getInstance().getEngine();
        mContentRv = (RecyclerView) v.findViewById(R.id.ryv_pager_cmu_video);
        cid = getActivity().getIntent().getExtras().getString("cid");
        initRecyclerView();

        loadContentData();
        return v;
    }

    /**
     * 初始化RecyclerView
     */
    private void initRecyclerView() {
        // 初始化适配器
        mContentAdapter = new CmuVideoFragment.ContentAdapter(mContentRv);
        Log.d(TAG, "initRecyclerView: "+mContentAdapter);
        // 测试 item 点击事件
        mContentAdapter.setOnRVItemClickListener(new BGAOnRVItemClickListener() {
            @Override
            public void onRVItemClick(ViewGroup parent, View itemView, int position) {
                // 注意：即使加了 HeaderView，这里返回的 position 也是从 0 开始的，在 BGARecyclerViewAdapter 的内部已经帮开发者减去了 HeaderView
                Intent i = new Intent(getActivity(), Video.class);
                i.putExtra("vid", vidArray.get(position));
                startActivity(i);
            }
        });

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
                if (position > 0) {
                    int halfPadding = BGABannerUtil.dp2px(view.getContext(), 4);
                    outRect.set(halfPadding, halfPadding, halfPadding, halfPadding);
                }
            }
        });

        // 注意：这里调用了 getHeaderAndFooterAdapter 方法
        mContentRv.setAdapter(mContentAdapter.getHeaderAndFooterAdapter());
    }

    private void loadContentData() {
        Log.d(TAG, "loadContentData: called");
        mEngine.loadVideoList(cid).enqueue(new Callback<List<Video>>() {
            @Override
            public void onResponse(Call<List<Video>> call, Response<List<Video>> response) {
                List<Video> list = response.body();
                info = list.get(0);
                if (!list.isEmpty()){
                    for (Video v : list){
                        vidArray.add(v.getVid());
                    }
                }
                mContentAdapter.setData(list);
            }

            @Override
            public void onFailure(Call<List<Video>> call, Throwable t) {
                Log.d(TAG, "onFailure: load data failure!");
                Toast.makeText(App.getInstance(), "加载内容数据失败", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private class ContentAdapter extends BGARecyclerViewAdapter<Video> {

        public ContentAdapter(RecyclerView recyclerView) {
            super(recyclerView, R.layout.item_video);
        }

        @Override
        protected void fillData(BGAViewHolderHelper helper, int position, Video model) {
            helper.setText(R.id.tv_video_title, model.getTitle());
            if(!model.getIllustration().isEmpty()){
                Uri uri = Uri.parse("http://106.14.250.168/"+model.getIllustration());
                Log.d(TAG, "fillData: "+"http://106.14.250.168/"+model.getIllustration());
                SimpleDraweeView draweeView = helper.getView(R.id.sdv_event_ilt);
                draweeView.setImageURI(uri);
            }
        }
    }


}
