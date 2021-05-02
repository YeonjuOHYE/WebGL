#include <iostream>
#include "constants.h"

extern int a = 123;
using namespace std;

int g_a = 10;
static int g_b = 20;
const int g_c = 1000; // c++과 c의 차이. const 가 붙으면 c++은 internal linkage로 처리됨 
static const int g_d = 1000;
extern const int g_e = 1000;

int bar(int x) { return x + 1; }
static int goo(int x) { return x * x; }
inline int hoo(int x) { return x / 2; }
template<typename T> T ioo(T x) { return x * x * x; }

void Foo()
{
	cout << "Hello " << endl;
}

void ShowConstants()
{
	cout << "in test_external.cpp file :" << Constants::pi << " " << &Constants::pi << endl;
}