---
id: cpp-building-blocks
title: C++ Building Blocks
sidebar_position: 2
description: TBD
---

# C++ Building Blocks

- Describe the building blocks of C++
- Introduce the syntax associated with these building blocks

> "Prefer the compiler to the pre-processor." ***Scott Meyers (2005)***

The programming language used to demonstrate object-oriented programming throughout these notes is C++.  The language standard refers to its building blocks as entities.  These entities include values, variables, objects, references, functions, types, class members, templates, and namespaces.  Before the C++20 standard, the source code of a typical C++ module consists of a header file and an implementation file.  The header file declares the names of its entities that are accessible by other modules.  The implementation file attaches meanings to those names.  The C++ compiler accepts each module as a independent *translation unit* and converts it into binary code for that module. 

This chapter describes how C++ introduces entities into translation units, how an entity's scope determines its visibility and how its declaration can link it across different scopes and possibly different modules.  This chapter reviews namespaces, which also restrict an entity's visibility across modules, and describes how to specify an object's duration in memory.




## Declarations


A compiler translates the source code of a module into its binary equivalent.  In C++, the compiler proper accepts a module in the form of a translation unit.  The translation unit is a sequence of declarations.  Each declaration introduces a name into the unit. 


### Definitions


A *definition* is a declaration that associates a meaning with a name.  A declaration may be a definition but is not necessarily a definition. 

Examples of declarations that are definitions include variable and object declarations, function definitions, parameter declarations in function definitions, class definitions, and template definitions. 

Examples of declarations that are not definitions include function prototypes, parameter declarations in function prototypes, and forward class declarations.


#### One Definition Rule


In C++, every declaration that is also a definition follows the *one definition rule*.  A definition may not appear more than once across all translation units.  No translation unit may contain more than one definition of a variable, function, class or template.  If a definition appears in multiple translation units, that definition must be identical in all translation units in which it appears.


### Scope


A declaration introduces a name into a scope.  The scope is the region of the program throughout which the name is valid; that is, the region where the entity identified by that name is visible.  The scope starts at the name's declaration and ends at the terminator for the region that hosts the declaration. 



#### Block Scope


A C++ *block* is a set of program instructions enclosed within curly braces.  Any block can be treated as a single compound instruction.  A name declared within a block is local to that block.  The name's scope extends from its declaration to the end of its block.

C++17 introduced initializer expressions into selection constructs.  The scope of a name declared in the selection condition of a selection construct extends to the end of the construct itself.  In the case of an `if-else` construct, the scope of the name includes all branches of the construct.  In the case of a `switch` construct, the scope of the name includes all of the cases including the default case. 

For example,

```cpp
// Selection Constructs - Block Scope
// selection_scope.cpp

#include <iostream>

int main()
{
    int i;
    std::cout << "Enter i: ";
    std::cin >> i;
    if (int j = i % 10; j < 5) // C++17
    {
        i -= j;      // round down
    }
    else
    {
        i += 10 - j; // round up
    }
    std::cout << i << std::endl;

    std::cout << "Enter i: ";
    std::cin >> i;
    switch (int j = i % 10; j / 5)  // C++17
    {
      case 0: // round down
        i -= j;
        break;
      case 1: // round up
        i += 10 - j;
    }
    std::cout << i << std::endl;
}
```

outputs the following:

```
Enter i: 14
10
Enter i: 16
20
```


#### Class Scope


Class scope is the scope of a name that has been declared in a class definition.  Class scope extends from the memory allocation of the named entity during the object's construction to its deallocation during destruction.


#### Global Scope


Global scope refers to the entire region of a program.  Names with global scope include class and function identifiers not defined in any other scope.  Namespaces (see below) localize names of otherwise global scope. 


#### Shadowing

A name declared within the scope of an identical name shadows the entity with the broader scope.  Shadowing of this form should be avoided to improve readability and maintainability.

```cpp
// Shadowed Scope
// shadowed_scope.cpp

#include <iostream>

int main()
{
    int i;
    std::cout << "Enter i: ";
    std::cin >> i;
    if (i < 0)
    {
       int i = 4;  // shadows the outer i
        std::cout << i << std::endl;
    }
    else
    {
        int i = -4; // shadows the outer i
        std::cout << i << std::endl;
    }
    std::cout << i << std::endl;
}
```

produces the output

```
Enter i: 7
-4
7
```


The name of a variable declared within a member function shadows the instance variable with an identical name.  The name of the shadowed instance variable can be accessed using the `this` keyword (`this->name`).

The name of a variable within a class or a function shadows the entity with an identical name and global scope.  The name of the shadowed global variable can be accessed using the scope resolution operator (`::name`).

### Linkage

#### External Linkage

A name with *external linkage* refers to an entity that is declared in a different scope within another translation unit.  The C++ keyword `extern` identifies external linkage. 

```cpp
extern int share_me; // declaration
```

We omit this linkage keyword in the translation unit that defines and initialize the named entity:

```
int share_me = 0;  // definition
```

C++ ignores the `extern` keyword if an initialization is present. 

In the following program the name `share_me` refers to the same entity across two translation units.  The variable `share_me` is accessed in `Module_a.cpp` and defined in `Module_b.cpp`.

```cpp
// External Linkage
// Module_a.cpp

#include <iostream>
extern int share_me; // external linkage declaration

void display()
{
    std::cout << "Module A: share_me at " << &share_me   << '\n'; 
    std::cout << "Module A: share_me is " <<  share_me++ << '\n';
}
```

```cpp
// External Linkage
// Module_b.cpp

#include <iostream>
void display();
int share_me = 0; // variable definition

int main()
{
    display();
    display();
    std::cout << "Module B: share_me at " << &share_me   << '\n'; 
    std::cout << "Module B: share_me is " <<  share_me++ << '\n';
}
```

produces the following output when compiled using the `cl` compiler

```
Module A: share_me at 00FE4A24
Module A: share_me is 0
Module A: share_me at 00FE4A24
Module A: share_me is 1
Module B: share_me at 00FE4A24 
Module B: share_me is 2
```

Note that when the address of the variable `share_me` is printed, we get **exactly** the same address; this is proof that the same variable is accessed from both modules.


#### Internal Linkage


A name with *internal linkage* refers to an entity that is invisible outside its own translation unit, but visible to other scopes within its translation unit.  The C++ keyword `static` identifies internal linkage. 

```cpp
static int local = 2;
```

The following program allocates separate memories for the variables named `local` in `Module_a.cpp` and `Module_b.cpp`.  The same name (`local`) refers to two distinct variables in the two translation units. 

```cpp
// Internal Linkage
// Module_a.cpp

#include <iostream>
static int local = 4;

void display()
{
    std::cout << "Module A: local at " << &local   << '\n'; 
    std::cout << "Module A: local is " <<  local++ << '\n';
}
```

```cpp
// Internal Linkage
// Module_b.cpp

#include <iostream>

void display();
static int local = 2;

int main()
{
    display();
    display();
    std::cout << "Module B: local at " << &local   << '\n'; 
    std::cout << "Module B: local is " <<  local++ << '\n';
}
```

produces the following output when compiled using the `cl` compiler

```
local at 010D3000
local is 4
local at 010D3000
local is 5
local at 010D323C 
local is 2
```

Note the different addresses for the same name in the two translation units. 



### Type


A declaration associates the name of an entity with a type.  A C++ *type* describes how to interpret the bit string in memory associated with the name and identifies the operations that are admissible on that type.  The type may be fundamental, built-in or user-defined. 

A C++ type may exhibit specific storage properties.  We identify these properties using *cv-qualifiers*.


#### cv Qualifiers


The storage properties of a type differ with respect to mutability and side-effects.  The *cv-qualifiers* include:

- none - the type is modifiable and not subject to any side-effects
- `const` - the type is unmodifiable and not subject to any side-effects
- `volatile` - the type is modifiable and subject to some side-effects
- `const volatile` - the type is unmodifiable and subject to some side-effects

A value stored in a `const` type cannot be changed.  Including this keyword in the entity's declaration informs the compiler that it should reject any code that attempts to modify the value of the object.

A value stored in a `volatile` type is subject to side-effects and needs its memory location updated every single time that the CPU changes that value.  This qualification is important in hardware-related code that keeps the value in register memory as the CPU updates that value.  Declaring a type as volatile instructs the compiler to retain all intermediate instructions and avoid optimizations that assume no side-effects. 

A type without any qualifier is *cv-unqualified*. 



#### Type Definition


A type definition is an alias for a type.  A type definition can simplify code readability for compound types. 

The C++ keyword `typedef` identifies a synonym for a specified type.  A type definition takes the form

```cpp
typedef compoundType Synonym;
```

`compoundType` is the original type along with all of the type specifiers.  `Synonym` is the alias for `compoundType`.

For example,

```cpp
typedef const int constInt; // defines the const int type as a constInt 
```

We can use the alias to declare a variable of the compound type: 

```cpp
constInt myConstant; // myConstant is a const int
```

All type specifiers must be included in the type definition.  We cannot insert new specifiers when we invoke the synonym type. 

A `typedef` cannot include a linkage specifier. 



## Namespaces


A namespace is a scope that limits the visibility of its names with respect to the program as a whole.  Any name declared within a namespace is local to that namespace and invisible outside that namespace.  The name within the namespace may be a variable name, an object name, a class name, or a function name.  The scope of each name declared within a namespace extends from its declaration to the end of the code block that contains that declaration or to the end of the namespace if the declaration is outside any code block. 

The usual scoping rules apply: an identifier in one namespace does not conflict with an identically named identifier in another namespace.  We may nest namespaces; that is, a namespace may contain another namespace.


### Declaration


The declaration of a namespace takes the form

```cpp
namespace identifier
{
    // declarations here
    // ...
}
```

`identifier` is optional (see anonymous namespaces below). 

Note that the declaration of a namespace is similar to a class definition.  However, a namespace, unlike a class, is not a type: we cannot create an instance of a namespace.  There is no semi-colon after the closing brace in the declaration of a namespace.

We expand a namespace by re-declaring it. 


#### Examples


Let us declare two identically named functions `leader()` in namespaces `dot` and `hat`:

```cpp
// Namespace for dot
// dot.h

namespace dot
{
    const char* leader(char*);
    const int ML = 15;
}
```

```cpp
// Namespace for hat
// hat.h

namespace hat
{
    const char* leader(char*);
    const int ML = 14;
}
```

Let us expand each namespace to include the definitions for their `leader()` functions:

```cpp
// Extend Namespace for dot
// dot.cpp

#include "dot.h"
namespace dot
{
    const char* leader(char* s)
    {
        for (int i = 0; i < ML; i++) 
            s[i] = '.';
        s[ML] = '\0';
        return s;
    }
}
```

```cpp
// Extend Namespace for hat
// hat.cpp

#include "hat.h"
namespace hat
{
    const char* leader(char* s)
    {
        for (int i = 0; i < ML; i++) 
            s[i] = '^';
        s[ML] = '\0';
        return s;
    }
}
```

### Visibility

A name within a namespace is invisible outside its namespace. 

```cpp
#include "dot.h"

int main()
{
    char s[51];
    leader(s);  // ERROR unidentified function name 
}
```

To expose an identifier, we prefix it with its namespace identifier followed by the scope resolution operator:

```cpp
#include "dot.h"

int main()
{
    char s[51];
    dot::leader(s);  // OK
}
```

Scope resolution selects the namespace:

```cpp
#include "dot.h"
#include "hat.h"

int main()
{
    char s[51];
    dot::leader(s);  // OK calls the leader() function declared in dot
    hat::leader(s);  // OK calls the leader() function declared in hat 
}
```


#### `using` Declaration


To minimize repetition of scope resolution, we can expose a name within a namespace by a `using` declaration.  A `using` declaration takes the form

```cpp
using namespace::identifier;
```

For example,

```cpp
#include "dot.h"
#include "hat.h"

int main()
{
    char s[51];

    using dot::leader;
    leader(s);          // OK calls the leader() function declared in dot

    using hat::leader;  // creates ambiguity
    hat::leader(s);     // OK calls the leader() function declared in hat 
}
```

Note how we have used scope resolution (`hat::`) to resolve the ambiguity. 


#### `using` Directive


We can expose all of the names within a namespace by a single `using` directive.  A `using` directive takes the form

```cpp
using namespace nameOfTheNamespace;
```

For example,

```cpp
#include "dot.h"
#include "hat.h"

int main()
{
    char s[51];

    using namespace dot;
    leader(s);            // OK calls the function declared in dot

    using namespace hat;  // creates ambiguity
    hat::leader(s);       // resolves the ambiguity in favor of hat 
}
```



### Anonymous Namespaces


Anonymous namespaces provide a means of isolating names within a translation unit.  The names declared within an anonymous namespace are only visible inside their own translation unit and invisible to all other translation units.  If a definition appears in multiple translation units, it can differ across the translation units if it is within anonymous namespaces in each translation unit.


#### Co-Existing Namespaces


An anonymous namespace reduces duplication across a set of co-existing namespaces in a translation unit.  For example,

```cpp
// Unnamed Namespace for dot and hat
// dot_hat.cpp

#include "dot.h"
#include "hat.h"

namespace
{
    const char* fill(char* s, char c, int n)
    {
        for (int i = 0; i < n; i++)
            s[i] = c;
        s[n] = '\0';
        return s;
    }
}

namespace dot
{
    const char* leader(char* s)
    {
        return fill(s, '.', ML);
    }
}

namespace hat
{
    const char* leader(char* s)
    {
        return fill(s, '^', ML);
    }
}
```

The function definition `fill()` is visible to namespaces `dot` and `hat`, which are within the translation unit `dot_hat.cpp`.  `fill()` is invisible outside `dot_hat.cpp`.

The following program uses this syntax to produce the result shown

```cpp
// Namespaces
// namespace.cpp

#include <iostream>
#include "dot.h"
#include "hat.h"

int main()
{
    char s[51];

    std::cout << dot::leader(s) <<  10 << std::endl;
    std::cout << hat::leader(s) << 120 << std::endl;
}
```

```
...............10
^^^^^^^^^^^^^^120
```


### Good Design Practice

#### Header File Design

`using` declarations and directives complicate header file inclusions. 

Since we cannot determine the order in which header files will be included within another source file, we qualify all names within the header file with their namespace's identifiers and the scope resolution operator.  It is good design practice to avoid the `using` directive or declaration in any header file.


#### Implementation File Design


Good style restricts `using` declarations and directives to implementation files and places them after all of the `#include` directives.  Placing `using` declarations or directives before `#include` directives might produce behavior that differs from the behavior that the library's authors had intended and may generate compiler errors.



## Lifetime in Memory


The lifetime of a variable or object is equal to or nested within the lifetime of its storage.  Its lifetime starts at the point of execution when the object is complete and ends at the point of execution when its storage starts to be released.


### Variables and Objects


A *variable* occupies a region of memory, holds a value and has a name.  An *object* occupies a region of memory, holds a value and may have a name.  For example:

```cpp
A* a;        // variable with the name a (a is a pointer to an object of type A)
A  b;        // object with the name b (b is created on the stack) - a variable
a = new A(); // object without a name (*a is created on the heap) - not a variable
```


#### Subobjects


C++ uses subobject terminology.  An object may be a *subobject* of another object.  For example, a base object is a subobject of a derived object. 

![Object with a Subobject](/img/subobject.png)

A *complete* object is an object that is not part of any other object.  The lifetimes of non-static members and base subobjects begin and end following class initialization order.

### Storage Duration

The *storage duration* of a variable or object defines its lifetime within a program.  Storage duration may be one of the following:

- automatic - lasts from its declaration to the end of its scope - no keyword
- static - lasts the entire lifetime of the program - use keyword `static`
- dynamic - created using the keyword `new` - last until deallocated using the keyword `delete`
- thread - lasts the lifetime of the thread - use keyword `thread_local`

A member subobject, a base class subobject and an array element has the same storage duration as their complete object.

#### Static Duration

An integer of static duration can be used to count the number of times that a function has been called:

```cpp
// Static Duration
// static.cpp

#include <iostream>

void display()
{
    static int n = 1;
    std::cout << "n is " << n++ << std::endl; 
}

int main()
{
    display();
    display();
}
```

produces the output

```
n is 1
n is 2
```

Note that the second call to `display()` does not re-initialize `n`. 


## Exercises

- Complete the practice problem in the [Handout on Synonyms and Storage Duration](https://ict.senecacollege.ca/~btp305/pages/handouts/h4.html).
- Read StackOverflow on [C++ subobjects and Java super classes and sub classes](http://stackoverflow.com/questions/18451683/c-disambiguation-subobject-and-subclass-object)
- Read Wikipedia on the [C++17 Standard](https://en.wikipedia.org/wiki/C%2B%2B17)
