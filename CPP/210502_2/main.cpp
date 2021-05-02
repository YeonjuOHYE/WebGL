#include <iostream>
#include "constants.h"

using namespace std;

// ���漱���� extern Ű���尡 ������ ���̶� �� �� �ִ�.
//void Foo();
extern void Foo(); //��ü�� ��򰡿� �־�� ��� ��.


// extern�� ���α׷� ��ü���� �ϳ��� �������� ������ �Ѵ�.
extern int a; //��ü�� ��򰡿� �־��.
//extern int a=123; //�ι� ���Ǵ� �ȵ�. test_External���� �̹� �ʱ�ȭ�Ͽ���

void ShowConstants();

// �ܺ� ������ ���� ���� & ����鿡 ������ �õ�
extern int g_a;
extern int g_b;
extern const int g_c;
extern const int g_d;
extern const int g_e;
//const int g_e = 10;

// �ܺ� ������ �Լ��鿡 ������ �õ�
extern int bar(int x);
extern int goo(int x);
extern int hoo(int x);
template<typename T> extern T ioo(T x);

int main() 
{
	Foo(); //���� ������ �߱� ������ ���ٸ� include ���� ȣ���� �����ϴ�. (external linkage)
	cout << a << endl;

	cout << "in main.cpp file :" << Constants::pi << " " << &Constants::pi <<endl;
	ShowConstants(); //extern�� ���� ������ �޸� ���纻�� ���������.
	
	cout << "linkage test" << endl;
	cout << g_a << endl; //���� ������ �ܺη� ������
	//cout << g_b << endl; //���� ���� ������ �ܺη� �������� ����
	//cout << g_c << endl; //�Ϲ� ���� ����� �ܺη� �������� ����
	//cout << g_d << endl; //����ƽ ���� ����� �ܺη� �������� ����
	cout << g_e << endl; //extern ���� ������ �ܺη� ������

	bar(10); //���� �Լ��� �ܺη� ������
	//goo(20); // x ����ƽ �Լ��� �ܺη� �������� ����
	//hoo(30); // x �ζ��� �Լ��� �ܺη� �������� ����
	//ioo(40); // x ���ø� �Լ��z �ܺη� �������� ����

	return 0;
}

