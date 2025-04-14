import os
import random
import json
from datetime import datetime
from pathlib import Path
from groq import Groq
import time

# === Setup Groq Client ===
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# === Paths ===
CONTENT_PATH = Path("content")
DOCS_PATH = CONTENT_PATH / "docs"
BLOG_PATH = CONTENT_PATH / "blog"
PUBLIC_PATH = Path("public")
POSTS_JSON_PATH = PUBLIC_PATH / "posts.json"
DOCS_JSON_PATH = PUBLIC_PATH / "docs.json"
AUTHOR_ID = "dhruval"

# === Better Blog-Worthy CS Prompts ===
TOPIC_LIST = [
    "Why You're Probably Misunderstanding Recursion — And Why That's Okay",
    "Pointers in C Explained Like I'm Explaining to Myself at 2AM",
    "I Wrote My Own Shell in Python. Here's What I Broke (and Learned)",
    "What Happens When You Type 'google.com' in Your Browser? (But Actually)",
    "Stack Overflow Lied to Me: The Real Deal on Mutable Default Arguments in Python",
    "I Finally Understand Binary Search Trees. Here's the Mental Model That Helped",
    "Dijkstra's Algorithm Walkthrough: How I Visualized Shortest Paths While Walking My Dog",
    "Dynamic Programming Isn't Hard — Your Brain Just Wants to See It Differently",
    "How Hash Maps Work (and Why Python Dicts Are Built Different)",
    "Merge Sort Explained with IKEA Furniture",
    "What Is an API, Really? And Why I Built a Dumb One in Flask to Learn",
    "Understanding OAuth with Zero Buzzwords",
    "I Made a URL Shortener in 15 Lines of Code and Now I Think I'm a Backend Dev",
    "A Beginner's Guide to How Databases Actually Store Your Data",
    "How JavaScript Event Loop Works — with Vibes and Visuals",
    "What Is a Compiler and Why Does It Feel Like Wizardry?",
    "Memory Management for Humans Who Never Took OS 101",
    "How Computers Actually Multiply Numbers (It's Not What You Think)",
    "CPU Caches Explained with Grocery Shopping",
    "Process vs Thread Explained Using Bad Roommate Metaphors",
    "Big O Isn't Just a Buzzword. Here's Why You Should Care",
    "Turing Machines Explained with Whiteboards and Sharpies",
    "Lambda Calculus Is Just Functions. Here's the Fun Side.",
    "NP-Complete Problems Are the Weirdos of CS",
    "Regex is Black Magic — Until You Realize It's Just Finite State Machines",
    "How I Used AI to Teach Me Linked Lists (and It Worked)",
    "I Let GPT Refactor My Old Code. The Results Were... Unexpected",
    "Daily AI Lessons: Why I Genuinely Learn More This Way Than From YouTube",
    "The AI Said 'Use Tail Recursion'. I Panicked. Then I Understood.",
    "What Building a Self-Writing CS Website Taught Me About Control (And Letting Go)"
]

def create_directories():
    """Create necessary directories if they don't exist."""
    for path in [DOCS_PATH, BLOG_PATH, PUBLIC_PATH]:
        path.mkdir(parents=True, exist_ok=True)
    
    # Create subdirectories for individual JSON files
    public_posts_dir = PUBLIC_PATH / "posts"
    public_docs_dir = PUBLIC_PATH / "docs"
    public_posts_dir.mkdir(exist_ok=True)
    public_docs_dir.mkdir(exist_ok=True)

def generate_slug(title):
    """Generate a slug from the title."""
    return title.lower() \
        .replace("'", "") \
        .replace("'", "") \
        .replace("'", "") \
        .replace("?", "") \
        .replace(",", "") \
        .replace(".", "") \
        .replace("(", "") \
        .replace(")", "") \
        .replace("—", "-") \
        .replace(" ", "-")

def generate_content(topic):
    """Generate content and tags using Groq API."""
    blog_prompt = f"""
    Write a Markdown-formatted, Reddit-style technical blog post titled: "{topic}". 
    Make it fun, casual, and deeply educational. Teach real computer science concepts, 
    include code snippets, clever metaphors, and avoid sounding like a textbook. 
    Use section headings, bold text, and formatting that would feel at home on a cool dev blog.
    """

    try:
        # Step 1: Generate blog content
        blog_response = client.chat.completions.create(
            messages=[{"role": "user", "content": blog_prompt}],
            model="llama-3.3-70b-versatile",
            stream=False,
        )
        blog_markdown = blog_response.choices[0].message.content.strip()

        # Step 2: Now generate tags using that markdown
        tag_prompt = f"""
        Based on the following blog content, give 3 to 5 relevant tags.
        Tags should be lowercase, short, and one word each. Return only a JSON array like ["tag1", "tag2"].

        ---
        {blog_markdown}
        """

        tag_response = client.chat.completions.create(
            messages=[{"role": "user", "content": tag_prompt}],
            model="llama-3.3-70b-versatile",
            stream=False,
        )
        tags_raw = tag_response.choices[0].message.content.strip()

        # Parse tags safely
        tags = json.loads(tags_raw) if tags_raw.startswith("[") else ["cs"]
        tags = tags[:3]  # Limit to top 3 tags


        return blog_markdown, tags

    except Exception as e:
        print(f"Error generating content or tags: {e}")
        return f"# {topic}\n\n*Placeholder content*", ["cs"]


def write_markdown_files(topic, blog_markdown, tags):
    """Write the markdown files to docs/ and blog/."""
    today = datetime.now().strftime("%Y-%m-%d")
    slug = generate_slug(topic)
    
    # Content for docs/
    doc_filename = DOCS_PATH / f"{today}-{slug}.md"
    doc_content = f"""---
id: {slug}
title: {topic}
description: LLM-generated CS blog lesson on {topic}.
sidebar_position: 1
tags: [{', '.join(tags)}]
date: {today}
---

{blog_markdown}
"""
    doc_filename.write_text(doc_content, encoding="utf-8")
    
    # Content for blog/
    blog_filename = BLOG_PATH / f"{today}-{slug}-log.md"
    blog_content = f"""---
slug: {slug}-log
title: {topic}
authors: [{AUTHOR_ID}]
tags: [{', '.join(tags)}]
date: {today}
---

Here's today's drop from KnowGrow — and it's a good one.

**{topic}** dives deep into something every CS nerd should care about — in the nerdiest, coolest way possible.

🔗 [Read the full article](/docs/{today}-{slug})
"""
    blog_filename.write_text(blog_content, encoding="utf-8")
    
    return {
        "doc_path": str(doc_filename),
        "blog_path": str(blog_filename),
        "date": today,
        "slug": slug
    }

def update_json_indexes():
    """Update the JSON indexes for posts and docs."""
    # Generate posts.json
    posts = []
    for file_path in BLOG_PATH.glob("*.md"):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        # Simple frontmatter parsing
        if content.startswith("---"):
            frontmatter_end = content.find("---", 3)
            if frontmatter_end != -1:
                frontmatter = content[3:frontmatter_end].strip()
                body = content[frontmatter_end + 3:].strip()
                
                post = {}
                for line in frontmatter.split("\n"):
                    if ":" in line:
                        key, value = line.split(":", 1)
                        key = key.strip()
                        value = value.strip()
                        
                        # Handle special cases
                        if key == "tags":
                            # Convert "[tag1, tag2]" to ["tag1", "tag2"]
                            tags = value.strip("[]").replace(" ", "").split(",")
                            post[key] = tags
                        elif key == "authors":
                            # Convert "[author]" to ["author"]
                            authors = value.strip("[]").replace(" ", "").split(",")
                            post[key] = authors
                        else:
                            post[key] = value
                
                post["excerpt"] = body[:200] + "..." if len(body) > 200 else body
                posts.append(post)
    
    # Sort by date
    posts.sort(key=lambda x: x.get("date", ""), reverse=True)
    
    # Write posts.json
    with open(POSTS_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(posts, f, indent=2)
    
    # Similar process for docs.json
    docs = []
    for file_path in DOCS_PATH.glob("*.md"):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        if content.startswith("---"):
            frontmatter_end = content.find("---", 3)
            if frontmatter_end != -1:
                frontmatter = content[3:frontmatter_end].strip()
                body = content[frontmatter_end + 3:].strip()
                
                doc = {}
                for line in frontmatter.split("\n"):
                    if ":" in line:
                        key, value = line.split(":", 1)
                        key = key.strip()
                        value = value.strip()
                        
                        if key == "tags":
                            tags = value.strip("[]").replace(" ", "").split(",")
                            doc[key] = tags
                        elif key == "sidebar_position":
                            doc[key] = int(value)
                        else:
                            doc[key] = value
                
                doc["content"] = body
                docs.append(doc)
    
    # Sort docs by sidebar_position or title
    docs.sort(key=lambda x: (x.get("sidebar_position", 999), x.get("title", "")))
    
    # Write docs.json
    with open(DOCS_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(docs, f, indent=2)

def create_json_files():
    """Create individual JSON files for the React frontend."""
    public_posts_dir = PUBLIC_PATH / "posts"
    public_docs_dir = PUBLIC_PATH / "docs"
    
    # Ensure directories exist
    public_posts_dir.mkdir(exist_ok=True)
    public_docs_dir.mkdir(exist_ok=True)
    
    # Process blog posts
    for md_file in BLOG_PATH.glob("*.md"):
        with open(md_file, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Extract frontmatter
        if content.startswith("---"):
            frontmatter_end = content.find("---", 3)
            if frontmatter_end != -1:
                frontmatter = content[3:frontmatter_end].strip()
                body = content[frontmatter_end + 3:].strip()
                
                post_data = {}
                for line in frontmatter.split("\n"):
                    if ":" in line:
                        key, value = line.split(":", 1)
                        key = key.strip()
                        value = value.strip()
                        
                        if key == "tags":
                            tags = value.strip("[]").replace(" ", "").split(",")
                            post_data[key] = tags
                        elif key == "authors":
                            authors = value.strip("[]").replace(" ", "").split(",")
                            post_data[key] = authors
                        else:
                            post_data[key] = value
                
                post_data["content"] = body
                
                # Save to JSON file - both with and without -log suffix
                if "slug" in post_data:
                    slug = post_data["slug"]
                    
                    # Save with original slug
                    json_file = public_posts_dir / f"{slug}.json"
                    with open(json_file, "w", encoding="utf-8") as f:
                        json.dump(post_data, f, indent=2)
                    print(f"Created post JSON: {json_file}")
                    
                    # Also save with -log suffix removed if present
                    if slug.endswith("-log"):
                        clean_slug = slug[:-4]
                        json_file = public_posts_dir / f"{clean_slug}.json"
                        with open(json_file, "w", encoding="utf-8") as f:
                            json.dump(post_data, f, indent=2)
                        print(f"Created post JSON (clean slug): {json_file}")
    
    # Process docs (similar logic - create files with and without -log suffix)
    for md_file in DOCS_PATH.glob("*.md"):
        with open(md_file, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Extract frontmatter
        if content.startswith("---"):
            frontmatter_end = content.find("---", 3)
            if frontmatter_end != -1:
                frontmatter = content[3:frontmatter_end].strip()
                body = content[frontmatter_end + 3:].strip()
                
                doc_data = {}
                for line in frontmatter.split("\n"):
                    if ":" in line:
                        key, value = line.split(":", 1)
                        key = key.strip()
                        value = value.strip()
                        
                        if key == "tags":
                            tags = value.strip("[]").replace(" ", "").split(",")
                            doc_data[key] = tags
                        elif key == "sidebar_position":
                            doc_data[key] = int(value)
                        else:
                            doc_data[key] = value
                
                doc_data["content"] = body
                
                # Save to JSON file with ID
                if "id" in doc_data:
                    doc_id = doc_data["id"]
                    
                    # Save with original ID
                    json_file = public_docs_dir / f"{doc_id}.json"
                    with open(json_file, "w", encoding="utf-8") as f:
                        json.dump(doc_data, f, indent=2)
                    print(f"Created doc JSON: {json_file}")
                    
                    # Also save with -log suffix if not present (for backward compatibility)
                    if not doc_id.endswith("-log"):
                        log_id = f"{doc_id}-log"
                        json_file = public_docs_dir / f"{log_id}.json"
                        with open(json_file, "w", encoding="utf-8") as f:
                            json.dump(doc_data, f, indent=2)
                        print(f"Created doc JSON (with log suffix): {json_file}")
                    
                    # Save with the full filename as the ID too
                    full_id = md_file.stem  # Gets filename without extension
                    full_json_file = public_docs_dir / f"{full_id}.json"
                    with open(full_json_file, "w", encoding="utf-8") as f:
                        json.dump(doc_data, f, indent=2)
                    print(f"Created doc JSON (full ID): {full_json_file}")

def main():
    """Main function to generate and save content."""
    create_directories()
    
    # Pick topic for the day
    topic = random.choice(TOPIC_LIST)
    print(f"Selected topic: {topic}")
    
    # Generate content + tags using Groq
    print("Generating content and tags...")
    blog_markdown, tags = generate_content(topic)
    
    # Write markdown files (docs + blog)
    print("Writing markdown files...")
    file_paths = write_markdown_files(topic, blog_markdown, tags)
    
    # Update main index files (posts.json, docs.json)
    print("Updating JSON indexes...")
    update_json_indexes()
    
    # Create per-post and per-doc JSONs for React frontend
    print("Creating individual JSON files...")
    create_json_files()
    
    print(f"New lesson + blog generated for: {topic}")
    print(f"Doc: {file_paths['doc_path']}")
    print(f"Blog: {file_paths['blog_path']}")

if __name__ == "__main__":
    main()