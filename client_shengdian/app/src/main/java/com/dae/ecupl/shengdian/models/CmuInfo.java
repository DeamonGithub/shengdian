package com.dae.ecupl.shengdian.models;

import java.util.List;

/**
 * Created by ASUS on 2017/6/22.
 */

public class CmuInfo {
    public String cname;
    public String cid;
    public String profile;
    public String signup;
    public String star;
    public String member_count;
    public String school;
    public List<UserModel> members;
    public List<EventModel> activities;


    public CmuInfo(String cname, String cid, String profile, String signup, String star,
                   String member_count, String school, List members, List<EventModel> activities) {
        this.cname = cname;
        this.cid = cid;
        this.profile = profile;
        this.signup = signup;
        this.star = star;
        this.member_count = member_count;
        this.school = school;
        this.members = members;
        this.activities = activities;
    }

    @Override
    public String toString() {
        return "CmuInfo{" +
                "cname='" + cname + '\'' +
                ", cid='" + cid + '\'' +
                ", profile='" + profile + '\'' +
                ", signup='" + signup + '\'' +
                ", star='" + star + '\'' +
                ", member_count='" + member_count + '\'' +
                ", school='" + school + '\'' +
                ", members=" + members +
                ", activities=" + activities +
                '}';
    }
}
