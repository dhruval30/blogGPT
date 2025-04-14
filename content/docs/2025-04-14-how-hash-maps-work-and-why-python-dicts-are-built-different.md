---
id: how-hash-maps-work-and-why-python-dicts-are-built-different
title: How Hash Maps Work (and Why Python Dicts Are Built Different)
description: LLM-generated CS blog lesson on How Hash Maps Work (and Why Python Dicts Are Built Different).
sidebar_position: 1
tags: [python, hash, dicts]
date: 2025-04-14
---

# How Hash Maps Work (and Why Python Dicts Are Built Different)
===========================================================

Hey fellow devs, have you ever wondered how those magical `dict`s in Python work their magic? You know, the ones that let you store and retrieve data in constant time, like a superpower? Well, today we're going to lift the lid on **hash maps**, the data structure behind the scenes, and explore why Python's `dict`s are built a little differently.

## What's a Hash Map, Anyway?
---------------------------

Imagine a librarian who uses a **super-smart cataloging system** to store and retrieve books in a massive library. When you give the librarian a book title, they use a special formula (the **hash function**) to determine the exact shelf where the book should be stored. This way, when you ask for a book, the librarian can quickly find it by applying the same formula and heading straight to the correct shelf.

In computer science, this librarian is like a **hash map**, a data structure that stores key-value pairs in a way that allows for lightning-fast lookups, insertions, and deletions. The **hash function** is the magic formula that maps each key to a specific **index** in an array, where the corresponding value is stored.

### A Simple Hash Map Example
-----------------------------

Here's a simple example of a hash map implemented in Python:
```python
class SimpleHashMap:
    def __init__(self):
        self.size = 10
        self.table = [[] for _ in range(self.size)]

    def _hash(self, key):
        return hash(key) % self.size

    def put(self, key, value):
        index = self._hash(key)
        for pair in self.table[index]:
            if pair[0] == key:
                pair[1] = value
                return
        self.table[index].append([key, value])

    def get(self, key):
        index = self._hash(key)
        for pair in self.table[index]:
            if pair[0] == key:
                return pair[1]
        return None
```
In this example, the `_hash` method uses the built-in `hash` function to generate a hash code for the key, and then applies the modulo operator to map it to an index in the `table` array.

## The Problem with Simple Hash Maps
-----------------------------------

So, why doesn't Python's `dict` use a simple hash map like the one above? Well, there are a few issues:

* **Collisions**: When two different keys hash to the same index, we get a collision. In our simple example, we handle collisions by storing multiple key-value pairs in the same index, but this leads to slower lookup times.
* **Resizing**: When the hash map grows or shrinks, we need to rehash all the existing key-value pairs to maintain the correct indexing.

## Python's Dict: A More Complex Hash Map
------------------------------------------

Python's `dict` uses a more complex hash map implementation that addresses these issues. Here are some key features:

* **Open addressing**: Python's `dict` uses open addressing, which means that when a collision occurs, it probes other indices in the table to find an empty slot.
* **Resizing**: Python's `dict` resizes the table dynamically, doubling its size when it reaches a certain load factor.
* **Custom hash functions**: Python's `dict` uses custom hash functions for different types of keys, such as strings, integers, and tuples.

### A Peek into Python's Dict Implementation
-----------------------------------------

Here's a simplified example of how Python's `dict` implementation might look:
```python
class PythonDict:
    def __init__(self):
        self.size = 8
        self.table = [None] * self.size
        self.load_factor = 0.66

    def _hash(self, key):
        # Custom hash function for different types of keys
        if isinstance(key, str):
            return self._string_hash(key)
        elif isinstance(key, int):
            return self._int_hash(key)
        else:
            raise TypeError("Unsupported key type")

    def _string_hash(self, key):
        # Simple string hash function
        return sum(ord(c) for c in key) % self.size

    def _int_hash(self, key):
        # Simple int hash function
        return key % self.size

    def put(self, key, value):
        index = self._hash(key)
        if self.table[index] is None:
            self.table[index] = [(key, value)]
        else:
            # Handle collisions using open addressing
            for i in range(self.size):
                index = (index + i) % self.size
                if self.table[index] is None:
                    self.table[index] = [(key, value)]
                    return
                elif self.table[index][0][0] == key:
                    self.table[index][0] = (key, value)
                    return
            # Resize the table if it's too full
            self._resize()

    def _resize(self):
        new_size = self.size * 2
        new_table = [None] * new_size
        for pair in self.table:
            if pair is not None:
                index = self._hash(pair[0][0]) % new_size
                if new_table[index] is None:
                    new_table[index] = [pair[0]]
                else:
                    new_table[index].append(pair[0])
        self.size = new_size
        self.table = new_table
```
This is a highly simplified example, but it should give you an idea of the extra complexity that goes into Python's `dict` implementation.

## Conclusion
----------

Hash maps are an incredibly powerful data structure that underlies many of the data structures we use in programming. By understanding how they work and the trade-offs involved, we can write more efficient and effective code. Python's `dict` implementation is a great example of how a well-designed hash map can make a huge difference in performance and usability.

So, next time you use a `dict` in Python, remember the clever librarian and the complex hash map implementation that's working behind the scenes to make your code faster and more efficient!
