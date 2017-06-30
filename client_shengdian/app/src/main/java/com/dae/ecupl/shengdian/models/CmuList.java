package com.dae.ecupl.shengdian.models;

/**
 * Created by ASUS on 2017/6/21.
 */

public class CmuList {
    public String cname;
    public String cid;
    public String profile;
    public String avatar;

    public String getCid() {
        return cid;
    }

    public String getCname() {
        return cname;
    }

    public String getProfile() {
        return profile;
    }

    public String getAvater() {
        return avatar;
    }

    public CmuList(String cname, String profile, String cid, String avatar) {
        this.cname = cname;
        this.profile = profile;
        this.cid = cid;
        this.avatar = avatar;
    }

    @Override
    public String toString() {
        return "CmuList{" +
                "cname='" + cname + '\'' +
                ", cid='" + cid + '\'' +
                ", profile='" + profile + '\'' +
                ", avater='" + avatar + '\'' +
                '}';
    }
}
