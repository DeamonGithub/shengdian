package com.dae.ecupl.shengdian;

/**
 * Created by ASUS on 2017/4/7.
 */
import android.app.Application;
import android.util.Log;

import com.facebook.drawee.backends.pipeline.Fresco;

import com.dae.ecupl.shengdian.engines.Engine;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * 作者:daemon 邮件:1490802761@qq.com
 * 创建时间:17/4/7 下午10:13
 * 描述:
 */
public class App extends Application {
    private static App sInstance;
    private Engine mEngine;

    @Override
    public void onCreate() {
        super.onCreate();

        sInstance = this;
        mEngine = new Retrofit.Builder()
                .baseUrl("http://7xk9dj.com1.z0.glb.clouddn.com/banner/api/") //主站域名
                .addConverterFactory(GsonConverterFactory.create()) //
                .build().create(Engine.class);
       /* mEngine = new Retrofit.Builder()
                .baseUrl("http://106.14.250.168/api/") //主站域名
                .addConverterFactory(GsonConverterFactory.create()) //
                .build().create(Engine.class);*/
        Fresco.initialize(this);

    }

    public static App getInstance() {
        return sInstance;
    }

    public Engine getEngine() {
        return mEngine;
    }
}