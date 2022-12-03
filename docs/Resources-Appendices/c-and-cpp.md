---
id: c-and-cpp
title: How C++ and C Fit Together
sidebar_position: 8
description: TBD
---

# How C++ and C Fit Together

- Identify the incompatibilities between the C++ and C standards
- Describe the differences between the C++11 standard and C99
- Review the features of the standard C library included in the standard C++ library

> "The semi-official policy for C++ in regards to C compatibility has always been 'As Close as Possible to C, but no Closer'." Koenig (1989)

C++ provides, in addition to sophisticated object-oriented facilities, procedural programming facilities through the syntax that it shares with the C language. Some language implementers advocate increasing compatibility between the two languages, while others claim that nothing can be done about the existing incompatibilities. Each language was created for different purposes and continues to have its own preference. C++ was created for developing large scale, complex applications, focuses on type safety and building libraries, and prefers additions to its standard library over additions to the built-in core facilities. C was created to develop operating systems like Unix, focuses on relatively low level features, and prefers additions to built-in core facilities.

Each language standard includes facilities particular to itself as illustrated below. Differences between the standards have been and continue to be a source of confusion and bugs. We need to be aware of these differences whenever we port code from one standard to another.

![C and C++ Compatibility](/img/compatibility.png)

In this chapter, we describe the facilities that are implemented differently under the different standards and review the C libraries that ship with standard C++.

## Differences

The major incompatibility between C++ and C is the set of new keywords, such as `class`, `new`, and `public`, that cannot be used as identifiers in C++ programs. C++ introduced BCPL's `//` comments, `const` as a symbolic constant that follows type and scope rules, `void*` as a type-safe notion of memory holding objects of unknown type, `new` and `delete` for memory allocation and de-allocation, and `inline` functions. The C standards have integrated some of the C++ facilities. C89 introduced its own version of `void*` and C99 introduced its own version of `inline` functions.

The standards writers have tried not to increase the number of incompatibilities and have adjusted wordings where possible. For example, declarations that differ only in `const` at the highest level of an argument type are identical:

```cpp
void foo(const int);
void foo(int);       // identical to void foo(const int)
```

### What is a Definition?

The C++ and C standards apply the term **definition** differently. In both, a definition is a declaration, but a declaration is not necessarily a definition. In C++, a definition attaches some meaning to a name. That meaning may be what is temporarily required in processing the name and does not necessarily refer to assigned storage. In C, definition specifically refers to the place in the code where an object or function is assigned storage.

For example,

```cpp
// Declarations and definitions

// Statement                 // in C++           // in C
extern int a;                // declares a       declares a
extern const int b;          // declares b       declares b
int f(int);                  // declares f       declares f
struct S;                    // declares S       declares S
typedef int Int;             // declares Int     declares Int

int c;                       // defines c        defines c
int f(int x) { return ++x; } // defines f        defines f

enum Dir { up, down };       // defines up down  declares up down
struct S { int a; int b; };  // defines S        declares S
struct X {                   // defines X        declares X
  int x;                     // defines x        declares x
};
```

The difference in interpretation of 'definition' does not affect the design of a header file. In C++, certain definitions (listed in the chapter on platform-dependent libraries) as well as declarations that are not definitions are permitted in a header file. In C, a header file does not include any definitions. In the end, the result is the same.

### Noteworthy Cases

The following cases are more fully described in the memo entitled _"Sibling Rivalry: C and C++"_ by Bjarne Stroustrup (2002).

#### Implicit `int`

Both C++98 and C99 have banned implicit `int`. All variable definitions must specify their data type and all function definitions must specify their return type. Omitting type in either case no longer defaults to an `int`. Both standards have broken backward compatibility in banning this legacy default.

#### Undeclared Templates

C++98 and C99 have banned calls to undeclared functions. C89 still allows such calls.

```cpp
// declared functions - C++

#include <cstdio> // required
using std::printf;

int main()
{
     printf("Hello World");
}
```

```c
/* declared functions - C */

#include <stdio.h> // C99 requires

int main(void)
{
     printf("Hello World");
     return 0;
}
```

#### No Function Parameters

C++98 specifies no function parameters through empty parentheses. C89 and C99 specify no function parameters through the keyword `void` between the parentheses:

```cpp
// no function parameters - C++

#include <iostream>
using std::cout;

int main()
{
  cout << "Hello World";
  return 0;
}
```

```c
/* no function parameters - C */

#include <stdio.h>

int main(void)
{
  printf("Hello World");
  return 0;
}
```

C++98 permits use of the keyword `void` as a parameter for compatibility with the C standards.

#### `int main()`

C++98 and C99 specify a return type of `int` for the main function of any application. C++98 lets us omit the return statement, in which case a value of 0 returns to the system. C99 does not allow omission of the the return statement. The function definition can take either of two forms: with parameters or without parameters.

Templates that take no parameters have the following headers:

```cpp
// main() without parameters - C++

#include <iostream>
using std::cout;

int main()
{
  cout << "Hello World";
}
```

```c
/* main() without parameters - C */

#include <stdio.h>

int main(void)
{
  printf("Hello World");
  return 0; /* C99 requires */
}
```

Templates that take two parameters have the following headers:

```cpp
// main() with parameters - C++

#include <iostream>
using std::cout;

int main(int argc, char* argv[])
{
  for (int i = 0; i < argc; i++)
    cout << argv[i] << ' ';
}
```

```c
/* main() with parameters - C */

#include <stdio.h>

int main(int argc, char* argv[])
{
  int i;
  for (i = 0; i < argc; i++)
    printf("%s ", argv[i]);
  return 0; /* C99 requires */
}
```

C99 specifies that `argv[argc]` holds the `NULL` address.

#### Global `const`

C++98 implements a global `const` as local to its translation unit by default, as usable in constant expressions, and as stored in memory only if its address is taken. C89 implemented global `const` as having external linkage by default, as unusable in constant expressions, and as stored in memory.

C++98 selected internal linkage to make `const` behave like macros and `struct`s. C89 selected external linkage for consistency with the default linkage of global variables and functions, which made it necessary to store all `const`s in memory and therefore introduced overhead with respect to macros.

#### `void*`

C++98 implements `void*` as a type-safe notion of memory that holds objects of unknown type. Any pointer can be implicitly converted to `void*`, but any use of the memory addressed requires some sort of cast. C89 added `void*` and admitted implicit assignment of `void*` to any pointer type.

Because C++98 has the `new` operator, it doesn't require implicit assignment as C89 required for `malloc()`. On the other hand, C89 allowed for a definition of `NULL` that can't be assigned to an `int`. C++98 does not and in this respect is less type-safe than C89 (the case to an `int` shown below is required in C89).

```cpp
// Generic Pointers - C++

#include <iostream>
#define NULL 0
using std::cout;

int main()
{
  void* q;
  char* c;
  int*  p;
  int   x = NULL; // no cast

  p  = new int; // no cast
  *p = 1;
  q  = p;
  c  = (char*)q; // needs cast
  *c = 'a';

  cout << x << ',' << *c << ',' << *p;

  delete p;
}
```

```c
/* Generic Pointers - C */

#include <stdio.h>
#include <stdlib.h>
#undef  NULL
#define NULL (void*)0

int main(void)
{
  void* q;
  char* c;
  int*  p;
  int   x = (int)NULL;

  p  = malloc(sizeof(int));
  *p = 1;
  q  = p;
  c  = q; /* no cast */
  *c = 'a';

  printf("%d,%c,%d", x, *c, *p);

  free(p);
  return 0;
}
```

#### `new`, `delete`

C++98 uses `new` and `delete` for allocation and de-allocation, which eliminates the need for a cast and the possibility of incorrect sizing on allocation, which arise in the alternatives - `malloc()` and `free()`. C89 and C99 use `malloc()` and `free()`.

#### `enum`

Each enumeration is a separate type in both C++ and C. C++98 lets us overload a function for an enumeration and does not let us assign an `int` to an enumerated type without a cast. C89 and C99 treat each enumerated type as an `int` and let us assign any `int` to any enumerated type.

```cpp
// enumerated types - C++

#include <iostream>
using std::cout;

enum Color {red, white, blue};

int main()
{
  Color wall;

  wall = (Color)1; // cast

  cout << wall;
}
```

```c
/* enumerated types - C */

#include <stdio.h>

enum Color {red, white, blue};

int main(void)
{
  enum Color wall;

  wall = 1; // no cast needed

  printf("%d", wall);
  return 0;
}
```

#### Nested structs

C++98 considers nested `struct` tags to be within the inner scope of the nesting `struct`. C89 and C99 consider nested `struct` tags to be in the outer scope.

```cpp
// nested structs - C++

#include <iostream>
using std::cout;

struct A
{
  struct B
  {
    int a;
  };
};

int main()
{
  A::B x = {2};

  cout << x.a;
}
```

```c
/* nested structs - C */

#include <stdio.h>

struct A
{
  struct B
  {
    int a;
  };
};

int main(void)
{
  struct B x = {2};

  printf("%d", x.a);
  return 0;
}
```

#### `bool`

C++ and C define `bool` differently. C++98 defines `bool` as a primitive type that takes the values `true` and `false`, which are keywords in the core language. C99 defines `bool` as a macro and provides the header file `<stdbool.h>`, which contains four macros:

- `bool` expands to the primitive type `_Bool`
- `true` expands to the integer constant `1`
- `false` expands to the integer constant `0`
- `__bool_true_false_are_defined` expands to the integer constant `1`

C99 introduced `_Bool` is the built-in type for boolean data. C99 lets us undefine and then redefine `bool`, `true`, and `false`.

```cpp
// booleans - C++

#include <iostream>
using std::cout;

int main()
{
  bool a = true, b = false;

  cout << a << ',' << b;
}
```

```c
/* booleans - C */

#include <stdio.h>
#include <stdbool.h>

int main(void)
{
  bool a = true, b = false;

  printf("%d, %d", a, b);
  return 0;
}
```

#### `static`

C++98 has deprecated the use of `static` to mean local to this translation unit in favour of the use of unnamed namespaces. C99 uses the keyword `static` to mean local to this translation unit; that is, internal linkage.

#### `inline` Templates

C++ provides `inline` functions as type-safe alternatives to function-like C macros. The **One Definition Rule** of C++98 requires identical definition of global `inline` functions in all of the translation units of a single application. C99 considers an `inline` function local to its translation unit by default.

#### `for` Initializers

C++98 and C99 allow initializer definitions in `for` statements. C89 did not.

```cpp
// for initializers - C++

#include <iostream>
using std::cout;

int main()
{
  for (int i = 0; i < 5; i++)
  cout << i << ' ';
}
```

```c
/* for initializers - C99 */

#include <stdio.h>

int main(void)
{
  for (int i = 0; i < 5; i++)
    printf("%d ", i);
  return 0;
}
```

#### Algol-Style Templates

C++98 allows prototype-style function definition syntax but not Algol-style function definition syntax (as shown below). C99 still allows both prototype-style and Algol-style syntax.

```cpp
// prototype style definitions - C++

#include <iostream>
using std::cout;

int foo(int a, int b)
{
  return a + b;
}

int main()
{
  cout << foo(1, 2);
}
```

```c
/* Algol style definitions - C */

#include <stdio.h>

int foo(a, b) int a; int b;
{
  return a + b;
}

int main(void)
{
  printf("%d", foo(1, 2));
  return 0;
}
```

#### Character Constants

C++ treats character constants as `char`s: C treats character constants as `int`s.

In a C++ program, `sizeof('[')` is the same as `sizeof(char)`.

```cpp
/* Storing Character Constants
* char.cpp
*/

#include <cstdio>
using std::printf;

int main()
{
  printf("%d %d\n", sizeof(char), sizeof('\xfe'));
}
```

```
1 1
```

In a C program, `sizeof('[')` is the same as `sizeof(int)`.

```c
/* Storing Character Constants
* char.c
*/
#include <stdio.h>

int main(void)
{
  printf("%d %d\n", sizeof(char), sizeof('\xfe'));
}
```

```
1 4
```

Some C compilers convert the character to its equivalent integer value, as if converting from type `char` to type `int`.

#### Optimization

Some non-standard compilers do not perform narrowing casts as we might expect. For instance, some optimize rather than truncate expressions like:

```cpp
double pi = (double)(float) 3.1415926535897932;

// pi = 3.1415926535897932 or 3.1415920000000000; ?
```

It is better to force the truncation (no optimization) by writing

```cpp
float pi_f = (float) 3.1415926535897932;
double pi  = (double) pi_f;
```

This coding style improves portability.

## Standard C Library

Standard C++ includes most of the standard C Library, with a few modifications.

### Without Modification

Standard C++ provides the following without modification:

- 54 standard C macros, which include amongst others

  - General utilities: `EXIT_FAILURE`, `EXIT_SUCCESS`, `RAND_MAX`
  - Debugging: `assert()`
  - Mathematics: `HUGE_VAL`
  - Input output: `EOF`, `FILENAME_MAX`, `FOPEN_MAX`, `NULL`, `SEEK_CUR`, `SEEK_END`, `SEEK_SET`
  - Variable arguments: `va_arg()`, `va_end()`, `va_start()`
  - Date and time: `CLOCKS_PER_SEC`
  - Wide character: `WCHAR_MAX`, `WCHAR_MIN`, `WEOF`

- 45 standard C values, which include among others

  - Sizes of integer types: `CHAR_BIT`, `CHAR_MAX`, `CHAR_MIN`, `INT_MAX`, `INT_MIN`, `LONG_MAX`, `LONG_MIN`, `UCHAR_MAX`, `UINT_MAX`, `ULONG_MAX`, `USRT_MAX`
  - Characteristics of float types: `DBL_MAX`, `DBL_MIN`, `FLT_MAX`, `FLT_MIN`, `LDBL_MAX`, `LDBL_MIN`

- 19 standard C types, which include among others

  - Common definitions: `ptrdiff_t`, `size_t`
  - Input output: `FILE`
  - Variable arguments: `va_list`
  - Date and time: `clock_t`, `time_t`
  - Wide character: `wctype_t`, `win_t`

- 2 standard C structs

  - Localization: `lconv`
  - Date and time: `tm`

- 209 standard C functions, which include among others
  - General utilities: `abs()`, `fabs()`, `floor()`, `labs()`, `atof()`, `atoi()`, `atol()`, `strtod()`, `strtok()`, `strtol()`, `strtoul()`, `ceil()`, `clock()`, `difftime()`, `calloc()`, `malloc()`, `realloc()`, `free()`, `system()`, `sqrt()`, `pow()`, `qsort()`, `srand()`, `rand()`
  - Mathematics: `acos()`, `asin()`, `atan()`, `cos()`, `sin()`, `tan()`, `cosh()`, `sinh()`, `tanh()`
  - Mathematics: `exp()`, `log()`, `log10()`
  - Character handling: `isalpha()`, `iscntrl()`, `isdigit()`, `islower()`, `isprint()`, `isspace()`, `isupper()`, `tolower()`, `toupper()`
  - Input output: `getc()`, `getchar()`, `gets()`, `printf()`, `putc()`, `putchar()`, `puts()`, `scanf()`, `feof()`, `fclose()`, `fopen()`, `fgetc()`, `fprintf()`, `fputc()`, `fputs()`, `fread()`, `freopen()`, `fscanf()`, `fseek()`, `ftell()`, `fprintf()`, `fwrite()`, `rewind()`, `tmpfile()`, `tmpnam()`, `remove()`, `sprintf()`, `sscanf()`
  - String handling: `memcmp()`, `memcpy()`, `memmove()`, `memset()`, `strcat()`, `strcmp()`, `strcpy()`, `strlen()`, `strncat()`, `strncpy()`, `strncmp()`
  - Date and time: `clock()`, `difftime()`, `time()`

### Deprecated

For compatibility, standard C++ provides the 18 C headers, but deprecates their use:

- `<assert.h>` - use `<cassert>` instead
- `<ctype.h>` - use `<cctype>` instead
- `<errno.h>` - use `<cerrno>` instead
- `<float.h>` - use `<cfloat>` instead
- `<iso646.h>` - use `<ciso646>` instead
- `<limits.h>` - use `<climits>` instead
- `<locale.h>` - use `<clocale>` instead
- `<math.h>` - use `<cmath>` instead
- `<signal.h>` - use `<csignal>` instead
- `<setjmp.h>` - use `<csetjmp>` instead
- `<stdarg.h>` - use `<cstdarg>` instead
- `<stddef.h>` - use `<cstddef>` instead
- `<stdio.h>` - use `<cstdio>` instead
- `<stdlib.h>` - use `<cstdlib>` instead
- `<string.h>` - use `<cstring>` instead
- `<time.h>` - use `<ctime>` instead
- `<wchar.h>` - use `<cwchar>` instead
- `<wctype.h>` - use `<cwctype>` instead

### Differences

#### Keywords

Standard C++ defines the type `wchar_t` and the tokens `and`, `and_eq`, `bitand`, `compl`, `not_eq`, `not`, `or`, `or_eq`, `xor` and `xor_eq` as keywords. `wchar_t` appears in the standard C headers but is not included in the `std` namespace. The operator aliases require the inclusion of `<iso646.h>` in standard C. For compatibility, standard C++ provides the header `<ciso646>`, inclusion of which has no effect.

#### Declarations

The following functions have different declarations:

- `const char* strchr(const char*, int);`
  `char* strchr(char*, int);`
- `const char* strpbrk(const char*, const char*);`
  `char* strpbrk(char*, const char*);`
- `const char* strrchr(const char*, int);`
  `char* strrchr(char*, int);`
- `const char* strstr(const char*, const char*);`
  `char* strstr(char*, const char*);`
- `const char* memchr(const char*, int, size_t);`
  `char* memchr(char*, int, size_t);`
- `const wchar_t* wcschr(const wchar_t*, wchar_t);`
  `wchar_t* wcschr(wchar_t*, int);`
- `const wchar_t* wcspbrk(const wchar_t*, const wchar_t*);`
  `wchar_t* wcspbrk(wchar_t*, const wchar_t*);`
- `const wchar_t* wcsrchr(const wchar_t*, wchar_t);`
  `wchar_t* wcsrchr(wchar_t*, wchar_t);`
- `const wchar_t* wcsstr(const wchar_t*, const wchar_t*);`
  `wchar_t* wcsstr(wchar_t*, const wchar_t*);`
- `const wchar_t* wmemchr(const wchar_t*, wchar_t, size_t);`
  `wchar_t* wmemchr(wchar_t*, wchar_t, size_t);`

#### Behavior

The following functions exhibit different behaviors:

- `abort()` - terminates without executing destructors and without calling functions passed to `atexit()`
- `exit(int)` - objects with static storage duration are destroyed and functions registered by calling `atexit()` are called first. All open C streams are flushed and closed. Control is returned to the host environment.
- `extern "C" int atexit(void (*)(void))`
  `extern "C++" int atexit(void (*)(void))`
- `longjmp(jmpBuf, int)` - undefined behavior in some cases

The `malloc()`, `calloc()`, `realloc()`, and `free()` functions of `<stdlib.h>` and `<cstdlib>` do not allocate or de-allocate memory by attempting to call `new` or `delete`.

### Not in C++

#### `intptr_t`

C99 defines `intptr_t` and `uintptr_t` as synonyms for pointer types to `signed` and `unsigned` types respectively. A variable of one of these synonym types can hold a pointer to a variable of any type.

#### `restrict`

C99 defines `restrict` as a type qualifier. Some C++ compilers process `restrict` to no effect.

A `restrict` type is a pointer type that provides sole access to the lvalue pointed to. No other pointer anywhere in the application accesses the same lvalue. This qualification allows the compiler to optimize code associated with the lvalue.
