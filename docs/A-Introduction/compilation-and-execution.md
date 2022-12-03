---
id: compilation-and-execution
title: Compliation and Execution
sidebar_position: 3
description: TBD
---

# Compilation and Execution

- Review the stages of compilation
- Describe the platforms used in this course
- Introduce constant expressions and static assertions

> "Prefer the compiler to the pre-processor." **_Scott Meyers (2005)_**

Program compilation is a multi-stage process. The initial stage collates the source code for compilation into translation units. It inserts into the implementation file the source code of all the header files referred to by the implementation file. The intermediate stage compiles the translation units individually. The final stage creates a single binary executable from all the compiled translation units. The intermediate stage uses the language's type system to evaluate the source code for syntactic errors and to construct the binary instructions that form the executable. A user can run the executable multiple times without recompiling the source code.

This chapter reviews the stages of the C++ compilation process, describes the platforms used in this course and introduces the syntax for communicating with the operating system. This chapter also describes the syntax for expressions that the compiler itself can evaluate directly and the syntax for custom checking assumptions and reporting breaches of those assumptions at compile-time.

## Compilation Process

The source code for a typical C++ application may be distributed across many modules. A module's header file (`*.h`) exposes its names to other modules. Its implementation file (`*.cpp`) contains the definitions associated with declarations in the header files.

Transforming the original source code for an application into a binary executable involves three distinct stages:

1. Pre-Processing Stage - the pre-processor creates a separate _translation unit_ from the original source files for each module by inserting the header files into the implementation file and replacing or expanding any macros (lines starting with `#`)
2. Compilation Stage - the compiler creates a separate binary file from each translation unit
3. Linking Stage - the linker creates a single relocatable file from the binary files for all translation units and the binary files for any referenced libraries.

![Pre-Processing, Compilation and Linking Stages of the Compilation Process](/img/compile_link.png)

To run the executable, the user instructs the operating system to load the relocatable file into memory. The loader copies the relocatable file into RAM, arranges the storage locations for the data and the code and transfers control to the entry point of the executable (the `main()` function).

After the initial build, only those translation units that have been changed need to be re-compiled.

## Platforms and Compilers

The platform used in this course is Windows and the development compiler is that shipped with Visual Studio.

### Microsoft Visual Studio - `cl`

Visual Studio is an Integrated Development Environment (IDE) supported by Microsoft. Instructions for installing this IDE on a Windows platform are listed in the [resources section](https://scs.senecac.on.ca/~chris.szalwinski/resources/cl.html) of the course web site.

#### Compiler Options

To list the options available on this compiler, open a Visual Studio command-prompt window and enter

```bash
cl /?
```

Notable options are

- `/c` compile only without a link stage - create a `.obj` binary file.
- `/E` pre-process only - send the output to `stdout`.
- `/P` pre-process only - send the output to `*.i` file.
- `/Wall` enable all warnings.

To disable warning C4996 (for example, `strcpy` is unsafe - use `strcpy_s`), add the following macro definition before the `#include` for the 'unsafe' function:

```cpp
#define _CRT_SECURE_NO_WARNINGS
```

### Linux - `gcc`

The GNU Compiler Collection (gcc) is a comprehensive open-source collection of compilers available on all Linux based platforms. The version for C++ source code is called `g++`. To access this compiler remotely from a Windows machine, we open a terminator emulator. Instructions for configuring an ssh terminal emulator are listed in the [resources section](https://scs.senecac.on.ca/~chris.szalwinski/resources/putty.html).

To access version 9.1.0 of the GCC compiler on matrix, enter

```bash
export LD_LIBRARY_PATH=/usr/local/gcc/9.1.0/lib64:$LD_LIBRARY_PATH
/usr/local/gcc/9.1.0/bin/g++ -std=c++17 mySource.cpp
```

#### Compiler Options

To list the options available on the GCC compiler, enter

```bash
/usr/local/gcc/9.1.0/bin/g++ --help
```

Notable options are

- `-c` pre-process and compile without a link stage - create a .o binary file.
- `-E` pre-process only - send the output to `stdout`.
- `-g` produce information for the debugger (`gdb`).

## Interface with the Operating System

The `main()` function of a C++ program is its entry point to its executable version. This function's return type is an `int`. This function accepts as its parameters either no information or a set of command-line arguments. The corresponding prototypes are:

```cpp
int main();                       // no command-line arguments
int main(int argc, char *argv[]); // two command-line arguments
```

### Command-Line Arguments

The first parameter (`argc`) in the command-line-arguments version of the `main()` function receives the number of arguments supplied on the command line from the operating system. This number includes the name of the relocatable file. The second parameter (`argv`) receives the address of an array of pointers to C-style null-terminated strings. Each pointer holds the address of a string that holds one command-line argument. `argv[0]` holds the address of the name of the relocatable file. `argv[i]` holds the address of the C-style null-terminated string that holds the `i`-th command-line argument.

Consider the following command-line instruction:

```bash
my_prg Assignments Workshops Tests Exam
```

The source code listed below

```cpp
// Interfacing with the Host Platform
// my_prg.cpp

#include <iostream>

int main (int argc, char *argv[])
{
    int i;

    std::cout << "Application: " << argv[0] << std::endl;
    for (i = 1; i < argc; i++)
        std::cout << "- " << argv[i] << std::endl;
}
```

produces the output

```
Application: my_prg
- Assignments
- Workshops
- Test
- Exam
```

On some operating systems the first argument includes the absolute path to the relocatable.

### Returning Control

Upon completion of the program's execution, the `main()` function returns control to the operating system. This function's return value is that of the expression on its `return` statement. If this statement is missing, `main()` returns the value `0` to the operating system:

```cpp
int main()
{
    return 0; // inserted by the C++ compiler if the return statement is missing
}
```

## Compile-time Evaluations

Modern compilers are sophisticated enough to perform calculations that will not change during the execution of a program and store the results of those calculations in the executable code. C++ provides specialized syntax for evaluations at compile-time and for reporting custom error messages during the translation unit compilation stage.

### Constant Expressions

The `constexpr` keyword declares that the value of its identifier is a run-time constant and can be evaluated at compile time.

#### Example

In this example, the factorial calculation expressed in the form of a recursive function (a function that calls itself) does not depend on the rest of the program and is identified as a constant expression. An constant expression can only refer to variables that are also constant expressions:

```cpp
// Compiler-Evaluated Expressions
// constexpr.cpp
#include <iostream>

constexpr int N = 8; // constant variable

constexpr int factorial(int i) // constant function
{
    return i > 1 ? i * factorial(i - 1) : 1;
}

int main()
{
    std::cout << N << "! = " << factorial(N) << std::endl;
}
```

```
8! = 40320
```

Both `N` and the function `factorial()` are evaluated at compile-time and the result is stored as a constant value in the output stream expression.

### Static Assertions

The C++ language supports messaging at compile time prompted by custom checks in addition to messaging prompted by inconsistencies in the source code caught by the C++ type system.

These custom programmer-inserted checks are called _assertions_. The `static_assert()` mechanism generates a custom compiler error message if the specified condition is not met.

```cpp
static_assert(bool condition, const char* message);
```

In the example below, the `main()` function checks the value of `N` (which has been specified earlier in the translation stream) and reports an error if the value is outside practical bounds:

```cpp
// Static Assertion
// static_assert.cpp
#include <iostream>

constexpr int N = 0;

constexpr int factorial(int i)
{
    return i > 1 ? i * factorial(i - 1) : 1;
}

int main()
{
    static_assert (N >  0, "N <=  0");
    static_assert (N < 20, "N >= 20");

    std::cout << N << "! = " << factorial(N) << std::endl;
}
```

```
N <= 0
static assertion failed with "N <= 0"
```

<!--
## Exercises

-->
