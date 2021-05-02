#include <iostream>
#include "constants.h"

using namespace std;

// 전방선언은 extern 키워드가 생략된 것이라 볼 수 있다.
//void Foo();
extern void Foo(); //몸체가 어딘가에 있어요 라는 뜻.


// extern은 프로그램 전체에서 하나의 변수명을 가져야 한다.
extern int a; //몸체가 어딘가에 있어요.
//extern int a=123; //두번 정의는 안됨. test_External에서 이미 초기화하였음

void ShowConstants();

// 외부 파일의 전역 변수 & 상수들에 접근을 시도
extern int g_a;
extern int g_b;
extern const int g_c;
extern const int g_d;
extern const int g_e;
//const int g_e = 10;

// 외부 파일의 함수들에 접근을 시도
extern int bar(int x);
extern int goo(int x);
extern int hoo(int x);
template<typename T> extern T ioo(T x);

int main() 
{
	Foo(); //전방 선언을 했기 때문에 별다른 include 없이 호출이 가능하다. (external linkage)
	cout << a << endl;

	cout << "in main.cpp file :" << Constants::pi << " " << &Constants::pi <<endl;
	ShowConstants(); //extern을 쓰지 않으면 메모리 복사본이 만들어진다.
	
	cout << "linkage test" << endl;
	cout << g_a << endl; //전역 변수는 외부로 공개됨
	//cout << g_b << endl; //정적 전역 변수는 외부로 공개되지 않음
	//cout << g_c << endl; //일반 전역 상수는 외부로 공개되지 않음
	//cout << g_d << endl; //스태틱 전역 상수는 외부로 공개되지 않음
	cout << g_e << endl; //extern 전역 변수는 외부로 공개됨

	bar(10); //전역 함수는 외부로 공개됨
	//goo(20); // x 스태틱 함수는 외부로 공개되지 않음
	//hoo(30); // x 인라인 함수는 외부로 공개되지 않음
	//ioo(40); // x 템플릿 함수틑 외부로 공개되지 않음

	return 0;
}

