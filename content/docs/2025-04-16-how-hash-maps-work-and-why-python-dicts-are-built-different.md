---
id: how-hash-maps-work-and-why-python-dicts-are-built-different
title: How Hash Maps Work (and Why Python Dicts Are Built Different)
description: LLM-generated CS blog lesson on How Hash Maps Work (and Why Python Dicts Are Built Different).
sidebar_position: 1
tags: [hash, python, dicts]
date: 2025-04-16
---

# How Hash Maps Work (and Why Python Dicts Are Built Different)
================================================================================

## Introduction to Hash Maps
Hash maps, also known as hash tables, are one of the most fundamental data structures in computer science. They're like the **Swiss Army knives** of data structures – versatile, efficient, and ridiculously useful. But have you ever wondered how they work under the hood? In this post, we'll dive into the fascinating world of hash maps and explore why Python's dictionaries are built a little differently.

### What's a Hash Map, Anyway?
A hash map is a data structure that stores **key-value pairs** in a way that allows for fast lookups, insertions, and deletions. It's like a phonebook where you can look up a person's phone number by their name. The "hash" part refers to the fact that we use a **hash function** to map the key (e.g., the person's name) to a specific location in memory where the corresponding value (e.g., the phone number) is stored.

## How Hash Maps Work
Here's a simplified overview of the hash map workflow:

1. **Key hashing**: When you insert a key-value pair into the hash map, the key is passed through a hash function that generates a **hash code**. This hash code is like a unique fingerprint for the key.
2. **Index calculation**: The hash code is then used to calculate an **index** into an array of **buckets**. Each bucket can hold multiple key-value pairs.
3. **Collision resolution**: If two keys hash to the same index (this is called a **collision**), the hash map uses a technique like **chaining** or **open addressing** to resolve the conflict.

### Example Code: A Simple Hash Map in Python
```python
class HashMap:
    def __init__(self):
        self.size = 10
        self.buckets = [[] for _ in range(self.size)]

    def _hash(self, key):
        return hash(key) % self.size

    def put(self, key, value):
        index = self._hash(key)
        bucket = self.buckets[index]
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                break
        else:
            bucket.append((key, value))

    def get(self, key):
        index = self._hash(key)
        bucket = self.buckets[index]
        for k, v in bucket:
            if k == key:
                return v
        return None

# Create a hash map and insert some key-value pairs
hash_map = HashMap()
hash_map.put("John", "123-456-7890")
hash_map.put("Jane", "987-654-3210")

# Retrieve a value by its key
print(hash_map.get("John"))  # Output: 123-456-7890
```

## Why Python Dictionaries Are Built Different
Python's dictionaries (which are implemented as hash maps) have some unique features that set them apart from other hash map implementations. For one, Python dictionaries use a technique called **open addressing** to resolve collisions, whereas many other hash maps use chaining.

### Open Addressing vs. Chaining
**Open addressing** works by probing other indices in the array until an empty slot is found. This can lead to **clustering**, where multiple collisions occur in the same region of the array. To mitigate this, Python dictionaries use a technique called **perturbative probing**, which helps to distribute the collisions more evenly.

**Chaining**, on the other hand, works by storing colliding key-value pairs in a linked list at the same index. This can lead to slower lookup times, especially for large datasets.

### Python's Dictionary Implementation
Python's dictionary implementation is highly optimized and uses a number of clever techniques to improve performance. For example, Python dictionaries use a **load factor** to determine when to resize the underlying array. When the load factor exceeds a certain threshold, the dictionary is resized to maintain a consistent level of performance.

### Example Code: Python's Dictionary Implementation
```python
import sys

# Create a Python dictionary
d = {"John": "123-456-7890", "Jane": "987-654-3210"}

# Print the dictionary's size and load factor
print(sys.getsizeof(d))  # Output: 240 (approximate size in bytes)
print(len(d))  # Output: 2 (number of key-value pairs)
```

## Conclusion
Hash maps are a fundamental data structure in computer science, and Python's dictionaries are a great example of how they can be implemented efficiently. By understanding how hash maps work and how Python's dictionaries are built differently, you can write more efficient and effective code. So next time you use a Python dictionary, remember that there's a lot of clever engineering going on under the hood!

**Additional Resources**

* [Python Dictionary Implementation](https://github.com/python/cpython/blob/main/Objects/dictobject.c)
* [Hash Map Tutorial](https://www.geeksforgeeks.org/hash-table-implementation-in-python/)
* [Open Addressing vs. Chaining](https://en.wikipedia.org/wiki/Hash_table#Open_addressing_vs._chaining)
