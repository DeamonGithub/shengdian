package com.dae.ecupl.shengdian.activities;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.AppCompatButton;
import android.support.v7.widget.AppCompatEditText;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.dae.ecupl.shengdian.App;
import com.dae.ecupl.shengdian.R;
import com.dae.ecupl.shengdian.engines.Engine;
import com.dae.ecupl.shengdian.models.Auth;
import com.dae.ecupl.shengdian.models.CmuInfo;
import com.dae.ecupl.shengdian.security.CookieStore;

import java.util.List;

import okhttp3.internal.framed.Header;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


/**
 * Created by ASUS on 2017/7/4.
 */

public class LoginActivity extends AppCompatActivity implements View.OnClickListener{
    private static final String TAG = "LoginActivity";
    private AppCompatButton mLoginBtn;
    private AppCompatButton mSignupBtn;
    private AppCompatEditText mNameET;
    private AppCompatEditText mPwdET;
    private Engine mEngine;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        mEngine = App.getInstance().getEngine();

    }
    public void init(){
        mLoginBtn = (AppCompatButton) findViewById(R.id.login_btn);
        mSignupBtn = (AppCompatButton) findViewById(R.id.signup_btn);
        mNameET = (AppCompatEditText) findViewById(R.id.nick_et);
        mPwdET = (AppCompatEditText) findViewById(R.id.pwd_et);

    }


    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.login_btn:
                mEngine.loginAuth(mNameET.getText().toString(), mPwdET.getText().toString()).enqueue(new Callback<Auth>() {
                    @Override
                    public void onResponse(Call<Auth> call, Response<Auth> response) {
                        String cookie = response.headers().get("Cookie");
                        if(cookie != null && response.body().getResult().equals("0")){
                            CookieStore.saveCookiePreference(LoginActivity.this, cookie, true);
                        }else{
                            Log.d(TAG, "onResponse: cookie don't exis!");
                        }
                    }

                    @Override
                    public void onFailure(Call<Auth> call, Throwable t) {
                        Log.d(TAG, "onFailure: load data failure!");
                        Toast.makeText(App.getInstance(), "登陆失败！", Toast.LENGTH_SHORT).show();
                    }
                });

                break;
            case R.id.signup_btn:
                //// TODO: 2017/7/4
                break;
        }
    }
}
