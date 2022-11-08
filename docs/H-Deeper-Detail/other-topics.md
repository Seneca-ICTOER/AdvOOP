---
id: other-topics
title: Other Topics
sidebar_position: 6
description: TBD
---

# Other Topics

- Introduce topics related to intermediate level OO programming

> "The Standard Template Library provides a set of well-structured generic components that work together in a seamless way." Stepanov and Lee (1995)



The most common and versatile data structures in computer science are linked lists and containers in general.  The Standard Template Library (STL) of C++17 provides various implementations, enabling developers to focus on defining the compound type that is suitable for the programming problem at hand.  The STL takes care of the memory management as well as the access to elements of the lists and containers.

This chapter introduces the Standard Template Library along with the concept of a linked list.  To illustrate the concept this chapter presents two simple examples: a stack and a queue.  A stack is a last in first out list, like a stack of plates.  A queue is a first in first out list, like a lineup at a bus stop.  The following chapter introduces containers in general.




## Standard Template Library

The Standard Template Library (STL) is arguably the most important part of the C++17 Standard Library.  It provides code for managing the elements of a data structure in a generic form, hiding the complex details and allowing re-use.  The STL consists of:
- container template classes
  - sequential containers
  - associative containers
  - container adapters
- iterators
- algorithms
- function objects

A container class represents the shell of a data structure, manages the memory associated with the elements of that structure and provides member functions to access those elements.  Iterators facilitate the traversal of the data structure and provide simple access to range of elements.  Algorithms implement solutions for sequences of elements through the use of iterators and function objects.

A complete programming solution to the implementation of a data structure requires:
- the definition of the data type of each element in the data structure
- the choice of the optimal data structure to collect the elements
- the function object for the algorithm to use on the data structure
- supervisory coding to accesses the facilities of the STL

![Standard Template Library](/img/stl.png)
