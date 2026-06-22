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
    private static final LruCache<String, String> appNameCache = new LruCache<>(32);
    private static String customToastText = Messages.getLocaleMessage();
    private static final HashSet<String> ignorePackageList = new HashSet<>();
    private static boolean autoDeleteLog = false;

    @SuppressLint("UnsafeDynamicallyLoadedCode")
    public static void main(String[] args) {
        if(Process.myUid() != 0) {
            Log.e(TAG, "Need root access!!!");
            return;
        }
        try {
            parseArguments(args);
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
            System.load(libraryFile.getAbsolutePath());
            if(!jniInit(autoDeleteLog)) {
                onInitFailed("Native init failed!");
                System.exit(1);
                return;
            }
            modifyModuleDescription(String.format(Locale.getDefault(), "✅Working.PID:%d,Ignored package(s) count:%d", Process.myPid(), ignorePackageList.size()));
            jniSetUid(1000);
            System.gc();
            Log.i(TAG, "Init success!");
            Looper.loop();
        } catch (ClassNotFoundException | NoSuchMethodException | InvocationTargetException |
                 IllegalAccessException | PackageManager.NameNotFoundException |
                 RuntimeException e) {
            Log.e(TAG, "Failed to init!", e);
            jniSetUid(0);
            onInitFailed("Init failed!");
            systemContext = null;
            System.exit(1);
        }
    }

    private static void parseArguments(String[] args) {
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
        //自动删除日志
        if(args.length > 4 && args[4] != null) {
            try {
                Log.i(TAG, "Found auto delete log setting");
                autoDeleteLog = Boolean.parseBoolean(args[4]);
                Log.i(TAG, "Set auto delete log to " + autoDeleteLog);
            } catch (NumberFormatException numberFormatException) {
                Log.e(TAG, "Invalid auto delete log setting!", numberFormatException);
            }
        }
    }

    private static void showToast(String pkgName) {
        if(handler == null) handler = new Handler(Looper.getMainLooper());
        handler.post(() -> Toast.makeText(systemContext, String.format(Locale.getDefault(), customToastText, pkgName), Toast.LENGTH_SHORT).show());
    }

    public static void jniOnNewSuEvent(int uid) {
        if(packageManager == null) packageManager = systemContext.getPackageManager();

        //通过 uid 获取包名，非 Android 应用 uid 返回 null
        String[] packages = packageManager.getPackagesForUid(uid);
        if(packages == null || packages.length == 0) return;

        for(String packageName : packages) {
            if(ignorePackageList.contains(packageName)) continue;

            String cachedAppName = appNameCache.get(packageName);
            if(cachedAppName != null) {
                showToast(cachedAppName);
                return;
            }

            try {
                ApplicationInfo appInfo = packageManager.getApplicationInfo(packageName, 0);
                String appName = appInfo.loadLabel(packageManager).toString();
                appNameCache.put(packageName, appName);
                showToast(appName);
                return;
            } catch (PackageManager.NameNotFoundException e) {
                Log.w(TAG, "Failed to get app info for " + packageName, e);
            }
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
            changeDescriptorProcess.waitFor(20, TimeUnit.SECONDS);
            changeDescriptorProcess.destroyForcibly();
        } catch (IOException | InterruptedException e) {
            Log.e(TAG, "Failed to modify module description", e);
        }
    }

    private static native boolean jniInit(boolean autoDeleteLog);

    private static native void jniSetUid(int uid);
}
