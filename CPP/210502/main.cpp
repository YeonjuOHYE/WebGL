#include <iostream>

using namespace std;

void doSomething()
{
	// static : �޸��� ������ ������(static) ������ ���� �Ҵ��Ѵ�.
	// �ʱ⿡ �ѹ� a�� �Ҵ��ϰ�, a�� �������ϸ�, �̹� ���ǵǾ� �����Ƿ� ���ο� �޸� ������ ���� �ʴ´�.
	// ��, �Ʒ� ���� �� ó�� ȣ��ȴ�.
	// ���������� ���� ���� ��� ������ ����������, ���������� ������ �����Ƿ� ���� �ʴ°��� ����.
	// ���������� ��𼭵� ���ٰ���������, static ������ �ش� scope�ȿ����� ������ �����ϴ�.
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
	cout << ::value << endl << endl; //global value ȣ��


	doSomething();
	doSomething();
	doSomething();
	doSomething2(); // �ٸ� �Լ����� ȣ��� static ������ �����̸��� ������ �ٸ� �޸𸮿� �Ҵ�ȴ�.
	doSomething2(); 

	return 0;
}