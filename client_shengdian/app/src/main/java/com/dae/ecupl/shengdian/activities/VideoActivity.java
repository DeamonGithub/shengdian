package com.dae.ecupl.shengdian.activities;

import android.net.Uri;
import android.os.Bundle;
import android.os.PersistableBundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;

import com.bumptech.glide.Glide;
import com.dae.ecupl.shengdian.widget.media.AndroidMediaController;
import com.dae.ecupl.shengdian.widget.media.IjkVideoView;

import tv.danmaku.ijk.media.player.IjkMediaPlayer;
import com.dae.ecupl.shengdian.R;
/**
 * Created by ASUS on 2017/7/5.
 */

public class VideoActivity extends AppCompatActivity{
    private static final String TAG = "VideoActivity";
    private String mVideoPath = "http://106.14.250.168/jinan.mp4";
    private Uri mVideoUri;
    private IjkVideoView mVideoView;
    private AndroidMediaController mMediaController;
    private boolean mBackPressed;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_video);
        IjkMediaPlayer.loadLibrariesOnce(null);
        IjkMediaPlayer.native_profileBegin("libijkplayer.so");
//        mMediaController = new AndroidMediaController(this, false);

        mVideoView = (IjkVideoView) findViewById(R.id.video_view);
        if(mVideoView == null){
            Log.d(TAG, "onCreate: videoView is null");
        }
//        mVideoView.setMediaController(mMediaController);
        // prefer mVideoPath
        if (mVideoPath != null)
            mVideoView.setVideoPath(mVideoPath);
        else if (mVideoUri != null)
            mVideoView.setVideoURI(mVideoUri);
        else {
            Log.e(TAG, "Null Data Source\n");
            finish();
            return;
        }
        mVideoView.start();
    }

    @Override
    public void onBackPressed() {
        mBackPressed = true;

        super.onBackPressed();
    }

    @Override
    protected void onStop() {
        super.onStop();

        if (mBackPressed || !mVideoView.isBackgroundPlayEnabled()) {
            mVideoView.stopPlayback();
            mVideoView.release(true);
            mVideoView.stopBackgroundPlay();
        } else {
            mVideoView.enterBackground();
        }
        IjkMediaPlayer.native_profileEnd();
    }


}
