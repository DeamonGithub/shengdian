package com.dae.ecupl.shengdian.security;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;

/**
 * Created by ASUS on 2017/7/4.
 */

public class CookieStore {
    public static void saveCookiePreference(Context context, String value, Boolean status) {
        SharedPreferences preference = context.getSharedPreferences("cookie", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = preference.edit();
        editor.putString("sid", value);
        editor.putBoolean("status", status);
        editor.apply();

    }

    public static String getCookiePreference(Context context) {
        SharedPreferences preference = context.getSharedPreferences("cookie", Context.MODE_PRIVATE);
        String s = preference.getString("sid", "non-exist");
        return s;
    }

    public static Boolean getUserStatus(Context context){
        SharedPreferences preference = context.getSharedPreferences("cookie", Context.MODE_PRIVATE);
        Boolean status = preference.getBoolean("status", false);
        return status;
    }
}
