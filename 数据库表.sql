-- phpMyAdmin SQL Dump
-- version 2.10.2
-- http://www.phpmyadmin.net
-- 
-- 主机: 10.165.35.203:3306
-- 生成日期: 2018 年 11 月 07 日 12:20
-- 服务器版本: 1.0.12
-- PHP 版本: 5.5.14

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

-- 
-- 数据库: ``
-- 

-- --------------------------------------------------------

-- 
-- 表的结构 `bj_sjs_jybhy_articles`
-- 

CREATE TABLE `bj_sjs_jybhy_articles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `authorid` varchar(32) NOT NULL,
  `createdate` int(10) unsigned NOT NULL,
  `updatetime` int(10) unsigned NOT NULL COMMENT '更新/擦亮时间',
  `pics` varchar(500) NOT NULL,
  `text` varchar(10000) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `url` varchar(1000) NOT NULL,
  `gps` varchar(50) NOT NULL,
  `gpsaddr` varchar(50) NOT NULL,
  `gpscity` varchar(10) NOT NULL,
  `type` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '0-98论坛99公告100商店101达人102PK103接龙',
  `eventid` int(10) unsigned NOT NULL,
  `title` varchar(1000) NOT NULL COMMENT '商品标题',
  `price` int(10) unsigned NOT NULL COMMENT '价格(分)',
  `unit` varchar(2) NOT NULL,
  `exchangecoin` int(10) unsigned NOT NULL COMMENT '积分抵扣额度',
  `exchangeprice` int(10) unsigned NOT NULL COMMENT '可换人民币额度',
  `exchangedesc` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '积分兑换说明',
  `telephone` varchar(11) NOT NULL,
  `viewcount` int(8) unsigned NOT NULL COMMENT '访问量',
  `deleted` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `masked` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '匿名',
  `disablecomment` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '禁止评论',
  PRIMARY KEY (`id`),
  KEY `authorid` (`authorid`,`gpscity`,`type`),
  KEY `title` (`title`(255),`price`),
  KEY `viewcount` (`viewcount`),
  KEY `deleted` (`deleted`),
  KEY `updatetime` (`updatetime`),
  KEY `priceexchange` (`exchangeprice`),
  KEY `masked` (`masked`),
  KEY `disablecomment` (`disablecomment`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

-- 
-- 表的结构 `bj_sjs_jybhy_books`
-- 

CREATE TABLE `bj_sjs_jybhy_books` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `isbn` varchar(20) NOT NULL,
  `ownerid` varchar(32) NOT NULL,
  `createdate` int(10) unsigned NOT NULL,
  `status` tinyint(1) unsigned NOT NULL COMMENT '0可借1已借出',
  `title` varchar(50) NOT NULL,
  `coverurl` varchar(100) NOT NULL,
  `telephone` varchar(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `isbn` (`isbn`,`ownerid`,`status`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

-- 
-- 表的结构 `bj_sjs_jybhy_coinhistory`
-- 

CREATE TABLE `bj_sjs_jybhy_coinhistory` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ownerid` varchar(32) CHARACTER SET utf8 NOT NULL,
  `value` int(10) NOT NULL,
  `createdate` int(10) unsigned NOT NULL,
  `msg` varchar(50) CHARACTER SET utf8 NOT NULL,
  `type` tinyint(1) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ownerid` (`ownerid`,`createdate`,`type`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

-- 
-- 表的结构 `bj_sjs_jybhy_comment`
-- 

CREATE TABLE `bj_sjs_jybhy_comment` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `authorid` varchar(32) NOT NULL,
  `articleid` int(10) unsigned NOT NULL,
  `replyid` int(10) unsigned NOT NULL,
  `text` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdate` int(10) unsigned NOT NULL,
  `deleted` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `authorid` (`authorid`,`articleid`,`replyid`,`createdate`),
  KEY `deleted` (`deleted`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

-- 
-- 表的结构 `bj_sjs_jybhy_exchangehistory`
-- 

CREATE TABLE `bj_sjs_jybhy_exchangehistory` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ownerid` varchar(32) CHARACTER SET utf8 NOT NULL,
  `goodsid` int(10) unsigned NOT NULL,
  `exchangecoin` int(10) unsigned NOT NULL,
  `exchangeprice` int(10) unsigned NOT NULL,
  `createdate` int(10) unsigned NOT NULL,
  `exchangetime` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ownerid` (`ownerid`,`goodsid`,`createdate`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

-- 
-- 表的结构 `bj_sjs_jybhy_formids`
-- 

CREATE TABLE `bj_sjs_jybhy_formids` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ownerid` varchar(32) CHARACTER SET utf8 NOT NULL,
  `formid` varchar(32) CHARACTER SET utf8 NOT NULL,
  `createdate` int(10) unsigned NOT NULL,
  `used` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `ownerid` (`ownerid`,`createdate`),
  KEY `used` (`used`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

-- 
-- 表的结构 `bj_sjs_jybhy_like`
-- 

CREATE TABLE `bj_sjs_jybhy_like` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` varchar(32) NOT NULL,
  `articleid` int(10) unsigned NOT NULL,
  `createdate` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `uid` (`uid`,`articleid`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

-- 
-- 表的结构 `bj_sjs_jybhy_livecams`
-- 

CREATE TABLE `bj_sjs_jybhy_livecams` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ownerid` varchar(32) CHARACTER SET utf8 NOT NULL,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `desc` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `url` varchar(500) CHARACTER SET utf8 NOT NULL,
  `thumb` varchar(100) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ownerid` (`ownerid`,`title`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

-- 
-- 表的结构 `bj_sjs_jybhy_members`
-- 

CREATE TABLE `bj_sjs_jybhy_members` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `openid` varchar(32) NOT NULL,
  `nickname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `headimg` varchar(150) NOT NULL,
  `gender` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '1男2女',
  `area` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `city` varchar(20) NOT NULL,
  `province` varchar(20) NOT NULL,
  `country` varchar(20) NOT NULL,
  `age` tinyint(2) unsigned NOT NULL,
  `slogan` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `tags` varchar(100) NOT NULL,
  `career` varchar(10) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `wechatid` varchar(20) NOT NULL,
  `qq` varchar(15) NOT NULL,
  `type` tinyint(1) unsigned NOT NULL DEFAULT '10' COMMENT '1管理2官方7认证商铺8认证业主10普通',
  `joindate` int(10) unsigned NOT NULL,
  `lastlogin` int(10) unsigned NOT NULL COMMENT '最后登录',
  `baned` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '封禁',
  `coin` int(10) unsigned NOT NULL DEFAULT '50' COMMENT '积分/代币',
  PRIMARY KEY (`id`),
  UNIQUE KEY `openid` (`openid`),
  KEY `gender` (`gender`,`city`,`province`,`country`,`type`,`joindate`),
  KEY `baned` (`baned`),
  KEY `area` (`area`),
  KEY `coin` (`coin`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

-- 
-- 表的结构 `bj_sjs_jybhy_services`
-- 

CREATE TABLE `bj_sjs_jybhy_services` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `telephone` varchar(50) NOT NULL,
  `type` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `text` varchar(5000) NOT NULL,
  `ownerid` varchar(32) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `title` (`title`,`type`),
  KEY `ownerid` (`ownerid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

-- 
-- 表的结构 `bj_sjs_jybhy_vote`
-- 

CREATE TABLE `bj_sjs_jybhy_vote` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` varchar(32) CHARACTER SET utf8 NOT NULL,
  `createdate` int(10) unsigned NOT NULL,
  `votevalue` tinyint(1) unsigned NOT NULL COMMENT '1反对2支持',
  `comment` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `articleid` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `authorid` (`uid`,`createdate`,`votevalue`,`articleid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

-- 
-- 表的结构 `bj_sjs_jybhy_werun`
-- 

CREATE TABLE `bj_sjs_jybhy_werun` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ownerid` varchar(32) CHARACTER SET utf8 NOT NULL,
  `stepcount` int(6) unsigned NOT NULL DEFAULT '0',
  `timestamp` int(10) unsigned NOT NULL,
  `updatetime` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ownerid` (`ownerid`,`stepcount`),
  KEY `wxtimestamp` (`timestamp`),
  KEY `updatetime` (`updatetime`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;
