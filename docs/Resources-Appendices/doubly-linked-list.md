---
id: doubly-linked-list
title: Doubly Linked List
sidebar_position: 2
description: TBD
---

# Doubly Linked List

- Implement a Doubly Linked List

> "Using a vector for small lists is almost always superior to using list." Sutter, Alexandruscu (2005)

A **doubly linked** list admits traversal from tail to head as well as from head to tail. It is not restricted to either front-end or back-end addition or removal. We may insert a node before or after any other node and remove any node in the list. This kind of list has a more complicated structure than a stack or a queue.

![Doubly Linked List](/img/doubly.png)

Consider the following example,

```cpp
// Algorithms - Doubly Linked List
// doubly.cpp

#include <iostream>
using namespace std;

class Data
{
    int data;
public:
    Data(int d = 0) : data(d) {}
    int out() const
    {
        return data;
    }
};

struct Node
{
    Data data;
    Node* next;
    Node* previous;
    Node (const Data& d, Node* n, Node* p) : data(d), next(n), previous(p) {}
};

class DLList
{
    Node* head;
    Node* tail;
    Node* current;
public:
    DLList() : head(NULL), tail(NULL), current(NULL) {}
    ~DLList()
    {
        while (current = head)
        {
            head = head->next;
            delete current;
        }
    }

    void goHead()
    {
        current = head;
    }

    void goNext()
    {
        if (current)
            current = current->next;
    }

    void remove()
    {
        if (current)
        {
            Node* p = current;
            if (current == head)
            {
                head = head->next;
            }
            else
            {
                current->next->previous = current->previous;
                current->previous->next = current->next;
                current = current->next;
            }
            delete p;
        }
    }

    bool end()
    {
        return !current;
    }

    Data get() const
    {
        return current ? current->data : Data();
    }

    void insertBefore(const Data& a)
    {
        if (current)
        {
            Node* p = new (nothrow) Node(a, current, current->previous);
            if (p)
            {
                if (current->previous)
                    current->previous->next = p;
                else
                    head = p;
                current->previous = p;
            }
        }
        else
        {
            Node* p = new (nothrow) Node(a, nullptr, nullptr);
            if (p)
                head = tail = current = p;
        }
    }

    void insertAfter(const Data& a)
    {
        if (current)
        {
            Node* p = new (nothrow) Node(a, current->next, current);

            if (p)
            {
                if (current->next)
                    current->next->previous = p;
                else
                    tail = p;
                current->next = p;
            }
        }
        else
        {
            Node* p = new (nothrow) Node(a, nullptr, nullptr);
            if (p)
                head = tail = current = p;
        }
    }
};

int main ()
{
    DLList r;

    // Insert Data
    r.insertAfter(3);
    r.insertAfter(5);
    r.goHead();
    r.insertAfter(9);
    r.goNext();
    r.insertAfter(8);

    // Display Data
    r.goHead();
    while (!r.end())
    {
        cout << r.get().out() << ' ';
        r.goNext();
    }
    cout << endl;
}
```

```
3 9 8 5
```

The `DLList` class contains three instance pointers: a pointer to the head of the list, a pointer to the tail of the list and a pointer to the current element. Each node contains two instance pointers: a pointer to the previous node and a pointer to the next node.

The `DLList` object positions its current pointer through the `goHead()` and `goNext()` methods. We can add an element before or after the current one using the `insertBefore()` or `insertBefore()` methods and remove the current element using the `remove()` method. We can extract the data held in the current element through the `get()` query.
