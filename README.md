# KernelSU Grant Toast
##### 让KernelSU像Magisk一样弹出'授予超级用户权限' Toast
### 与原版的区别
本分支基于 [NativeStar/KernelSUGrantToast](https://github.com/NativeStar/KernelSUGrantToast)，修改如下：
- **改用 uid 判断**：原版通过遍历 /proc 回溯 ppid 获取应用名，改为通过 `getPackagesForUid` 直接获取，更高效？（至少不用追它的父进程了）
- **shell 提权提示**：shell（adb 等）申请 root 权限时同样会弹出 Toast，显示 "shell"（或许可以防止横向提权？比如你给了setuid权限）
### 截图
![](./mdAssets/1000132279.png)
![](./mdAssets/1000130680.png)
![](./mdAssets/Screenshot_2026-06-23-12-30-38-50_com.termux~2.png)
### 功能
- 在应用提权时弹出Toast提醒
- 支持自定义提醒文本
- 支持忽略指定应用的提权提醒
### 安装
在Release中下载模块包后进入KernelSU中选中模块包安装即可

安装完成后需要重启生效 记得在重启前确保SuLog功能已启用

该模块不依赖Zygisk和MetaModule
### 兼容性提醒
模块仅限最新(支持SuLog的版本)KernelSU使用 且仅在官方版本上测试

对其他分支版本兼容性未知 理论上如果未对SuLog功能进行修改就能正常工作
### 原理
KernelSU在开启SuLog功能后 会拉起一个常驻的ksud进程用于接收由内核转发的日志数据并将其写入文件

该数据实时性极高 完全足够用作事件监测

安装模块后 当设备启动完成 模块将杀死原有负责日志写入的ksud进程并获取用于接收相关数据的文件描述符(该描述符只能被一个进程持有 故必须杀死ksud进程)接手事件处理

如果发现有Android应用被授予root权限 模块将获取该应用的相关信息 并在满足条件时弹出提醒
### 注意
由于原本负责写入日志文件的进程在设备启动完成后即被杀死 原本的SuLog将停止记录

并且为避免文件堆积 在模块启动完成后会将旧的SuLog日志文件删除

因此你将无法在管理器中查看SuLog数据

(理论上也可以不杀死进程 通过监听日志文件变化实现获取信息 但这么做性能可能不佳)

### 最后

