---
id: linked-list-technology
title: Linked List Technology
sidebar_position: 5
description: TBD
---

# Introduction to Linked Lists

- Introduce the concept of a linked list to represent a data structure
- Demonstrate linked list technology through a stack and a queue

> "The Standard Template Library provides a set of well-structured generic components that work together in a seamless way." Stepanov and Lee (1995)

The containers of the C++ Standard Template Library (STL) of C++ are designed using linked list technology. Linked lists are the most common and versatile data structures in computer science.

This chapter introduces the concept of a linked list and illustrates it with two examples: a stack and a queue. A stack is a last in first out (LIFO) list, like a stack of plates. A queue is a first in first out (FIFO) list, like a lineup at a bus stop.

## The Concept of a Linked List

A linked list is a collection of objects of **identical** type with possibly different lifetimes. A list implements this flexibility by allocating dynamic memory separately for each object and linking its objects together through pointers to adjacent objects in the list. The objects are not necessarily stored contiguously in memory.

While an array, vector or queue is well suited for managing objects with identical lifetimes, a linked list is significantly more flexible: the list can change its size by discarding and inserting select objects within its interior.

### A Simple Chain of Objects

The simplest way to build a dynamic chain of objects is to link each object to the next one in the list by address.

#### Adding Objects

Consider a chain of elements that hold integer values. Each element consists of a single int and a pointer to the next element in the chain. The last element in the chain points to the `nullptr` address. We call the element furthest from the `nullptr` address the **head** of the list and the element that points to the `nullptr` address the _tail_ of the list. We start with an empty chain and allocate memory one element at a time. We add each new element to the head of the chain.

![Chain of Elements](/img/chain.png)

The following code implements this sequential allocation of memory. We de-allocate elements in opposite order to that of construction:

```cpp
// Linked Lists - Adding Objects to a Chain
// chain.cpp

#include <iostream>

struct Element
{
  int data;
  Element* next;
  Element(int d, Element* n) : data(d), next(n) {}
};

int main ()
{
  Element* head = nullptr;

  // Add one element at a time to the head of the chain
  head = new Element(3, head);
  head = new Element(5, head);
  head = new Element(9, head);
  head = new Element(8, head);

  // Display elements from head to tail
  for (Element* p = head; p; p = p->next)
    std::cout << p->data << ' ';
  std::cout << std::endl;

  // De-allocate memory one element at a time
  while (Element* p = head)
  {
    head = head->next;
    delete p;
  }
}
```

```
8 9 5 3
```

This list displays its elements naturally from head to tail; that is, in reverse order to that of their addition.

#### Removing Elements

To remove the first two elements from the head of the chain, we reset `head` to the address of the third element and de-allocate the memory used by the first two elements:

![Chain of Elements](/img/chain_r.png)

```cpp
// Linked Lists - Removing Elements from a Chain
// removeElement.cpp

#include <iostream>

struct Element
{
  int data;
  Element* next;
  Element(int d, Element* n) : data(d), next(n) {}
};

int main ()
{
  Element* head = nullptr;

  // Add one element at a time to the head of the list
  head = new Element(3, head);
  head = new Element(5, head);
  head = new Element(9, head);
  head = new Element(8, head);

  // Remove first two elements
  Element* remove = head;
  head = head->next;
  delete remove;

  remove = head;
  head = head->next;
  delete remove;

  // Display elements from head to tail
  for (Element* p = head; p; p = p->next)
    std::cout << p->data << ' ';
  std::cout << std::endl;

  // De-allocate one element at a time
  while (Element* p = head)
  {
    head = head->next;
    delete p;
  }
}
```

```
5 3
```

In this design, we can only remove the element at the head. First, we change the address of the head to that of the element pointed to by the element at the head. Then, we de-allocate the memory for the removed element.

### Nodes

A standard linked list uncouples the data structure from the data values themselves. The structure collects the objects through a system of _nodes_. Each node refers to a single object and holds at least one pointer to another node. Accessing a particular object in a list involves starting with the node for a known object and stepping through the list node by node.

Referring to the example above, let us uncouple each data value from the pointer to the next element. We do so by introducing a node for each element. The node contains the object and at least one pointer to another node. The object itself only holds the data value stored in the element.

![Node](/img/nodes.png)

For example,

```cpp
// Linked Lists - Nodes
// nodes.cpp

#include <iostream>

class Data
{
  int data;
public:
  Data(int d) : data(d) {}
  int out() const { return data;}
};

struct Node
{
  Data data;
  Node* next;
  Node (const Data& d, Node* n) : data(d), next(n) {}
};

int main ()
{
  Node* head = nullptr;

  // Add one nodes at a time to the head of the list
  head = new Node(3, head);
  head = new Node(5, head);
  head = new Node(9, head);
  head = new Node(8, head);

  // Remove the head node
  Node* remove = head;
  head = head->next;
  delete remove;

  // Display elements from head to tail
  for (Node* p = head; p; p = p->next)
    std::cout << p->data.out() << ' ';
  std::cout << std::endl;

  // De-allocate one node at a time
  while (Node* p = head)
  {
    head = head->next;
    delete p;
  }
}
```

```
9 5 3
```

The `Node` constructor passes the data to its `Data` subobject and stores the address of the next node in its pointer member. Both the `Data` object and the pointer are publicly accessible.

The `Data` object accepts information through its constructor and exposes that information through its `out()` query.

## Stack (optional for OOP345)

A _stack_ is a special kind of linked list in which each node adds to the head and removes from the head. In a stack, the last element in is the first element out (LIFO).

![Stack](/img/stack.png)

Let us redesign our Nodes example in the form of a `Stack` class. A `Stack` object adds a node to its head through a `push()` member function and removes a node from its head through a `pop()` member function.

```cpp
// Linked Lists - Stack
// stack.cpp

#include <iostream>

class Data
{
  int data;
public:
  Data(int d = 0) : data(d) {}
  int out() const { return data;}
};

struct Node
{
  Data data;
  Node* next;
  Node (const Data& d, Node* n) : data(d), next(n) {}
};

class Stack
{
  Node* head;
public:
  Stack() : head(nullptr) {}
  ~Stack()
  {
    while (Node* p = head)
    {
      head = head->next;
      delete p;
    }
  }

  void push(int d) { head = new Node (d, head);}

  Data pop()
  {
    Data data;
    if (head)
    {
      Node* p = head;
      data = head->data;
      head = head->next;
      delete p;
    }
    return data;
  }

  bool empty() { return head == nullptr;}
};

int main ()
{
  Stack s;

  // Push Data Onto Stack
  s.push(3);
  s.push(5);
  s.push(9);
  s.push(8);

  // Remove first Node
  s.pop();

  // Pop Data Off Stack
  while (!s.empty())
    std::cout << s.pop().out() << ' ';
  std::cout << std::endl;
}
```

```
9 5 3
```

The only instance variable in our `Stack` class is a pointer to the head node. Given the address of this node, we can locate any data value on the stack by progressing through the elements one by one.

Our `Stack` class completely hides its implementation details from the application itself.

## Queue (optional for OOP345)

A _queue_ is a special kind of linked list that adds nodes to the tail and remove nodes from the head. A queue operates on a first in, first out principle (FIFO).

![Queue](/img/queue.png)

Let us redesign our Nodes example in the form of a `Queue` class. Our `Queue` object adds a node to its head through a `push()` member function and removes a node from its tail through a `pop()` member function.

```cpp
// Linked Lists - Queue
// queue.cpp

#include <iostream>

class Data
{
  int data;
public:
  Data(int d = 0) : data(d) {}
  int out() const { return data;}
};

struct Node
{
  Data data;
  Node* next;
  Node (const Data& d, Node* n) : data(d), next(n) {}
};

class Queue
{
  Node* head;
  Node* tail;
public:
  Queue() : head(nullptr), tail(nullptr) {}
  ~Queue()
  {
    Node* current;
    while (current = head)
    {
      head = head->next;
      delete current;
    }
  }

  void push(int d)
  {
    Node* p = new Node(d, 0);
    if (head)
      tail->next = p;
    else
      head = p;
    tail = p;
  }

  Data pop()
  {
    Data data;
    if (head)
    {
      Node* p = head;
      data = head->data;
      head = head->next;
      delete p;
      if (!head)
      	tail = nullptr;
    }
    return data;
  }

  bool empty() { return head == nullptr;}
};

int main ()
{
  Queue q;

  // Push Data onto the Queue
  q.push(3);
  q.push(5);
  q.push(9);
  q.push(8);

  // Remove First Node
  q.pop();

  // Pop Data Off the Queue
  while (!q.empty())
    std::cout << q.pop().out() << ' ';
  std::cout << std::endl;
}
```

```
5 9 8
```

Our `Queue` class has two instance variables: a pointer to the head node and a pointer to the tail node.

A `Queue` object displays its data values from head to tail in the same order as it has added nodes.

## Exercises

- Read Wikipedia about [Linked Lists](https://en.wikipedia.org/wiki/Linked_list)
