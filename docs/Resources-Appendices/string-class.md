---
id: string-class
title: String Class
sidebar_position: 1
description: TBD
---

# String Class

- Describe the string class and its member functions

> "Use vector and string instead of arrays." Sutter, Alexandruscu (2005)

The C++ Standard Library defines the `string` class as the object-oriented alternative to null-terminated character strings of the C language. The member functions of this class that are specialized for direct operations on strings.

## Class Definition

The `string` class is defined within the `std` namespace. The `<string>` header file contains the class definition.

### Constructors

The constructors of the `string` class can initialize an object using:

1. a C-style null-terminated string
2. a C-style null-terminated substring
3. another `string` object
4. a substring of another `string` object
5. a sequence of characters

That is,

```cpp
string a = "Hello";           // a C-style string
string b("Good Bye", 4);      // the 1st 4 characters of C-style string
string c = a;                 // another string object
string d(b, 5, 3);            // "Bye" - a substring of a string object
string e(a.begin(), a.end()); // a sequence of characters
```

### Member Functions and Operations

Member functions and operations of the string class include:

- `string& operator=(const string& s)` - assign string `s` to the current object
- `string& operator+=(const string& s)` - append string `s` to the current object
- `string& operator+=(const char* s)` - append C-style string `s` to the current object
- `string& operator+=(char c)` - append character `c` to the current object
- `size_t size() const` - returns number of bytes stored in the current object
- `size_t length() const` - returns number of bytes stored in the current object
- `bool empty() const` - returns whether the current object is empty
- `char& operator[](size_t i)` - returns a reference to the character at index `i` (unchecked)
- `const char& operator[](size_t i) const` - read the character at index `i` (unchecked)
- `at(size_t i) const` - read the character at index `i` (checked)
- `char& front()` - returns a modifiable reference to the first character
- `const char& front() const` - read the first character
- `char& back()` - returns a modifiable reference to the last character
- `const char& back() const` - read the last character
- `const char* c_str() const` - return the address of the C-style null-terminated string equivalent
- `size_t find_first_of(const string& str) const` - returns the position of the first character that matches a character in `str`; if no match, returns `string::npos`
- `size_t find_last_of(const string& str) const` - returns the position of the last character that matches a character in `str`; if no match, returns `string::npos`
- `string substr(size_t pos, size_t len = npos)` - returns a string that contains the portion of the current string starting at character position `pos` and spanning `len` characters (or to the end of the current string)
- `int compare(const string& str) const` - compares the current object to `str` and returns `0` if the strings are equal, != 0 otherwise
- `void clear()` - erases the contents of the current object

`npos` is a class member constant with the greatest possible value for position within the string (`unsigned(-1)`).

#### Example

```cpp
// String Class
// string.cpp

#include <string>
#include <iostream>

int main()
{
  std::string str("Good ");

  str += "day";
  str += '!';

  str[5] = 'D';
  std::cout << str.length() << ' ' << str.c_str() << std::endl;
}
```

```
9 Good Day!
```

### Helper Functions

Helper functions for the string class include:

- `std::istream& getline(std::istream&is, string& str, char delimiter)` - extracts characters from `is` until delimiter; stores the characters in `str` and discards the delimiter
- `string operator+(const string& lhs, const string& rhs)` - concatenates `lhs` to `rhs` and returns the concatenated string
- `istream& operator>>(istream& is, string& s)` - extracts `s` from `is` and returns a reference to `is`
- `ostream& operator<<(ostream& os, const string& s)` - inserts `s` into `os` and returns a reference to `os`

## STL Related Notes

The `string` class is the default instantiation of the `basic_string` class template. The `basic_string` class template is similar to the `vector` class template. The `string` class provides iterators and can be used with the standard algorithms of the standard template library. Pointer/array equivalence does not hold: if `s` is an instance of the `string` class, then `&s[0]` is not the same as `s`.
