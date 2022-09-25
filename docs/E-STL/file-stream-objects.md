---
id: file-stream-objects
title: File Stream Objects
sidebar_position: 4
description: TBD
---

# File Stream Objects


- Describe the file objects for streaming sequences of data
- Describe how to write to and read from the same file object
- Describe how to store and retrieve images of memory without loss of information

> "Files are examples of containers that you can both read from and write to.  Consequently, you can have a stream that supports both `<<` and `>>`.  Such a stream is called an `iostream`." Stroustrup (1997)






The streaming facilities for transfers to and from memory are defined in the input/output category of the Standard Library.  A **stream** is defined as a sequence of items of unspecified size, while a byte stream is a sequence of bytes of unspecified size.

This chapter outlines the input-output stream class hierarchy of the C++ Standard Library, describes the file-stream classes in detail and introduces the member functions that access byte data within a file.



## Class Hierarchy


The input-output stream class hierarchy supports streaming to and from the standard console devices, files, and string streams.  The base class for this hierarchy is called `ios_base`.  It defines components that are independent of the direction of the stream.  The `basic_ios` class template holds the type-dependent information.



### Two Class Hierarchies


The `basic_ios` class template supports streams of char objects and `wchar_t` objects through separate hierarchies. 



#### `ios` Class Hierarchy


The `ios` class is the instance of the `basic_ios` template for streams of type `char`.  The input (`istream`) and output (`ostream`) classes are abstract classes derived from this `ios` class.  Furthermore, the file input stream class (`ifstream`) derives from the `istream` class and the file output stream class (`ofstream`) derives from the `ostream` class.  The `fstream` class combines the input and output functionality and derives from the `iostream` class, which derives from the `istream` and `ostream` classes.

![IOS Hierarchy](/img/fstream.png)

The `<fstream>` header file contains the definitions of all three file stream classes. All of the classes in this hierarchy are defined in the `std` namespace.


#### `wios` Hierarchy

The `wios` class is an instance of the `basic_ios` template for streams of type `wchar_t`.  The input (`wistream`) and output (`wostream`) classes are abstract classes derived from this `wios` class.  The file input stream class (`wifstream`) derives from the `wistream` class and the file output stream class (`wofstream`) derives from the `wostream` class.  The `wfstream` class combines the input and output functionality and derives from the `wiostream` class, which derives from the `wistream` and `wostream` classes. 

![WIOS Hierarchy](/img/wfstream.png)

The `<wfstream>` header file contains the definitions of all three file stream classes. All of the classes in this hierarchy are defined in the `std` namespace.



### `ios_base` Class

The `ios_base` class shared by both hierarchies holds formatting information, stream state flags, stream opening mode flags and the stream seeking direction flag.  Its member functions provide access to these flags. 



#### State Flags

Four flags identify a stream's current state:

- `ios_base::goodbit` is true if the next operation *may* succeed
- `ios_base::failbit` is true if the latest operation failed
- `ios_base::eofbit` is true if the stream object encountered an end of data mark
- `ios_base::badbit` is true if the stream object encountered a serious error, possibly with the internal buffer

A stream is in a ready state if the first flag is true or the other three flags are false. 

The `eofbit` flag is set only after an attempt to read the stream has been made to read data when there is no more data to be read.  Just having finished accessing the last byte in a stream does not set this `eofbit` flag: it is the subsequent attempt to access a further byte that sets this bit.



#### Stream Seeking Direction

Three enumeration constants identify the seeking direction in a stream seeking operation

- `ios_base::beg` - beginning of the stream
- `ios_base::end` - end of the stream
- `ios_base::cur` - current position within the stream

These are public member constants and can be referred to throughout the inherited classes (`ios::beg`) or their instantiated objects (`cin.beg`).



### `basic_ios` Template


The `basic_ios` template adds the fill character and holds the current state.  Its member functions provide access to the state flags. 



#### Member Functions


Six public member functions query the current state of the stream:

- `bool basic_ios::good() const` - none of the flags is set
- `bool basic_ios::fail() const` - `ios::failbit` or `ios::badbit` is `true`
- `bool basic_ios::eof() const` - `ios::eofbit` is `true`
- `bool basic_ios::bad() const` - `ios::badbit` is `true`
- `bool basic_ios::operator!() const` - same result as `fail()`
- `basic_ios::operator bool() const` - same result as `!fail()`

Note that the logical negation operator (`!`) is overloaded as an alternative to `fail()`.  This operator reports `true` if the latest operation failed or if the stream has encountered a serious error.  We can use it on a stream object to check the success of the most recent action:

```cpp
if (std::cin.fail())
{
	std::cerr << "Read error" << std::endl; 
	std::cin.clear();
}

// ... may also be written as ...

if (!std::cin)
{
	std::cerr << "Read error" << std::endl;
	std::cin.clear();
}
```

One member function resets the state of the stream:

- `void basic_ios::clear()` - clears all flags



#### Open mode Flags

Six member constants identify the open mode of a stream:

- `ios_base::in` open for reading
- `ios_base::out` open for writing
- `ios_base::app` open for appending
- `ios_base::trunc` open for writing, but truncate if file exists
- `ios_base::ate` move to the end of the file when the file is opened
- `ios_base::binary` access the file as a binary file



### `ios` Classes

The `ios` instance of the `basic_ios` template defines the base class for narrow character (`char`) input and output.

Practical bit-wise combinations of the openmode flags include

- `ios::in | ios::out` open for reading and writing (default)
- `ios::in | ios::out | ios::trunc` open for reading and overwriting
- `ios::in | ios::out | ios::app` open for reading and appending
- `ios::out | ios::trunc` open for overwriting

The `ostream` and `istream` bases classes for the `ofstream`, `ifstream`, and `fstream` classes provide access to bytes within a narrow character stream through a buffer.

A data member of type `streampos` holds the byte position value within the stream.  Numbering starts at `0` for the first byte in the stream.



#### Output Stream


The member functions for accessing a byte within an output stream are:

- `streampos tellp()` - returns the current position in the output stream
- `ostream& seekp(streampos pos)` - sets the current position in the output stream to `pos`
- `ostream& seekp(long offset, ios_base::seekdir dir)` - sets the current position in the output stream to offset from `dir`

`pos` refers to the number of bytes from the beginning of the stream, `offset` refers to the number of bytes from the seeking direction, and `dir` refers to one of the three enumeration constants (see above).

Note that the single argument version of `seekp()` accepts the absolute position, while the two argument version accepts the relative position with respect to the specified seeking direction.


#### Input Stream

The member functions for accessing a byte within an input stream are:

- `streampos tellg()` - returns the current position in the input stream
- `istream& seekg(streampos pos)` - sets the current position in the input stream to `pos`
- `istream& seekg(long offset, ios_base::seekdir dir)` - sets the current position in the input stream to offset from `dir`

`pos` refers to the number of bytes from the beginning of the stream, offset refers to the number of bytes from the seeking direction, and `dir` refers to one of three enumeration constants (see `ios` class above).

Note that the single argument version of `seekg()` accepts the absolute position, while the two argument version accepts the relative position with respect to the specified seeking direction. 



### `wios` Class

The `wios` instance of the `basic_ios` template defines the base class for wide character (`wchar_t`) input and output. 

Practical bit-wise combinations of the openmode flags include

- `wios::in | wios::out` open for reading and writing (default)
- `wios::in | wios::out | wios::trunc` open for reading and overwriting
- `wios::in | wios::out | wios::app` open for reading and appending
- `wios::out | wios::trunc` open for overwriting

The `wostream` and `wistream` base classes for the `wofstream`, `wifstream`, and `wfstream` classes provide access to bytes within a wide character stream through a buffer. 

A data member of type `wstreampos` holds the wide-character position value within the stream.  Numbering starts at `0` for the first wide character in the stream. 



#### Output Stream

The member functions for accessing a wide-character within an output stream are:

- `wstreampos tellp()` - returns the current position in the output stream
- `wostream& seekp(wstreampos pos)` - sets the current position in the output stream to `pos`
- `wostream& seekp(long offset, ios_base::seekdir dir)` - sets the current position in the output stream to offset from `dir`

`pos` refers to the number of bytes from the beginning of the stream, offset refers to the number of bytes from the reference position, and `dir` refers one of the three seeking directions.

Note that the single argument version of `seekp()` accepts the absolute position, while the two argument version accepts the relative position with respect to the specified seeking direction.



#### Input Stream


The member functions for accessing a wide-character within an input stream are:

- `wstreampos tellg()` - returns the current position in the input stream
- `wistream& seekg(wstreampos pos)` - sets the current position in the input stream to `pos`
- `wistream& seekg(long offset, ios_base::seekdir dir)` - sets the current position in the input stream to offset from `dir`

`pos` refers to the number of wide-characters from the beginning of the stream, offset refers to the number of wide-characters from the seeking direction, and `dir` refers to one of three enumeration constants (see `wios` class above).

Note that the single argument version of `seekg()` accepts the absolute position, while the two argument version accepts the relative position with respect to the specified seeking direction. 



## File Objects


File stream objects manage the transfer of data between program memory and files through buffers.  A file object can connect to a stream in either of two access modes:

- text mode - the stream consists of characters interpreted using an encoding sequence and has a record structure with a terminator that identifies the end of each record
- binary mode - the stream consists of characters without any interpretation or structure.

We specify the access mode on opening the file.  Text mode is the default mode. 



### Connections

`ofstream` objects manage writing to a file, while `ifstream` objects manage reading from a file.  Both classes have default constructors and constructors that receive the name of the file to be opened.  The constructors are overloaded to receive the address of a C-style null-terminated string and a reference to a `string` object.  For file objects created using the default constructor, the `open()` member function connects to the file itself.  For example,

```cpp
#include <fstream>

std::ofstream fout("output.txt");  // opens output.txt for output
std::ifstream fin ("input.txt");   // opens input.txt for input

std::ofstream fo;                  // declares an output file named fo 
fo.open("moreOutput.txt");         // connect fo to moreOutput.txt

std::ifstream fi;                  // declares an input file named fi
fi.open("moreInput.txt");          // connects fi to moreInput.txt
```

The logical negation operator (`!`) on the file object returns the current state of the object:

```cpp
#include <fstream>

std::ofstream fout("output.txt");  // opens output.txt for output 

if (!fout)
{
	std::cerr << "File failed to open" << std::endl;
}
else
{
	// opened successfully
}
```

The `is_open()` query on the file object returns the success of a connection attempt:

```cpp
#include <fstream>

std::ofstream fout("output.txt");  // opens output.txt for output 

if (!fout.is_open())
{
	std::cerr << "File failed to open" << std::endl;
}
else
{
	// opened successfully
}
```

The open-mode flags listed above, if passed to the constructor or `open()` specify the connection mode.



#### File Buffer


The `rdbuf()` member function on a file object returns the address of the object's buffer.  The insertion operator (`<<`) is overloaded for a pointer to this buffer.  To copy the contents of a file (say, source) to another file (say, destination) we can call this member function directly:

```cpp
// Copying Files
// fileCopy.cpp

#include <fstream>

int main(int argc, char agrv[])
{
	std::ifstream source(argv[1]);
	std::ofstream destination(argv[2]); 

	destination << source.rdbuf();
}
```



### Close a Connection

The destructor for a file object flushes the buffer and closes the file when the object goes out of scope.  To close a file connection before the file object goes out of scope, we call the `close()` member function on the object itself: 

```cpp
// Closing a connection early
// fileCopy2.cpp

#include <fstream>

int main(int argc, char agrv[])
{
	std::ifstream source;
	std::ofstream destination(argv[3]);

	source.open(argv[1]); // open first file

	destination << source.rdbuf(); // copy

	source.close();       // close first file 
	source.open(argv[2]); // open second file

	destination << source.rdbuf(); // copy
}
```



### Direct Access

A file object can access the contents of its stream either sequentially or directly.  Sequential access progresses from the beginning of the stream to its end.  Direct access starts at a specified position in the stream.  The `seek?()` member functions on the file object set the starting position.  That position is the next to be accessed within the stream. The program below

```cpp
// File Objects - Direct Access
// direct.cpp

#include <iostream>
#include <fstream>

int main(int argc, char* argv[])
{
	std::ofstream fo(argv[1]);      // open for output

	fo << "Line 1" << std::endl;    // line 1
	fo << "Line 2" << std::endl;    // line 2
	fo << "Line 3" << std::endl;    // line 3

	fo.seekp(0, std::ios::beg);     // go to the start of the file
	fo << "****";                   // overwrite four characters

	fo.seekp(4, std::ios::cur);     // go 4 char's beyond current
	fo << '#';                      // overwrite one character

	std::streampos p = fo.tellp();  // remember current position 
	fo.seekp(0, std::ios::end);     // go to end of the file
	fo << "The last line\n";        // add a line

	fo.seekp(p);                    // jump back to pos
	fo << '^';                      // overwrite one character
	fo.close();                     // close file

	std::ifstream fi(argv[1]);      // open for reading
	char c;

	while (fi.get(c))               // read 1 character at a time 
		std::cout << c;             // display the character

	fi.clear();                     // clear failed (eof) state
	fi.seekg(-8, std::ios::end);    // move 8 bytes from end

	while (fi.get(c))               // read 1 character at a time
		std::cout << c;             // display the character read
}
```

outputs in Windows
```
**** 1
#^ne 2
Line 3
The last line
t line
```
and in Linux
```
**** 1
L#^e 2
Line 3
The last line 
st line
```

The output on a Windows platform differs from that on a Linux platform because the record terminator consists of two characters on Windows - a carriage return and a newline (`\r\n`) - while the record terminator on Linux is a single character - a newline (`\n`).



### Writing and Reading


A file object of the `fstream` class can manage both writing to and reading from a file.  Instead of creating separate objects for reading and writing, we can create a single instance of the `fstream` class for writing to and reading from the same file.

The program below

```cpp
// File Objects - writing and reading
// fstream.cpp

#include <iostream>
#include <fstream>

int main(int argc, char* argv[])
{
	std::fstream f(argv[1], std::ios::in | std::ios::out | std::ios::trunc);

	f << "Line 1" << std::endl;   // line 1
	f << "Line 2" << std::endl;   // line 2
	f << "Line 3" << std::endl;   // line 3

	f.seekp(0, std::ios::beg);    // go to the start of the file
	f << "****";                  // overwrite four characters

	f.seekp(4, std::ios::cur);    // go 4 bytes beyond current
	f << '#';                     // overwrite one character

	std::streampos p = f.tellp(); // remember current position
	f.seekp(0, std::ios::end);    // go to end of the file
	f << "The last line\n";       // add a line

	f.seekp(p);                   // jump back to pos
	f << '^';                     // overwrite one character

	char c;
	f.seekg(0, std::ios::beg);    // to the start of the file

	while (f.get(c))              // read 1 character at a time 
		std::cout << c;           // display the character
	
	f.clear();                    // clear failed (eof) state
	f.seekg(-8, std::ios::end);   // move 8 bytes from end
	
	while (f.get(c))              // read 1 character at a time
		std::cout << c;           // display the character read
}
```

outputs in Windows
```
**** 1
#^ne 2
Line 3
The last line
t line
```
and in Linux
```
**** 1
L#^e 2
Line 3
The last line 
st line
```

Note the open-mode flag settings for writing to and reading from the file.



## Binary Access


Binary access transfers data to and from memory without any formatting; there is no conversion, insertion, or extraction of record or field separators.  Binary access lets us save the image of the contents of memory without any loss of information.  The contents of a file opened for binary access is typically indecipherable when viewed within a text editor. 

An application that reads or writes in binary access mode is responsible for keeping track of any structure that the data may have. 



### Input


The `istream` class of the input-output hierarchy includes a member function that reads a stream in binary mode.  The prototype for this function is

```cpp
std::istream& read(char* data, std::streamsize nb);
```

`data` is the address of the destination in memory where the file data is to be copied and `nb` is the number of bytes to be copied.  `std::streamsize` is an integral type typically type defined as a `signed long`.

The program on the left reads from the file named on the command line, stores the data in `str` and displays the stored string on standard output

```cpp
// Binary Access - Reading
// readBinary.cpp

#include <iostream>
#include <fstream>

int main(int argc, char* argv[])
{
	char str[1025];
	char* p = str;

	std::ifstream f(argv[1], std::ios::in | std::ios::binary); 

	while(f)
		f.read(p++, 1);

	*--p = '\0'; // adds the null terminator

	std::cout << str << std::endl;
}
```

```
Hello World
```

The `std::ios::binary` flag in the constructor call specifies binary access mode.



### Output

The `ostream` class of the input-output hierarchy includes a member function for writing to a file in binary mode.  The prototype for this function is

```cpp
std::ostream& write(const char* data, std::streamsize nb);
```

`data` is the address of the data to be copied to the file and `nb` is the number of bytes to be copied. 

The following program writes the string `str` to the file named on the command line

```cpp
// Binary Access - Writing
// writeBinary.cpp

#include <fstream>

int main(int argc, char* argv[])
{
	char str[] = "Hello World";

	std::ofstream f(argv[1], std::ios::out | std::ios::binary | std::ios::trunc); 

	f.write(str, sizeof str - 1);
}
```



### Binary versus Text


The program below compares binary and text access with respect to the same value stored in memory (1.0/3.0).  The file object opened under binary access preserves the original precision so that the value returned to memory is the same as originally stored.  The file object opened under text access discards some of the precision as it formats the value for output to 6 decimal places. 

```cpp
// Binary Access - Binary or Text
// binary.cpp

#include <iostream>
#include <iomanip>
#include <fstream>

int main(int argc, char* argv[])
{
	std::cout << std::fixed << std::setprecision(15);

	{
		// binary access
		double x = 1.0/3.0;

		std::fstream f(argv[1], std::ios::in | std::ios::out | std::ios::trunc | std::ios::binary);

		f.write(reinterpret_cast<char*>(&x), sizeof(x));
		f.seekg(0, std::ios::beg);
		f.read(reinterpret_cast<char*>(&x), sizeof(x));

		std::cout << x << std::endl;
	}

	{
		// text access
		double x = 1.0/3.0;

		std::fstream t(argv[2], std::ios::in | std::ios::out | std::ios::trunc);

		t << x;
		t.seekg(0, std::ios::beg);
		t >> x;

		std::cout << x << std::endl;
	}
}
```

```
0.333333333333333
0.333333000000000
```

Note the cast to a `char*` type in the `read()` and `write()` member functions.



## Exercises

<!-- - Complete the practice problem in the Handout on File Objects.-->
<!-- - Complete the practice problem in the Handout on Binary Access.-->
- Read Wikipedia on [streams](https://en.wikipedia.org/wiki/Stream_%28computing%29)
