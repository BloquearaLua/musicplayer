# musicplayer

使用html，css，JavaScript实现的一个简洁的音乐播放器，除了简单的播放、暂停和切歌功能，还能进行搜索，以及滚动查看歌词。音源来自网易云音乐，接口地址：[https://binaryify.github.io/NeteaseCloudMusicApi/#/](https://binaryify.github.io/NeteaseCloudMusicApi/#/)。

（本资源仅用于学习，请勿用作它途，如侵权请告知，删除处理。）

# 相关

## 环境要求

需要NodeJS 8.12+ 环境

### 安装

    $ git clone git@github.com:Binaryify/NeteaseCloudMusicApi.git 

	$ npm install

### 运行
	
    $ node app.js

## 相关接口
	
1. 搜索音乐：/cloudsearch?keywords= 海阔天空
2. 获取音乐url： /song/url?id=33894312
3. 查看音乐是否可用： /check/music?id=33894312
4. 获取歌词： /lyric?id=33894312

## 播放器界面

![image](https://github.com/BloquearaLua/musicplayer/blob/master/images/appearance.png)
