---
id: platform-io-dependencies
title: Platform I/O Dependencies
sidebar_position: 3
description: TBD
---

# Platform-Dependent Libraries



- Introduce some principles of modular library design
- Describe the platform-dependent console input output library in detail
- Combine the code for several platforms into a single module
- Extend keyboard input to include non-ASCII keys

> "As a rule of thumb, the right level of abstraction is the most general you can comprehend and afford, not the absolutely most general." Stroustrup (1997)



Some of the libraries outside the language standard cross language boundaries.  For instance, the C++ standard leaves direct terminal control entirely to the initiatives of language implementers and independent developers.  Implementers have developed platform-specific, C language libraries that ship with C and C++ compilers.  In developing applications with direct terminal control, we use these non-standard libraries.

We divide applications that use non-standard libraries into two parts as illustrated below: a fully portable top layer of platform-independent modules and a platform-dependent interface module.  The platform-dependent module interfaces with the non-standard library that shipped with the host platform.  The interface module consists of two files: a fully portable header file and a platform-dependent implementation file.  The fully portable top layer of the application refers only to this header file and the implementation file contains all of the references to the non-standard C library. 

![Console Module](/img/console.png)

We install our interface module separately from the top layer of each application.  When we compile an application that uses our module, we link its binary files with the previously compiled binary files for our interface module and its lower-level, non-standard library. 

In this chapter, we describe a few principles of library design, the implementation of our interface module, and the unified implementation that spans all platforms that we have considered.  We show how to link our interface module to the lower-level functions in the C library. 



## Design Principles

A module consists of two files: a header file and an implementation file.  The header file contains the prototypes for the module's functions and the definitions, including class definitions, that are exposed to other modules.  Other modules that call its functions or define instances of its classes only need access to the header file for compilation of their own implementations. 

Conventionally, a header file has the extension `.h` (and sometimes `.hpp`) and a C++ implementation file has the extension `.cpp`.



### Design Rules

A header file provides the interface to its module.  It informs the compiler that the identifiers declared in the header file are valid so that the compiler does not flag them as syntax errors during the compilation of an implementation file. 

Consider the following program

```cpp
// Declaring Identifiers
// #include directive
// hello.cpp

#include <iostream>

int main()
{
    std::cout << "Hello World\n";
}
```

The pre-processor inserts the contents of the `iostream` header file into `hello.cpp`.  This header file includes the declaration of the `std` namespace, the declaration of the `cout` object, and the declaration of the `<<` operator.  Accordingly, the compiler recognizes `cout` and the `<<` operator on it and a C-style string as valid syntax.



#### Declarations and Definitions

We use the terms **declaration** and **definition** to distinguish naming from meaning.  A declaration introduces a name into a translation unit or redeclares a name introduced by a previous declaration.  A definition gives the name some meaning.  Many declarations are also definitions.

Although a definition is also a declaration, a declaration is not necessarily a definition.  The standard states that a declaration is a definition unless it

- declares a function without specifying its body
- contains the `extern` specifier
- declares a `static` data member in a class definition
- is a `class`/`struct`/`union` name declaration
- is an opaque-`enum`-declaration
- is a `typedef` declaration
- is a `using` declaration
- is a `static_assert` declaration
- is an attribute declaration
- is an empty declaration
- is a `using` directive

The following statements except for the static declaration are also definitions:

```cpp
int a;                         // defines a
extern const int c = 1;        // defines c
int f(int x) { return x + 1; } // defines f
struct S { int a; int b; };    // defines S
struct X                       // defines X
{
    int x;                     // defines non-static member x
    static int y;              // declares static member y
    X() : x(0) {}              // defines constructor of X
};

int X::y = 1;                  // defines X::y
enum Dir { up, down };         // defines up and down
namespace N { int d; }         // defines N and N::d
namespace N1 = N;              // defines N1
X z;                           // defines z
```

The following statements are declarations but not definitions:
```cpp
extern int a;       // declares a
extern const int c; // declares c
int f(int);         // declares f
struct S;           // declares S
typedef int Int;    // declares Int
using N::d;         // declares d
```


#### One Definition Rule

A definition of any variable, function, class type, enumeration type, or template may only appear once in a translation unit. 


#### Inclusion Rule

In designing a header file we only include declarations that are not definitions and definitions that need to be exposed to other modules.  The implementation file contains all of the remaining definitions.  A header file may include:

- function prototypes 
- `enum`, `union`, `struct`, `class` definitions
- template definitions
- `const` definitions
- `typedef` declarations
- `extern` declarations
- forward declarations of `class`, `struct`, `union`, and `enum` types
- inline function definitions
- `using` declarations and directives

We say that a `#include` directive should only refer to a properly designed header file.


#### Compatibility Rules


The following rules ensure compatibility between function prototypes and function definitions in a module as well as across different modules:

- Every function defined in a module should have its prototype listed in the module's header file 
- Every implementation file that includes a call to a function that is defined in another module should `#include` the header file that contains the prototype for that function 
- The implementation file for a module should `#include` the module's header file 

Under these rules, a compiler should trap most incompatibilities between function calls and function definitions. 



### Just Enough Information, But No More

A header file that refers to a `class`, `struct`, `union`, or `enum` type, which is fully defined in another header file, must include either

- a forward declaration of the `class`, `struct`, `union`, or `enum`, or
- a `#include` directive to insert the header file that contains the complete declaration

A forward declaration identifies the type as one that is fully defined elsewhere and takes the form
```cpp
class  Type;
struct Type;
union  Type;
enum   Type;
```
where `Type` is the name of the type declared elsewhere.  For example,
```cpp
class Student; // below, the compiler doesn't need size of a Student 

class Course
{
    Student* student;
    unsigned noStudents;
public:
    Course();
    ~Course();
    Course(const Course&);
    Course& operator=(const Course&);
};
```

A forward declaration is sufficient wherever the compiler does not require information about the size or the contents of the type.  For example, a forward declaration is sufficient in the case of a pointer or a reference to an object of the type. 

If the compiler needs to know the size of a type, then we `#include` the header file that contains the type's definition.  For example,

```cpp
#include "Student.h" // compiler needs the size of a Student

class Course
{
    Student student[40];
    unsigned noStudents;
public:
    Course();
    ~Course();
    Course(const Course&);
    Course& operator=(const Course&);
};
```



## User-Interface Library

The `cio` user-interface library below provides direct terminal access facilities for any application.  Application programmer don't need to know any details beyond the contents of the header file for this library.  The console module that contains this library provides a uniform interface for all applications similar to the interface provided by the standard `iostream` library. 

The console module consists of two files: the fully portable header file (`console.h`) and the platform-dependent implementation file (`console.cpp`) as illustrated below.  The implementation file contains all of the platform-dependent code. 

![Console Library](/img/library.png)

The application code and the `console.h` header file do not change from platform to platform.  It is only the implementation file (`console.cpp`) that changes. 


### `Console` Class

The `Console` class provides complete access to lower-level direct terminal control facilities and buffering functionality.

We refer to a position on the screen in terms of `x` and `y` coordinates.  The origin is at the top-left corner, the `x` (column) axis is directed to the left and the `y` (row) axis is directed downwards.

![Screen Coordinates](/img/coordinates.png)

The `console.h` header file contains the class definition, the prototypes for its helper operators, and an external declaration of the console object, all within the `cio` namespace:

```cpp
#ifndef _FS_CONSOLE_H_
#define _FS_CONSOLE_H_

// Console Input Output Library - C++ module
// console.h
//

namespace cio
{
    // Console holds the state of the Console Input Output Facility
    //
    class Console
    {
        char* buffer;        // screen buffer
        int   curRow;        // cursor position - current row
        int   curCol;        // cursor position - current column
        int   bufrows;       // number of rows
        int   bufcols;       // number of columns
        Console& operator=(const Console&); // prevent assignments
        Console(const Console&);            // prevent copying
        void  clearBuffer(); // clear the buffer
        int   getKey();      // extract a key from console input
        public:
        Console();
        ~Console();
        int   getRows() const;
        int   getCols() const;
        void  getPosition(int& row, int& col) const;
        void  setPosition(int r, int c);
        char  getCharacter() const;
        void  setCharacter(char c);
        void  drawCharacter();
        void  clear();
        void  pause();
        friend Console& operator>>(Console&, int&);
        friend Console& operator<<(Console&, char);
    };

    Console& operator<<(Console&, const char*);

    extern Console console; // console object external linkage
} // end namespace cio

#endif
```

The helper operators support the same syntax for console access that the standard library provides for standard input and output.

For example,
```cpp
// Duplicating iostream syntax at the console
// duplicate.cpp

#include "console.h"
using namespace cio;

int main()
{
    int key;

    console.setPosition(3, 10);
    console << "Press a key : ";
    console >> key;
    console.setPosition(5, 10);
    console << "You pressed " << key; 
    console.pause();
}
```


### `console.cpp`

The `console.cpp` implementation file contains the definition of the console object and the function definitions for the Console class. 



#### Platform-Independent Section

Some of the definitions are platform-independent.  They include the definition of the console object and the definitions of the functions that manage the buffering operations:
```cpp
// Console Input Output Library - Implementation
// console.cpp

#include "console.h"

namespace cio
{
    //--------------------------- Platform-Independent Section ------------------

    // Definition of the console object
    //
    Console console;

    // getRows retrieves the number of rows in the output object
    //
    int  Console::getRows() const
    {
        return bufrows;
    }

    // getCols retrieves the number of columns in the output object
    //
    int  Console::getCols() const
    {
        return bufcols;
    }

    // getPosition retrieves the current position of the cursor
    //
    void Console::getPosition(int& r, int& c) const
    {
        r = curRow;
        c = curCol;
    }

    // clearBuffer clears the cio buffer and resets the cursor
    // position to the top left corner
    //
    void Console::clearBuffer()
    {
        for (int i = 0; buffer && i < bufrows * bufcols; i++)
            buffer[i] = ' ';
        setPosition(0, 0);
    }

    // pause accepts a key press from the input object
    //
    void Console::pause()
    {
        getKey();
    }

    // setCharacter sets the character at the current cursor position to c
    // and moves the current cursor position one character towards the end
    //
    void Console::setCharacter(char c)
    {
        if (buffer)
            buffer[curRow * bufcols + curCol++] = c;
    }

    // getCharacter returns the character at the current cursor position
    //
    char Console::getCharacter() const
    {
        return buffer ? buffer[curRow * bufcols + curCol] : ' ';
    }

    // >> extracts the next key from the input object
    //
    Console& operator>>(Console& is, int& c)
    {
        c = is.getKey();
        return is;
    }

    // << inserts string str at the current cursor position
    //
    Console& operator<<(Console& os, const char* str)
    {
        for(int i = 0; str[i]; i++)
            os << str[i];
        return os;
    }
} // end of cio namespace
```



#### Platform-Dependent Section

The other function definitions contain calls to the lower-level C functions that support console input output on the host platform.  To link function calls to the lower-level C function definitions properly, we identify the lower-level functions explicitly as C functions.  This identification takes the form of a linkage directive:
```cpp
extern "C"
{
    #include CIO_LOWER_LEVEL_H_
}
```
where `CIO_LOWER_LEVEL_H_` is the name of the header file for the lower-level library.  This directive instructs the compiler not to mangle the names of the functions listed in the `CIO_LOWER_LEVEL_H_` file in the normal way that the compiler mangles the names of C++ functions.



#### Borland Implementation

The Borland platform uses the `conio` lower-level library.  The `conio` function prototypes are:


- `void clrscr(void);` - clears the screen leaving the cursor in the upper-left corner
- `void gotoxy(int c, int r);` - places the cursor at column `c` and row `r`, where the leftmost column is column 1 and the topmost row is row 1
- `int putch(int c);` - displays the character `c` at the current cursor position, advances the cursor one position right and returns the value of the character displayed
- `int cputs(const char *s);` - displays the string pointed to by `s`, starting at the current cursor position, advances the cursor one position right with each character displayed and returns the value of the last character displayed
- `int getch();` - returns the key code generated by the next key pressed.  If the key represents a standard ASCII character, that key code is the character's ASCII code
- `void gettextinfo(struct text_info *info);` - fills the struct pointed to by info with information about the screen.  Two of the fields in `*info` are:
  - `info->screenheight` - the height of the screen in rows
  - `info->screenwidth` - the width of the screen in columns

The system header file `conio.h` contains these prototypes along with the definition of the `text_info` struct.

Our `console.cpp` implementation file for the Borland platform is
```cpp
// Console Input Output Library - Borland Implementation 
// console.cpp

#define CIO_LOWER_LEVEL_H_ <conio.h>
extern "C"
{
    #include CIO_LOWER_LEVEL_H_
}
#include "console.h"

namespace cio // continuation of cio namespace
{
    //--------------------------- Platform-Dependent Section --------------------

    // Console initializes the Console Input Output object
    //
    Console::Console()
    {
        struct text_info x;
        ::gettextinfo(&x);
        bufrows = x.screenheight;
        bufcols = x.screenwidth;
        if (bufrows * bufcols > 0)
            buffer  = new char[bufrows * bufcols];
        else
            buffer = NULL;
        clear();
    }

    Console::~Console()
    {
        clear();
        setPosition(0, 0);
        delete [] buffer;
    }

    void Console::clear()
    {
        ::clrscr();
        clearBuffer();
    }

    int Console::getKey()
    {
        return ::getch();
    }

    // setPosition moves the cursor to row r column c
    //
    void Console::setPosition(int r, int c)
    {
        curRow = r;
        curCol = c;
        ::gotoxy(c + 1, r + 1);
    }

    // drawCharacter draws the character at the current cursor position
    //
    void Console::drawCharacter()
    {
        if (buffer)
            ::putch(buffer[curRow * bufcols + curCol]);
    }

    // << inserts character c at the current cursor position
    //
    Console& operator<<(Console& os, char c)
    {
        ::putch(c);
        os.setCharacter(c);
        return os;
    }

    // Platform Independent Code Here ...

} // end of cio namespace
```

Note that:
- an instance of the `text_info` struct holds the screen information
- row and column numbering starts at (1,1) in the top-left corner

Note also the technique used to extract screen information:
- define an instance of the `text_info` struct and name that instance `x`
- pass the address of `x` in the call to void `gettextinfo(struct text_info *x)`
- let `void gettextinfo(struct text_info *x)` populate `x`
- extract the sought-after information as member data of `x`


#### Microsoft Module

The Microsoft platform also uses the `conio` lower-level library.  Calls to its lower-level functions differ slightly from those for the Borland platform.

The `console.cpp` implementation file for the Microsoft platform is 
```cpp
// Console Input Output Library - Microsoft Implementation 
// console.cpp

#include <windows.h>
#define CIO_LOWER_LEVEL_H_ <conio.h>
extern "C"
{
    #include CIO_LOWER_LEVEL_H_
}
#include "console.h"

namespace cio // continuation of cio namespace
{
    //--------------------------- Platform-Dependent Section --------------------

    HANDLE  consh;
    CONSOLE_SCREEN_BUFFER_INFO bufinfo;

    // Console initializes the Console Input Output object
    //
    Console::Console()
    {
        consh = ::GetStdHandle(STD_OUTPUT_HANDLE);
        ::GetConsoleScreenBufferInfo(consh, &bufinfo);
        bufrows = bufinfo.srWindow.Bottom + 1;
        bufcols = bufinfo.srWindow.Right + 1;
        if (bufrows * bufcols > 0)
            buffer  = new char[bufrows * bufcols];
        else
            buffer = NULL;
        clear();
    }

    Console::~Console()
    {
        clear();
        setPosition(0, 0);
        delete [] buffer;
    }

    void Console::clear()
    {
        DWORD len = bufrows * bufcols, actual;
        TCHAR ch = ' ';
        COORD coord;
        coord.X = 0;
        coord.Y = 0;
        ::FillConsoleOutputCharacter(consh, ch, len, coord, &actual);
        clearBuffer();
    }

    int Console::getKey()
    {
        return ::_getch();
    }

    // setPosition moves the cursor to row r column c
    //
    void Console::setPosition(int r, int c)
    {
        curRow = r;
        curCol = c;
        COORD coord;
        coord.X = c;
        coord.Y = r;
        ::SetConsoleCursorPosition(consh, coord);
    }

    // drawCharacter draws the character at the current cursor position
    //
    void Console::drawCharacter()
    {
        if (buffer)
            ::_putch(buffer[curRow * bufcols + curCol]);
    }

    // << inserts character c at the current cursor position
    //
    Console& operator<<(Console& os, char c)
    {
        ::_putch(c);
        os.setCharacter(c);
        return os;
    }

    // Platform Independent Code Here ...

} // end of namespace cio
```

The Microsoft platform, compared to the Borland platform:
- accesses the `windows.h` system header file
- defines an instance of a `CONSOLE_SCREEN_BUFFER_INFO` struct to hold screen information that includes cursor position
- starts row and column numbering at 0
- obtains the address of the screen with a call to the Windows `GetStdHandle()` function
- extracts the screen information with a call to the Windows `GetConsoleScreenBufferInfo()` function
- sets the cursor position with a call to the Windows `SetConsoleCursorPosition()` function
- clears the screen with a call to the Windows `FillConsoleOutputCharacter()` function



#### Linux Implementation

The Linux platform uses the `curses` lower-level library.  The `ncurses.h` header file contains the prototypes for its lower-level functions.  The prototypes are:
- `void initscr(void);` - initializes the screen and sets up the library for other curses routines to expect the terminal identified by the environment variable `TERM`
- `void noecho(void);` - turns off the operating system's echoing of characters on input
- `void cbreak(void);` - reverts control to the caller on each keystroke
- `void endwin(void);` - puts the terminal back in its original mode and clears the screen
- `void erase(void);` - clears the screen leaving the cursor in the upper-left corner
- `void refresh(void);` - brings the screen up-to-date
- `void move(int r, int c);` - places the cursor at column `c` and row `r`, where the leftmost column is column 0 and the topmost row is row 0
- `int addch(int c);` - displays the character `c` at the current cursor position, advances the cursor one position right and returns the value of the character displayed
- `int addstr(const char *s);` - displays the string pointed to by `s`, starting at the current cursor position, advances the cursor one position right with each character displayed and returns the value of the last character displayed
- `int getch(void);` - returns the key code generated by the next key pressed.  If the key represents a standard ASCII character, the key code is the character's ASCII code

The implementation file for a Linux platform is
```cpp
// Console Input Output Library - Linux Implementation 
// console.cpp

#define CIO_LOWER_LEVEL_H_ <ncurses.h>
extern "C"
{
    #include CIO_LOWER_LEVEL_H_
}

#include "console.h"

namespace cio // continuation of cio namespace
{
    //--------------------------- Platform-Dependent Section --------------------

    // Console initializes the Console Input Output object
    //
    Console::Console()
    {
        ::initscr();
        ::noecho();
        ::cbreak();
        ::keypad(stdscr,1);
        bufrows = LINES;
        bufcols = COLS;
        if (bufrows * bufcols > 0)
            buffer  = new char[bufrows * bufcols];
        else
            buffer = NULL;
        clear();
    }

    Console::~Console()
    {
        clear();
        setPosition(0, 0);
        delete [] buffer;
        ::endwin();
    }

    void Console::clear()
    {
        ::erase();
        clearBuffer();
    }

    int Console::getKey()
    {
        ::refresh();
        return ::getch();
    }

    // setPosition moves the cursor to row r column c
    //
    void Console::setPosition(int r, int c)
    {
        curRow = r;
        curCol = c;
        ::move(r, c);
    }

    // drawCharacter draws the character at the current cursor position
    //
    void Console::drawCharacter()
    {
        if (buffer) ::addch(buffer[curRow * bufcols + curCol]);
    }

    // << inserts character c at the current cursor position
    //
    Console& operator<<(Console& os, char c)
    {
        ::addch(c);
        os.setCharacter(c);
        return os;
    }

    // Platform Independent Code Here ...

} // end of cio namespace
```

Unlike the `conio` library, `curses` library accumulates changes to the screen in an internal buffer and requires a refresh to display the current state on the screen.  Hence, the additional call to `::refresh()` in `Console::getch()`.

To link an application on a Linux platform, we explicitly include the `ncurses` library
```bash
 g++ app.cpp console.o -lncurses
```


#### Unix Implementation

The Unix platform also uses the `curses` lower-level library.  The `curses.h` header file contains the prototypes for its lower-level functions. 

The implementation file for the Unix platform differs from the Linux implementation only in the name of the included header file:

```cpp
// Console Input Output Library - Unix Implementation 
// console.cpp

#define CIO_LOWER_LEVEL_H_ <curses.h>
extern "C"
{
    #include CIO_LOWER_LEVEL_H_
}

#include "console.h"

namespace cio // continuation of cio namespace
{
    //--------------------------- Platform-Dependent Section --------------------

    // ... continues the same as the Linux implementation above

    // Platform Independent Code Here ...

} // end of cio namespace
```

To link an application on a Unix platform, we explicitly include the `curses` library
```bash
g++ app.cpp console.o -lcurses
```



## Unified Implementation

We can assemble the different `console.cpp` implementation files for the different platforms into a unified file so that the same unified module ships for all platforms.  We use conditional pre-processor directives to bracket the code that is specific to each host platform.



### Implementation File

After the platform-independent section, we define a table of the host platforms, an auto-detection of the host platform and the header file that contains the lower-level C function prototypes.  We follow these definitions with the linkage directive for the header file and the platform specific function definitions:

```cpp
// Console Input Output Library - Unified Implementation
// console.cpp
//

// table of platforms
#define CIO_LINUX     1
#define CIO_MICROSOFT 2
#define CIO_BORLAND   3
#define CIO_UNIX      4

// auto-select your platform here
#if defined __BORLANDC__
    #define CIO_PLATFORM CIO_BORLAND
    #define CIO_LOWER_LEVEL_H_ <conio.h>
#elif defined _MSC_VER
    #define CIO_PLATFORM CIO_MICROSOFT
    #include <windows.h>
    #define CIO_LOWER_LEVEL_H_ <conio.h>
#elif defined __MACH__
    #define CIO_PLATFORM CIO_UNIX
    #define CIO_LOWER_LEVEL_H_ <curses.h>
#elif defined __GNUC__
    #define CIO_PLATFORM CIO_LINUX
    #define CIO_LOWER_LEVEL_H_ <ncurses.h>
#elif !defined __BORLANDC__ && !defined _MSC_VER && !defined __GNUC__ && !defined __MACH__
    #error CIO_PLATFORM is undefined
#endif

extern "C"
{
    #include CIO_LOWER_LEVEL_H_
}

#include "console.h"

namespace cio // continuation of cio namespace
{
    //--------------------------- Platform-Dependent Section --------------------
    //

#if CIO_PLATFORM == CIO_LINUX || CIO_PLATFORM == CIO_UNIX

    // Console initializes the Console Input Output object
    //
    Console::Console()
    {
        ::initscr();
        ::noecho();
        ::cbreak();
        ::keypad(stdscr,1);
        bufrows = LINES;
        bufcols = COLS;
        if (bufrows * bufcols > 0)
            buffer  = new char[bufrows * bufcols];
        else
            buffer = 0;
        clear();
    }

    Console::~Console()
    {
        clear();
        setPosition(0, 0);
        delete [] buffer;
        ::endwin();
    }

    void Console::clear()
    {
        ::erase();
        clearBuffer();
    }

    int Console::getKey()
    {
        int key;
        ::refresh();
        return ::getch();
    }

    // setPosition moves the cursor to row r column c
    //
    void Console::setPosition(int r, int c)
    {
        curRow = r;
        curCol = c;
        ::move(r, c);
    }

    // drawCharacter draws the character at the current cursor position
    //
    void Console::drawCharacter()
    {
        if (buffer)
            ::addch(buffer[curRow * bufcols + curCol]);
    }

    // << inserts character c at the current cursor position
    //
    Console& operator<<(Console& os, char c)
    {
        ::addch(c);
        os.setCharacter(c);
        return os;
    }

#elif CIO_PLATFORM == CIO_MICROSOFT

    HANDLE  consh;
    CONSOLE_SCREEN_BUFFER_INFO bufinfo;

    // Console initializes the Console Input Output object
    //
    Console::Console()
    {
        consh = ::GetStdHandle(STD_OUTPUT_HANDLE);
        ::GetConsoleScreenBufferInfo(consh, &bufinfo);
        bufrows = bufinfo.srWindow.Bottom + 1;
        bufcols = bufinfo.srWindow.Right + 1;
        if (bufrows * bufcols > 0)
            buffer  = new char[bufrows * bufcols];
        else
            buffer = 0;
        clear();
    }

    Console::~Console()
    {
        clear();
        setPosition(0, 0);
        delete [] buffer;
    }

    void Console::clear()
    {
        DWORD len = bufrows * bufcols, actual;
        TCHAR ch = ' ';
        COORD coord;
        coord.X = 0;
        coord.Y = 0;
        ::FillConsoleOutputCharacter(consh, ch, len, coord, &actual);
        clearBuffer();
    }

    int Console::getKey()
    {
        return ::_getch();
    }

    // setPosition moves the cursor to row r column c
    //
    void Console::setPosition(int r, int c)
    {
        curRow = r;
        curCol = c;
        COORD coord;
        coord.X = c;
        coord.Y = r;
        ::SetConsoleCursorPosition(consh, coord);
    }

    // drawCharacter draws the character at the current cursor position
    //
    void Console::drawCharacter()
    {
        if (buffer)
            ::_putch(buffer[curRow * bufcols + curCol]);
    }

    // << inserts character c at the current cursor position
    //
    Console& operator<<(Console& os, char c)
    {
        ::_putch(c);
        os.setCharacter(c);
        return os;
    }

#elif CIO_PLATFORM == CIO_BORLAND

    // Console initializes the Console Input Output object
    //
    Console::Console()
    {
        struct text_info x;
        ::gettextinfo(&x);
        bufrows = x.screenheight;
        bufcols = x.screenwidth;
        if (bufrows * bufcols > 0)
            buffer  = new char[bufrows * bufcols];
        else
            buffer = 0;
        clear();
    }

    Console::~Console()
    {
        clear();
        setPosition(0, 0);
        delete [] buffer;
    }

    void Console::clear()
    {
        ::clrscr();
        clearBuffer();
    }

    int Console::getKey()
    {
        return ::getch();
    }

    // setPosition moves the cursor to row r column c
    //
    void Console::setPosition(int r, int c)
    {
        curRow = r;
        curCol = c;
        ::gotoxy(c + 1, r + 1);
    }

    // drawCharacter draws the character at the current cursor position
    //
    void Console::drawCharacter()
    {
        if (buffer)
            ::putch(buffer[curRow * bufcols + curCol]);
    }

    // << inserts character c at the current cursor position
    //
    Console& operator<<(Console& os, char c)
    {
        ::putch(c);
        os.setCharacter(c);
        return os;
    }
#endif

    //--------------------------- Platform-Independent Section ------------------ 

    // Definition of the Console Input Output object
    //
    Console console;

    // getRows retrieves the number of rows in the output object
    //
    int  Console::getRows() const
    {
        return bufrows;
    }

    // getCols retrieves the number of columns in the output object
    //
    int  Console::getCols() const
    {
        return bufcols;
    }

    // getPosition retrieves the current position of the cursor
    //
    void Console::getPosition(int& r, int& c) const
    {
        r = curRow;
        c = curCol;
    }

    // clearBuffer clears the cio buffer and resets the cursor
    // position to the top left corner
    //
    void Console::clearBuffer()
    {
        for (int i = 0; buffer && i < bufrows * bufcols; i++)
            buffer[i] = ' ';
        setPosition(0, 0);
    }

    // pause accepts a key press from the input object
    //
    void Console::pause()
    {
        getch();
    }

    // setCharacter sets the character at the current cursor position to c
    // and moves the current cursor position one character towards the end
    //
    void Console::setCharacter(char c)
    {
        if (buffer)
            buffer[curRow * bufcols + curCol++] = c;
    }

    // getCharacter returns the character at the current cursor position
    //
    char Console::getCharacter() const
    {
        return buffer ? buffer[curRow * bufcols + curCol] : ' ';
    }

    // >> extracts the next key from the input object
    //
    Console& operator>>(Console& is, int& c)
    {
        c = is.getKey();
        return is;
    }

    // << inserts string str at the current cursor position
    //
    Console& operator<<(Console& os, const char* str)
    {
        for(int i = 0; str[i]; i++)
            os << str[i];
        return os;
    }
} // end of cio namespace
```



## Non-ASCII Keys

The `Console::getKey()` methods listed above work properly only with ASCII keys.  To accommodate non-ASCII keys, we introduce our own set of virtual key codes and convert the platform-specific codes to corresponding virtual key codes in each of these methods.


### Virtual Key Codes

We define the virtual key codes for the non-printable ASCII keys, the cursor control keys, and the function keys as follows:

```cpp
// Virtual Key Definitions - Header
// keys.h

#define TAB       '\t'
#define BACKSPACE '\b'
#define ALARM     '\a'
#define ESCAPE    27
#define ENTER     '\n'
#define SPACE     ' '
#define HOME      1000
#define UP        1001
#define DOWN      1002
#define LEFT      1003
#define RIGHT     1004
#define END       1005
#define PGDN      1006
#define PGUP      1007
#define DEL       1008
#define INSERT    1009
#define F(n)      (1009+(n))
#define UNKNOWN   9999
```

`F(n)` is a function-like macro that defines the formula for determining the numerical value to substitute for `F(n)`.


### Implementation

The `::getch()` and `::_getch()` global functions of the lower-level libraries return different non-ASCII key codes.


#### `conio` Platforms

The `conio` library returns two codes: one to identify a non-ASCII key press and a second code to identify the key press itself.  The Borland platform returns a zero value for the first code, while the Microsoft returns returns 0 for some function keys and 224 for the navigation, editing, and other function keys.  The Borland and Microsoft platforms return the same secondary code.  Complete the table below after finishing the workshop on finding a key code:

Keystroke	         | Borland  |  Microsoft  |  Secondary Code
---------------------|----------|-------------|------------------
Home                 | 0        | 71          | 
Up Arrow             | 0        | 72          | 
Down Arrow           | 0        | 80          | 
Left Arrow           | 0        | 75          | 
Right Arrow          | 0        |             |
End                  | 0        |             |
Page Up              | 0        |             |
Page Down            | 0        |             |
Delete               | 0        |             |
Insert               | 0        |             |
F(n) for 0 < n < 11  | 0        |             |
F11                  | 0        |             |
F12                  | 0        |             |

Pressing the `ENTER` key on either `conio` platform generates the value `13`, which we must map to our own virtual key code for the `ENTER` key.



#### `curses` Platforms

The `curses` library returns a single code above 255.  The `*curses.h` header file defines `KEY_*` symbolic names for the different non-ASCII keys.  We use the symbolic name to determine the key pressed and convert it to our own virtual key code:

Keystroke   | Symbolic Name  | Value  | Virtual Key Code
------------|----------------|--------|------------------
Home        | KEY_HOME       |        | HOME
Up Arrow    | KEY_UP         |        | UP
Down Arrow  | KEY_DOWN       |        | DOWN
Left Arrow  | KEY_LEFT       |        | LEFT
Right Arrow | KEY_RIGHT      |        | RIGHT
End         | KEY_END        |        | END
Page Up     | KEY_PPAGE      |        | PGUP
Page Down   | KEY_NPAGE      |        | PGDN
Delete      | KEY_DC         |        | DEL
Insert      | KEY_IC         |        | INSERT
F(n)        | KEY_F(n)       |        | F(n)
Enter       | KEY_ENTER	     |        | ENTER
Backspace   | KEY_BACKSPACE  |        | BACKSPACE

Pressing the `ENTER` or `BACKSPACE` key on a `curses` platform generates a code greater than 255, which we must convert to our corresponding virtual key code.

Note that the `curses` library defines its key code values in octal notation. 


#### `Console::getKey()`: Unified Implementation File

The upgraded, unified implementation file for the `console` module includes the header file listing the virtual key codes and the following upgrades to the `Console::getKey()` methods:

```cpp
// Console Input Output Library - Unified Implementation
// console.cpp
//

// ... see above listing

#include "console.h"
#include "keys.h"

namespace cio // continuation of cio namespace
{
#if CIO_PLATFORM == CIO_LINUX || CIO_PLATFORM == CIO_UNIX

    // ... see above listing

    int Console::getKey()
    {
        int key;
        ::refresh();
        key = ::getch();
        switch(key)
        {
            // KEY_* is defined in *curses.h
            case KEY_HOME:  key = HOME;   break;
            case KEY_UP:    key = UP;     break;
            case KEY_DOWN:  key = DOWN;   break;
            case KEY_LEFT:  key = LEFT;   break;
            case KEY_RIGHT: key = RIGHT;  break;
            case KEY_END:   key = END;    break;
            case KEY_NPAGE: key = PGDN;   break;
            case KEY_PPAGE: key = PGUP;   break;
            case KEY_DC:    key = DEL;    break;
            case KEY_IC:    key = INSERT; break;
            case KEY_F(1):  key = F(1);   break;
            case KEY_F(2):  key = F(2);   break;
            case KEY_F(3):  key = F(3);   break;
            case KEY_F(4):  key = F(4);   break;
            case KEY_F(5):  key = F(5);   break;
            case KEY_F(6):  key = F(6);   break;
            case KEY_F(7):  key = F(7);   break;
            case KEY_F(8):  key = F(8);   break;
            case KEY_F(9):  key = F(9);   break;
            case KEY_F(10): key = F(10);  break;
            case KEY_F(11): key = F(11);  break;
            case KEY_F(12): key = F(12);  break;
            case KEY_ENTER: key = ENTER;  break;
            case KEY_BACKSPACE: key = BACKSPACE; break;
            default:
                if (key < 0 || key > '~')
                    key = UNKNOWN;
        }
        return key;
    }

    // ... see above listing

#elif CIO_PLATFORM == CIO_MICROSOFT

    // ... see above listing

    int Console::getKey()
    {
        int key;
        key = ::_getch();

// Platform Specific Key Code
#define KEY_ENTER  13
        
        if (key == 0)
        {
            key = ::_getch();

// Platform Specific Key Codes
#define KEY_F0     58
#define KEY_F(n)   (KEY_F0+(((n)<=10)?(n):((n) + 64)))

            switch(key)
            {
                case KEY_F(1):  key = F(1);   break;
                case KEY_F(2):  key = F(2);   break;
                case KEY_F(3):  key = F(3);   break;
                case KEY_F(4):  key = F(4);   break;
                case KEY_F(5):  key = F(5);   break;
                case KEY_F(6):  key = F(6);   break;
                case KEY_F(7):  key = F(7);   break;
                case KEY_F(8):  key = F(8);   break;
                case KEY_F(9):  key = F(9);   break;
                case KEY_F(10): key = F(10);  break;
                default: key = UNKNOWN;
            }
        }
        else if (key == 224)
        {
            key = ::_getch();

// Platform Specific Key Codes
#define KEY_HOME   71
#define KEY_UP     72
#define KEY_DOWN   80
#define KEY_LEFT   75
#define KEY_RIGHT  77
#define KEY_END    79
#define KEY_NPAGE  81
#define KEY_PPAGE  73
#define KEY_DC     83
#define KEY_IC     82

            switch(key)
            {
                case KEY_HOME:  key = HOME;   break;
                case KEY_UP:    key = UP;     break;
                case KEY_DOWN:  key = DOWN;   break;
                case KEY_LEFT:  key = LEFT;   break;
                case KEY_RIGHT: key = RIGHT;  break;
                case KEY_END:   key = END;    break;
                case KEY_NPAGE: key = PGDN;   break;
                case KEY_PPAGE: key = PGUP;   break;
                case KEY_DC:    key = DEL;    break;
                case KEY_IC:    key = INSERT; break;
                case KEY_F(11): key = F(11);  break;
                case KEY_F(12): key = F(12);  break;
                default: key = UNKNOWN;
            }
        }
        else if (key < 0 || key > '~')
            key = UNKNOWN;
        else if (key == KEY_ENTER)
            key = ENTER;

        return key;
    }
    // ... see above listing

#elif CIO_PLATFORM == CIO_BORLAND

    // ... see above listing

    int Console::getKey()
    {
        int key;
        key = ::getch();

// Platform Specific Key Code
#define KEY_ENTER  13

        if (key == 0)
        {
            key = ::getch();

// Platform Specific Key Codes
#define KEY_HOME   71
#define KEY_UP     72
#define KEY_DOWN   80
#define KEY_LEFT   75
#define KEY_RIGHT  77
#define KEY_END    79
#define KEY_NPAGE  81
#define KEY_PPAGE  73
#define KEY_DC     83
#define KEY_IC     82
#define KEY_F0     58
#define KEY_F(n)   (KEY_F0+(((n)<=10)?(n):((n) + 64))) 

            switch(key)
            {
                case KEY_HOME:  key = HOME;   break;
                case KEY_UP:    key = UP;     break;
                case KEY_DOWN:  key = DOWN;   break;
                case KEY_LEFT:  key = LEFT;   break;
                case KEY_RIGHT: key = RIGHT;  break;
                case KEY_END:   key = END;    break;
                case KEY_NPAGE: key = PGDN;   break;
                case KEY_PPAGE: key = PGUP;   break;
                case KEY_DC:    key = DEL; break;
                case KEY_IC:    key = INSERT; break;
                case KEY_F(1):  key = F(1);   break;
                case KEY_F(2):  key = F(2);   break;
                case KEY_F(3):  key = F(3);   break;
                case KEY_F(4):  key = F(4);   break;
                case KEY_F(5):  key = F(5);   break;
                case KEY_F(6):  key = F(6);   break;
                case KEY_F(7):  key = F(7);   break;
                case KEY_F(8):  key = F(8);   break;
                case KEY_F(9):  key = F(9);   break;
                case KEY_F(10): key = F(10);  break;
                case KEY_F(11): key = F(11);  break;
                case KEY_F(12): key = F(12);  break;
                default:        key = UNKNOWN;
            }
        }
        else if (key < 0 || key > '~')
            key = UNKNOWN;
        else if (key == KEY_ENTER)
            key = ENTER;

        return key;
    }

    // ... see above listing

 #endif
} // end of cio namespace
```


## Exercises

<!--Complete the Workshop on [Finding Key Codes](w2.html]-->

- Read Wikipedia on [conio](http://en.wikipedia.org/wiki/Conio)
- Read Wikipedia on [ncurses](http://en.wikipedia.org/wiki/Ncurses)



## Unions

A union is a collection of types that are not necessarily identical but share the same address in memory.  Unlike a class or a struct, a union assigns the same address to all of its members. 

The declaration of a union takes the form
```cpp
union Tag
{
    type member;
    //...
    type member;
};
```
where the `Tag` is the name of the union type, `type` is the member's type, and `member` is the member's name.  The members of a union, like those of a structs, are public by default.

An instance of union type can only hold the value of one of its members at any particular time.  For example,
```cpp
// Unions
// union.cpp

#include <iostream>
#include <cstring>
using namespace std;

union Product // some have skus, some have upcs 
{
    int sku;
    char upc[13];
};

int main()
{
    Product cereal, tissue;

    cereal.sku = 4789;
    strcpy(tissue.upc, "0360002607555");

    cout << cereal.sku << endl;
    cout << tissue.upc << endl;
}
```

```
4789
0360002607555
```

Note that we can only access the value of the member that was most recently assigned a value. 


### Anonymous Types

We may omit the `Tag` of a compound type if we never refer to it.  This is particularly useful with structs and unions.  For example,
```cpp
struct // Tag omitted
{
    unsigned number;
    char desc[41];
} subject, *pSubject; // definitions
```

We call a compound type without a `Tag` an *anonymous* type.  In defining an anonymous type, we must include either the instance identifier or the synonym name.  That is, the definition of an anonymous type is also either the definition of an instance of that type or the declaration of a synonym type.

For example,
```cpp
class Subject
{
    int number;
    struct // definition - no tag
    {
        char shortName[7];
        char fullName[41];
    } name;
}

typedef struct // synonym - no tag
{
    unsigned number;
    char desc[41];
} Course;
```


### Tracking Access in Unions

There is no independent way of identifying which the most recently accessed member of a union.  To avoid this indeterminacy, we wrap a union type within a struct type and add an enumerator as a member of the struct type.  The enumerator identifies the most recently accessed member within the union type.  For example,
```cpp
// Structs with Unions
// struct_union.cpp

#include <iostream>
#include <cstring>
using namespace std;

enum class ProductId {sku, upc};

typedef struct
{
    ProductId id;
    union // some have skus, some upcs
    {
        int  sku;
        char upc[13];
    } code;
} Product;

int main()
{
    Product p[2];

    p[0].id = ProductId::sku;
    p[0].code.sku = 4789;
    p[1].id = ProductId::upc;
    strcpy(p[1].code.upc, "0360002607555");

    for (int i = 0; i < 2; i++)
    {
        switch(p[i].id)
        {
        case ProductId::sku:
           cout << p[i].code.sku << endl;
            break;
        case ProductId::upc:
            cout << p[i].code.upc << endl;
            break;
        }
    }
}
```

```
4789
0360002607555
```

Note the two anonymous types in this example.
