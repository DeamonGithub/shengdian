package com.dae.ecupl.shengdian.fragment;

import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import com.dae.ecupl.shengdian.App;
import com.dae.ecupl.shengdian.R;
import com.dae.ecupl.shengdian.engines.Engine;
import com.dae.ecupl.shengdian.models.RefreshModel;
import com.facebook.drawee.view.SimpleDraweeView;

import java.util.ArrayList;
import java.util.List;

import cn.bingoogolapple.androidcommon.adapter.BGARecyclerViewAdapter;
import cn.bingoogolapple.androidcommon.adapter.BGAViewHolderHelper;
import cn.bingoogolapple.bgabanner.BGABanner;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Created by ASUS on 2017/4/26.
 */

public class CommunityFragment extends Fragment {
    private static final String TAG = "EventFragment";
    private SwipeRefreshLayout lay_fresh;
    private RecyclerView mContentRv;
    private CommunityFragment.ContentAdapter mContentAdapter;
    private BGABanner mBanner;
    private Engine mEngine;
    private ArrayList<String> aidArray = new ArrayList<>();
    public static CommunityFragment newInstance() {
        CommunityFragment fragment = new CommunityFragment();
        return fragment;
    }
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_event, container, false);
        /*initBase();*/
        mContentRv = (RecyclerView) v.findViewById(R.id.community_recyclerView);
        mEngine = App.getInstance().getEngine();
        loadContentData();

        return v;
    }
    private void loadContentData() {
        Log.d(TAG, "loadContentData: called");
        mEngine.loadContentData("http://106.14.250.168/api/activity/list").enqueue(new Callback<List<RefreshModel>>() {
            @Override
            public void onResponse(Call<List<RefreshModel>> call, Response<List<RefreshModel>> response) {
                List<RefreshModel> list = response.body();
                for(RefreshModel r : list){
                    aidArray.add(r.aid);
                }
                mContentAdapter.setData(response.body());
            }

            @Override
            public void onFailure(Call<List<RefreshModel>> call, Throwable t) {
                Toast.makeText(App.getInstance(), "加载内容数据失败", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private class ContentAdapter extends BGARecyclerViewAdapter<RefreshModel> {

        public ContentAdapter(RecyclerView recyclerView) {
            super(recyclerView, R.layout.item_normal);
        }

        @Override
        protected void fillData(BGAViewHolderHelper helper, int position, RefreshModel model) {
            helper.setText(R.id.tv_item_normal_title, model.title).setText(R.id.tv_item_normal_detail, model.site);
            if(model.illustration != null){
                Uri uri = Uri.parse(model.illustration);
                SimpleDraweeView draweeView = helper.getView(R.id.iv_event_illustration);
                draweeView.setImageURI(uri);
            }
        }
    }
 

}
