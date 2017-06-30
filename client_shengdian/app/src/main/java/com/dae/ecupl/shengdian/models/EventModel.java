package com.dae.ecupl.shengdian.models;

/**
 * Created by ASUS on 2017/4/7.
 */


import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;

/**
 * 作者:王浩 邮件:bingoogolapple@gmail.com
 * 创建时间:15/5/21 14:53
 * 描述:
 */
public class EventModel implements Serializable {
    public String aid;
    public String title;
    public String start_at;
    public String end_at;
    public String site;
    public String cname;
    public String create_at;
    public String illustration;


    public String getAid() {
        return aid;
    }

    public void setAid(String aid) {
        this.aid = aid;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getStart_at() {
        return start_at;
    }

    public void setStart_at(String start_at) {
        this.start_at = start_at;
    }

    public String getEnd_at() {
        return end_at;
    }

    public void setEnd_at(String end_at) {
        this.end_at = end_at;
    }

    public String getSite() {
        return site;
    }

    public void setSite(String site) {
        this.site = site;
    }

    public String getCname() {
        return cname;
    }

    public void setCname(String cname) {
        this.cname = cname;
    }

    public String getCreate_at() {
        return create_at;
    }

    public void setCreate_at(String create_at) {
        this.create_at = create_at;
    }

    public String getIllustration() {
        return illustration;
    }

    public void setIllustration(String illustration) {
        this.illustration = illustration;
    }


    @Override
    public String toString() {
        return "EventModel{" +
                "aid='" + aid + '\'' +
                ", title='" + title + '\'' +
                ", start_at='" + start_at + '\'' +
                ", end_at='" + end_at + '\'' +
                ", site='" + site + '\'' +
                ", cname='" + cname + '\'' +
                ", create_at='" + create_at + '\'' +
                ", illustration='" + illustration + '\'' +
                '}';
    }

    public EventModel() {
    }

    public EventModel(String aid, String title, String start_at, String end_at, String site, String cname, String create_at) {
        this.aid = aid;
        this.title = title;
        this.start_at = start_at;
        this.end_at = end_at;
        this.site = site;
        this.cname = cname;
        this.create_at = create_at;
    }

    public EventModel(String aid, String title, String start_at, String end_at, String site, String cname, String create_at, String illustration) {
        this.aid = aid;
        this.title = title;
        this.start_at = start_at;
        this.end_at = end_at;
        this.site = site;
        this.cname = cname;
        this.create_at = create_at;
        this.illustration = illustration;
    }



}