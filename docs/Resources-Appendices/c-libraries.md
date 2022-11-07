---
id: c-libraries
title: The C Libraries
sidebar_position: 7
description: TBD
---

# The C Libraries


- Describe the procedural features available in the standard libraries

> "The best thing about standards is that there are so many to choose from." Variously Attributed.





C++ provides procedural programming support through access to the standard C libraries within the `std` namespace.  The two most common libraries are the input-output library (`cstdio`) and the general-purpose library (`cstdlib`). 

In this chapter, we describe the two families of functions in the C input-output library and the full set of conversion specifiers for the various fundamental types.  We also describe the functions in the general-purpose C library for string conversion, allocation and de-allocation of dynamic memory, and creation of temporary files. 



## Input-Output

The `cstdio` library is the standard input-output library for procedural programming in C++.

The `cstdio` library handles input and output streams through pointers to `FILE` types.  The library predefines three `FILE` pointers, which are available to all applications:

- `FILE* stdin`  - standard input stream
- `FILE* stdout` - standard output stream
- `FILE* stderr` - standard error stream

The two families of functions available for formatted input and output are:

- `scanf()` family:
  - `int scanf(const char*, ...)` - read formatted data from `stdin`
  - `int fscanf(FILE*, const char*, ...)` - read formatted data from a file
  - `int sscanf(const char*, const char*, ...)` - read formatted data from a C-style string

- `printf()` family:
  - `int printf(const char*, ...)` - write formatted output to `stdout`
  - `int fprintf(FILE*, const char*, ...)` - write formatted output to a file
  - `int sprintf(char*, const char*, ...)` - write formatted output to a C-style string

The `scanf()` functions returns the number of addresses successfully filled or `EOF` if end of data has been encountered.  The `printf()` functions return the number of characters successfully written.  Both families use conversion specifiers for formatting data.  Each conversion specifier consists of a leading `%` and a trailing conversion letter.



### `scanf` Conversion Specifiers

#### Integral Types

The conversion specifiers for the integral types in calls to the `scanf()` functions are:

Specifier  | Input Value          | Argument     | Default Conversion
-----------|----------------------|--------------|---------------------------
`%c`       | `cc...c`             | `char*`      | one or more characters 
`%d`       | `[-/+]dd...d`        | `int*`       | signed decimal
`%i`       | `[-/+][0[x]]dd...d`  | `int*`       | signed integer
`%u`       | `[-/+]dd...d`        | `unsigned*`  | unsigned decimal
`%o`       | `[-/+]dd...d`        | `unsigned*`  | unsigned octal
`%x`       | `[-/+][0x]dd...d`    | `unsigned*`  | unsigned hexadecimal

The size specifiers between the `%` and the conversion letter are:

Conversion Specifier          | Size Specifier  | Argument
------------------------------|-----------------|----------
`%c`                          | `l`             | `wchar_t*`
`%d`, `%i`, `%u`, `%o`, `%x`  | `hh`            | `char*`
`%d`, `%i`, `%u`, `%o`, `%x`  | `h`             | `short*`
`%d`, `%i`, `%u`, `%o`, `%x`  | `l`             | `long*`
`%d`, `%i`, `%u`, `%o`, `%x`  | `ll`            | `long long*`


#### Floating-Point Types

The conversion specifiers for the floating-point types in calls to the `scanf()` functions are:

Specifier               |  Input Value         |  Argument  |  Default Conversion
------------------------|----------------------|------------|---------------------
`%a`, `%f`, `%e`, `%g`  | `[-/+]dd... . ...d`  | `float*`   | signed decimal floating-point

The size specifiers between the `%` and the conversion letter are:

Conversion Specifier    | Size Specifier  | Argument
------------------------|-----------------|---------------
`%a`, `%f`, `%e`, `%g`  | `l`             | `double*`
`%a`, `%f`, `%e`, `%g`  | `L`             | `long double*`



### `printf` Conversion Specifiers

#### Integral Types

The conversion specifiers for the integral types in calls to the `printf()` functions are:

Specifier   | Output Value         | Argument     | Default Conversion
------------|----------------------|--------------|---------------------------
`%c`        | `c`                  | `char`       | one character 
`%d`        | `[-/+]dd...d`        | `int`        | signed decimal
`%i`        | `[-/+]dd...d`        | `int*`       | signed integer
`%u`        | `[-/+]dd...d`        | `unsigned*`  | unsigned decimal
`%o`        | `[0]oo...o`          | `unsigned*`  | unsigned octal
`%x`, `%X`  | `[0x/0X]hh...h`      | `unsigned*`  | unsigned hexadecimal

The size specifiers before the conversion letter are:

Conversion Specifier                | Size Specifier  | Argument
------------------------------------|-----------------|----------------------------
`%c`                                | `l`             | `wint_t*`
`%d`, `%i`, `%u`, `%o`, `%x`, `%X`  | `hh`            | `char`, `unsigned char`
`%d`, `%i`, `%u`, `%o`, `%x`, `%X`  | `h`             | `short`, `unsigned short`
`%d`, `%i`, `%u`, `%o`, `%x`, `%X`  | `l`             | `long`, `unsigned long`
`%d`, `%i`, `%u`, `%o`, `%x`, `%X`  | `ll`            | `long long`, `unsigned long long`

The `wint_t` type stores a single wide character.


#### Floating-Point Types

The conversion specifiers for the floating-point types in calls to the `printf()` functions are:

Specifier                     |  Output Value        |  Argument  |  Default Conversion
------------------------------|----------------------|------------|--------------------
`%f`, `%e`, `%E`, `%g`, `%G`  | `[-/+]dd... . ...d`  | `double`   | signed decimal floating point
`%a`, `%A`                    | `[-/+]dd... . ...d`  | `double`   | signed hexadecimal floating point

In `%g`, `%G` conversions the `%e`, `%E` conversion applies only if the exponent is less than -4 or greater than or equal to the specified precision.  Otherwise, the `%f` conversion applies. 

The size specifiers before the conversion letter are

Conversion Specifier                      | Size Specifier  | Argument
------------------------------------------|-----------------|---------------
`%a`, `%A`, `%f`, `%e`, `%E`, `%g`, `%G`  | `l`             | `double*`
`%a`, `%A`, `%f`, `%e`, `%E`, `%g`, `%G`  | `L`             | `long double*`




## General Purpose


The general purpose utilities library includes functions for string conversion, dynamic memory management, random number generation, communication with the environment, searching, and sorting.



### String Conversion

The string conversion functions convert a C-style null-terminated string to a primitive type:

- `double atof(const char*)` - string to a `float`
- `int atoi(const char*)` - string to an `int`
- `long atol(const char*)` - string to a `long`
- `strod(const char*, char** endptr)` - string to a `double`
- `strol(const char*, char** endptr, int base)` - string to a `long`
- `stroul(const char*, char** endptr, int base)` - string to an `unsigned long`

`endptr` returns the address of the character immediately after the converted part of the string.  `base` is the base to use in the conversion.



### Dynamic Memory

The functions for allocating and de-allocating dynamic memory apply to arrays of any dimension.


#### One-Dimensional Arrays

We define a one-dimensional array in dynamic memory in two parts

- define a pointer that holds the address of the array
- allocate dynamic memory for the array

The pointer definition takes the form

```cpp
type* array;
```

where `array` is the array's identifier.  We allocate dynamic memory for the array by calling the library function:

```cpp
void* malloc(int)
```

This function takes as its parameter the number of bytes in the array, allocates contiguous space in dynamic memory for the specified number of bytes and returns the address of the allocated space as a generic pointer.  We cast this pointer to the type of the array and store the result in the pointer we previously defined

```cpp
array = (type*) malloc(nBytes);
```

We de-allocate the dynamic memory before this pointer goes out of scope by calling the library function:

```cpp
void free(void*)
```

This function takes as its parameter the address of the array. 

Note that `malloc(int)` returns a generic pointer, which we may need to cast to a particular type.

The following example shows the allocation and de-allocation of a one-dimensional array in dynamic memory:

```cpp
/* Dynamically Allocated Arrays
* malloc.cpp
*/

#include <cstdio>
#include <cstdlib>
using namespace std;

int main ()
{
  int n;
  int* a; 

  printf("Number of elements : ");
  scanf("%d", &n);

  a = (int*) malloc(n * sizeof(int));

  for (int i = 0; i < n; i++)
    a[i] = (i + 1) * (i + 1);

  for (int i = 0; i < n; i++)
    printf("%3d %5d\n", i + 1, a[i]);

  free(a);
}
```

```
Number of elements : 5
  1     1
  2     4
  3     9
  4    16
  5    25
```



#### Two-Dimensional Arrays

We allocate a two-dimensional array in dynamic memory in five steps:

- allocate memory for a single pointer to a 1-D array of pointers to the rows of the 2-D array
- allocate dynamic memory for a 1-D array of pointers to the rows of the array
- store the address of the 1-D array in the stack pointer
- allocate dynamic memory for each row of the array
- store the address of each row in an element of the 1-D array of pointers

We de-allocate the memory allocated for each row first followed by the memory allocated for the array of pointers. 

For example,

```cpp
// Dynamically Allocated 2d Arrays
// malloc2d.cpp

#include <cstdio>
#include <cstdlib>
using namespace std;

int main () {
  int nc, nr;
  int** a; 

  printf("Number of rows : ");
  scanf("%d", &nr);
  printf("Number of columns : ");
  scanf("%d", &nc);

  a = (int**) malloc(nr * sizeof(int*)); 

  for (int i = 0; i < nr; i++)
    a[i] = (int*) malloc(nc * sizeof(int)); 

  for (int i = 0; i < nr; i++)
    for (int j = 0; j < nc; j++)
      a[i][j] = (i + 1) * (j + 1);

  printf("   ");
  for (int j = 0; j < nc; j++)
    printf("%4d", j + 1);
  printf("\n");

  for (int i = 0; i < nr; i++)
  {
    printf("%3d", i + 1);
    for (j = 0; j < nc; j++)
      printf("%4d", a[i][j]);
    printf("\n");
  }

  for (int i = 0; i < nr; i++)
    free(a[i]); // deallocate row i
  free(a); // deallocate pointers
}
```

```
Number of rows : 4
Number of columns : 5

    1   2   3   4   5 
1   1   2   3   4   5
2   2   4   6   8  10
3   3   6   9  12  15
4   4   8  12  16  20
```



### Temporary Files


If we need to create a temporary file, we must ensure that the name of that file is not a name that already exists in the host directory.  The `cstdlib` library includes a global function named `mkstemp(char*)` that receives a template for such a file name in the form of a C-style null-terminated string and changes the string to a file name that is unique.  Once we are finished with the file, we delete it using the global `remove()` function.

For example,

```cpp
// Unique Temporary File
// mkstemp.cpp

#include <cstdlib>
#include <iostream>
#include <fstream>
using namespace std;

int main()
{
  char tempfile[] = "tempXXXXXX";
  mkstemp(tempfile);
  ofstream fout(tempfile);  // opens for output 
  cout << tempfile << endl;
  remove(tempfile); // removes file from system
}
```



## Exercise and Research

- Read pages 105-106 from Evan Weaver's subject notes
- Research the exception class in the [GNU library](http://gcc.gnu.org/onlinedocs/libstdc++/latest-doxygen/classstd_1_1exception.html)

