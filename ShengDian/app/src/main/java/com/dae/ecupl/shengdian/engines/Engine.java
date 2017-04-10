package com.dae.ecupl.shengdian.engines;

/**
 * Created by ASUS on 2017/4/7.
 */

import java.util.List;

import com.dae.ecupl.shengdian.models.BannerModel;
import com.dae.ecupl.shengdian.models.RefreshModel;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;
import retrofit2.http.Url;


/**
 * 作者:陶俊宇 邮件:1490802761@qq.com
 * 创建时间:17/4/8 下午12:44
 * 描述:
 */
public interface Engine {

    @GET("{itemCount}item.json")
    Call<BannerModel> fetchItemsWithItemCount(@Path("itemCount") int itemCount);

    @GET
    Call<List<RefreshModel>> loadContentData(@Url String url);
}