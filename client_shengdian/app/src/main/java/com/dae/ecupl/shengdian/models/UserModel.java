package com.dae.ecupl.shengdian.models;

import java.util.StringTokenizer;

/**
 * Created by ASUS on 2017/6/23.
 */

public class UserModel {
    public String sid;
    public String nickname;
    public String username;
    public String avatar;
    public String sex;
    public String school;
    public String feeling;
    public String password;
    public String snum;
    public String email;
    public String phone;
    public String lock;
    public String identity;
    public String favoriteActivities;

    public UserModel(String sid, String nickname, String avatar, String sex) {
        this.sid = sid;
        this.nickname = nickname;
        this.avatar = avatar;
        this.sex = sex;
    }

    public UserModel(String sid, String nickname, String username, String avatar,
                     String sex, String school, String feeling, String password, String snum,
                     String email, String phone, String lock, String identity, String favoriteActivities) {
        this.sid = sid;
        this.nickname = nickname;
        this.username = username;
        this.avatar = avatar;
        this.sex = sex;
        this.school = school;
        this.feeling = feeling;
        this.password = password;
        this.snum = snum;
        this.email = email;
        this.phone = phone;
        this.lock = lock;
        this.identity = identity;
        this.favoriteActivities = favoriteActivities;
    }

    @Override
    public String toString() {
        return "UserModel{" +
                "sid='" + sid + '\'' +
                ", nickname='" + nickname + '\'' +
                ", username='" + username + '\'' +
                ", avatar='" + avatar + '\'' +
                ", sex='" + sex + '\'' +
                ", school='" + school + '\'' +
                ", feeling='" + feeling + '\'' +
                ", password='" + password + '\'' +
                ", snum='" + snum + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", lock='" + lock + '\'' +
                ", identity='" + identity + '\'' +
                ", favoriteActivities='" + favoriteActivities + '\'' +
                '}';
    }
}
