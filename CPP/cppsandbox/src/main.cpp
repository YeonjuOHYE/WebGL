#include <iostream>
#include <algorithm>

#define MY_HELLO "Hello, World"
#define MAX(a,b) ((a>b) ? a : b)
#define LIKE_APPLE

using namespace std;

int main()
{
	int x = 0;
#ifdef LIKE_APPLE
	cout << "Apple" << endl;
#endif // LIKE_APPLE


	cout << max(1 + 3, 2) << endl;
}



