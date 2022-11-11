---
id: algorithms
title: Algorithms
sidebar_position: 3
description: TBD
---

# Algorithms

- Introduce the algorithms of the Standard Template Library
- Introduce the function objects and wrappers of the Standard Template Library
- Show examples of how to use the STL algorithms with sequences of elements

> "By default, ... prefer algorithms to loops." Stroustrup (2014)





The algorithms category of the C++ STL provides a variety of common programming solutions that operate on ranges of elements within containers.  These algorithms are expressed in the form of functions within the `std` namespace and are usable with our own collections of types as well as with the STL containers.  Most algorithms include overloads that accept execution policies.  The three libraries in this category are:

- `functional` - standard function objects
- `algorithm` - standard algorithms
- `numeric` - standard numeric operations

Each library is independent of any other library. 

This chapter introduces each library of the algorithms category in turn and describes some commonly used features.  This introduction includes descriptions of selected functions with examples.  <!-- MISSING For fuller details, see the online references cited in the [tutorials section](/resources/tutorials.html) of the course web site.-->



## Functional Library


The functional library defines templated function-objects that can be passed as arguments to other functions, including the algorithm templates.  This library is defined in the header file `<functional>` and consists of three distinct parts:

- Wrapper Class Templates
- Function Templates
- Operator Classes



### Wrapper Class Templates


The wrapper class templates are templates that manage access to some underlying object.  These templates include:

- `function` - creates a function-object wrapper for a function, another function-object or a lambda expression
- `reference_wrapper` - creates a reference object



#### `std::function` Wrapper Template


The program below creates 3 function objects: one for the function `multiply()`, one for the functor `Multiply`, and one for a lambda expression that performs a multiply operation.

```cpp
// Functional - function wrapper
// function_wrapper.cpp

#include <iostream>
#include <functional>

// a simple function
long multiply(long x, long y) { return x * y; }

// a functor
struct Multiply
{
	long operator()(long x, long y) { return x * y; }
};

int main()
{
	std::function<long(long, long)> f1 = multiply;
	std::function<long(long, long)> f2 = Multiply();
	std::function<long(long, long)> f3 = [](long x, long y) 
	                                     {
	                                     	return x * y;
	                                     };

	std::cout << "f1(10, 2) = " << f1(10, 2) << std::endl;
	std::cout << "f2(10, 2) = " << f2(10, 2) << std::endl;
	std::cout << "f3(10, 2) = " << f3(10, 2) << std::endl;
}
```

```
f1(10, 2) = 20 
f2(10, 2) = 20
f3(10, 2) = 20
```



#### `reference_wrapper` Template


The `reference_wrapper` template creates a class that facilitates the copying and assigning of references for functions as well as objects.  This template allows utilization of references where the C++ standard forbid normal references (for example, in container classes). 

A reference wrapper facilitates the storage of references inside container objects.

The program below creates a `vector` of `double` objects and a parallel vector of references to those double objects.  It multiplies the values in the original vector by 3 and displays the values referred to by the reference wrapper:

```cpp
// Functional - reference wrapper
// reference_wrapper_vector.cpp

#include <iostream>
#include <vector>
#include <functional>

int main()
{
	std::vector<double> original(5, 10.3);
	std::vector<std::reference_wrapper<double>>  references(original.begin(), original.end());

	for (auto& e : original)
		e *= 3;

	for (auto e : references)
		std::cout << e << " ";
	std::cout << std::endl; 
}
```

```
30.9 30.9 30.9 30.9 30.9
```

`std::reference_wrapper` can be used anywhere a regular reference can be used.

The following program creates references to 3 `long`s, resets the referenced values, and displays the value of each reference:

```cpp
// Functional - reference wrapper
// reference_wrapper.cpp

#include <iostream>
#include <functional>

int main()
{
	long v1 = 1L, v2 = 2L, v3 = 3L;

	std::reference_wrapper<long> r1 = v1;
	std::reference_wrapper<long> r2 = v2;
	std::reference_wrapper<long> r3 = v3;

	v1 = 10L, v2 = 20L, v3 = 30L;

	std::cout << "r1 = " << r1 << std::endl; 
	std::cout << "r2 = " << r2 << std::endl;
	std::cout << "r3 = " << r3 << std::endl;
}
```

```
r1 = 10 
r2 = 20
r3 = 30
```



### Function Templates


The function templates include:

- `bind(Fn&& fn, Args&&... args)` - binds one or more arguments to a function object
- `reference_wrapper<T> ref(T& t)` - creates a reference wrapper on object `t` of type `T`
- `reference_wrapper<const T> cref(const T& t)` - creates a reference wrapper on unmodifiable object `t` of type `T`



#### `bind`


The program below binds the function `multiply()` to its arguments and returns the corresponding function object.  When we call the function object, it returns the result for the specified arguments:

```cpp
// Functional - bind a function to its arguments
// bind.cpp

#include <iostream>
#include <functional>

double multiply(double x, double y) { return x * y; } 

int main()
{
	auto p = std::bind(multiply, 10, 3);
	std::cout << "Product = " << p() << std::endl;
}
```

```
Product = 30 
```

`std::bind` stores the arguments passed in by copying their values.


#### `ref`


The function template `std::ref()` returns an `std::reference_wrapper` instance for the argument supplied.

The program below binds two arguments to function `std::increment()`, one by reference and the other by value and displays their values after `inc()` has updated them:

```cpp
// Functional - create a reference wrapper
// ref.cpp

#include <iostream>
#include <functional>

void increment(int& x, int& y) { ++x, ++y; }

int main()
{
	int a = 10, b = 20;
	auto inc = bind(increment, std::ref(a), b);
	
	inc();

	std::cout << "a = " << a << std::endl;
	std::cout << "b = " << b << std::endl;
}
```

```
a = 11
b = 20
```



### Operator Class Templates


The operator class templates define function object equivalents for most of the operators present in the core language.  The templates include:

- `bit_and` - result of `x & y`
- `bit_or` - result of `x | y`
- `bit_xor` - result of `x ^ y`
- `divides` - result of `x / y`
- `equal_to` - result of `x == y`
- `greater` - result of `x > y`
- `greater_equal` - result of `x >= y`
- `less` - result of `x < y`
- `less_equal` - result of `x <= y`
- `logical_and` - result of `x && y`
- `logical_or` - result of `x || y`
- `minus` - result of `x - y`
- `multiplies` - result of `x * y`
- `negate` - result of `-x`
- `not_equal` - result of `x != y`
- `plus` - result of `x + y`

These objects specify the operation to be performed by an algorithm and can be passed to an algorithm in place of a lambda expression or full-blown function object.




## Algorithm Library


The `algorithm` function templates perform common operations on ranges of elements in a sequence.  The function calls accept these ranges as arguments in the form of iterators.  These functions apply, not only to containers, but also to strings and built-in arrays.  They do not change the size or storage allocation of any sequence. 

The function templates are defined in header `<algorithm>`. The templates consist of:

- Queries
- Modifiers
- Manipulators

The template parameter types include:

- Iterators from one of the six categories that define the operations to be performed:
	- `InputIterator` - an input iterator type (supported operations: `!=`, `*`, `->`, `++`, `*i++`)
	- `OutputIterator` - an output iterator type (supported operations: write and `++`, `*i++`)
	- `ForwardIterator` - an output iterator type (supported operations: `!=`, `*`, `->`, `++`, `*i++`)
	- `BiDirectionalIterator` - an output iterator type (supported operations: `!=`, `*`, `->`, `++`, `*i++`, `--`)
	- `RandomAccessIterator` - a random access iterator type (supported operations: `!=`, `*`, `->`, `++`, `*i++`, `--`, `*i--`, `+`, `i`, `i[n]`, `<`, `>`, `<=`, `>=`)
	- `ContiguousIterator` - an output iterator type (supported operations: `!=`, `*`, `->`, `++`, `*i++`, `--`, `*i--`, `+`, `i`, `i[n]`, `<`, `>`, `<=`, `>=`, contiguous storage)
- `Fn` - a function object type

The notation `[f, l)` refers to the range starting at the position identified by iterator `f` and extending to the position immediately before that identified by iterator `l`.

The admissible operations defined on each type of iterator may be found at [cppreference.com](http://en.cppreference.com/w/cpp/iterator).



### Queries


The query class templates include:

- `bool all_of(InputIterator f, InputIterator l, Fn predicate)` - returns `true` if all elements within range `[f, l)` satisfy predicate
- `bool any_of(InputIterator f, InputIterator l, Fn predicate)` - returns `true` if any element within range `[f, l)` satisfies predicate
- `bool none_of(InputIterator f, InputIterator l, Fn predicate)` - returns `true` if no element within range `[f, l)` satisfies predicate
- `Fn for_each(InputIterator f, InputIterator l, Fn predicate)` - for each element within range `[f, l)` apply predicate
- `InputIterator find(InputIterator f, InputIterator l, const T& t)` - find first element within range `[f, l)` equal to `t`
- `InputIterator find_if(InputIterator f, InputIterator l, Fn predicate)` - find first element within range `[f, l)` that satisfies predicate
- `InputIterator find_if_not(InputIterator f, InputIterator l, Fn predicate)` - find first element within range `[f, l)` that does not satisfy predicate
- `int count(InputIterator f, InputIterator l, const T& t)` - count the occurrences of `t` within range `[f, l)`
- `int count_if(InputIterator f, InputIterator l, Fn predicate)` - count how many elements within range `[f, l)` satisfy predicate



#### `count`


The program below counts the number of occurrences of the value `12` in array `a`:

```cpp
// Algorithms - Count
// count.cpp

#include <array>
#include <algorithm>
#include <iostream>

int main()
{
	std::array<int, 11> a = {1, 12, 4, 5, 8, 9, 12, 13, 16, 18, 12};

	int n = std::count(a.begin(), a.end(), 12);

	std::cout << "12 occurs "<< n << " times.\n";
}
```

```
12 occurs 3 times.
```


#### `count_if`

The program below counts how many even numbers exist in the array `a`:

```cpp
// Algorithms - Count If
// count_if.cpp

#include <algorithm>
#include <iostream>

int main()
{
	int a[] = {1, 2, 4, 5, 8, 9, 12, 13, 16, 18, 22}; 
	
	int n = std::count_if(a, a + 11, [](int i)
	                                 {
	                                     return !(i & 1);
	                                 });

	std::cout << "Even numbers = "<< n << std::endl;
}
```

```
Even numbers = 7
```



### Modifiers


The modifier class templates include:

- `OutputIterator copy(InputIterator f, InputIterator l, OutputIterator o)` - copy all of the elements from range `[f, l)` into the range starting at `o`
- `OutputIterator copy_if(InputIterator f, InputIterator l, OutputIterator o, Fn predicate)` - copy all elements from range `[f, l)` that satisfy the predicate into the range starting at `o`
- `OutputIterator transform(InputIterator f, InputIterator l, OutputIterator o, Fn u)` - apply the unary operation `u` to all of the elements from range `[f, l)` and store the result starting at `o`
- `OutputIterator transform(InputIterator f, InputIterator l, InputIterator g, OutputIterator o, Fn b)` - apply the binary operation `b` to all of the elements from range `[f, l)` and corresponding element starting at `g` and store the result starting at `o`
- `void fill(ForwardIterator f, ForwardIterator l, const T& old_t, const T& new_t)` - fill every element within range `[f, l)` with `t`
- `OutputIterator fill_n(OutputIterator f, size n, const T& t)` - fill the first `n` elements starting at element `f` with `t`
- `void replace(ForwardIterator f, ForwardIterator l, const T& s, const T& t)` - replace every occurrence of `s` with `t` for all of the elements within range `[f, l)`
- `void replace_if(ForwardIterator f, ForwardIterator l, Fn predicate, const T& t)` - replace every element that satisfies predicate with `t` for all of the elements within range `[f, l)`



#### `copy`


The program below copies the first 2 elements of vector `v` into vector `c`, starting at the second element of vector `c` and displays the updated contents of vector `c`:

```cpp
// Algorithms - Copy
// copy_.cpp

#include <vector>
#include <algorithm>
#include <iostream>

int main()
{
	std::vector<double> v(4, 10.34);
	std::vector<double> c(4, 20.68);

	std::copy(v.begin(), v.begin() + 2, c.begin() + 1);

	for (auto e : c)
		std::cout << e << std::endl; 
}
```

```
20.68 
10.34
10.34
20.68
```



#### `copy_if`

The program below copies from the first 10 elements of vector `v` those elements that are odd into vector `c` and displays the all of the elements in `c`:

```cpp
// Algorithms - Copy If
// copy_if.cpp

#include <vector>
#include <algorithm>
#include <iostream>

int main()
{
	std::vector<int> v = {1, 2, 4, 5, 7, 8, 10, 13, 17, 21, 43}; 
	std::vector<int> c(15);

	std::copy_if(v.begin(), v.begin() + 10, c.begin(), [](int i) -> bool
		{
			return i % 2;
		});

	for (auto e : c)
		std::cout << e << std::endl; 
}
```

```
1
5
7
13
17
21 
```



#### `transform`


The `transform` function templates perform programmer-specified transformations on the elements of a sequence.  A function object defines the transformation.

The program below multiplies each element in vector `v` by 3, stores the result in vector `c` and displays the contents of vector `c`:

```cpp
// Algorithms - Transform - Unary Operation
// transform_u.cpp

#include <vector>
#include <algorithm>
#include <iostream>

int main()
{
	std::vector<int> v = {1, 2, 4, 5, 7, 8, 10, 13, 17, 21, 43}; 
	std::vector<int> c(11);

	std::transform(v.begin(), v.end(), c.begin(), [](int i)
		{
			return 3 * i;
		});

	for (auto e : c)
		std::cout << e << std::endl;
}
```

```
3
6
12
15
21
24
30
39
51
63
129 
```

The program below adds each element in vector `a` to the corresponding element in vector `b`, stores the results in vector `c` and displays the contents of vector `c`:

```cpp
// Algorithms - Transform - Binary Operation
// transform_b.cpp

#include <vector>
#include <algorithm>
#include <functional>
#include <iostream>

int main()
{
	std::vector<int> a = {1, 2, 4, 5, 7, 8, 10, 13, 17, 21, 43}; 
	std::vector<int> b = {2, 1, 0, 1, 2, 3, 16, 23, 21, 17, 32}; 
	std::vector<int> c(11);

	std::transform(a.begin(), a.end(), b.begin(), c.begin(), std::plus<int>());

	for (auto e : c)
		std::cout << e << std::endl; 
}
```

```
3
3
4
6
9
11
26
36
38
38
75 
```



### Manipulators

The manipulator class templates include:

- `void sort(RandomAccessIterator f, RandomAccessIterator l)` - sorts the elements in ascending order
- `void sort(RandomAccessIterator f, RandomAccessIterator l, Fn compare)` - sorts the elements using `compare` as the comparator
- `OutputIterator merge(InputIterator f1, InputIterator l1, InputIterator f2, InputIterator l2, OutputIterator o)` - combine elements in sorted ranges `[f1, l1)` and `[f2, l2)` and store the merged results in `o` in ascending order
- `OutputIterator merge(InputIterator f1, InputIterator l1, InputIterator f2, InputIterator l2, OutputIterator o, Fn compare)` - combine elements in sorted ranges `[f1, l1)` and `[f2, l2)` and store the merged results in `o` using the comparator `compare`



#### `sort`

The program below sorts the elements in array a in descending order and displays the sorted result:

```cpp
// Algorithms - Sort Descending Order
// sort.cpp

#include <iostream>
#include <algorithm>
#include <functional>

int main()
{
	int a[] = {3, 2, 4, 1};

	std::sort(a, &a[4], greater<int>()); 

	for(int e : a)
		std::cout << e <<  std::endl;
}
```

```
4
3
2
1 
```



## Numeric Library


The numeric library provides standard templated functions for performing numeric operations on ranges of elements in a sequence. 

The numeric function templates include:

- `T accumulate(InputIterator f, InputIterator l, T init)` - accumulate the values in the range `[f, l)` to `init` and return the result
- `T accumulate(InputIterator f, InputIterator l, T init, Fn boper)` - accumulate the values in the range `[f, l)` to `init` using the binary operation `boper` and return the result
- `T inner_product(InputIterator f1, InputIterator l1, InputIterator f2, T init)` - accumulate the products of each pair in the ranges `[f1, l1)` and `[f2, ...)` to `init` and return the result
- `T inner_product(InputIterator f1, InputIterator l1, InputIterator f2, T init, Fn boper1, Fn boper2)` - accumulate the results of binary operation `boper2` on each pair in the ranges `[f1, l1)` and `[f2, ...)` to `init` using binary operation `boper1` and return the result
- `OutputIterator partial_sum(InputIterator f1, InputIterator l1, OutputIterator partialSum)` - calculate the partial sums for vector `v` and store them in collection starting at `partialSum`
- `OutputIterator partial_sum(InputIterator f1, InputIterator l1, OutputIterator partialSum, Fn boper)` - calculate the partial expressions for vector `v` using binary operation `boper` and store them in the collection starting at `partialSum`



### Examples

#### `accumulate`

The program below sums the elements in array `a`, displays the result, then sums twice their values and displays that result:

```cpp
// Algorithms - Accumulate
// accumulate.cpp

#include <iostream>
#include <numeric>

int main()
{
	int a[] = {3, 2, 4, 1}, s;

	s = std::accumulate(a, &a[4], (int)0);
	
	std::cout << "sum = " << s <<  std::endl;
	
	s = std::accumulate(a, &a[4], (int)0, [](int x, int y)
		{
			return x + 2 * y;
		});

	std::cout << "2 * sum = " << s <<  std::endl; 
}
```

```
sum = 10
2 * sum = 20
```



#### `inner_product`


The program below calculate the inner or dot product of array `a` with array `b`, displays the result, then calculates the sum of the squares of the differences between the elements of the arrays and displays that result:

```cpp
// Algorithms - Inner Product
// inner_product.cpp

#include <iostream>
#include <numeric>
#include <functional>

int main()
{
	int a[] = {3, 2, 4, 1},
	    b[] = {1, 2, 3, 4},
	    s;

	s = std::inner_product(a, &a[4], b, (int)0);

	std::cout << "dot product = " << s <<  std::endl; 

	s = std::inner_product(a, &a[4], b, (int)0, std::plus<int>(),
		                   [](int x, int y) { return (x - y) * (x - y); }); 

	std::cout << "sum of (a[i] - b[i]) ^ 2 = " << s <<  std::endl; 
}
```

```
dot product = 23
sum of (a[i] - b[i]) ^ 2 = 14
```



#### `partial_sum`


The program below calculates the partial sums of the elements in vector `v`, displays them, then calculates their partial products and displays them:

```cpp
// Algorithms - Partial Sum
// partial_sum.cpp

#include <iostream>
#include <vector>
#include <functional>
#include <numeric>

int main()
{
	std::vector<int> v = {1, 2, 3, 4}, p(4);

	std::partial_sum(v.begin(), v.end(), p.begin()); 

	for (auto i : p)
		std::cout << i << std::endl;

	std::partial_sum(v.begin(), v.end(), p.begin(),
	std::multiplies<int>());

	for (auto i : p)
		std::cout << i <<  std::endl;
}
```

```cpp
1
3
6
10

1
2
6
24 
```



## Exercises

- Read Wikipedia on the [Standard Template Library](https://en.wikipedia.org/wiki/Standard_Template_Library)
