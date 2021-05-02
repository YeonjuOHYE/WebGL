#pragma once
//이중 define을 방지하는 전처리 코드.
//아래와 동일한 역할을 수행한다.
//#ifndef CONFIG
//#define CONFIG
//	...code
//#endif


namespace config {
	constexpr double value{ 3.14 };
	constexpr int option{};
	constexpr bool isdebug{true};
}