/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2018/9/2 19:40:35                            */
/*==============================================================*/
CREATE DATABASE `yyfax_cms` CHARACTER SET utf8mb4 -- UTF-8 Unicode COLLATE utf8mb4_general_ci;

use yyfax_cms;

drop table if exists tb_activity;

drop table if exists tb_operate_log;

drop table if exists tb_model_config;

/*==============================================================*/
/* Table: tb_activity                                           */
/*==============================================================*/
create table tb_activity
(
   id                   int(11)                        not null auto_increment,
   activity_name        varchar(30)                    not null comment '活动名称',
   strategy_number      varchar(60)                    null comment '策略编号',
   start_time           datetime                       not null comment '上架时间',
   end_time             datetime                       not null comment '下架时间',
   activity_type        tinyint(1)                     not null comment '活动页类型 1: 注册页 2: 宣传页 3: 福利领取页',
   manager_name         varchar(20)                    not null comment '负责人名字',
   manager_id           varchar(20)                    not null comment '负责人',
   department_name      varchar(20)                    not null comment '负责人所属部门名',
   department_id        varchar(20)                    not null comment '复制人所属部门id',
   activity_desc        varchar(200)                   null comment '活动描述',
   share_title          varchar(20)                    null comment '分享标题',
   share_icon           varchar(100)                   null comment '分享图标',
   share_desc           varchar(200)                   null comment '分享描述',
   status               tinyint(1)                     not null comment '活动页状态 0:暂存, 1:上架, 2: 下架 3：删除',
   activity_json        longtext                       null comment '活动页配置',
   activity_page_url    varchar(200)                   null comment '活动页发布地址',
   stash_page_url       varchar(200)                   null comment '活动页暂存地址',
   store_name           varchar(50)                    null comment '商户名称',
   store_number         varchar(20)                    null comment '商户号',
   invitation_code      varchar(60)                    null comment '活动邀请码',
   create_time          datetime                       not null comment '创建时间',
   update_time          datetime                       not null comment '更新时间',
   constraint PK_TB_ACTIVITY primary key (id)
);
alter table tb_activity comment '活动页配置表';

/*==============================================================*/
/* Table: tb_operate_log                                        */
/*==============================================================*/
create table tb_operate_log
(
   id                   int(11)                        not null auto_increment,
   activity_id          int(11)                        not null comment '活动页id',
   action               varchar(20)                    not null comment '操作事件',
   state                tinyint(1)                     not null comment '操作后状态 0：暂存 1：上架 2：下架 3：删除',
   operator_name        varchar(20)                    not null comment '操作人名字',
   remark               varchar(200)                   not null comment '备注',
   operator_id          varchar(20)                    not null comment '操作人id',
   operator_department_name varchar(20)                not null comment '操作人所属部门',
   update_time          datetime                       not null comment '更新时间',
   create_time          datetime                       not null comment '创建时间',
   constraint PK_TB_OPERATE_LOG primary key (id)
);
alter table tb_operate_log comment '操作日志表';

/*==============================================================*/
/* Table: tb_model_config                                       */
/*==============================================================*/
create table tb_model_config
(
   id                   int(11)                        not null auto_increment,
   activity_type        tinyint(1)                     not null comment '活动页类型',
   activity_config      longtext                       not null comment '活动页默认配置',
   use_time             datetime                       null comment '使用时间',
   model_img            varchar(100)                   null comment '模块图片',
   create_time          datetime                       not null comment '创建时间',
   update_time          datetime                       not null comment '更新时间',
   constraint PK_TB_MODEL_CONFIG primary key (id)
);
alter table tb_model_config comment '默认配置表';
