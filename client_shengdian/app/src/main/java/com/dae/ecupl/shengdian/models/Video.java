package com.dae.ecupl.shengdian.models;

import java.util.Date;

/**
 * Created by ASUS on 2017/7/6.
 */

public class Video {
    private String vid;
    private String title;
    private String path;
    private String cid;
    private String site;
    private String detail;
    private Date start_at;
    private String illustration;

    public String getTitle() {
        return title;
    }

    public String getPath() {
        return path;
    }

    public String getVid() {
        return vid;
    }

    public String getIllustration() {
        return illustration;
    }

    public Video(String title, String vid, String path, String cid, String site, String detail, Date start_at, String illustration) {
        this.title = title;
        this.vid = vid;
        this.path = path;
        this.cid = cid;
        this.site = site;
        this.detail = detail;
        this.start_at = start_at;
        this.illustration = illustration;
    }

    @Override
    public String toString() {
        return "Video{" +
                "title='" + title + '\'' +
                ", path='" + path + '\'' +
                ", cid='" + cid + '\'' +
                ", site='" + site + '\'' +
                ", detail='" + detail + '\'' +
                ", start_at=" + start_at +
                ", illustration='" + illustration + '\'' +
                '}';
    }
}
