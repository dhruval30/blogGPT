import os
import json
from datetime import datetime
from pathlib import Path
from groq import Groq
import time

# === Setup Groq Client ===
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

# === Paths ===
CONTENT_PATH = Path("content")
DOCS_PATH = CONTENT_PATH / "docs"
BLOG_PATH = CONTENT_PATH / "blog"
PUBLIC_PATH = Path("public")
PUBLIC_POSTS_DIR = PUBLIC_PATH / "posts"
PUBLIC_DOCS_DIR = PUBLIC_PATH / "docs"
POSTS_JSON_PATH = PUBLIC_PATH / "posts.json"
DOCS_JSON_PATH = PUBLIC_PATH / "docs.json"
AUTHOR_ID = "dhruval"

# === Better Blog-Worthy CS Prompts ===
def generate_cs_topic():
    prompt = """
I'm creating a technical blog series for computer science students and developers.

Generate ONE short and original blog post title that meets the following criteria:
- Slightly cool and engaging, without sounding forced or overly casual
- Clear and informative, explaining a fundamental computer science concept accessibly
- Keep the title concise — ideally under 15 words
- Do not repeat common ideas like recursion, binary search, or "what happens when you type..."

Return only the title as plain text. Dont enclose it in quotes, no formatting, no extra explanation.

the topic is: schrodingers cat and what it is really.


"""


    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            stream=False,
        )
        content = response.choices[0].message.content.strip()
        
        # Clean the response - ensure we just get a plain string
        if content.startswith('"') and content.endswith('"'):
            content = content[1:-1]
        elif content.startswith('{') and content.endswith('}'):
            # Try to extract just the title string from JSON
            try:
                content_obj = json.loads(content)
                if isinstance(content_obj, dict) and len(content_obj) > 0:
                    # Take the first value if it's a dictionary
                    content = list(content_obj.values())[0]
            except:
                # If JSON parsing fails, just strip braces
                content = content.strip('{}').strip('"').strip()
                
        return content
    except Exception as e:
        print(f"Error generating topic: {e}")
        return "Exploring Esoteric CS Concepts at 3AM"  # Fallback title

def create_directories():
    """Create necessary directories if they don't exist."""
    for path in [DOCS_PATH, BLOG_PATH, PUBLIC_PATH, PUBLIC_POSTS_DIR, PUBLIC_DOCS_DIR]:
        path.mkdir(parents=True, exist_ok=True)

def generate_slug(title):
    """Generate a URL-friendly slug from the title."""
    # More comprehensive sanitization
    slug = title.lower()
    replacements = {
        "'": "", "'": "", "'": "", "?": "", ",": "", ".": "",
        "(": "", ")": "", "—": "-", " ": "-", "{": "", "}": "",
        '"': "", """: "", """: "", ":": "", ";": "", "!": "",
        "[": "", "]": "", "/": "-", "\\": "-", "&": "and"
    }
    for old, new in replacements.items():
        slug = slug.replace(old, new)
    
    # Handle multiple consecutive hyphens
    while "--" in slug:
        slug = slug.replace("--", "-")
    
    # Trim hyphens from start and end
    return slug.strip("-")

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

        # Step 2: Generate tags
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
        try:
            tags = json.loads(tags_raw) if tags_raw.startswith("[") else ["cs"]
            tags = tags[:3]  # Limit to top 3 tags
        except:
            tags = ["cs", "programming", "tech"]

        return blog_markdown, tags

    except Exception as e:
        print(f"Error generating content or tags: {e}")
        return f"# {topic}\n\n*Placeholder content*", ["cs"]

def write_markdown_files(topic, blog_markdown, tags):
    """Write the markdown files to docs/ and blog/ directories."""
    today = datetime.now().strftime("%Y-%m-%d")
    slug = generate_slug(topic)
    
    # Content for docs/ directory
    doc_filename = DOCS_PATH / f"{today}-{slug}.md"
    doc_content = f"""---
id: {slug}
title: "{topic}"
description: LLM-generated CS blog lesson on {topic}.
sidebar_position: 1
tags: [{', '.join(tags)}]
date: {today}
---

{blog_markdown}
"""
    doc_filename.write_text(doc_content, encoding="utf-8")
    
    # Content for blog/ directory
    blog_filename = BLOG_PATH / f"{today}-{slug}-log.md"
    blog_content = f"""---
slug: {slug}-log
title: "{topic}"
authors: [{AUTHOR_ID}]
tags: [{', '.join(tags)}]
date: {today}
---

Here's today's drop from KnowGrow — and it's a good one.

**{topic}** dives deep into something every CS nerd should care about — in the nerdiest, coolest way possible.

🔗 [Read the full article](/docs/{slug})
"""
    blog_filename.write_text(blog_content, encoding="utf-8")
    
    return {
        "doc_path": str(doc_filename),
        "blog_path": str(blog_filename),
        "date": today,
        "slug": slug
    }

def update_posts_json(new_post_data):
    """Update posts.json with the new blog post."""
    # Read existing posts
    posts = []
    if POSTS_JSON_PATH.exists():
        try:
            with open(POSTS_JSON_PATH, "r", encoding="utf-8") as f:
                posts = json.load(f)
        except:
            posts = []
    
    # Add new post metadata
    slug = new_post_data["slug"]
    date = new_post_data["date"]
    
    # Read the blog file to get frontmatter
    blog_path = BLOG_PATH / f"{date}-{slug}-log.md"
    if blog_path.exists():
        with open(blog_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        # Extract frontmatter
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
                
                # Add only if not already in the list
                post_exists = False
                for i, existing_post in enumerate(posts):
                    if existing_post.get("slug") == post.get("slug"):
                        posts[i] = post  # Replace with updated version
                        post_exists = True
                        break
                
                if not post_exists:
                    posts.append(post)
    
    # Sort by date (newest first)
    posts.sort(key=lambda x: x.get("date", ""), reverse=True)
    
    # Write posts.json
    with open(POSTS_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(posts, f, indent=2)

def update_docs_json(new_post_data):
    """Update docs.json with the new doc."""
    # Read existing docs
    docs = []
    if DOCS_JSON_PATH.exists():
        try:
            with open(DOCS_JSON_PATH, "r", encoding="utf-8") as f:
                docs = json.load(f)
        except:
            docs = []
    
    # Add new doc metadata
    slug = new_post_data["slug"]
    date = new_post_data["date"]
    
    # Read the doc file to get frontmatter
    doc_path = DOCS_PATH / f"{date}-{slug}.md"
    if doc_path.exists():
        with open(doc_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        # Extract frontmatter
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
                
                doc["content"] = body[:500] + "..." if len(body) > 500 else body
                
                # Add only if not already in the list
                doc_exists = False
                for i, existing_doc in enumerate(docs):
                    if existing_doc.get("id") == doc.get("id"):
                        docs[i] = doc  # Replace with updated version
                        doc_exists = True
                        break
                
                if not doc_exists:
                    docs.append(doc)
    
    # Sort by sidebar_position or title
    docs.sort(key=lambda x: (x.get("sidebar_position", 999), x.get("title", "")))
    
    # Write docs.json
    with open(DOCS_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(docs, f, indent=2)

def create_individual_json_files(new_post_data):
    """Create individual JSON files for the new post/doc."""
    slug = new_post_data["slug"]
    date = new_post_data["date"]
    
    # Process blog post
    blog_path = BLOG_PATH / f"{date}-{slug}-log.md"
    if blog_path.exists():
        with open(blog_path, "r", encoding="utf-8") as f:
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
                
                # Save with -log suffix
                post_slug = post_data.get("slug", "")
                json_file = PUBLIC_POSTS_DIR / f"{post_slug}.json"
                with open(json_file, "w", encoding="utf-8") as f:
                    json.dump(post_data, f, indent=2)
                print(f"Created post JSON: {json_file}")
                
                # Also save without -log suffix
                if post_slug.endswith("-log"):
                    clean_slug = post_slug[:-4]
                    json_file = PUBLIC_POSTS_DIR / f"{clean_slug}.json"
                    with open(json_file, "w", encoding="utf-8") as f:
                        json.dump(post_data, f, indent=2)
                    print(f"Created post JSON (clean slug): {json_file}")
    
    # Process doc
    doc_path = DOCS_PATH / f"{date}-{slug}.md"
    if doc_path.exists():
        with open(doc_path, "r", encoding="utf-8") as f:
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
                
                # Save with original ID
                doc_id = doc_data.get("id", "")
                json_file = PUBLIC_DOCS_DIR / f"{doc_id}.json"
                with open(json_file, "w", encoding="utf-8") as f:
                    json.dump(doc_data, f, indent=2)
                print(f"Created doc JSON: {json_file}")
                
                # Save with -log suffix as well
                log_id = f"{doc_id}-log"
                json_file = PUBLIC_DOCS_DIR / f"{log_id}.json"
                with open(json_file, "w", encoding="utf-8") as f:
                    json.dump(doc_data, f, indent=2)
                print(f"Created doc JSON (with log suffix): {json_file}")
                
                # Save with date prefix
                full_id = doc_path.stem  # Gets filename without extension
                json_file = PUBLIC_DOCS_DIR / f"{full_id}.json"
                with open(json_file, "w", encoding="utf-8") as f:
                    json.dump(doc_data, f, indent=2)
                print(f"Created doc JSON (full ID): {json_file}")

def main():
    """Main function to generate and save content."""
    create_directories()
    
    # Generate a new blog topic
    print("Generating a fresh CS blog topic...")
    topic = generate_cs_topic()
    print(f"Selected topic: {topic}")
    
    # Generate content and tags
    print("Generating content and tags...")
    blog_markdown, tags = generate_content(topic)
    
    # Write markdown files
    print("Writing markdown files...")
    file_paths = write_markdown_files(topic, blog_markdown, tags)
    
    # Update JSON files
    print("Updating JSON indexes...")
    update_posts_json(file_paths)
    update_docs_json(file_paths)
    
    # Create individual JSON files
    print("Creating individual JSON files...")
    create_individual_json_files(file_paths)
    
    print(f"New lesson + blog generated for: {topic}")
    print(f"Doc: {file_paths['doc_path']}")
    print(f"Blog: {file_paths['blog_path']}")

if __name__ == "__main__":
    main()