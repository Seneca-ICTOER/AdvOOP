---
id: classes-and-scoped-enumerations
title: Classes and Scoped Enumerations
sidebar_position: 3
description: TBD
---

# Classes and Scoped Enumerations

- Describe user-defined types including both class and enumerator types
- Introduce move constructors and move assignment operators for class types

> "The C++ programming language ... provides powerful and flexible mechanisms for abstraction; that is, language constructs that allow the programmer to introduce and use new types of objects that match the concepts of an application." Stroustrup (1999)

_User-defined types_ are types that we construct from fundamental, built-in and possibly other user-defined types, using the abstraction mechanisms of the programming language. The user-defined types of the C++ language can be divided into two groups: **classes** and **enumerations**.

- Class types represent data that has its own dedicated logic. Class types encapsulate their own logic, protect their objects' data through access modifiers and manage access to that data through public member functions.
- Enumeration types represent sets of discrete values using symbolic names, which makes the source code more readable and less error-prone.

This chapter reviews class definitions, construction, copying and assigning of objects that are instances of classes, and introduces move-constructors and move-assignment operators along with class variables, class functions. This chapter concludes with an introduction to enumerations: both plain and scoped.

## Class Basics

A class is a set of types. Unlike an array, the data types defined in a class need not be identical. The function types define the class logic. The data and function types constitute the _members_ of the class. A class does not necessarily store its data members contiguously in a region of memory. Gaps may exist between the data members to satisfy alignment requirements. The compiler inserts holes/padding between the data members or between the last data member and the end of the class instance, as required. Such holes/padding are unpredictable and implementation defined.

C++ specifies a class type using one of three class-keys:

- `class`
- `struct`
- `union`

The class-key class identifies a class that is strongly encapsulated. The members of a `class` are private by default, which facilitates the hiding of their information.

The class-keys `struct` and `union` identify classes that are weakly encapsulated. The members of a `struct` or `union` are public by default, which facilitates the sharing of their information.

### Declarations and Definitions

#### Class Definitions

A class definition introduces a type into a scope. The definition declares the sub-objects of the class and its member function types. The definition takes the form:

```
class-key Identifier
{
	sub-object declarations

	member function declarations
};
```

where `Identifier` is the name of the class.

#### Sub-Object Declarations

The sub-object declarations in a class definition refer to other types (data members), which may including types that point to instances of the class itself. For example, the definition of a `Subject` class may include a data member of `Subject*` type:

```cpp
class Subject
{
	unsigned number;
	char desc[41];
	Subject* prerequisite; // OK
};
```

A class definition may not include a sub-object declaration the same type. For example, the definition of a `Subject` class may not declare a sub-object of `Subject` type:

```cpp
class Subject
{
	unsigned number;
	char desc[41];
	Subject subject; // ERROR
};
```

Such an inclusion would be infinitely recursive: the type would include itself, which would include itself, ... and the amount of memory required by an instance of type `Subject` cannot be calculated.

#### Forward Declarations

A forward class declaration introduces a new type to a scope, without declaring the sub-objects or member function types of that class. The declaration simply informs the compiler that the name of the class is a valid name. A forward declaration takes the form:

```
class-key Identifier;
```

#### Instance Definitions

We may combine a class definition with the definition of one or more instances of that class in a single compound statement. We do so by inserting the instance identifier between the closing brace of the definition and the semi-colon:

```
class-key Identifier
{
	sub-object declarations

	member function declarations
} object;
```

where `object` is the name of the instance of type `Identifier`.

The following class definition defines both an instance named `subject` and a pointer to an instance named `pSubject`:

```cpp
class Subject
{
	unsigned number;
	char desc[41];
} subject, *pSubject;
```

### Data Member Initialization

We can initialize modifiable non-static data members in three ways:

- in the member declaration (default member initializers)
- in the member-list initializers when implementing the constructor
- in the constructor body

We cannot initialize unmodifiable data members in the constructor's body, but can initialize them in the first two ways.

#### Default Member Initializers

A class definition can initialize its data members directly through default member initializers, which are either a braces-enclosed values or lists of comma-separated values or an equals initializers on the member declaration itself.

```cpp
class-key Identifier
{
	sub-object declaration   {initial value}; // braces-enclosed - type-safe
	sub-object declaration = {initial value}; // braces-enclosed - type-safe
	sub-object declaration =  initial value;  // equals initializer
	sub-object declaration   {initial value, ... }; // braces-enclosed list
	sub-object declaration = {initial value, ... }; // braces-enclosed list

	member function declarations
};
```

The comma and ellipsis denote further initial values.

#### Member List Initializers

Any constructor of a class can initialize a data member directly. Initialization takes the form of the data member's name followed by the initial value enclosed within braces. Initializations can happen **only** when implementing the constructor, are comma-separated, and follow a single colon after the closing parenthesis of the constructor's prototype:

```cpp
Class-name(type x, ...) : data-member-name{x},...
{
	// any logic
}
```

The comma and ellipsis denote further initializations.

#### Example

The program

```cpp
// Initializing Data Members
// initialize.cpp

#include <iostream>
#include <string>

int nItems = 0;

class Item
{
	int item = ++nItems;              // default initializer
	const std::string name {"empty"}; // default initializer
public:
	Item() {}                                        // 2 defaults
	Item(const char* n) : name{n} {}                 // 1 member-list initializer, 1 default
	Item(const char* n, int i) : name{n}, item{i} {} // 2 member-list initializers, 0 defaults

	const char* itemName() const { return name.c_str(); }
	int itemNo() const { return item; }
};

int main()
{
	std::cout << nItems << std::endl;
	Item a;
	std::cout << a.itemName() << ' ' << a.itemNo() << '\n';

	Item b("apple");
	std::cout << b.itemName() << ' ' << b.itemNo() << '\n';

	Item c("grape", 6);
	std::cout << c.itemName() << ' ' << c.itemNo() << '\n';

	std::cout << nItems << std::endl;
}
```

produces the output

```
0
empty 1
apple 2
grape 6
2
```

A data initializer on an instance variable is slightly more efficient than the equivalent logic within the constructor's body.

### Copying

#### Copy Construction and Copy Assignment

Classes that include resources manage them through user-defined copy constructors, copy-assignment operators and destructors. In the following example, member initialization syntax simplifies the coding of these special member functions. The C++ language allows dynamic memory allocation of 0 (zero) elements, but requires its destruction to complement it.

The program below

```cpp
// Copy-Construction, Copy-Assignment and Subscripting Operator
// copy_assign.cpp
#include <iostream>

class Array
{
	int* a = nullptr;
	unsigned n = 0u;
	int dummy = 0;

public:
	Array(){}
	Array(unsigned no) : a(new int[no]), n(no) {}
	Array(const Array& src) { *this = src; }

	Array& operator=(const Array& src)
	{
		if (this != &src)
		{
			delete [] a;
			n = src.n;
			dummy = src.dummy;
			a = new int[src.n];
			for (unsigned i = 0u; i < src.n; ++i)
				a[i] = src.a[i];
		}
		return *this;
	}

	~Array() { delete [] a; }

	int& operator[](unsigned i)
	{
		return n > 0u && i < n ? a[i] : dummy;
	}

	int operator[](unsigned i) const
	{
		return n > 0u && i < n ? a[i] : dummy;
	}

	unsigned size() const { return n; }
};


int main()
{
	const unsigned size = 5;
	Array a(size), b;

	for (unsigned i = 0u; i < a.size(); ++i)
		a[i] = 3 * i;

	for (unsigned i = 0u; i < a.size(); ++i)
		std::cout << a[i] << ' ';
	std::cout << std::endl;

	b = a;

	for (unsigned i = 0u; i < b.size(); ++i)
		std::cout << a[i] << ' ';
	std::cout << std::endl;
}
```

produces the output

```
0 3 6 9 12
0 3 6 9 12
```

This example also shows how to code _lvalue_ and _rvalue_ versions of the subscripting operator (`[]`). The _lvalue_ version returns a reference to either an element of the array or to the `dummy` instance variable. Both versions check that the index received is within bounds and if outside refer to this `dummy` variable. This ensures that any change by the _lvalue_ version of the subscripting operator does not corrupt memory outside the memory referred to by the object.

Identify which member operator is called at which statement in `main()`.

### Anonymous Classes

If we never refer to the `Identifier` of a class, we may omit the name in the definition of the class. This occurs in the definition of type synonyms and structures or unions nested within a class definition. A class without an `Identifier` is called an **anonymous** class.

In defining an anonymous type, we must include either the instance's identifier or the synonym name. That is, the definition of an anonymous type is also either the definition of an instance of that type or the declaration of a synonym type.

For example,

```cpp
// defining an instance of an anonymous type (name)
struct // definition - no tag
{
	char shortName[7];
	char fullName[41];
} name;


// declaring a synonym type (Course)
typedef struct // definition - no tag
{
	unsigned number;
	char desc[41];
} Course; // "Course" is a synonym for the structure
```

## Move Operators

In cases where an instance of **a class with resources** will no longer be referred to once it has been copied or assigned, we may move that object's resources by a simple copying of their addresses. This copying is an efficient alternative to copying the members of the to-be-moved object to new locations in the current object.

The C++ move facilities implement this alternative solution for objects that are near the end of their lifetime.

The prototype for a move-constructor takes the form

```
class-name(class-name&&);
```

The prototype for a move-assignment operator takes the form

```
class-name& operator=(class-name&&);
```

These special member functions receive _rvalue_ references to the source object (the object whose content is to be moved) and perform the swapping of addresses between the objects' resources.

For example, these operators are defined below for the `copy_assign.cpp` program listed above.

```cpp
// Copy and Move
// copy_move.cpp
#include <iostream>
#include <utility>

class Array
{
	int* a = nullptr;
	unsigned n = 0u;
	int dummy = 0;

public:
	Array(){}
	Array(unsigned no) : a(new int[no]), n(no) {}

	// the COPY constructor
	Array(const Array& src) { *this = src; }

	// the MOVE constructor
	Array(Array&& src) { *this = std::move(src); }

	// the COPY assignment operator
	Array& operator=(const Array& src)
	{
		// 1. check for self-assignment
		if (this != &src)
		{
			// 2. clean-up the resource used by the current instance
			delete [] a;

			// 3. shallow copy
			n = src.n;
			dummy = src.dummy;

			// 4. deep copy
			a = new int[src.n];
			for (unsigned i = 0u; i < src.n; ++i)
				a[i] = src.a[i];
		}
		return *this;
	}

	// the MOVE assignment operator
	Array& operator=(Array&& src)
	{
		// 1. check for self-assignment
		if (this != &src)
		{
			// 2. clean-up the resource used by the current instance
			delete [] a;

			// 3. shallow copy
			n = src.n;
			dummy = src.dummy;

			// 4. move the resource from parameter into current instance
			a = src.a;       // copy address to current object
			src.a = nullptr; // the parameter doesn't have the resource anymore
		}
		return *this;
	}

	~Array() { delete [] a; }

	int& operator[](unsigned i)
	{
		return n > 0u && i < n ? a[i] : dummy;
	}

	int operator[](unsigned i) const
	{
		return n > 0u && i < n ? a[i] : dummy;
	}

	unsigned size() const { return n; }
};


int main()
{
	const unsigned size = 5;

	Array a(size), b;
	for (unsigned i = 0u; i < a.size(); ++i)
		a[i] = 3 * i;


	std::cout << "Copy-Assignment\n";

	std::cout << "a : ";
	for (unsigned i = 0u; i < a.size(); ++i)
		std::cout << a[i] << ' ';
	std::cout << std::endl;

	b = a; // calls copy-assignment

	std::cout << "b : ";
	for (unsigned i = 0u; i < b.size(); ++i)
		std::cout << b[i] << ' ';
	std::cout << std::endl;

	std::cout << "a : ";
	for (unsigned i = 0u; i < a.size(); ++i)
		std::cout << a[i] << ' ';
	std::cout << std::endl;


	std::cout << "Move-Assignment\n";

	std::cout << "a : ";
	for (unsigned i = 0u; i < a.size(); ++i)
		std::cout << a[i] << ' ';
	std::cout << std::endl;

	b = std::move(a); // calls move-assignment

	std::cout << "b : ";
	for (unsigned i = 0u; i < b.size(); ++i)
		std::cout << b[i] << ' ';
	std::cout << std::endl;

	std::cout << "a : ";
	for (unsigned i = 0u; i < a.size(); ++i)
		std::cout << a[i] << ' ';
	std::cout << std::endl;
}
```

The output of the program above is

```
Copy-Assignment
a : 0 3 6 9 12
b : 0 3 6 9 12
a : 0 3 6 9 12
Move-Assignment
a : 0 3 6 9 12
b : 0 3 6 9 12
a :
```

## Class Members

A class can include data members that hold the same information for **all instances** of the class and access that information regardless of the number of instances that currently exist. These are called **class variables**. Class functions can access these variables at any time.

### Class Variables

A _class variable_ lasts the lifetime of the program and holds a value that all instances of the class share. Application examples include the interest on a savings account for customers of a non-discriminating bank or counters that keep track of the number of objects instantiated but not yet destroyed.

The keyword `static` declares a variable in a class definition to be a class variable. We define and initialize the class variable in the implementation file for the module. For example, the program

```cpp
// Class Variables - Header
// classVariable.h

class Horse
{
	unsigned age;             // <-- this is an instance variable
	unsigned id;              // <-- this is an instance variable
public:
	static unsigned noHorses; // <-- this is a class variable

	Horse(unsigned a);
	~Horse();

	void display() const;
};
```

```cpp
// Class Variables - Implementation
// classVariable.cpp

#include <iostream>
#include "classVariable.h"

unsigned Horse::noHorses = 0; // this is how class variables are initialized

// the constructor increments the class variable, but is not initialize it
Horse::Horse(unsigned a) : age{a}, no{++Horse::noHorses} {}

// the destructor decrements the class variable
Horse::~Horse() { --Horse::noHorses; }

void Horse::display() const
{
	std::cout << "Horse " << no << " is " << age << " years old\n";
}
```

```cpp
// Class Variables - Application
// classVariableMain.cpp

#include <iostream>
#include "classVariable.h"

int main()
{
	// no need for an instance to access the class variable
	std::cout << Horse::noHorses << " horses\n";

	{
		// create a local scope
		Horse silver(3), northernDancer(4);

		silver.display();
		northernDancer.display();

		std::cout << Horse::noHorses << " horses" << std::endl;
		std::cout << silver.noHorses << " horses" << std::endl;
		std::cout << northernDancer.noHorses << " horses" << std::endl;

		// local scope ends: variables created in this scope will be destroyed
	}

	std::cout << Horse::noHorses << " horses" << std::endl;
}
```

outputs

```
0 horses
Horse 1 is 3 years old
Horse 2 is 4 years old
2 horses
2 horses
2 horses
0 horses
```

We can refer to a class variable through its class name or through anyone of its objects' names. We can access a class variable even if there are no instances of the class at the time.

### Class Functions

A class function provides access to private class variables. The keyword `static` declares a function in a class definition to be a class function. We define the class function in the implementation file. For example, the program

```cpp
 // Class Functions - Header
 // classFunction.h

 class Horse {
     unsigned age;              // <-- instance variable
     unsigned no;               // <-- instance variable
     static unsigned noHorses;  // <-- PRIVATE class variable, cannot be accessed from outside the class
 public:
     Horse(unsigned a);
     ~Horse();

     void display() const;      // <-- instance function

     static unsigned howMany(); // <-- PUBLIC class function
 };
```

```cpp
// Class Functions - Implementation
// classFunctioncpp

#include <iostream>
#include "classFunction.h"

unsigned Horse::noHorses = 0;  // initialize the class variable

Horse::Horse(unsigned a) : age{a}, no{++noHorses} {}

Horse::~Horse() { --noHorses; }

void Horse::display() const
{
	std::cout << "Horse " << no << " is " << age << " years old\n";
}

unsigned Horse::howMany() { return noHorses; }
```

```cpp
// Class Functions - Application
// classFunctionMain.cpp

#include <iostream>
#include "classFunction.h"

int main()
{
	std::cout << Horse::howMany() << " horses\n";

	{
		Horse silver(3), northernDancer(4);
		silver.display();
		northernDancer.display();

		std::cout << Horse::howMany() << " horses" << std::endl;
		std::cout << silver.howMany() << " horses" << std::endl;
		std::cout << northernDancer.howMany() << " horses" << std::endl;
	}

	std::cout << Horse::howMany() << " horses\n";
}
```

outputs

```
0 horses
Horse 1 is 3 years old
Horse 2 is 4 years old
2 horses
2 horses
2 horses
0 horses
```

All data members of class scope to which a class function refers must be class variables. A class function may not refer to any instance variable.

## Structs and Unions

A `struct` or `union` is a class that is weakly encapsulated. Its members are public by default. Just like for `class`, the data members of a `struct` or `union` can be of different types.

### Structs

The members of a `struct` are arranged **sequentially** but not necessarily contiguously in memory.

### Unions

The members of a union are arranged **in parallel** in memory. Unlike the members in a `class` or a `struct`, the members in a `union` share the same address in memory.

An object of `union` type can only hold the value of one of its members at any particular time. For example, the program

```cpp
// Unions
// union.cpp

#include <iostream>
#include <cstring>

union Product // some instances have skus, other have upcs, but not both
{
	int sku;
	char upc[13];
};

int main()
{
	Product cereal, tissue;

	cereal.sku = 4789;
	std::strcpy(tissue.upc, "0360002607555");

	std::cout << cereal.sku << std::endl;
	std::cout << tissue.upc << std::endl;
}
```

outputs

```
4789
0360002607555
```

Note that only the value of the member that was most recently assigned is stored in memory. Attempting to access the memory of a union using a different member than the one assigned will produce a value that doesn't make sense.

## Enumerations

An enumeration is a type that holds a discrete set of symbolic constants. These constants can simplify the readability and the upgradability of an application significantly.

Each enumeration definition declares a type that is different from all other types and has an underlying type. The default underlying type of an enumeration in an `int`.

### Plain Enumerations

The definition of a plain enumeration type lists the symbolic constants in the following form

```
enum Type
{
	symbolic_constant_1,
	symbolic_constant_2,
	symbolic_constant_3,
	...
};
```

The keyword `enum` distinguishes the enumerated type from any other type. `Type` is the name of the enumerated type. Each symbolic constant in the list is an **enumeration constant**.

We define a variable of enumeration type using a declaration of the form

```
Type identifier;
```

`identifier` is the name of the variable that holds one of the symbolic constants of type `Type`.

For example, the program

```cpp
// Plain Enumerations
// plain_enum.cpp

#include <iostream>
#include <string>

// define the Colour enumeration type
enum Colour { white, red, green, blue };

std::ostream& operator<<(std::ostream& os, const Colour& colour)
{
	std::string str;

	switch(colour)
	{
	case white: // symbolic constant
		str = "white";
		break;
	case red: // symbolic constant
		str = "red";
		break;
	case green: // symbolic constant
		str = "green";
		break;
	case blue: // symbolic constant
		str = "blue";
		break;
	default:
		str = "none";
	}

	os << str;

	return os;
}

int main()
{
	Colour wall, ceiling, door; // define Colour variables
	wall = red;
	ceiling = white;
	door = green;

	std::cout << wall << ' ' << ceiling << ' ' << door << std::endl;
}
```

outputs

```
red white green
```

### Tracking Access in Unions Using Structs and Enumerations

There is no independent way of identifying a union's most recently accessed member. To address this ambiguity, we wrap a union type within a struct type and declare an enumerator as a member of the struct type. The enumerator identifies the most recently accessed member within the union type. For example,

```cpp
// Structs with Unions
// struct_union.cpp

#include <iostream>
#include <cstring>

enum ProductId { sku, upc };

typedef struct
{
	ProductId id; // enumeration type holds a symbolic constant
	union // some have skus, some upcs
	{
		int  sku;
		char upc[13];
	} code;
	char desc[100];
} Product;


int main()
{
	Product p[2];

	p[0].id = sku;
	p[0].code.sku = 4789;
	std::strcpy(p[0].desc, "A history book about ancient Rome.");

	p[1].id = upc;
	std::strcpy(p[1].desc, "A universal remote control for TVs.");
	std::strcpy(p[1].code.upc, "0360002607555");

	for (int i = 0; i < 2; i++)
	{
		switch(p[i].id)
		{
		case sku:
			std::cout << p[i].code.sku << std::endl;
			break;
		case upc:
			std::cout << p[i].code.upc << std::endl;
			break;
		}
	}
}
```

outputs

```
4789
0360002607555
```

Note the type definitions and the two anonymous types in this example.

### Scoped Enumerations

A scoped enumeration is an enumeration that restricts access to its symbolic constant based on its scope. Symbolic constants with the same name but different scopes are distinct from one another.

The definition of a scoped enumeration type lists the symbolic constants and takes the following form. The keyword `class` identifies a scoped enumeration:

```cpp
enum class Type
{
	symbolic_constant_1,
	symbolic_constant_2,
	symbolic_constant_3,
	...
};
```

`Type` is the name of the enumerated type. Each symbolic constant in the list is an **enumeration constant**.

We define a variable of enumerator type using a declaration of the form

```cpp
Type identifier;
```

`identifier` is the name of the variable that will hold one of the symbolic constants of type `Type`.

For example, the program

```cpp
// Scoped Enumerations
// scoped_enum.cpp

#include <iostream>
#include <string>

// define the Colour type
enum class Colour { white, red, green, blue };

std::ostream& operator<<(std::ostream& os, const Colour& colour)
{
	std::string str;

	switch(colour)
	{
	case Colour::white:
		str = "white";
		break;
	case Colour::red:
		str = "red";
		break;
	case Colour::green:
		str = "green";
		break;
	case Colour::blue:
		str = "blue";
		break;
	default:
	str = "none";
	}

	os << str;
	return os;
}

int main()
{
	Colour wall, ceiling, door; // define Colour variables

	wall = Colour::red;
	ceiling = Colour::white;
	door = Colour::green;

	std::cout << wall << ' ' << ceiling << ' ' << door << std::endl;
}
```

outputs

```
red white green
```

### Underlying Types

The compiler associates each symbolic constant of an enumeration with a unique value of the enumeration's underlying type. By default, the compiler assigns the value 0 to the first constant in the list and a value 1 greater than the preceding value to each successive constant.

We may assign our own value to an enumeration constant provided that each value is unique within the list for that type. For example,

```cpp
enum class Colour
{
	white = 0x01,
	red   = 0x02,
	green = 0x04,
	blue  = 0x08
};
```

Note that the value of `red` is 2, which is 1 greater than `white`, but the value of `blue` is 8, which is 4 greater than `green`.

### Modifying an Enumeration

Enumeration syntax simplifies upgradability. If we insert a new symbolic constant into the enumeration, the compiler renumbers the underlying types for the subsequent constants in the list without requiring any further modification:

```cpp
// Inserting Enumeration Constants
// insert_enum.cpp

#include <iostream>
#include <string>

// define the Colour type
enum class Colour { white, yellow, red, green, blue };

std::ostream& operator<<(std::ostream& os, const Colour& colour)
{
	std::string str;

	switch(colour)
	{
	case Colour::white:
		str = "white";
		break;
	case Colour::yellow:
		str = "yellow";
		break;
	case Colour::red:
		str = "red";
		break;
	case Colour::green:
		str = "green";
		break;
	case Colour::blue:
		str = "blue";
		break;
	default:
		str = "none";
	}

	os << str;
	return os;
}

int main()
{
	Colour wall, ceiling, door, window;

	wall = Colour::red;
	ceiling = Colour::white;
	door = Colour::green;
	window = Colour::yellow;

	std::cout << wall    << ' ' << window << ' '
	          << ceiling << ' ' << door   << std::endl;
}
```

outputs

```
red yellow white green
```

Note that the only changes required for inserting the new symbolic constant `yellow` were adding it to the enumeration definition and adding a corresponding `case` to the `switch-case` construct.

### Exercises

<!-- Complete the practice problem in the Handout on [Class Variables and Class Functions](missing)-->
<!--- Complete the practice problem in the Handout on [Union Types](missing)-->

- Read Wikipedia on [Class Variables](https://en.wikipedia.org/wiki/Class_variable)
