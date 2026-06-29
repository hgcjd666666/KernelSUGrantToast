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

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.RandomAccessFile;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;
import java.util.concurrent.TimeUnit;


public class Entry {
    private static final Set<String> allowedSettingKeys = new HashSet<>(Arrays.asList("customToastText", "ignorePackageNames"));
    private static final String TAG = "KernelSuGrantToast";
    private static Context systemContext;
    private static Handler handler;
    private static PackageManager packageManager;
    private static FileInputStream ipcInputStream;
    private static RandomAccessFile ipcPipe;
    //缓存应用名 避免每次都走PackageManager
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
            initSettingHotUpdateIpcListener();
            //降权 不然就是java.lang.SecurityException: Package android is not owned by uid 0
            //等写入描述完成才执行 系统框架没模块目录权限
            jniSetUid(1000);
            System.gc();
            Log.i(TAG, "Init success!");
            Looper.loop();
        } catch (Throwable e) {
            Log.e(TAG, "Failed to init!", e);
            //重新提权 否则无法执行ksud
            if(Process.myUid() != 0) {
                jniSetUid(0);
            }
            onInitFailed("Init failed!");
            systemContext = null;
            System.exit(1);
        }
    }

    private static void parseArguments(String[] args) {
        if(args.length > 0 && args[0] != null) {
            String tempCustomText = args[0];
            Log.i(TAG, "Found custom toast text");
            if(Util.checkConfigConfigValueValid("customToastText", tempCustomText)) {
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
        //shell（uid 2000）申请 root 时直接显示 shell
        if(uid == 2000) {
            showToast("shell");
            return;
        }
        if(packageManager == null) packageManager = systemContext.getPackageManager();

        //通过 uid 获取包名，非 Android 应用 uid 返回 null
        String[] packages = packageManager.getPackagesForUid(uid);
        if(packages == null || packages.length == 0) return;

        //共享 uid 的应用（如 Termux 和插件）会返回多个包名，选最短的（主应用）
        String targetPackage = null;
        for(String packageName : packages) {
            if(ignorePackageList.contains(packageName)) continue;
            if(targetPackage == null || packageName.length() < targetPackage.length()) {
                targetPackage = packageName;
            }
        }
        if(targetPackage == null) return;

        String cachedAppName = appNameCache.get(targetPackage);
        if(cachedAppName != null) {
            showToast(cachedAppName);
            return;
        }

        try {
            ApplicationInfo appInfo = packageManager.getApplicationInfo(targetPackage, 0);
            String appName = appInfo.loadLabel(packageManager).toString();
            appNameCache.put(targetPackage, appName);
            showToast(appName);
        } catch (PackageManager.NameNotFoundException e) {
            Log.w(TAG, "Failed to get app info for " + targetPackage, e);
        } catch (Exception | Error e) {
            Log.e(TAG, "Error on showing toast!", e);
            onFatalException("Error on showing toast!");
        }
    }

    private static void onInitFailed(String errorMessage) {
        modifyModuleDescription("❌" + errorMessage);
    }

    private static void onFatalException(String msg) {
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

    private static void initSettingHotUpdateIpcListener() {
        File pipeFile = new File("/data/adb/toast_ipc");
        if(!pipeFile.exists()) {
            Log.w(TAG, "IPC pipe file not found!");
            return;
        }
        //自保留写端
        try {
            ipcPipe = new RandomAccessFile(pipeFile, "rw");
            ipcInputStream = new FileInputStream(ipcPipe.getFD());
        } catch (IOException e) {
            Log.e(TAG, "Failed to open IPC pipe file", e);
            onFatalException("Failed to open IPC pipe file");
        }
        new Thread(() -> {
            try {
                //等自己的写入端开启
                BufferedReader reader = new BufferedReader(new InputStreamReader(ipcInputStream, StandardCharsets.UTF_8));
                String line;
                Log.i(TAG, "Start ipc polling");
                while ((line = reader.readLine()) != null) {
                    Log.i(TAG, "Received IPC message: " + line);
                    String[] splitMessage = line.split((char) 0x2 +" ", 2);
                    if(splitMessage.length != 2) {
                        Log.w(TAG, "Invalid IPC message format");
                        continue;
                    }
                    if(!allowedSettingKeys.contains(splitMessage[0])) {
                        Log.w(TAG, "Invalid setting key: " + splitMessage[0]);
                        continue;
                    }
                    if(!Util.checkConfigConfigValueValid(splitMessage[0], splitMessage[1])) {
                        //重置内容检测
                        if(splitMessage[0].equals("customToastText") && splitMessage[1].isEmpty()) {
                            customToastText = Messages.getLocaleMessage();
                            Log.i(TAG, "Custom toast text reset");
                            continue;
                        } else if(splitMessage[0].equals("ignorePackageNames") && splitMessage[1].isEmpty()) {
                            ignorePackageList.clear();
                            Log.i(TAG, "Ignore package list reset");
                            continue;
                        }
                        Log.w(TAG, "Invalid config value: " + splitMessage[1]);
                        continue;
                    }
                    switch (splitMessage[0]) {
                        case "customToastText":
                            customToastText = splitMessage[1];
                            Log.i(TAG, "Custom toast text updated");
                            break;
                        case "ignorePackageNames":
                            ignorePackageList.clear();
                            String[] rawSplit = splitMessage[1].split(";");
                            for(String packageName : rawSplit) {
                                if(!packageName.isEmpty()) ignorePackageList.add(packageName);
                            }
                            Log.i(TAG, "Ignore package list updated");
                            break;
                        //autoDeleteLog没有热更新的意义
                        default:
                            Log.w(TAG, "Unknown setting key or key not supported hot update: " + splitMessage[0]);
                    }
                }
                Log.w(TAG, "Stop ipc polling");
            } catch (IOException e) {
                Log.e(TAG, "Failed to read IPC pipe file", e);
                onFatalException("Failed to read IPC pipe file");
            }
        }, "Setting IPC thread").start();
    }

    private static native boolean jniInit(boolean autoDeleteLog);

    private static native void jniSetUid(int uid);
}
