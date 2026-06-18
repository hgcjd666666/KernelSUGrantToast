#include <unistd.h>
#include "util.h"
#include "android/log.h"
#include "fcntl.h"
#include "sys/syscall.h"
#include "dirent.h"

using namespace std;
#define KSU_INSTALL_MAGIC1 0xDEADBEEFu
#define KSU_INSTALL_MAGIC2 0xCAFEBABEu
#define KSU_IOCTL_GET_SULOG_FD 0x40044B14u
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, "KsuToast", __VA_ARGS__)
#define LOGW(...) __android_log_print(ANDROID_LOG_WARN, "KsuToast", __VA_ARGS__)
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, "KsuToast", __VA_ARGS__)

static inline pid_t getPidByName(const string &name) {
    FILE *result = popen(("pidof " + name).c_str(), "r");
    if (!result) return -1;
    char buf[64];
    if (fgets(buf, sizeof(buf), result) == nullptr) {
        pclose(result);
        return -1;
    }
    pclose(result);
    return static_cast<pid_t>(strtol(buf, nullptr, 10));
}

bool tryKillKsudProcess() {
    /*
     * 开启sulog后启动的ksud进程名
     * 如果是启动后才开启该功能 进程名会不同
     * 但我选择初始化时如果sulog未开启直接退出
     * */
    pid_t ksudPid = getPidByName("ksud");
    if (ksudPid > 1) {
        kill(ksudPid, SIGKILL);
        //等待退出
        for (int i = 0; i < 25; ++i) { // 500ms
            if (kill(ksudPid, 0) == -1 && errno == ESRCH) break;
            usleep(20000);
        }
        return true;
    }
    return false;
}

int getKernelSuDriver() {
    int fd = -1;
    syscall(SYS_reboot, KSU_INSTALL_MAGIC1, KSU_INSTALL_MAGIC2, 0, &fd);
    return fd;
}

int getSuLogFd(int driverFd) {
    struct {
        uint32_t flags;
    } suLog_cmd = {0};
    int fd = ioctl(driverFd, KSU_IOCTL_GET_SULOG_FD, &suLog_cmd);
    if (fd < 0) {
        int err = errno;
        if (err == EBUSY) {
            LOGW("Get su log fd failed,trying kill ksud process...");
            if (tryKillKsudProcess()) {
                LOGI("Ksud process killed.Try get su log fd again");
                fd = ioctl(driverFd, KSU_IOCTL_GET_SULOG_FD, &suLog_cmd);
            }
        }
        if (fd < 0) {
            LOGE("Get su log fd failed,errno:%d", err);
        }
    }
    return fd;
}

void deleteSuLogFile() {
    DIR *dir = opendir("/data/adb/ksu/log");
    if (!dir) {
        LOGW("Failed to open KernelSU log directory!");
        return;
    }
    while (struct dirent *entry = readdir(dir)) {
        if (entry->d_type != DT_REG) continue;
        if (strstr(entry->d_name, "sulog-") != nullptr &&
            strstr(entry->d_name, ".log") != nullptr) {
            string path = "/data/adb/ksu/log/" + string(entry->d_name);
            if (unlink(path.c_str()) < 0) {
                LOGW("Failed to delete %s", path.c_str());
            }
        }
    }
    closedir(dir);
}
