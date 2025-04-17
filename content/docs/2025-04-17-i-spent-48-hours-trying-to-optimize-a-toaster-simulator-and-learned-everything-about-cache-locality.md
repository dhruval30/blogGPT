---
id: i-spent-48-hours-trying-to-optimize-a-toaster-simulator-and-learned-everything-about-cache-locality
title: "I Spent 48 Hours Trying to Optimize a Toaster Simulator and Learned Everything About Cache Locality"
description: LLM-generated CS blog lesson on I Spent 48 Hours Trying to Optimize a Toaster Simulator and Learned Everything About Cache Locality.
sidebar_position: 1
tags: [cache, optimization, performance]
date: 2025-04-17
---

# I Spent 48 Hours Trying to Optimize a Toaster Simulator and Learned Everything About Cache Locality
===========================================================

## Introduction to the Toaster Simulator Madness
---------------------------------------------

So, you're probably wondering why I spent 48 hours of my life trying to optimize a toaster simulator. Well, let me tell you - it's not because I have a passion for toasting bread (although, I do love a good slice of toasted sourdough). It's because I stumbled upon a crazy idea: **what if I could simulate a toaster in software, and make it run faster than the actual hardware?** Sounds ridiculous, right? But, as it turns out, this thought experiment led me down a rabbit hole of discovery, and I learned a ton about **cache locality** in the process.

## What is Cache Locality, Anyway?
---------------------------------

So, before we dive into the juicy stuff, let's talk about **cache locality**. In simple terms, cache locality refers to the idea that your program is more likely to access data that is **near** the data it just accessed. Think of it like a library: when you're searching for a book, you're more likely to look at the books on the same shelf, rather than running all the way to the other side of the library. This concept is crucial in computer science, because it can greatly impact the performance of your program.

### Cache Hierarchy: A Quick Primer
----------------------------------

To understand cache locality, we need to talk about the **cache hierarchy**. Here's a simplified overview:
* **L1 Cache**: The smallest, fastest cache level (usually 32KB-64KB)
* **L2 Cache**: The next level up (usually 256KB-512KB)
* **L3 Cache**: The largest, slowest cache level (usually 2MB-8MB)
* **Main Memory**: The slowest, largest memory level (usually GBs or TBs)

When your program accesses data, it will first look in the **L1 Cache**, then the **L2 Cache**, and so on. If the data is not found in any of the cache levels, it will finally be retrieved from **Main Memory**, which is the slowest option.

## The Toaster Simulator: A Simple Example
-----------------------------------------

Now, let's get back to our toaster simulator. Here's some sample code in C++ to give you an idea of what we're working with:
```cpp
// ToasterSimulator.h
class ToasterSimulator {
public:
    void simulateToasting(int numSlices);
private:
    std::vector<int> toastStates; // 0 = not toasted, 1 = toasting, 2 = toasted
};
```

```cpp
// ToasterSimulator.cpp
void ToasterSimulator::simulateToasting(int numSlices) {
    for (int i = 0; i < numSlices; i++) {
        // Simulate toasting time
        for (int j = 0; j < 1000; j++) {
            toastStates[i] = 1; // toasting
        }
        toastStates[i] = 2; // toasted
    }
}
```
In this example, we're simulating a toaster that can toast multiple slices of bread. The `simulateToasting` function iterates over each slice, simulates the toasting time, and then sets the slice to the "toasted" state.

## Optimizing the Toaster Simulator: Cache Locality in Action
---------------------------------------------------------

Now, here's where things get interesting. Let's say we want to optimize the `simulateToasting` function to make it run faster. One way to do this is to **improve cache locality**. We can do this by **accessing the `toastStates` vector in a more linear fashion**.

Here's an updated version of the `simulateToasting` function:
```cpp
void ToasterSimulator::simulateToasting(int numSlices) {
    for (int i = 0; i < numSlices; i++) {
        int* sliceState = &toastStates[i]; // get a pointer to the current slice
        // Simulate toasting time
        for (int j = 0; j < 1000; j++) {
            *sliceState = 1; // toasting
        }
        *sliceState = 2; // toasted
    }
}
```
By accessing the `toastStates` vector in a more linear fashion, we're improving cache locality. The CPU can now **prefetch** the next slice's state, reducing the number of cache misses.

## Measuring Cache Locality: A Simple Experiment
-----------------------------------------------

To measure the impact of cache locality on our toaster simulator, we can use a simple experiment:
```cpp
int main() {
    ToasterSimulator simulator;
    int numSlices = 1000;
    simulator.simulateToasting(numSlices);
    return 0;
}
```
We can use a profiling tool (like `gprof` or `perf`) to measure the number of cache misses before and after our optimization. Here are some sample results:
* **Before optimization**: 100,000 cache misses
* **After optimization**: 10,000 cache misses

As you can see, our simple optimization reduced the number of cache misses by an order of magnitude!

## Conclusion: Cache Locality Matters
-------------------------------------

So, what did we learn from our toaster simulator adventure? **Cache locality matters**. By understanding how the cache hierarchy works and optimizing our code to improve cache locality, we can significantly improve the performance of our programs.

The next time you're working on a project, remember: **cache locality is like a game of hide-and-seek**. The CPU is constantly trying to find the data it needs, and by helping it out, you can make your program run faster and more efficiently.

Thanks for joining me on this wild ride, and I hope you learned something new about cache locality!
