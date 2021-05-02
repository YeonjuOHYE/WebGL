//프로젝트 -> 속성 -> C/C++ -> 모든 옵션 -> C++ 언어 표준
#include <iostream>
#include <array>
#include "config.h";

using namespace std;
namespace work1
{
    void multiNamespace() {
        cout << "multi Namespace since c++11" << endl;
    }
}
int main()
{
    // c++11: 숫자 사이에 ' 넣어도 됨(효과없음)
    int money = 10'000;

    // c++14: 0b 바이너리 형식 추가
    int binary = 0b1011'1111'1010;

    // c++11: 고정 너비 정수 format
    int16_t fixed_1 = 5;
    int8_t fixed_2 = 10;

    // initialization 종류
    int init_1 = 5;  //         Copy initialization
    int init_2(5);   //         Direct initialization
    int init_3{ 5 }; // c++11:   Uniform initialization
    int init_4{};    // 기본 값으로 정의됨
                     // 모든 데이터 타입에서 작동. 형변환을 허용하지 않고, 다른 자료형의 값으로 초기화 불가

    // c++11 constexpr
    // 선언과 함께 초기화 해야하는 것은 const와 같으며,
    // 즉 const는 런타임 초기화, constexpr는 컴파일타임 초기화가 진행됨 
    // 하지만 c++14에서는 런타임 초기화가 되는 경우도 있음
    constexpr int const_num_1 = 3;
    int num = 3;
    const int const_num_2{ num }; // constexpr은 변수를 통한 초기화가 되지 않음.
    array<int, const_num_1> arr; // const는 array 크기 할당 불가(런타임이니까)
    //constexpr을 모아두고 사용할 수 있다.
    cout << (config::isdebug == true) << endl;

    //comma operator
    int x = 3;
    int y = 5;
    int z = (++x, ++y);
    cout << "comma operator : " << x << y << z << endl;
}