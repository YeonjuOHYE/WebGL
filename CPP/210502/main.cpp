#include <iostream>

using namespace std;

void doSomething()
{
	// static : 메모리의 정적인 고정된(static) 공간에 값을 할당한다.
	// 초기에 한번 a를 할당하고, a를 재정의하면, 이미 정의되어 있으므로 새로운 메모리 생성을 하지 않는다.
	// 즉, 아래 줄은 맨 처음 호출된다.
	// 전역변수로 물론 같은 기능 수행이 가능하지만, 전역변수는 관리가 어려우므로 쓰지 않는것이 좋다.
	// 전역변수는 어디서든 접근가능하지만, static 변수는 해당 scope안에서만 접근이 가능하다.
	static int a = 0;
	++a;
	cout << a << endl;
}
void doSomething2()
{
	static int a = 0;
	++a;
	cout << a << endl;
}

int value = 123; //global variable

int main() {
	int value = 12;
	cout << value << endl;
	cout << ::value << endl << endl; //global value 호출


	doSomething();
	doSomething();
	doSomething();
	doSomething2(); // 다른 함수에서 호출된 static 변수는 변수이름이 같더라도 다른 메모리에 할당된다.
	doSomething2(); 

	return 0;
}