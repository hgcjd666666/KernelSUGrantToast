package com.suisho.kernelsugranttoast;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Handler;
import android.os.Looper;
import android.os.Process;
import android.util.Log;
import android.util.LruCache;
import android.widget.Toast;

import org.lsposed.hiddenapibypass.HiddenApiBypass;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.HashSet;
import java.util.Locale;
import java.util.concurrent.TimeUnit;


public class Entry {
    private static final String TAG = "KernelSuGrantToast";
    private static Context systemContext;
    private static Handler handler;
    private static PackageManager packageManager;
    //缓存应用名 避免每次都走PackageManager
    private static final LruCache<String, String> appNameCache = new LruCache<>(32);
    private static String customToastText = Messages.getLocaleMessage();
    private static final HashSet<String> ignorePackageList = new HashSet<>();

    private static class TempArguments {
        public final short packageSearchDepth;
        public final boolean checkSuCompat;
        public final boolean autoDeleteLog;

        public TempArguments(short packageSearchDepth, boolean checkSuCompat, boolean autoDeleteLog) {
            this.packageSearchDepth = packageSearchDepth;
            this.checkSuCompat = checkSuCompat;
            this.autoDeleteLog = autoDeleteLog;
        }
    }

    @SuppressLint("UnsafeDynamicallyLoadedCode")
    public static void main(String[] args) {
        if(Process.myUid() != 0) {
            Log.e(TAG, "Need root access!!!");
            return;
        }
        try {
            var tmpArgs = parseArguments(args);
            HiddenApiBypass.addHiddenApiExemptions("Landroid/app/ActivityThread;");
            if(Looper.getMainLooper() == null) Looper.prepareMainLooper();
            @SuppressLint("PrivateApi") Class<?> activityThreadClass = Class.forName("android.app.ActivityThread");
            Object activityThread = HiddenApiBypass.invoke(activityThreadClass, null, "systemMain");
            Context context = (Context) HiddenApiBypass.invoke(activityThreadClass, activityThread, "getSystemContext");
            //uid0不能弹出toast
            systemContext = context.createPackageContext("android", 0);
            File localPath = new File("");
            File libraryFile = new File(localPath.getAbsolutePath(), "Shimizu");
            if(!libraryFile.exists()) {
                onInitFailed("Library file not found!Please reinstall module!!!");
                System.exit(1);
                return;
            }
            //确定没有崩掉再加载
            //app_process没法加载内置so
            System.load(libraryFile.getAbsolutePath());
            if(!jniInit(tmpArgs.packageSearchDepth, tmpArgs.checkSuCompat, tmpArgs.autoDeleteLog)) {
                onInitFailed("Native init failed!");
                System.exit(1);
                return;
            }
            modifyModuleDescription(String.format(Locale.getDefault(), "✅Working.PID:%d,Ignored package(s) count:%d", Process.myPid(), ignorePackageList.size()));
            //降权 不然就是java.lang.SecurityException: Package android is not owned by uid 0
            //等写入描述完成才执行 系统框架没模块目录权限
            jniSetUid(1000);
            //刚启动时不知道为啥占用会达到130MB 调用以加速回落
            System.gc();
            Log.i(TAG, "Init success!");
            Looper.loop();
        } catch (ClassNotFoundException | NoSuchMethodException | InvocationTargetException |
                 IllegalAccessException | PackageManager.NameNotFoundException |
                 RuntimeException e) {
            Log.e(TAG, "Failed to init!", e);
            //重新提权 否则无法执行ksud
            jniSetUid(0);
            onInitFailed("Init failed!");
            systemContext = null;
            System.exit(1);
        }
    }

    private static TempArguments parseArguments(String[] args) {
        short packageSearchDepth = 1;
        boolean checkSuCompat = false;
        boolean autoDeleteLog = false;
        //自定义提示文本
        if(args.length > 0 && args[0] != null) {
            String tempCustomText = args[0];
            Log.i(TAG, "Found custom toast text");
            if(tempCustomText.length() < 65 && tempCustomText.contains("%s")) {
                customToastText = tempCustomText;
            } else {
                Log.w(TAG, "Invalid custom toast text!");
            }
        } else {
            Log.i(TAG, "Use default toast text");
        }
        //忽略包列表
        if(args.length > 1 && args[1] != null) {
            String tempRawIgnorePackageList = args[1];
            Log.i(TAG, "Found ignore package list");
            if(!tempRawIgnorePackageList.isEmpty()) {
                String[] rawSplit = tempRawIgnorePackageList.split(";");
                for(String packageName : rawSplit) {
                    if(!packageName.isEmpty()) ignorePackageList.add(packageName);
                }
                Log.i(TAG, "Added all ignore package");
            } else {
                Log.w(TAG, "Invalid ignore package list");
            }
        }
        //搜索深度
        if(args.length > 2 && args[2] != null) {
            try {
                short tempSearchDepth = Short.parseShort(args[2]);
                Log.i(TAG, "Found custom package search depth");
                if(tempSearchDepth >= 0 && tempSearchDepth < 33) {
                    packageSearchDepth = tempSearchDepth;
                    Log.i(TAG, "Set package search depth to " + tempSearchDepth);
                } else {
                    Log.w(TAG, "Invalid package search depth!");
                }
            } catch (NumberFormatException numberFormatException) {
                Log.e(TAG, "Invalid package search depth!", numberFormatException);
            }
        }
        //compat检查
        if(args.length > 3 && args[3] != null) {
            try {
                Log.i(TAG, "Found check su compat setting");
                checkSuCompat = Boolean.parseBoolean(args[3]);
                Log.i(TAG, "Set check su compat to " + checkSuCompat);
            } catch (NumberFormatException numberFormatException) {
                Log.e(TAG, "Invalid check su compat setting!", numberFormatException);
            }
        }
        //自动移除log
        if(args.length > 4 && args[4] != null) {
            try {
                Log.i(TAG, "Found auto delete log setting");
                autoDeleteLog = Boolean.parseBoolean(args[4]);
                Log.i(TAG, "Set auto delete log to " + autoDeleteLog);
            } catch (NumberFormatException numberFormatException) {
                Log.e(TAG, "Invalid auto delete log setting!", numberFormatException);
            }
        }
        return new TempArguments(packageSearchDepth, checkSuCompat, autoDeleteLog);
    }

    private static void showToast(String pkgName) {
        if(handler == null) handler = new Handler(Looper.getMainLooper());
        handler.post(() -> Toast.makeText(systemContext, String.format(Locale.getDefault(), customToastText, pkgName), Toast.LENGTH_SHORT).show());
    }

    public static void jniOnFallbackSuEvent(String cmdline) {
        if(packageManager == null) packageManager = systemContext.getPackageManager();
        String packageName;
        if(cmdline.contains(":")) {
            int index = cmdline.indexOf(':');
            packageName = cmdline.substring(0, index);
        } else {
            packageName = cmdline;
        }
        //忽略提示的包名
        if(ignorePackageList.contains(packageName)) return;
        try {
            String cachedAppName = appNameCache.get(packageName);
            if(cachedAppName != null) {
                showToast(cachedAppName);
                return;
            }
            ApplicationInfo appInfo = packageManager.getApplicationInfo(packageName, 0);
            String appName = appInfo.loadLabel(packageManager).toString();
            appNameCache.put(packageName, appName);
            showToast(appName);
        } catch (PackageManager.NameNotFoundException e) {
            Log.w(TAG, "Failed to get app info", e);
        } catch (Exception e) {
            Log.e(TAG, "Error on showing toast!", e);
        }
    }

    public static void jniOnNewSuEvent(int uid,int ppid) {
        if(packageManager == null) packageManager = systemContext.getPackageManager();
        try {
            String[] appsList = packageManager.getPackagesForUid(uid);
            if(appsList == null || appsList.length == 0) {
                Log.i(TAG, "No package found for uid " + uid);
                return;
            }
            //sharedUserId处理
            if(appsList.length > 1) {
                //读取proc需要提权
                jniSetUid(0);
                jniProcessSharedUidApplication(ppid);
                return;
            }
            String packageName = appsList[0];
            //忽略提示的包名
            if(ignorePackageList.contains(packageName)) return;
            ApplicationInfo appInfo = packageManager.getApplicationInfo(packageName, 0);
            String appName = appInfo.loadLabel(packageManager).toString();
            appNameCache.put(packageName, appName);
            showToast(appName);
        } catch (PackageManager.NameNotFoundException e) {
            Log.w(TAG, "Failed to get app info", e);
        } catch (Exception e) {
            Log.e(TAG, "Error on showing toast!", e);
        }
    }

    private static void onInitFailed(String errorMessage) {
        modifyModuleDescription("❌" + errorMessage);
    }

    private static void onNativeError(String msg) {
        jniSetUid(0);
        modifyModuleDescription("❌" + msg);
        System.exit(1);
    }

    private static void modifyModuleDescription(String descText) {
        //使用ksu特性临时更改描述
        try {
            File ksudFile = new File("/data/adb/ksud");
            if(!ksudFile.exists()) {
                Log.w(TAG, "ksud file not found!");
                return;
            }
            String desc = String.format(Locale.getDefault(), "[%s]Show a root granted toast like Magisk.Require SuLog enabled.", descText);
            ProcessBuilder processBuilder = new ProcessBuilder("/data/adb/ksud", "module", "config", "set", "--temp", "override.description", desc);
            processBuilder.environment().put("KSU_MODULE", "ksuGrantToast");
            java.lang.Process changeDescriptorProcess = processBuilder.start();
            //等待写入完成 方便降权
            changeDescriptorProcess.waitFor(20, TimeUnit.SECONDS);
            changeDescriptorProcess.destroyForcibly();
        } catch (IOException | InterruptedException e) {
            Log.e(TAG, "Failed to modify module description", e);
        }
    }

    private static native boolean jniInit(short packageSearchDepth, boolean checkSuCompat, boolean autoDeleteLog);

    private static native void jniSetUid(int uid);
    private static native void jniProcessSharedUidApplication(int ppid);
}
