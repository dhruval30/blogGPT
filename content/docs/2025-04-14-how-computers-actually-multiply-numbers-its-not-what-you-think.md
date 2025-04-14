---
id: how-computers-actually-multiply-numbers-its-not-what-you-think
title: How Computers Actually Multiply Numbers (It's Not What You Think)
description: LLM-generated CS blog lesson on How Computers Actually Multiply Numbers (It's Not What You Think).
sidebar_position: 1
tags: [binary, bits, multiplication]
date: 2025-04-14
---

# How Computers Actually Multiply Numbers (It's Not What You Think)
===========================================================

## Introduction to the Magic
-----------------------------

When you multiply two numbers together in your favorite programming language, you probably don't think twice about what's happening under the hood. I mean, `2 * 3` is just `6`, right? **But have you ever stopped to consider how the computer actually performs this operation?** It's not just a simple matter of recalling a multiplication table - there's some seriously cool computer science at play here.

## Bits and Binary: The Basics
-----------------------------

Before we dive into the world of multiplication, let's take a quick look at how computers represent numbers in the first place. **It's all about bits, baby!** In binary, each digit (or bit) can be either a `0` or a `1`. This means that every number can be represented as a series of bits - for example, the number `5` is `101` in binary.

```python
# Let's take a look at how this works in Python
def binary_representation(n):
    return bin(n)[2:]  # [2:] is used to remove the '0b' prefix

print(binary_representation(5))  # Output: 101
```

## The Multiplication Algorithm
---------------------------

So, how do computers actually multiply two numbers together? **It's not as simple as just "knowing" the answer**. Instead, computers use a combination of **bit shifting** and **addition** to calculate the result.

Here's a high-level overview of the process:

1. **Take the two numbers to be multiplied** (let's call them `a` and `b`)
2. **Initialize a result variable to 0** (let's call this `result`)
3. **For each bit in `b`**:
	* **If the bit is 1**, **add `a` shifted by the current bit position to `result`**
	* **Shift `a` one bit to the left** (this effectively multiplies `a` by 2)
4. **Return `result`**

```python
def multiply(a, b):
    result = 0
    for i, bit in enumerate(bin(b)[2:][::-1]):
        if bit == '1':
            result += a << i  # << is the left shift operator
    return result

print(multiply(2, 3))  # Output: 6
```

## Example Use Cases
-------------------

But what about **real-world applications**? When would you actually need to implement a multiplication algorithm from scratch? **Well, here are a few examples**:

* **Embedded systems**: In some cases, you may be working with a microcontroller that doesn't have a built-in multiplication instruction. In this case, you'd need to implement your own multiplication algorithm.
* **Cryptography**: Some cryptographic algorithms rely on multiplication in finite fields. Implementing a custom multiplication algorithm can be useful in these cases.
* **Educational purposes**: Let's be real - implementing a multiplication algorithm from scratch is a great way to learn about computer science and binary arithmetic.

## Conclusion: The Magic Revealed
---------------------------------

And there you have it - a look behind the curtain at how computers actually multiply numbers. **It's not magic, it's just bits and binary**. By using a combination of bit shifting and addition, computers can efficiently calculate the result of two numbers multiplied together. So next time you write `2 * 3` in your code, remember the cool computer science that's happening behind the scenes.
