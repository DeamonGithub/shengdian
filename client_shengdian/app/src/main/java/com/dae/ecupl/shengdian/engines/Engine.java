package com.dae.ecupl.shengdian.engines;

/**
 * Created by ASUS on 2017/4/7.
 */

import java.util.List;

import com.dae.ecupl.shengdian.models.Auth;
import com.dae.ecupl.shengdian.models.BannerModel;
import com.dae.ecupl.shengdian.models.CmuInfo;
import com.dae.ecupl.shengdian.models.CmuList;
import com.dae.ecupl.shengdian.models.EventModel;
import com.dae.ecupl.shengdian.models.UserModel;
import com.dae.ecupl.shengdian.models.Video;

import retrofit2.Call;
import retrofit2.http.Field;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;
import retrofit2.http.Query;
import retrofit2.http.Url;


/**
 * 作者:陶俊宇 邮件:1490802761@qq.com
 * 创建时间:17/4/8 下午12:44
 * 描述:
 */
public interface Engine {

    @GET("http://106.14.250.168/api/adlist")
    Call<BannerModel> fetchItemsWithItemCount();

    @GET
    Call<List<EventModel>> loadContentData(@Url String url);

    @GET("/api/community/list")
    Call<List<CmuList>> loadComunitiesList();

    @GET("/api/community/info")
    Call<List<CmuInfo>> loadCommunityInfo(@Query("cid") String cid);

    @GET("")
    Call<BannerModel> bannerData();

    @POST("api/user/login")
    Call<Auth> loginAuth(@Field("name") String name, @Field("password") String password);

    @POST("api/community/video/list")
    Call<List<Video>> loadVideoList(@Field("cid") String cid);


}