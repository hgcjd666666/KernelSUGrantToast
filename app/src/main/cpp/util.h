#include <cstring>
#include <string>

#ifndef KERNELSUGRANTTOAST_UTIL_H
#define KERNELSUGRANTTOAST_UTIL_H
#pragma once

bool tryKillKsudProcess();

int getKernelSuDriver();

int getSuLogFd(int driverFd);

void deleteSuLogFile();

#endif //KERNELSUGRANTTOAST_UTIL_H
