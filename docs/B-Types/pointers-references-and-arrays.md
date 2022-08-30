---
id: pointers-references-and-arrays
title: Pointers, References and Arrays
sidebar_position: 2
description: TBD
---

# Pointers, References and Arrays


- Describe the built-in types available in C++
- Introduce the generic pointer type
- Distinguish lvalue and rvalue references
- Introduce aggregate initialization and range-based for syntax for array types

> "The C++ programming language ... provides powerful and flexible mechanisms for abstraction; that is, language constructs that allow the programmer to introduce and use new types of objects that match the concepts of an application." Stroustrup (1999)



A built-in type is a type that can be constructed from a fundamental type by using qualifiers and operators.  Built-in types access their underlying types through their addresses and are implemented to reflect the hardware capabilities directly and efficiently.  The built-in types in the C++ language are *pointers*, *references* and *arrays*.  A C++ built-in type can be constructed from a fundamental type, the `const` qualifier and the declarator operators (`[]`, `*` and `&`).

This chapter describes the built-in types for the C++ core language in some detail, introduces generic pointers and distinguishes references into lvalue and rvalue categories.  The array section introduces aggregate initialization and range-based iteration syntax.



## Pointer Types


A pointer type is a type that holds an address as its value.  Each type, whether fundamental, built-in or user-defined, has a pointer type associated with it.  The pointer types associated with the C++ fundamental types are:

- `signed char*`
- `short int*`
- `int*`
- `long int*`
- `long long int*`
- `float*`
- `unsigned char*`
- `unsigned short int*`
- `unsigned int*`
- `unsigned long int*`
- `unsigned long long int*`
- `double*`
- `char*`
- `bool*`
- `wchar_t*`
- `char16_t*`
- `char32_t*`
- `long double*`

In C++, different pointer types are not assignment compatible.



### Null Address Constant

The null address is an address in memory with special significance.  By convention, **the null address cannot be dereferenced**.  The C++ keyword `nullptr` refers to the constant that stores this address.  Any attempt to dereference a pointer that holds the value `nullptr` causes a run-time error.


#### Good Design Style

A *wild pointer* is a pointer that has not been initialized to any valid address.  It is good style to initialize every wild pointer to `nullptr`.  Any run-time attempt to dereference the `nullptr` address will terminate execution rather than allow execution to continue and generate erroneous results.


### Synonym Pointer Types

Each synonym type also has a pointer type associated with it:

```cpp
typedef unsigned long long int ullint;
ullint* p;
```

A synonym pointer type simplifies repeated definitions of the pointer type.  For example,

```cpp
typedef unsigned long long int* ullint_ptr;
ullint_ptr p; // a pointer to ullint
```

Unlike a pointer declaration, this synonym type does not require an `*` before each identifier.  Compare this syntax to direct-definition syntax:

```cpp
unsigned long long int* pp, * qq;  // we need * before each identifier
ullint_ptr p, q;                   // no need for a repeated *
```

Synonym pointer syntax is more readable and less error prone.



### Generic Pointer Type


The generic pointer type is distinct from any other pointer type defined in an application:  a pointer of generic type can hold the address of an object without holding the type information of that object itself.

A generic pointer type holds an address but is not associated with any object type.  The keyword `void` identifies a generic pointer type:

```cpp
void* p; // generic pointer type
```

Converting a pointer of any type into a generic type and vice versa does not lose its address. The program:

```cpp
// Generic Pointer Type
// void.cpp

#include <iostream>

int main()
{
	int i;
	void* v = &i;
	int* j;
	j = static_cast<int*>(v);  // OK - j now holds the address of i
	std::cout << &i << std::endl;
	std::cout << j << std::endl;
}
```

outputs (the values will be different in each run, but both lines will have the same value)

```
0024FA18
0024FA18
```

Converting from one pointer type to another requires an explicit cast:

```cpp
int* i;
char* c;
i = c; // ERROR - Incompatible: Different Pointer Types
```

```cpp
int* i;
char* c;
i = static_cast<int*>(static_cast<void*>(c)); // OK
```



#### Dereferencing a Generic Pointer


Since a generic pointer lacks the type information of the object pointed to, the compiler cannot dereference the pointer and interpret the data stored in the region of memory starting at the address pointed to.  To access the information stored at that address, the type of that information is required; we cast a generic pointer to the type that is associated with its address.



#### Hexadecimal Dump Example


The function `hexDump()` listed below displays the contents of a region of memory regardless of the type associated with that region.  The function receives the region's address and its size in number of bytes.  It casts the generic pointer `a` to a pointer to an `unsigned char` and displays the contents of `c[i]` in hexadecimal notation:

```cpp
// Hexadecimal Representation at an Address
// hexDump.cpp

#include <iostream>
#include <iomanip>

void hexDump(void*, int);

int main()
{
	int i;
	double x;

	std::cout << "Integer value: ";
	std::cin >> i;
	std::cout << "is : ";
	hexDump(&i, 4);
	std::cout << std::endl;

	std::cout << "Floating-point value: ";
	std::cin >> x;
	std::cout << "is : ";
	hexDump(&x, 8);
	std::cout << std::endl;
}

// Dump the first "n" bytes starting from the address stored in "a"
void hexDump(void* a, int n)
{
	unsigned char* c = static_cast<unsigned char*>(a);

	auto oldFill = std::cout.fill('0'); // zero fill
	std::cout << std::hex;              // hexadecimal output

	for (int i = 0; i < n; i++)
		std::cout << std::setw(2) << static_cast<int>(c[i]) << ' ';

	std::cout.fill(oldFill);  // restore the filling character
	std::cout << std::dec;    // restore to decimal output
}
```

If the user inputs the values `2456` and `4.56`, the output is

```
Integer value: 2456
is : 98 09 00 00

Floating-point value: 4.56
is : 3d 0a d7 a3 70 3d 12 40
```

Note that in this example the platform is little-endian (little end first).



## References


A reference is an **alias** for an existing object.  That is, it is an alternative name for the entity defined elsewhere.  Each object defined in source code can have a reference associated with it.  C++17 admits two reference declarations:

- an ***lvalue** reference* - denoted by `&`
- an ***rvalue** reference* - denoted by `&&`

The declaration of an *lvalue reference* identifies an accessible region of memory.  The declaration of an *rvalue reference* identifies:

- an object near the end of its lifetime
- a temporary object or subobject
- a value not associated with an object

The C++ language does not support references to references, arrays of references, or pointers to references.


### *lvalue* References

An lvalue reference requires an initializer unless it

- has external linkage
- is a class member within a class definition
- is a function parameter or a function return type

```cpp
// Module B Header
// B.h
class B
{
	int b;
public:
	B(int n);
	void display() const;
};
```

```cpp
// Module B Implementation
// B.cpp
#include <iostream>
#include "B.h"

B::B(int n) : b(n) {}

void B::display() const { std::cout << b << std::endl; }
```

```cpp
// Module A Header
// A.h
class B;

class A
{
	B& d; // no initializer required: class member declaration
public:
	A(B& bb); // no initializer required: function parameter declaration
};

A& foo(A&);
```

```cpp
// Module A Implementation
// A.cpp
#include <iostream>
#include "A.h"
#include "B.h"

extern B& b; // no initializer required: external linkage

A::A(B& bb) : d(bb) // initialization is in constructor definition
{
	d.display();
}

A& foo(A& a) // no initializers required:
{
	// parameter and return type declarations
	A& aa = a; // LVALUE REQUIRES AN INITIALIZER
	b.display();
	return aa;
}
```

```cpp
// lvalue References
// lvalue.cpp
#include "A.h"
#include "B.h"

B e(8), f(6);
B& b = e; // LVALUE REQUIRES INITIALIZER

int main()
{
	A a(f);
	foo(a);
}
```



### *rvalue* Reference

An rvalue reference declaration identifies an object that is less permanent, possibly temporary.  For example, the program

```cpp
// rvalue Reference
// rvalue.cpp

#include <iostream>

class A
{
	int a;
public:
	A(int aa) : a(aa) {}
	void display(const char* str) const
	{
		std::cout << str << ' ' << a << std::endl;
	}
};

void print(const A& a) { a.display("lvalue "); }
void print(A&& a)      { a.display("rvalue "); }

int main()
{
	A a(10);
	print(a);
	print(A(20));
}
```

produces the output

```
lvalue  10
rvalue  20
```

Practical uses for *rvalue* references include the move-constructors and move-assignment operators described in the chapter entitled [Classes and Scoped Enumerations](/B-Types/classes-and-scoped-enumerations).



### Standard Library

The standard library provides two functions for specifying the type of reference when that is important:

- `std::ref()` - returns an *lvalue* reference to its argument (important of functions in the standard library)
- `std::move()` - returns an *rvalue* reference to its argument

Their prototypes are declared in `<utility>` header.

The program

```cpp
// rvalue Reference using std::move()
// std_move.cpp

#include <iostream>
#include <utility>

class A
{
	int a;
public:
	A(int aa) : a(aa) {}
	void display(const char* str) const
	{
		std::cout << str << ' ' << a << std::endl;
	}
};

void print(const A& a) { a.display("lvalue "); }
void print(A&& a)      { a.display("rvalue "); }

int main()
{
	A a(10), b(20);
	print(a);
	print(std::move(b));
}
```

outputs

```
lvalue  10
rvalue  20
```

Practical uses of `std::ref` are discussed in the chapter entitled [Algorithms](/E-STL/algorithms).



## Array Types


An array type is a built-in type that consists of elements of identical type arranged contiguously in memory.  Each element is a subobject of the array type.  We declare an array type using the `[]` declarator operator.  An array can be constructed from any one of the

- fundamental types (except `void`)
- pointer types
- pointer to member types
- class types
- enumeration types (see the chapter entitled [Classes and Scoped Enumerations](B-Types/classes-and-scoped-enumerations))

Note that an array cannot be constructed directly from reference types.



### One-Dimensional Array

The definition of a one-dimensional array takes one of the following forms

```
Type identifier[ c ];             // allocated on the stack
Type* identifier = new Type[ n ]; // allocated on the heap
```

where:
- `Type` is the type of each of the elements in the array
- `c` is the number of elements in the array and is an integer constant or constant integer expression.
- `n` is the number of elements in the array and is an integer variable, integer constant or an integer constant expression.



### Aggregate Initialization

We can initialize an array through *aggregate initilization*.  Aggregate initialization takes one of the following forms:

- `Type identifier[ c ] = { initializer-list };`
- `Type identifier[ c ] = {  };`
- `Type identifier[ c ] { initializer-list };`
- `Type identifier[ c ] { };`
- `Type identifier[   ] = { initializer-list };`
- `Type identifier[   ] { initializer-list };`
- `Type* identifier = new Type[ n ] { initializer-list };`
- `Type* identifier = new Type[ n ] {  };`

`initializer-list` is a comma-separated list of initial values.  If this list is present, `c` is optional.  If `c` exceeds the number of values in the list, the compiler initializes the uninitialized elements to `0`.  If the initialization list is absent, `c` is required.  If the braces are present but there is no initialization list, the compiler initializes all elements to `0`.

For example, the program

```cpp
// Aggregate Initialization
// initializers.cpp
#include <iostream>

int main()
{
	const int n = 6;
	int  a[ ] = { 1,2,3 };
	int  b[ ]{ 1,2,3 };
	int  c[5]{ 1,2,3 };
	int  d[5]{};
	int* f = new int[n]{ 1,2,3 };
	int* g = new int[n]{};

	for (int e : a) // range-based for (see below)
		std::cout << e;
	std::cout << '|' << std::endl;

	for (int e : b)
		std::cout << e;
	std::cout << '|' << std::endl;

	for (int e : c)
		std::cout << e;
	std::cout << '|' << std::endl;

	for (int e : d)
		std::cout << e;
	std::cout << '|' << std::endl;

	for (int i = 0; i < n; ++i) // cannot use range-based for with pointers
		std::cout << f[i];
	std::cout << '|' << std::endl;

	for (int i = 0; i < n; ++i)
		std::cout << g[i];
	std::cout << '|' << std::endl;

	delete[] f;
	delete[] g;
}
```

produces the output

```
123|
123|
12300|
00000|
123000|
000000|
```




### Range-Based `for`

A range-based `for` is an iteration construct specifically designed for use with collections.  This construct steps sequentially through the elements of a collection; the collection type must carry information about its size or a mechanism to detect when the boundary has been reached (**statically**-allocated array types carry such information, but pointers don't).

The program:

```cpp
// Range-Based for
// for_each.cpp

#include <iostream>

int main ()
{
	int a[]{1, 2, 3, 4, 5, 6};

	for (int& e : a)
		std::cout << e << ' ';
	std::cout << std::endl;
}
```

outputs

```
1 2 3 4 5 6
```




### Range-Based for with Type Inference

A range-based for can infer the type of each element in the array from the array declaration itself. The program

```cpp
// Range-Based for
// for_each_auto.cpp

#include <iostream>

int main ()
{
	int a[]{1, 2, 3, 4, 5, 6};

	for (auto& e : a) // the type of an element will be inferred by the compiler
		std::cout << e << ' ';
	std::cout << std::endl;
}
```

outputs

```
1 2 3 4 5 6
```



## Exercises


<!-- Complete the practice problem in the Handout on [Generic Pointers](missing).-->
- Read Wikipedia on [Array Data Structures](https://en.wikipedia.org/wiki/Array_data_structure).
