# Comprehensive Markdown Test

This document contains various Markdown features to test how they render.

## 1. Text Formatting & Colors

Here is **bold text**, *italic text*, and ~~strikethrough text~~.

You can also use raw HTML to add colors to your text:
- <span style="color: red; font-weight: bold;">Red & Bold</span>
- <span style="color: blue;">Blue text</span>
- <span style="color: #10b981;">Emerald green text</span>
- <mark style="background-color: #fef08a; padding: 2px 4px; border-radius: 4px;">Highlighted text</mark>

## 2. Headings

# Heading 1
## Heading 2
### Heading 3
#### Heading 4

## 3. Lists

**Unordered List:**
- Item 1
- Item 2
  - Subitem A
  - Subitem B

**Ordered List:**
1. First step
2. Second step
3. Third step

**Task List:**
- [x] Completed task
- [ ] Incomplete task
- [ ] Another incomplete task

## 4. Blockquotes

> This is a blockquote. It can be used to emphasize a point or quote someone.
> 
> It can also span multiple lines and contain other formatting like **bold**.

## 5. Tables

| Feature | Support | Description |
| :--- | :---: | :--- |
| **Tables** | ✅ | GFM tables are supported |
| **Colors** | ✅ | Via HTML tags |
| **Code** | ✅ | With syntax highlighting |

## 6. Code and Syntax Highlighting

Inline `code` looks like this.

And here is a multi-line code block with syntax highlighting:

```javascript
// A simple React component
import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-4 border rounded">
      <h3 style={{ color: "blue" }}>Count: {count}</h3>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  );
}
```

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(f"Fibonacci of 10 is {fibonacci(10)}")
```

## 7. Links and Images

[Link to Google](https://google.com)

Here is a sample image:
![Sample Image](https://dummyimage.com/600x400/3b82f6/ffffff.png&text=Sample+Image)

## 8. Horizontal Rule

Below is a horizontal rule:

---

End of test document.
