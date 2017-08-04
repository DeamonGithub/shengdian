package com.dae.ecupl.shengdian.fragment;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.dae.ecupl.shengdian.App;
import com.dae.ecupl.shengdian.R;
import com.dae.ecupl.shengdian.engines.Engine;
import com.facebook.drawee.view.SimpleDraweeView;

/**
 * Created by ASUS on 2017/4/26.
 */

public class TipsFragment extends Fragment {
    private Engine mEngine;
    private View mHotFir;
    private SimpleDraweeView mHotSec;
    private SimpleDraweeView mHotThi;

    public static TipsFragment newInstance() {
        TipsFragment fragment = new TipsFragment();
        return fragment;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_home, container, false);
        mEngine = App.getInstance().getEngine();

        return v;
    }

    public void init(View v){
        mHotFir  = v.findViewById(R.id.sdv_hot_fir);
    }
}
