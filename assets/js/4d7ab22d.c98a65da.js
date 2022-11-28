"use strict";(self.webpackChunkoop345=self.webpackChunkoop345||[]).push([[227],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return u}});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function d(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var r=a.createContext({}),s=function(e){var t=a.useContext(r),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},p=function(e){var t=s(e.components);return a.createElement(r.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},h=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,r=e.parentName,p=d(e,["components","mdxType","originalType","parentName"]),h=s(n),u=o,m=h["".concat(r,".").concat(u)]||h[u]||c[u]||i;return n?a.createElement(m,l(l({ref:t},p),{},{components:n})):a.createElement(m,l({ref:t},p))}));function u(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,l=new Array(i);l[0]=h;var d={};for(var r in t)hasOwnProperty.call(t,r)&&(d[r]=t[r]);d.originalType=e,d.mdxType="string"==typeof e?e:o,l[1]=d;for(var s=2;s<i;s++)l[s]=n[s];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}h.displayName="MDXCreateElement"},5566:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return d},contentTitle:function(){return r},metadata:function(){return s},toc:function(){return p},default:function(){return h}});var a=n(7462),o=n(3366),i=(n(7294),n(3905)),l=["components"],d={id:"linked-list-technology",title:"Linked List Technology",sidebar_position:5,description:"TBD"},r="Introduction to Linked Lists",s={unversionedId:"H-Deeper-Detail/linked-list-technology",id:"H-Deeper-Detail/linked-list-technology",isDocsHomePage:!1,title:"Linked List Technology",description:"TBD",source:"@site/docs/H-Deeper-Detail/linked-list-technology.md",sourceDirName:"H-Deeper-Detail",slug:"/H-Deeper-Detail/linked-list-technology",permalink:"/H-Deeper-Detail/linked-list-technology",editUrl:"https://github.com/Seneca-ICTOER/AdvOOP/tree/main/docs/H-Deeper-Detail/linked-list-technology.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{id:"linked-list-technology",title:"Linked List Technology",sidebar_position:5,description:"TBD"},sidebar:"courseNotesSidebar",previous:{title:"Bit-Wise Expressions",permalink:"/H-Deeper-Detail/bit-wise-expressions"},next:{title:"Other Topics",permalink:"/H-Deeper-Detail/other-topics"}},p=[{value:"The Concept of a Linked List",id:"the-concept-of-a-linked-list",children:[{value:"A Simple Chain of Objects",id:"a-simple-chain-of-objects",children:[{value:"Adding Objects",id:"adding-objects",children:[],level:4},{value:"Removing Elements",id:"removing-elements",children:[],level:4}],level:3},{value:"Nodes",id:"nodes",children:[],level:3}],level:2},{value:"Stack (optional for OOP345)",id:"stack-optional-for-oop345",children:[],level:2},{value:"Queue (optional for OOP345)",id:"queue-optional-for-oop345",children:[],level:2},{value:"Exercises",id:"exercises",children:[],level:2}],c={toc:p};function h(e){var t=e.components,d=(0,o.Z)(e,l);return(0,i.kt)("wrapper",(0,a.Z)({},c,d,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"introduction-to-linked-lists"},"Introduction to Linked Lists"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Introduce the concept of a linked list to represent a data structure"),(0,i.kt)("li",{parentName:"ul"},"Demonstrate linked list technology through a stack and a queue")),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},'"The Standard Template Library provides a set of well-structured generic components that work together in a seamless way." Stepanov and Lee (1995)')),(0,i.kt)("p",null,"The containers of the C++ Standard Template Library (STL) of C++ are designed using linked list technology.  Linked lists are the most common and versatile data structures in computer science."),(0,i.kt)("p",null,"This chapter introduces the concept of a linked list and illustrates it with two examples: a stack and a queue.  A stack is a last in first out (LIFO) list, like a stack of plates.  A queue is a first in first out (FIFO) list, like a lineup at a bus stop."),(0,i.kt)("h2",{id:"the-concept-of-a-linked-list"},"The Concept of a Linked List"),(0,i.kt)("p",null,"A linked list is a collection of objects of ",(0,i.kt)("strong",{parentName:"p"},"identical")," type with possibly different lifetimes.  A list implements this flexibility by allocating dynamic memory separately for each object and linking its objects together through pointers to adjacent objects in the list.  The objects are not necessarily stored contiguously in memory."),(0,i.kt)("p",null,"While an array, vector or queue is well suited for managing objects with identical lifetimes, a linked list is significantly more flexible: the list can change its size by discarding and inserting select objects within its interior."),(0,i.kt)("h3",{id:"a-simple-chain-of-objects"},"A Simple Chain of Objects"),(0,i.kt)("p",null,"The simplest way to build a dynamic chain of objects is to link each object to the next one in the list by address."),(0,i.kt)("h4",{id:"adding-objects"},"Adding Objects"),(0,i.kt)("p",null,"Consider a chain of elements that hold integer values.  Each element consists of a single int and a pointer to the next element in the chain.  The last element in the chain points to the ",(0,i.kt)("inlineCode",{parentName:"p"},"nullptr")," address.  We call the element furthest from the ",(0,i.kt)("inlineCode",{parentName:"p"},"nullptr")," address the ",(0,i.kt)("strong",{parentName:"p"},"head")," of the list and the element that points to the ",(0,i.kt)("inlineCode",{parentName:"p"},"nullptr")," address the ",(0,i.kt)("em",{parentName:"p"},"tail")," of the list.  We start with an empty chain and allocate memory one element at a time.  We add each new element to the head of the chain."),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Chain of Elements",src:n(6321).Z})),(0,i.kt)("p",null,"The following code implements this sequential allocation of memory.  We de-allocate elements in opposite order to that of construction:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-cpp"},"// Linked Lists - Adding Objects to a Chain\n// chain.cpp\n\n#include <iostream>\n\nstruct Element\n{\n  int data;\n  Element* next;\n  Element(int d, Element* n) : data(d), next(n) {}\n};\n\nint main ()\n{\n  Element* head = nullptr;\n\n  // Add one element at a time to the head of the chain\n  head = new Element(3, head);\n  head = new Element(5, head);\n  head = new Element(9, head);\n  head = new Element(8, head);\n\n  // Display elements from head to tail\n  for (Element* p = head; p; p = p->next)\n    std::cout << p->data << ' ';\n  std::cout << std::endl;\n\n  // De-allocate memory one element at a time\n  while (Element* p = head)\n  {\n    head = head->next;\n    delete p;\n  }\n}\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"8 9 5 3\n")),(0,i.kt)("p",null,"This list displays its elements naturally from head to tail; that is, in reverse order to that of their addition."),(0,i.kt)("h4",{id:"removing-elements"},"Removing Elements"),(0,i.kt)("p",null,"To remove the first two elements from the head of the chain, we reset ",(0,i.kt)("inlineCode",{parentName:"p"},"head")," to the address of the third element and de-allocate the memory used by the first two elements:"),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Chain of Elements",src:n(7703).Z})),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-cpp"},"// Linked Lists - Removing Elements from a Chain\n// removeElement.cpp\n\n#include <iostream>\n\nstruct Element\n{\n  int data;\n  Element* next;\n  Element(int d, Element* n) : data(d), next(n) {}\n};\n\nint main ()\n{\n  Element* head = nullptr;\n\n  // Add one element at a time to the head of the list\n  head = new Element(3, head);\n  head = new Element(5, head);\n  head = new Element(9, head);\n  head = new Element(8, head);\n\n  // Remove first two elements\n  Element* remove = head;\n  head = head->next;\n  delete remove;\n\n  remove = head;\n  head = head->next;\n  delete remove;\n\n  // Display elements from head to tail\n  for (Element* p = head; p; p = p->next)\n    std::cout << p->data << ' ';\n  std::cout << std::endl;\n\n  // De-allocate one element at a time\n  while (Element* p = head)\n  {\n    head = head->next;\n    delete p;\n  }\n}\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"5 3\n")),(0,i.kt)("p",null,"In this design, we can only remove the element at the head.  First, we change the address of the head to that of the element pointed to by the element at the head.  Then, we de-allocate the memory for the removed element."),(0,i.kt)("h3",{id:"nodes"},"Nodes"),(0,i.kt)("p",null,"A standard linked list uncouples the data structure from the data values themselves.  The structure collects the objects through a system of ",(0,i.kt)("em",{parentName:"p"},"nodes"),".  Each node refers to a single object and holds at least one pointer to another node.  Accessing a particular object in a list involves starting with the node for a known object and stepping through the list node by node."),(0,i.kt)("p",null,"Referring to the example above, let us uncouple each data value from the pointer to the next element.  We do so by introducing a node for each element.  The node contains the object and at least one pointer to another node.  The object itself only holds the data value stored in the element."),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Node",src:n(1311).Z})),(0,i.kt)("p",null,"For example,"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-cpp"},"// Linked Lists - Nodes\n// nodes.cpp\n\n#include <iostream>\n\nclass Data\n{\n  int data;\npublic:\n  Data(int d) : data(d) {}\n  int out() const { return data;}\n};\n\nstruct Node\n{\n  Data data;\n  Node* next;\n  Node (const Data& d, Node* n) : data(d), next(n) {}\n};\n\nint main ()\n{\n  Node* head = nullptr;\n\n  // Add one nodes at a time to the head of the list\n  head = new Node(3, head);\n  head = new Node(5, head);\n  head = new Node(9, head);\n  head = new Node(8, head);\n\n  // Remove the head node\n  Node* remove = head;\n  head = head->next;\n  delete remove;\n\n  // Display elements from head to tail\n  for (Node* p = head; p; p = p->next)\n    std::cout << p->data.out() << ' ';\n  std::cout << std::endl;\n\n  // De-allocate one node at a time\n  while (Node* p = head)\n  {\n    head = head->next;\n    delete p;\n  }\n}\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"9 5 3\n")),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"Node")," constructor passes the data to its ",(0,i.kt)("inlineCode",{parentName:"p"},"Data")," subobject and stores the address of the next node in its pointer member.  Both the ",(0,i.kt)("inlineCode",{parentName:"p"},"Data")," object and the pointer are publicly accessible."),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"Data")," object accepts information through its constructor and exposes that information through its ",(0,i.kt)("inlineCode",{parentName:"p"},"out()")," query."),(0,i.kt)("h2",{id:"stack-optional-for-oop345"},"Stack (optional for OOP345)"),(0,i.kt)("p",null,"A ",(0,i.kt)("em",{parentName:"p"},"stack")," is a special kind of linked list in which each node adds to the head and removes from the head.  In a stack, the last element in is the first element out (LIFO)."),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Stack",src:n(967).Z})),(0,i.kt)("p",null,"Let us redesign our Nodes example in the form of a ",(0,i.kt)("inlineCode",{parentName:"p"},"Stack")," class.  A ",(0,i.kt)("inlineCode",{parentName:"p"},"Stack")," object adds a node to its head through a ",(0,i.kt)("inlineCode",{parentName:"p"},"push()")," member function and removes a node from its head through a ",(0,i.kt)("inlineCode",{parentName:"p"},"pop()")," member function."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-cpp"},"// Linked Lists - Stack\n// stack.cpp\n\n#include <iostream>\n\nclass Data\n{\n  int data;\npublic:\n  Data(int d = 0) : data(d) {}\n  int out() const { return data;}\n};\n\nstruct Node\n{\n  Data data;\n  Node* next;\n  Node (const Data& d, Node* n) : data(d), next(n) {}\n};\n\nclass Stack\n{\n  Node* head;\npublic:\n  Stack() : head(nullptr) {}\n  ~Stack()\n  {\n    while (Node* p = head)\n    {\n      head = head->next;\n      delete p;\n    }\n  }\n\n  void push(int d) { head = new Node (d, head);}\n\n  Data pop()\n  {\n    Data data;\n    if (head)\n    {\n      Node* p = head;\n      data = head->data;\n      head = head->next;\n      delete p;\n    }\n    return data;\n  }\n\n  bool empty() { return head == nullptr;}\n};\n\nint main ()\n{\n  Stack s;\n\n  // Push Data Onto Stack\n  s.push(3);\n  s.push(5);\n  s.push(9);\n  s.push(8);\n\n  // Remove first Node\n  s.pop();\n\n  // Pop Data Off Stack\n  while (!s.empty())\n    std::cout << s.pop().out() << ' ';\n  std::cout << std::endl;\n}\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"9 5 3\n")),(0,i.kt)("p",null,"The only instance variable in our ",(0,i.kt)("inlineCode",{parentName:"p"},"Stack")," class is a pointer to the head node.  Given the address of this node, we can locate any data value on the stack by progressing through the elements one by one."),(0,i.kt)("p",null,"Our ",(0,i.kt)("inlineCode",{parentName:"p"},"Stack")," class completely hides its implementation details from the application itself."),(0,i.kt)("h2",{id:"queue-optional-for-oop345"},"Queue (optional for OOP345)"),(0,i.kt)("p",null,"A ",(0,i.kt)("em",{parentName:"p"},"queue")," is a special kind of linked list that adds nodes to the tail and remove nodes from the head.  A queue operates on a first in, first out principle (FIFO)."),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Queue",src:n(9272).Z})),(0,i.kt)("p",null,"Let us redesign our Nodes example in the form of a ",(0,i.kt)("inlineCode",{parentName:"p"},"Queue")," class.  Our ",(0,i.kt)("inlineCode",{parentName:"p"},"Queue")," object adds a node to its head through a ",(0,i.kt)("inlineCode",{parentName:"p"},"push()")," member function and removes a node from its tail through a ",(0,i.kt)("inlineCode",{parentName:"p"},"pop()")," member function."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-cpp"},"// Linked Lists - Queue\n// queue.cpp\n\n#include <iostream>\n\nclass Data\n{\n  int data;\npublic:\n  Data(int d = 0) : data(d) {}\n  int out() const { return data;}\n};\n\nstruct Node\n{\n  Data data;\n  Node* next;\n  Node (const Data& d, Node* n) : data(d), next(n) {}\n};\n\nclass Queue\n{\n  Node* head;\n  Node* tail;\npublic:\n  Queue() : head(nullptr), tail(nullptr) {}\n  ~Queue()\n  {\n    Node* current;\n    while (current = head)\n    {\n      head = head->next;\n      delete current;\n    }\n  }\n\n  void push(int d)\n  {\n    Node* p = new Node(d, 0);\n    if (head)\n      tail->next = p;\n    else\n      head = p;\n    tail = p;\n  }\n\n  Data pop()\n  {\n    Data data;\n    if (head)\n    {\n      Node* p = head;\n      data = head->data;\n      head = head->next;\n      delete p;\n      if (!head)\n        tail = nullptr;\n    }\n    return data;\n  }\n\n  bool empty() { return head == nullptr;}\n};\n\nint main ()\n{\n  Queue q;\n\n  // Push Data onto the Queue\n  q.push(3);\n  q.push(5);\n  q.push(9);\n  q.push(8);\n\n  // Remove First Node\n  q.pop();\n\n  // Pop Data Off the Queue\n  while (!q.empty())\n    std::cout << q.pop().out() << ' ';\n  std::cout << std::endl;\n}\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"5 9 8\n")),(0,i.kt)("p",null,"Our ",(0,i.kt)("inlineCode",{parentName:"p"},"Queue")," class has two instance variables: a pointer to the head node and a pointer to the tail node."),(0,i.kt)("p",null,"A ",(0,i.kt)("inlineCode",{parentName:"p"},"Queue")," object displays its data values from head to tail in the same order as it has added nodes."),(0,i.kt)("h2",{id:"exercises"},"Exercises"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Read Wikipedia about ",(0,i.kt)("a",{parentName:"li",href:"https://en.wikipedia.org/wiki/Linked_list"},"Linked Lists"))))}h.isMDXComponent=!0},6321:function(e,t,n){t.Z=n.p+"assets/images/chain-f06a6a86627e423f3b57545f46fd0d19.png"},7703:function(e,t,n){t.Z=n.p+"assets/images/chain_r-aa4a4faf72e9ce98080fe977a325735c.png"},1311:function(e,t){t.Z="data:image/png;base64,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"},9272:function(e,t,n){t.Z=n.p+"assets/images/queue-63c241a91c08066e4f1f17a2a4aecd87.png"},967:function(e,t,n){t.Z=n.p+"assets/images/stack-955372f70b57b75d39e7f678a6661c1f.png"}}]);