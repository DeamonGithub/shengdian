package com.dae.ecupl.shengdian.fragment;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import com.dae.ecupl.shengdian.App;
import com.dae.ecupl.shengdian.R;
import com.dae.ecupl.shengdian.engines.Engine;
import com.dae.ecupl.shengdian.models.CmuInfo;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Created by ASUS on 2017/6/22.
 * 社团主页
 */

public class CmuMainFragment extends Fragment {
    private static final String TAG = "CmuMainFragment";
    private String cid;
    private Engine mEngine;
    private CmuInfo info;
    private TextView mCnameTV;
    private TextView mProfileTV;
    private TextView mTotalActTV;
    private TextView mTotalMemTV;
    private TextView mSchoolTV;

    public static CmuMainFragment newInstance() {
        CmuMainFragment fragment = new CmuMainFragment();
        return fragment;
    }
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.pager_cmu_main, container, false);
        Log.d(TAG, "onCreateView: called");
        cid = getActivity().getIntent().getExtras().getString("cid");
        mEngine = App.getInstance().getEngine();

        mCnameTV = (TextView) v.findViewById(R.id.cname);
        mProfileTV = (TextView) v.findViewById(R.id.profile);
        mTotalActTV = (TextView) v.findViewById(R.id.total_act);
        mTotalMemTV = (TextView) v.findViewById(R.id.total_mem);
        mSchoolTV = (TextView) v.findViewById(R.id.school);


        loadContentData();

        return v;
    }



    private void loadContentData() {
        mEngine.loadCommunityInfo(cid).enqueue(new Callback<List<CmuInfo>>() {
            @Override
            public void onResponse(Call<List<CmuInfo>> call, Response<List<CmuInfo>> response) {
                List<CmuInfo> list = response.body();
                info = list.get(0);
                Log.d(TAG, "onResponse: info->"+info);
                if (info != null){
                    mCnameTV.setText(info.cname);
                    mProfileTV.setText(info.profile);
                    mTotalActTV.setText(info.star);
                    mTotalMemTV.setText(info.member_count);
                    mSchoolTV.setText(info.school);
                }
            }

            @Override
            public void onFailure(Call<List<CmuInfo>> call, Throwable t) {
                Log.d(TAG, "onFailure: load data failure!");
                Toast.makeText(App.getInstance(), "加载内容数据失败", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
