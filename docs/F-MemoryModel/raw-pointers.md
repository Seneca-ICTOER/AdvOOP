---
id: raw-pointers
title: Raw Pointers
sidebar_position: 1
description: TBD
---

# Raw Pointers

- Create program components using raw pointers and pointer arithmetic

> "A memory model is an agreement between the machine architects and the compiler writers to ensure that most programmers do not have to think about the details of modern computer hardware."  Stroustrup (2014)





Programming languages associate objects with memory locations in an abstract machine, letting programmers focus on changes to the values stored in those memory locations without regard to the locations in processor memory on the host computer.  A programming language's memory model defines how any compiler should relate the memory locations in the abstract machine to the physical memory locations in any processor.  The simplest memory model is an address space consisting of a contiguous sequence of bytes, with each address referring to its own byte.  Such a model supports direct access to the underlying processor memory. 

The type systems of object-oriented languages associate regions of memory with objects.  Each region associated with an object is a contiguous sequence of bytes.  Each object is stored at a unique address and the object's type determines the region of memory occupied by the object. 

![Memory Map](/img/memory.png)

In C++, a raw pointer is a built-in type that holds an address of a memory location in the abstract machine.  The pointer provides direct access to the object that occupies the region of memory that *starts at that address*.  Dereferencing the pointer accesses the value stored in the region of memory starting at the pointer's address. 

This chapter reviews that part of the C++ memory model that describes the memory in the abstract machine through a review of raw pointer syntax.  The description covers C-style null-terminated character strings, which are part of the strings category of the Standard Library, and expressions that take pointer types as their operands. 



## C-Style Character Strings


A C-style character string provides the simplest possible analogue for describing the memory that a raw pointer accesses.  These strings are arrays of byte-size elements.  The addresses of consecutive elements differ in value by one.  That is, the memory is byte-addressable memory. 



### Element Addresses

The following program displays each character of a C-style character string along with its address in memory:

```cpp
// Element Addresses
// addresses.cpp

#include <iostream>

int main()
{
	const char s[] = "A C string"; 

	std::cout << std::hex;

	for (int i = 0; s[i]; i++)
		std::cout << (int*)&s[i] << " : " << s[i] << std::endl; 
}
```

```
37FB78 : A
37FB79 :
37FB7A : C
37FB7B :
37FB7C : s
37FB7D : t
37FB7E : r
37FB7F : i
37FB80 : n
37FB81 : g
```

The `std::hex` manipulator specifies the current output format as hexadecimal.  Note that in order to display the address of an element we cast it to an `int*` type.  Without the `int*` cast, the substring starting at the address would display as shown below:

```cpp
// Substrings
// substrings.cpp

#include <iostream>

int main()
{
	char s[] = "A C string"; 

	for (int i = 0; s[i]; i++)
		std::cout << &s[i] << " : " << s[i] << std::endl; 
}
```

```
A C string : A
C string :
C string : C
string :
string : s
tring : t
ring : r
ing : i
ng : n
g : g
```

Displaying a substring starts with the value stored at the address of the first element in the substring and ends once the element's value is the null byte (the value of the C-style character string terminator).



### String Literals


A sequence of characters surrounded by double quotes is called a string literal.  A string literal is an lvalue.  It is a primary expression stored in the segment of memory that holds global variables.  The lifetime of this segment is the lifetime of the program.  String literals have static duration. 



#### Copying a String Literal

The following program defines a string literal, stores its address in a pointer, defines a C-style character string, copies the contents of the string literal into that second string, changes the first character to lower case and displays the updated string along with the addresses of the pointer and the string:

```cpp
// String Literal
// stringLiteral.cpp

#include <iostream>
#include <cstring>

int main()
{
	const char* p = "May be overwritten";
	char s[19];
	std::strcpy(s, p);

	s[0] = 'm';  // OK
	std::cout << std::hex;
	std::cout << s << std::endl;

	std::cout << "s = " << (int*)s << std::endl; 
	std::cout << "p = " << (int*)p << std::endl;
}
```

```
may be overwritten 
s = 0x7ffcbd568e00
p = 0x400b54
```

Note that the program does not alter the string literal itself. The memory for `s` is distinct from the memory for the string literal `"May be overwritten"`, which we can change.



#### Pointing to a String Literal

A string literal is an **unmodifiable lvalue**.  We may not change its contents.  Compare the following program which points to a string literal with the program above:

```cpp
// Pointing to a String Literal
// ptrToStringLiteral.cpp

#include <iostream>

int main()
{
	char *p  = "Avoid overwriting"; // poor coding style; newer compilers might flag this line

	p[0] = 'a';  // ISO C++ forbids converting a string constant to a 'char*' 
	std::cout << p << std::endl;
}
```

The message is a warning.  Execution of the compiled code can cause a segmentation fault. 

To trap such errors at compile time, we explicitly qualify the pointer as unmodifiable:

```cpp
// String Constants
// ptrToConstStringLiteral.cpp

#include <iostream>

int main()
{
	const char *p  = "Avoid overwriting"; // good coding style 

	p[0] = 'a';  // ERROR: assignment of read-only location '*p'
	std::cout << p << std::endl;
}
```



## Expressions

The operands in various expressions can be raw pointers.  These expressions include:

- subscripting
- function call
- indirect selection
- postfix increment, decrement
- constrained casts
- prefix increment, decrement
- sizeof
- address of
- indirection
- type casting
- object, pointer to member pointer
- additive
- relational, equality, inequality
- logical and, or
- conditional
- compound type-wise addition, subtraction

Two groups are of particular interest:
- arithmetic operations
- postfix operations



### Arithmetic Operations


#### Addition

A binary expression with the addition operator (`+`) adds the values of its operands.  If one of the operands is of pointer type, the other must be of integral or unscoped enumeration type.  The expression evaluates to the address that is the number of types beyond the address stored in the pointer operand.  That is, the integral operand gives the offset in types (not bytes).  For example,

```cpp
// Pointer Addition
// pointerAddition.cpp

#include <iostream>

int main()
{
	double a[] = {1.1, 2.2, 3.3, 4.4 , 5.5};
	int i = 2;
	double* p;

	p = &a[1];
	std::cout << std::hex;
	std::cout << a[0]     << " : " << a     << std::endl; 
	std::cout << *(p + i) << " : " << p + i << std::endl; 
	std::cout << p[i]     << " : " << &p[i] << std::endl;
}
```

```
1.1 : 0037F99C 
4.4 : 0037F9B4
4.4 : 0037F9B4
```

Note that the difference between `0037F9B4` and `0037F99C` is 18 hexadecimal or 24 decimal; that is, 3 doubles.

An addition expression with a pointer operand evaluates to a defined value as long as the result of the addition points to an element of the array or to the location that is one element beyond the end of the array.  Otherwise, the expression is ill-defined.



#### Subtraction

A binary expression with the subtraction operator (`-`) subtracts the value of rightmost operand from the value of the leftmost operand.  If the left operand is of pointer type, the right operand must be either of integral or of the same pointer type.  The result of subtracting an integral type from a pointer type is the address that is the number of pointed-to types before the address stored in the left operand.  The result of subtracting a pointer type from another pointer type is an integer of synonym type `ptrdiff_t`.  The integer holds the number of types between the two addresses.  `ptrdiff_t` is defined in the `<cstddef>` header file.  For example,

```cpp
// Pointer Subtraction
// pointerSubtraction.cpp

#include <iostream>
#include <cstddef>

int main()
{
	int a[] = {1,2,3,4,5}, i = 2, *p, *r;
	ptrdiff_t k;

	p = &a[4];
	r = &a[0];
	k = p - r; // difference between addresses
	std::cout << *(p - i) << std::endl; // value at address i types before *p 
	std::cout << k << std::endl;
}
```

```
3
4
```

An expression that subtracts one pointer from another has a defined value if both pointers point to elements of the same array or if one points to an element of the array and the other points to the location that is one element beyond the end of the same array.  Otherwise, the expression is ill-defined.



### Postfix Operations


#### Increment and Decrement


Postfix expressions are useful for moving between adjacent type.  For example, the following function determines the length of a C-style, null-terminated string.  Execution leaves the `while` loop once it encounters the null byte (`*s == '\0'`).  In this example, each type is of one-byte length:

```cpp
unsigned length(const char *s)
{
	unsigned len = 0u;
	while (*s++) len++;
	return len;
}
```

Note that the dereferencing operator `*` has lower precedence than the post-fix operator `++`.  This means that the expression `*s++` is evaluated as `*(s++)`.  That is, the condition increments the address stored in pointer `s` to point to the next byte, retrieves the value stored in that address, and checks that value against `nullptr`. 



#### Reference to a Pointer

A reference to a pointer lets us change the address that has been stored in a pointer outside a function from within the function in the same way that a reference to a variable that holds a value.  For example,

```cpp
// Reference to a Pointer
// ref_to_ptr.cpp

#include <iostream>

void swap(int*& a, int*& b)
{
	int* t = a;
	a = b;
	b = t;
}

int main()
{
	int x, y;
	int* p = &x;
	int* q = &y;

	std::cout << "p = " << p << std::endl; 
	std::cout << "q = " << q << std::endl;

	swap(p, q);

	std::cout << "p = " << p << std::endl;
	std::cout << "q = " << q << std::endl;
}
```

```cpp
p = 0040F850
q = 0040F84C

p = 0040F84C 
q = 0040F850
```


## Exercises

- Read Wikipedia on [Pointers](https://en.wikipedia.org/wiki/Raw_pointer#raw_pointer)
