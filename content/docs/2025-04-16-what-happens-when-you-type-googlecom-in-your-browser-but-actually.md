---
id: what-happens-when-you-type-googlecom-in-your-browser-but-actually
title: What Happens When You Type 'google.com' in Your Browser? (But Actually)
description: LLM-generated CS blog lesson on What Happens When You Type 'google.com' in Your Browser? (But Actually).
sidebar_position: 1
tags: [networking, dns, http]
date: 2025-04-16
---

# What Happens When You Type 'google.com' in Your Browser? (But Actually)
====================================================================

### The Journey Begins
When you type `google.com` into your browser's address bar, it's like sending a message to a friend who lives on the other side of the world. But instead of using snail mail or a messaging app, your browser uses a complex network of systems to deliver that message. In this post, we'll dive into the fascinating world of **computer networking** and explore what happens when you type `google.com` into your browser.

## The DNS: Your Browser's GPS
--------------------------------

Before your browser can even think about loading Google's website, it needs to figure out where Google's servers are located. This is where the **Domain Name System (DNS)** comes in – think of it like a GPS for your browser. The DNS is a massive database that maps domain names like `google.com` to IP addresses like `216.58.194.174`.

Here's a simplified example of how the DNS works:
```python
# DNS lookup example
import socket

def dns_lookup(domain):
    try:
        ip_address = socket.gethostbyname(domain)
        return ip_address
    except socket.gaierror:
        return "DNS lookup failed"

domain = "google.com"
ip_address = dns_lookup(domain)
print(f"The IP address of {domain} is {ip_address}")
```
In this example, the `socket.gethostbyname()` function performs a DNS lookup for the specified domain name and returns the corresponding IP address.

### TCP Handshake: The Introduction
-------------------------------

Once your browser has the IP address of Google's server, it needs to establish a connection with that server. This is where the **Transmission Control Protocol (TCP)** comes in – think of it like a formal introduction between your browser and the server. The TCP handshake is a three-way process that involves:

1. **SYN (Synchronize)**: Your browser sends a SYN packet to the server to initiate the connection.
2. **SYN-ACK (Synchronize-Acknowledgment)**: The server responds with a SYN-ACK packet to acknowledge the connection request.
3. **ACK (Acknowledgment)**: Your browser sends an ACK packet to confirm the connection.

Here's an example of what the TCP handshake looks like:
```markdown
# TCP handshake example
Browser  -->  Server: SYN ( Seq=0 )
Server  -->  Browser: SYN-ACK ( Seq=0, Ack=1 )
Browser  -->  Server: ACK ( Seq=1, Ack=1 )
```
This three-way handshake ensures that both your browser and the server are aware of the connection and are ready to exchange data.

## HTTP Request: The Message
---------------------------

Now that your browser has established a connection with Google's server, it's time to send an **HTTP request**. The HTTP request is like a message that your browser sends to the server, asking it to retrieve the Google homepage.

Here's an example of what the HTTP request might look like:
```http
GET / HTTP/1.1
Host: google.com
Accept: text/html
User-Agent: Mozilla/5.0
```
In this example, the `GET` method is used to request the root URL (`/`) of the `google.com` domain. The `Host` header specifies the domain name, and the `Accept` header specifies the type of content that your browser can handle.

### The Response: The Answer
---------------------------

After your browser sends the HTTP request, the server processes it and sends an **HTTP response** back to your browser. The HTTP response is like an answer to your browser's question, containing the HTML code for the Google homepage.

Here's an example of what the HTTP response might look like:
```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234

<!-- HTML code for the Google homepage -->
```
In this example, the `200 OK` status code indicates that the request was successful, and the `Content-Type` header specifies that the response body contains HTML code. The `Content-Length` header specifies the length of the response body.

## The Browser's Rendering Engine
----------------------------------

Finally, your browser receives the HTTP response and uses its **rendering engine** to display the Google homepage. The rendering engine is like a master builder that takes the HTML code and constructs a visual representation of the webpage.

Here's a simplified example of how the rendering engine works:
```javascript
// Rendering engine example
function renderHtml(htmlCode) {
  // Parse the HTML code
  const parser = new HtmlParser();
  const document = parser.parse(htmlCode);

  // Apply styles and layouts
  const styles = applyStyles(document);
  const layout = applyLayouts(document, styles);

  // Paint the webpage
  paintWebpage(layout);
}

renderHtml(htmlCode);
```
In this example, the `renderHtml()` function takes the HTML code as input and uses a parser to construct a document object model (DOM). The function then applies styles and layouts to the DOM, and finally paints the webpage using the computed layout.

### Conclusion
----------

And that's what happens when you type `google.com` into your browser! It's a complex process that involves DNS lookups, TCP handshakes, HTTP requests, and rendering engines. By understanding these concepts, you'll gain a deeper appreciation for the underlying technology that powers the web.

So next time you type a URL into your browser, remember the incredible journey that your browser takes to retrieve the webpage and display it to you. It's a remarkable process that involves many different systems and protocols working together in harmony.
