package com.dae.ecupl.shengdian.models;

/**
 * Created by ASUS on 2017/6/6.
 */

public class CommunityModel {
    private String cid;
    private String name;
    private String avatar_url;
    private String member_count;
    private String school;
    private String star;


    public CommunityModel(String cid, String name, String avatar_url, String member_count, String school, String star) {
        this.cid = cid;
        this.name = name;
        this.avatar_url = avatar_url;
        this.member_count = member_count;
        this.school = school;
        this.star = star;
    }

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAvatar_url() {
        return avatar_url;
    }

    public void setAvatar_url(String avatar_url) {
        this.avatar_url = avatar_url;
    }

    public String getMember_count() {
        return member_count;
    }

    public void setMember_count(String member_count) {
        this.member_count = member_count;
    }

    public String getSchool() {
        return school;
    }

    public void setSchool(String school) {
        this.school = school;
    }

    public String getStar() {
        return star;
    }

    public void setStar(String star) {
        this.star = star;
    }
}
