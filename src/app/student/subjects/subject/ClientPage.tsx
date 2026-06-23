"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fetchGAS } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubjectResourceCard } from "@/components/cards/SubjectResourceCard";
import {
  TrendingUp, TrendingDown, Layers, Target, Zap, Brain, FileText,
  ArrowRight, Clock, Book, ExternalLink, Globe, Activity, ShieldAlert, Send, BookOpen,
  Folder, FolderOpen, FileCode, Terminal, Play, CheckCircle, Calendar, Bug, Settings, Code,
  ChevronDown, ChevronRight, FileJson, Component, Palette, Monitor, Grid, MousePointer, Layout, Columns
} from "lucide-react";



// Theme Configuration lookup table used by fallback default and custom layouts
const THEME_MAP: Record<string, {
  bg: string;
  cardBg: string;
  borderClass: string;
  shadowClass: string;
  btnPrimary: string;
  btnGhost: string;
  titleHover: string;
  textHeading: string;
  textMuted: string;
  badge: string;
  pattern: string;
}> = {
  "ui programming": {
    bg: "bg-[#F8F9FC]",
    cardBg: "bg-white",
    borderClass: "border border-[#E5E7EB] rounded-xl",
    shadowClass: "shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all duration-300",
    btnPrimary: "bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg shadow-sm border border-[#7C3AED]/20 transition-all",
    btnGhost: "text-slate-700 hover:text-[#7C3AED] font-bold text-xs uppercase hover:bg-slate-50 border border-slate-200 hover:border-[#7C3AED]/35 rounded-xl px-4 py-2 transition-all inline-flex items-center bg-white/80 shadow-sm",
    titleHover: "group-hover:text-[#7C3AED]",
    textHeading: "text-[#111827] font-extrabold tracking-tight",
    textMuted: "text-[#6B7280] font-medium",
    badge: "bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20 rounded-full font-semibold",
    pattern: "ui-blueprint-grid"
  },

  //"python programming"

  "python programming": {
    bg: "bg-[#0C0A09]",
    cardBg: "bg-[#1C1917]",
    borderClass: "border-4 border-[#3776AB] rounded-none",
    shadowClass: "shadow-[8px_8px_0px_0px_#FFD43B] hover:shadow-[0px_0px_0px_0px_#FFD43B] hover:translate-x-2 hover:translate-y-2",
    btnPrimary: "bg-[#FFD43B] text-black hover:bg-[#FFD43B]/90 border-2 border-white rounded-none shadow-[4px_4px_0px_0px_#3776AB] active:shadow-none active:translate-x-1 active:translate-y-1",
    btnGhost: "text-[#FFD43B] font-black hover:bg-[#FFD43B]/10 rounded-none",
    titleHover: "group-hover:text-[#FFD43B]",
    textHeading: "text-[#FFD43B] font-mono uppercase tracking-widest",
    textMuted: "text-zinc-400 font-mono",
    badge: "bg-[#3776AB] text-white border-2 border-[#FFD43B] rounded-none font-mono",
    pattern: "python-matrix-terminal"
  }
};

const DEFAULT_THEME = {
  bg: "bg-[#f4f4f0]",
  cardBg: "bg-white",
  borderClass: "border-4 border-black rounded-none",
  shadowClass: "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2",
  btnPrimary: "bg-[#2dd4bf] text-black hover:bg-[#2dd4bf]/90 border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
  btnGhost: "text-black font-black hover:bg-zinc-200 border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all text-xs h-9 px-3 flex items-center bg-white",
  titleHover: "group-hover:text-primary",
  textHeading: "text-black font-black uppercase",
  textMuted: "text-zinc-700 font-medium",
  badge: "bg-zinc-200 text-black border-2 border-black rounded-none",
  pattern: ""
};

const PYTHON_WORKSPACE_TOPICS = [
  {
    id: "basics",
    title: "01 Basics",
    files: [
      {
        name: "hello_world.py",
        code: `# hello_world.py\nprint("Hello, World!")\nprint("Welcome to Python Programming!")\n`,
        output: ["Hello, World!", "Welcome to Python Programming!"]
      },
      {
        name: "variables.py",
        code: `# variables.py\nx = 5\ny = 10\ntotal = x + y\nprint(f"x is {x}")\nprint(f"y is {y}")\nprint(f"Sum is {total}")\n`,
        output: ["x is 5", "y is 10", "Sum is 15"]
      }
    ]
  },
  {
    id: "control_flow",
    title: "02 Control Flow",
    files: [
      {
        name: "decisions.py",
        code: `# decisions.py\nscore = 85\nif score >= 90:\n    grade = "A"\nelif score >= 80:\n    grade = "B"\nelse:\n    grade = "C"\nprint(f"Score: {score}")\nprint(f"Grade: {grade}")\n`,
        output: ["Score: 85", "Grade: B"]
      },
      {
        name: "loops.py",
        code: `# loops.py\nprint("Counting from 1 to 5:")\nfor i in [1, 2, 3, 4, 5]:\n    print(f"Number: {i}")\n`,
        output: ["Counting from 1 to 5:", "Number: 1", "Number: 2", "Number: 3", "Number: 4", "Number: 5"]
      }
    ]
  },
  {
    id: "data_structures",
    title: "03 Data Structures",
    files: [
      {
        name: "lists_demo.py",
        code: `# lists_demo.py\nfruits = ["apple", "banana", "cherry"]\nprint(f"My fruits: {fruits}")\nprint(f"First fruit: {fruits[0]}")\n`,
        output: ["My fruits: ['apple', 'banana', 'cherry']", "First fruit: apple"]
      },
      {
        name: "dicts_demo.py",
        code: `# dicts_demo.py\nstudent = {"name": "Alice", "age": 20}\nprint(f"Student Profile: {student}")\n`,
        output: ["Student Profile: {'name': 'Alice', 'age': 20}"]
      }
    ]
  },
  {
    id: "functions_oop",
    title: "04 Functions & OOP",
    files: [
      {
        name: "functions_demo.py",
        code: `# functions_demo.py\ndef add(a, b):\n    return a + b\n\nresult = add(7, 8)\nprint(f"7 + 8 = {result}")\n`,
        output: ["7 + 8 = 15"]
      },
      {
        name: "classes_demo.py",
        code: `# classes_demo.py\nclass Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        return "Woof!"\n\nmy_dog = Dog("Buddy")\nprint(f"{my_dog.name} says {my_dog.bark()}")\n`,
        output: ["Buddy says Woof!"]
      }
    ]
  }
];

const PYTHON_FALLBACK_MODULES = [
  {
    id: "id_3rqsb6a8n",
    moduleNo: 1,
    title: "Data Types and Data Structures in Python",
    hours: 4,
    co: "CO1Demonstrate Proficiency in Python Fundamentals",
    subtopics: [
      { id: "id_h03iisfyq", title: "Data Types in Python, Whitespace, Code Block Indentation, Comments, Variables, reserved key words, Naming conventions, Python’s built-in type" },
      { id: "id_w7k4u8j07", title: "Operators in Python, Basic built-in Math functions" },
      { id: "id_jootxqine", title: "Strings , format(), print(), type casting in python" },
      { id: "id_dbuxrnh7s", title: "Data Structures: Tuples, List, Dictionaries, Set, Arrays,Conversion of data structures methods" }
    ]
  },
  {
    id: "id_0w0xo2oy6",
    moduleNo: 2,
    title: "Decision Making and Functions in python",
    hours: 6,
    co: "CO2: Implement Core Data Structures and Control Flow",
    subtopics: [
      { id: "id_sub2_1", title: "If statement: if, if-else, elif, Nested if, pass statement" },
      { id: "id_sub2_2", title: "Repetition using While loop, for loop & range function, break, continue and pass statement" },
      { id: "id_sub2_3", title: "Defining a Function, Checking & Setting Parameters Types of arguments" },
      { id: "id_sub2_4", title: "Pass statement in function, Nested Functions, Scope of variables" },
      { id: "id_sub2_5", title: "Recursion, Lambda and Filter, Map, Shallow Copy, Deep Copy, Decorators" }
    ]
  },
  {
    id: "id_9tunlumba",
    moduleNo: 3,
    title: "Python exception and file handling",
    hours: 6,
    co: "CO2: Implement Core Data Structures and Control Flow",
    subtopics: [
      { id: "id_sub3_1", title: "Error, Types of error: Runtime error, compile type error, logical error, Exceptions Handling and Assertions" },
      { id: "id_sub3_2", title: "Types of Files in Python, Opening a File: File opening modes, Closing a File, Writing Text Files, Appending in Text Files" },
      { id: "id_sub3_3", title: "Working with Binary Files, File Exceptions" }
    ]
  },
  {
    id: "id_pbx0ox3nc",
    moduleNo: 4,
    title: "Pandas and Seaborn CO3: Analyze and Visualize Data",
    hours: 8,
    co: "CO3: Analyze and Visualize Data",
    subtopics: [
      { id: "id_sub4_1", title: "NumPy and Matplotlib: Summary of NumPy arrays,functions, applications, matplotlib plots and graphs" },
      { id: "id_sub4_2", title: "PANDAS: Series and Dataframes, read /write data frames from/to csv files, json files, excel files" },
      { id: "id_sub4_3", title: "Sorting and Searching: Sort by label, sort by value, Pattern Matching using regex" },
      { id: "id_sub4_4", title: "SEABORN: Intro and supported data types" },
      { id: "id_sub4_5", title: "Plots and Charts - I: Line, Bar, Box, Pair, Scatter,Histogram, Pie charts." },
      { id: "id_sub4_6", title: "Types of Plots - II: Regression, Density, Distribution" }
    ]
  },
  {
    id: "id_u9nlx750x",
    moduleNo: 5,
    title: "GUI design & Database Connectivity using Python",
    hours: 6,
    co: "CO4: Develop Basic Applications and Connectivity",
    subtopics: [
      { id: "id_sub5_1", title: "GUI Programming Toolkits, Creating GUI Widgets with Tkinter, Creating Layouts, Form Components, Dialog Boxes, Event creation" },
      { id: "id_sub5_2", title: "Types of Databases Used with Python, Mysql database Connectivity with Python, SQL Relational Databases" },
      { id: "id_sub5_3", title: "Socket Programming using Python" }
    ]
  }
];

const executePythonSim = (code: string): string[] => {
  const logs: string[] = [];
  const lines = code.split("\n");
  const variables: Record<string, any> = {};

  try {
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line || line.startsWith("#")) continue;

      // Basic support for print statements
      if (line.startsWith("print(") && line.endsWith(")")) {
        const content = line.substring(6, line.length - 1).trim();

        // Evaluate literal strings: "..." or '...'
        if ((content.startsWith('"') && content.endsWith('"')) || (content.startsWith("'") && content.endsWith("'"))) {
          logs.push(content.substring(1, content.length - 1));
        }
        // Evaluate f-strings: f"..." or f'...'
        else if (content.startsWith("f\"") || content.startsWith("f'")) {
          let fstr = content.substring(2, content.length - 1);
          const matches = fstr.match(/\{[^}]+\}/g);
          if (matches) {
            for (const match of matches) {
              const varName = match.substring(1, match.length - 1).trim();
              if (varName in variables) {
                fstr = fstr.replace(match, String(variables[varName]));
              } else {
                fstr = fstr.replace(match, `<NameError: name '${varName}' is not defined>`);
              }
            }
          }
          logs.push(fstr);
        }
        // Evaluate variables or math expression
        else {
          if (content in variables) {
            logs.push(String(variables[content]));
          } else {
            // Check if it is math
            try {
              let evalExpr = content;
              for (const varName in variables) {
                const regex = new RegExp('\\b' + varName + '\\b', 'g');
                evalExpr = evalExpr.replace(regex, String(variables[varName]));
              }
              if (/^[0-9+\-*\/().\s-]+$/.test(evalExpr)) {
                logs.push(String(eval(evalExpr)));
              } else {
                logs.push(content);
              }
            } catch {
              logs.push(`NameError: name '${content}' is not defined`);
            }
          }
        }
      }
      // Simple variable assignment: name = expression
      else if (line.includes("=") && !line.includes("==") && !line.startsWith("def ") && !line.startsWith("class ")) {
        const parts = line.split("=");
        const varName = parts[0].trim();
        const valueExpr = parts.slice(1).join("=").trim();

        if (/^[a-zA-Z_]\w*$/.test(varName)) {
          // If string literal
          if ((valueExpr.startsWith('"') && valueExpr.endsWith('"')) || (valueExpr.startsWith("'") && valueExpr.endsWith("'"))) {
            variables[varName] = valueExpr.substring(1, valueExpr.length - 1);
          }
          // If list or dict literal
          else if ((valueExpr.startsWith("[") && valueExpr.endsWith("]")) || (valueExpr.startsWith("{") && valueExpr.endsWith("}"))) {
            variables[varName] = valueExpr;
          }
          // If math or reference evaluation
          else {
            try {
              let evalExpr = valueExpr;
              for (const v in variables) {
                const regex = new RegExp('\\b' + v + '\\b', 'g');
                evalExpr = evalExpr.replace(regex, String(variables[v]));
              }
              if (/^[0-9+\-*\/().\s-]+$/.test(evalExpr)) {
                variables[varName] = eval(evalExpr);
              } else if (valueExpr in variables) {
                variables[varName] = variables[valueExpr];
              } else {
                variables[varName] = valueExpr;
              }
            } catch {
              variables[varName] = valueExpr;
            }
          }
        }
      }
    }
  } catch (err: any) {
    logs.push(`SyntaxError: Invalid syntax - \${err.message}`);
  }

  if (logs.length === 0) {
    logs.push("(Program executed successfully with no output)");
  }
  return logs;
};

// Pure helper functions for syntax highlighting and file content generation inside Python Development Studio
const getCodeSnippet = (fileName: string, modTitle: string) => {
  if (fileName.startsWith("test_")) {
    return `# test_${fileName.replace("test_", "")}
import unittest
from ${fileName.replace("test_", "").replace(".py", "")} import *

class TestFeatures(unittest.TestCase):
    def test_run(self):
        self.assertTrue(True)
        print("✓ All tests executed successfully")

if __name__ == "__main__":
    unittest.main()
`;
  }

  if (fileName.endsWith(".md")) {
    return `# ${modTitle}
    
Workspace Documentation for the current project.
Learn Python step by step inside a professional IDE interface.

- Interactive Exercises
- Unit Testing Suite
- Performance Analysis
- Debug Challenges
`;
  }

  const titleLower = modTitle.toLowerCase();
  if (titleLower.includes("fundamental") || titleLower.includes("syntax") || titleLower.includes("intro")) {
    return `# fundamentals.py
def greet_developer(name: str) -> None:
    print(f"Welcome to Python Development Studio, {name}!")
    
    # Let's write a loop to print tech skills
    skills = ["VS Code", "PyCharm", "GitHub", "Jupyter"]
    for skill in skills:
        print(f"Integrating workspace: {skill}")

greet_developer("Pythonista")
`;
  } else if (titleLower.includes("data structure") || titleLower.includes("list") || titleLower.includes("dict")) {
    return `# data_structures.py
from typing import List, Dict

def analyze_complexity() -> Dict[str, str]:
    # Professional data structures syntax
    modules = ["List", "Dictionary", "Tuple", "Set"]
    complexity = {mod: "O(1) average lookup" for mod in modules}
    return complexity

print(analyze_complexity())
`;
  } else if (titleLower.includes("function") || titleLower.includes("def")) {
    return `# functions.py
import math

# Use clean modern type hinting
def calculate_velocity(completion_rate: float, time_spent: int) -> float:
    """
    Calculate the developer velocity index.
    """
    if time_spent <= 0:
        return 0.0
    return math.sqrt(completion_rate) * 10.0 / time_spent

print(f"Velocity Index: {calculate_velocity(0.85, 4)}")
`;
  } else if (titleLower.includes("oop") || titleLower.includes("class") || titleLower.includes("object")) {
    return `# oop.py
class PythonStudio:
    def __init__(self, theme: str = "DevStudio"):
        self.theme = theme
        self.status = "Initializing Build..."

    def run_tests(self) -> bool:
        print(f"[{self.theme}] Running unit tests...")
        return True

studio = PythonStudio("GitHub Dark")
studio.run_tests()
`;
  } else if (titleLower.includes("file") || titleLower.includes("handling") || titleLower.includes("io")) {
    return `# file_handling.py
import json

def load_config(filepath: str) -> dict:
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"error": "Configuration file not found"}

print(load_config("workspace_settings.json"))
`;
  }

  return `# ${fileName}
def main():
    print("Welcome to Python Development Studio!")
    print("Happy coding!")

if __name__ == "__main__":
    main()
`;
};

const highlightPythonCode = (code: string) => {
  if (!code) return null;

  const keywords = new Set(["def", "class", "import", "from", "return", "in", "for", "if", "else", "elif", "try", "except", "with", "as", "and", "or", "not", "lambda", "async", "await", "yield", "pass", "None", "True", "False"]);
  const builtins = new Set(["print", "math", "open", "json", "len", "range", "str", "int", "float", "bool", "list", "dict", "set", "tuple", "calculate_velocity", "greet_developer", "analyze_complexity", "load_config", "run_tests", "__init__"]);
  const types = new Set(["str", "int", "float", "bool", "List", "Dict", "dict", "None", "True", "False"]);

  // Token regex matching: whitespace, comment, double-quoted str, single-quoted str, number, word, symbol
  const tokenRegex = /(\s+)|(#[^\n]*)|("[^"]*")|('[^']*')|(\b\d+(?:\.\d+)?\b)|(\b[a-zA-Z_]\w*\b)|([^\w\s#]+)/g;

  let match;
  const elements: React.ReactNode[] = [];
  let keyIndex = 0;

  tokenRegex.lastIndex = 0;
  let lastIndex = 0;

  while ((match = tokenRegex.exec(code)) !== null) {
    const [
      text,
      whitespace,
      comment,
      doubleStr,
      singleStr,
      number,
      word,
      symbol
    ] = match;

    if (match.index > lastIndex) {
      const unmatched = code.slice(lastIndex, match.index);
      elements.push(<span key={`unmatched-${keyIndex++}`}>{unmatched}</span>);
    }
    lastIndex = tokenRegex.lastIndex;

    if (whitespace) {
      elements.push(whitespace);
    } else if (comment) {
      elements.push(<span key={keyIndex++} className="text-[#6A9955] italic font-mono">{comment}</span>);
    } else if (doubleStr || singleStr) {
      elements.push(<span key={keyIndex++} className="text-[#A31515] font-mono">{doubleStr || singleStr}</span>);
    } else if (number) {
      elements.push(<span key={keyIndex++} className="text-[#098658] font-mono">{number}</span>);
    } else if (word) {
      if (keywords.has(word)) {
        elements.push(<span key={keyIndex++} className="text-[#0000FF] font-bold font-mono">{word}</span>);
      } else if (builtins.has(word)) {
        elements.push(<span key={keyIndex++} className="text-[#795E26] font-mono">{word}</span>);
      } else if (types.has(word)) {
        elements.push(<span key={keyIndex++} className="text-[#267F99] font-medium font-mono">{word}</span>);
      } else {
        elements.push(<span key={keyIndex++} className="text-slate-800 font-mono">{word}</span>);
      }
    } else if (symbol) {
      elements.push(<span key={keyIndex++} className="text-slate-600 font-medium font-mono">{symbol}</span>);
    }
  }

  if (lastIndex < code.length) {
    const trailing = code.slice(lastIndex);
    elements.push(<span key={`trailing-${keyIndex++}`}>{trailing}</span>);
  }

  return <>{elements}</>;
};

// Premium 3D Tilt Card with moving light glare reflection effect
const DesignStudioCard = ({ children, className = "", style = {}, isPremium = true, ...props }: any) => {
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPremium) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Glare position percentage tracking cursor
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setGlare({ x: glareX, y: glareY, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-all duration-300 ease-out rounded-[22px] ${className}`}
      style={{
        ...style
      }}
      {...props}
    >
      {isPremium && (
        <>
          {/* Subtle radial spotlight overlay following cursor */}
          <div
            className="absolute inset-0 pointer-events-none rounded-[22px] z-30 transition-opacity duration-300 ease-out"
            style={{
              background: `radial-gradient(circle 160px at ${glare.x}% ${glare.y}%, rgba(124, 58, 237, 0.06), transparent 80%)`,
              opacity: glare.opacity
            }}
          />
        </>
      )}
      {children}
    </div>
  );
};

export default function StudentDashboard() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId');

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeNode, setActiveNode] = useState<number | null>(0);
  const [tickerX, setTickerX] = useState(0);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState([
    { role: "assistant", content: "Executive Strategy Portal active. Quarterly targets prioritize Module 1 operational scalability. Proceed?" }
  ]);

  // Python Development Studio State
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({ "basics": true });
  const [fileCodes, setFileCodes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const topic of PYTHON_WORKSPACE_TOPICS) {
      for (const file of topic.files) {
        initial[file.name] = file.code;
      }
    }
    return initial;
  });
  const [activeFile, setActiveFile] = useState<{ name: string; folder: string; code: string }>({
    name: "hello_world.py",
    folder: "01 Basics",
    code: `# hello_world.py\nprint("Hello, World!")\nprint("Welcome to Python Programming!")\n`
  });
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "Process finished with exit code 0"
  ]);
  const [isTerminalRunning, setIsTerminalRunning] = useState(false);
  const [editorActiveTab, setEditorActiveTab] = useState("hello_world.py");
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const particleKeywords = ["def", "class", "import", "lambda", "async", "return", "from", "yield", "try", "except", "await"];
    const generated = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      word: particleKeywords[Math.floor(Math.random() * particleKeywords.length)],
      left: `${Math.random() * 95}%`,
      delay: `${Math.random() * 15}s`,
      duration: `${15 + Math.random() * 15}s`,
      fontSize: `${11 + Math.random() * 5}px`
    }));
    setParticles(generated);
  }, []);

  const runCodeInTerminal = (fileName: string) => {
    if (isTerminalRunning) return;
    setIsTerminalRunning(true);
    setTerminalLogs([`$ python ${fileName}`]);

    setTimeout(() => {
      setTerminalLogs(prev => [...prev, "[RUNNING] Initializing python interpreter...", `[COMPILE] Compiling ${fileName}...`]);
    }, 300);

    setTimeout(() => {
      let matchedFile: any = null;
      for (const topic of PYTHON_WORKSPACE_TOPICS) {
        for (const file of topic.files) {
          if (file.name === fileName && activeFile.code.trim() === file.code.trim()) {
            matchedFile = file;
            break;
          }
        }
      }

      let outputs: string[] = [];
      if (matchedFile) {
        outputs = matchedFile.output;
      } else {
        outputs = executePythonSim(activeFile.code);
      }

      setTerminalLogs(prev => [...prev, ...outputs]);
    }, 700);

    setTimeout(() => {
      setTerminalLogs(prev => [...prev, "", "Process finished with exit code 0"]);
      setIsTerminalRunning(false);
    }, 1200);
  };

  useEffect(() => {
    if (subjectId) {
      const loadDashboardData = async () => {
        try {
          const result = await fetchGAS("getStudentDashboard", {
            userId: "anonymous",
            subjectId: subjectId
          });
          setData(result);
        } catch (err) {
          console.error("Failed to load dashboard data", err);
        } finally {
          setLoading(false);
        }
      };
      loadDashboardData();
    }
  }, [subjectId]);

  // Live horizontal trading ticker animation loop for Digital Business
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerX((prev) => (prev <= -1000 ? 0 : prev - 0.75));
    }, 16);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E2E8F0] flex flex-col justify-center items-center font-mono text-zinc-800 space-y-4">
        <div className="w-12 h-12 border-4 border-t-[#6366F1] border-zinc-300 rounded-full animate-spin" />
        <p className="text-sm tracking-widest uppercase font-bold animate-pulse">Establishing Terminal Baseline...</p>
      </div>
    );
  }

  if (!data || !data.subject) {
    return (
      <div className="p-8 text-center text-[#F43F5E] font-bold border-4 border-[#F43F5E] bg-white max-w-xl mx-auto mt-20">
        CRITICAL FAILURE: INSTANCE CONNECT PATHWAY TERMINATED.
      </div>
    );
  }

  const { subject, modules, quizzesWithAttempts, flashcardDecks, mindmaps = [], subjectResources } = data;
  const activeModule = modules[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    const userMsg = aiInput;
    setAiMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setAiInput("");

    setTimeout(() => {
      setAiMessages(prev => [...prev, {
        role: "assistant",
        content: `Analyzing parameters for "${userMsg}". Recommended strategic vector: Maximize output structures across target key result zones.`
      }]);
    }, 800);
  };

  // Identify theme variants safely using lowercase checks
  const subjectNameLower = subject?.name?.toLowerCase() || "";
  const isDigitalBusiness = subjectNameLower.includes("digital business");
  const isUiProgramming = subjectNameLower.includes("ui programming");
  const isPythonProgramming = subjectNameLower.includes("python");

  const pythonModules = isPythonProgramming
    ? ((modules && modules.length > 0) ? modules : PYTHON_FALLBACK_MODULES)
    : [];

  // ==========================================
  // RENDER VARIANT A: DIGITAL BUSINESS & TRANSFORMATION (PREMIUM LIGHT THEME)
  // ==========================================
  if (isDigitalBusiness) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-20 relative overflow-hidden font-mono antialiased selection:bg-[#3b82f6]/10 selection:text-[#3b82f6]">
        {/* Main Background Image - Low Opacity for Light Theme */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.08]" style={{
          backgroundImage: `url('/graph.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }} />

        {/* Background Light Overlay for Depth */}
        <div className="absolute inset-0 pointer-events-none z-0 bg-[#F8FAFC]/90 backdrop-blur-[1px]" />

        {/* LIVE MARKET TICKER */}
        <div className="w-full bg-white text-slate-600 text-xs font-mono py-2.5 border-b border-slate-200 overflow-hidden relative z-50 flex shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <div className="bg-slate-50 border-r border-slate-200 text-[#2563eb] px-4 font-black uppercase tracking-widest absolute left-0 top-0 bottom-0 flex items-center z-50 backdrop-blur-md shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
            [ DATA FEED ]
          </div>
          <div className="flex whitespace-nowrap space-x-16 pl-48 shadow-inner" style={{ transform: `translateX(${tickerX}px)` }}>
            <span className="flex items-center gap-2">XP_EARNED: <span className="text-[#16a34a] font-black">+{(modules.length * 1250).toLocaleString()}</span> <TrendingUp className="w-4 h-4 text-[#16a34a]" /></span>
            <span className="flex items-center gap-2">CORP_STREAK: <span className="text-[#2563eb] font-black">14 DAYS</span></span>
            <span className="flex items-center gap-2">COMP_INDEX: <span className="text-[#16a34a] font-black">88.4%</span></span>
            <span className="flex items-center gap-2">MKT_SHARE: <span className="text-[#16a34a] font-black">▲ 24.2%</span></span>
            <span className="flex items-center gap-2">RISK_RATIO: <span className="text-[#dc2626] font-black">▼ 0.04%</span> <TrendingDown className="w-4 h-4 text-[#dc2626]" /></span>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-8 relative z-10">

          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-4 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-lg">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#16a34a] shadow-[0_0_4px_#16a34a]" />
                  <span className="w-2 h-2 rounded-full bg-[#2563eb] shadow-[0_0_4px_#2563eb]" />
                  <span className="w-2 h-2 rounded-full bg-[#dc2626] shadow-[0_0_4px_#dc2626]" />
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#2563eb] font-bold">Terminal Connection Active</span>
              </div>
              <h1 className="text-2xl font-black uppercase tracking-widest text-slate-800 mt-2 flex items-center gap-3 font-sans">
                {subject.name} <span className="text-[#2563eb] font-light">|</span> <span className="text-lg text-slate-500 font-mono">COMMAND CENTER</span>
              </h1>
            </div>
            <div className="bg-slate-50 p-1.5 border border-slate-200 flex items-center font-mono text-[10px] font-black text-[#2563eb] rounded-lg">
              <span className="px-3 py-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-ping" />
                SYSTEM: ONLINE
              </span>
            </div>
          </div>

          {/* KPI METRIC BAR */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {/* KPI 1 */}
            <div className="bg-white border border-slate-200/80 p-5 relative shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-lg group hover:border-[#2563eb]/60 transition-colors overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#16a34a]/5 rounded-full blur-2xl group-hover:bg-[#16a34a]/10 transition-colors pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <span className="text-[10px] uppercase tracking-widest font-mono text-[#2563eb]">Growth Index</span>
                <span className="text-[10px] font-mono font-black text-[#16a34a] bg-[#16a34a]/10 border border-[#16a34a]/30 px-1.5 py-0.5 flex items-center gap-1 rounded-md">
                  ▲ +12.4%
                </span>
              </div>
              <div className="text-3xl font-black text-slate-800 mt-3 font-sans tracking-tight relative z-10">
                94.82 <span className="text-xs font-bold text-slate-400 font-mono tracking-normal">PTS</span>
              </div>
              <div className="h-8 mt-4 w-full opacity-80 relative z-10">
                <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,15 L15,13 L30,17 L45,8 L60,11 L75,3 L90,6 L100,2" fill="none" stroke="#16a34a" strokeWidth="2" />
                  <path d="M0,20 L0,15 L15,13 L30,17 L45,8 L60,11 L75,3 L90,6 L100,2 L100,20 Z" fill="url(#grad-green-light)" />
                  <defs>
                    <linearGradient id="grad-green-light" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#16a34a" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="bg-white border border-slate-200/80 p-5 relative shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-lg group hover:border-[#2563eb]/60 transition-colors overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#2563eb]/5 rounded-full blur-2xl group-hover:bg-[#2563eb]/10 transition-colors pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <span className="text-[10px] uppercase tracking-widest font-mono text-[#2563eb]">Velocity</span>
                <span className="text-[10px] font-mono font-black text-[#2563eb] bg-[#2563eb]/10 border border-[#2563eb]/30 px-1.5 py-0.5 flex items-center gap-1 rounded-md">
                  OPTIMAL <Activity className="w-3 h-3" />
                </span>
              </div>
              <div className="text-3xl font-black text-slate-800 mt-3 font-sans tracking-tight relative z-10">
                4.8 <span className="text-xs font-bold text-slate-400 font-mono tracking-normal">HRS/WK</span>
              </div>
              <div className="h-8 mt-4 w-full opacity-80 relative z-10">
                <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,10 L20,12 L40,8 L60,14 L80,5 L100,2" fill="none" stroke="#2563eb" strokeWidth="2" />
                  <path d="M0,20 L0,10 L20,12 L40,8 L60,14 L80,5 L100,2 L100,20 Z" fill="url(#grad-blue-light)" />
                  <defs>
                    <linearGradient id="grad-blue-light" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* KPI 3 */}
            <div className="bg-white border border-slate-200/80 p-5 relative shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-lg group hover:border-[#2563eb]/60 transition-colors overflow-hidden">
              <div className="flex justify-between items-start relative z-10">
                <span className="text-[10px] uppercase tracking-widest font-mono text-[#2563eb]">Capital</span>
                <span className="text-[10px] font-mono font-black text-[#16a34a] bg-[#16a34a]/10 border border-[#16a34a]/30 px-1.5 py-0.5 rounded-md">
                  LIQUID
                </span>
              </div>
              <div className="text-3xl font-black text-slate-800 mt-3 font-sans tracking-tight relative z-10">
                {(modules.length * 400).toLocaleString()} <span className="text-xs font-bold text-slate-400 font-mono tracking-normal">XP</span>
              </div>
              <div className="h-2 bg-slate-100 border border-slate-200 mt-8 w-full rounded-full overflow-hidden relative z-10">
                <div className="h-full bg-[#16a34a]" style={{ width: "74%" }} />
              </div>
            </div>

            {/* KPI 4 */}
            <div className="bg-white border border-slate-200/80 p-5 relative shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-lg group hover:border-[#2563eb]/60 transition-colors overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#dc2626]/5 rounded-full blur-2xl group-hover:bg-[#dc2626]/10 transition-colors pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <span className="text-[10px] uppercase tracking-widest font-mono text-[#2563eb]">Risk Assessment</span>
                <span className="text-[10px] font-mono font-black text-[#dc2626] bg-[#dc2626]/10 border border-[#dc2626]/30 px-1.5 py-0.5 flex items-center gap-1 rounded-md">
                  ▼ MINIMAL <ShieldAlert className="w-3 h-3" />
                </span>
              </div>
              <div className="text-3xl font-black text-slate-800 mt-3 font-sans tracking-tight relative z-10">
                0.02% <span className="text-xs font-bold text-slate-400 font-mono tracking-normal">DEG</span>
              </div>
              <div className="h-2 bg-slate-100 border border-slate-200 mt-8 w-full rounded-full overflow-hidden relative z-10">
                <div className="h-full bg-[#dc2626]" style={{ width: "2%" }} />
              </div>
            </div>
          </div>

          {/* TWO COLUMN MATRIX CONTAINER */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT & CENTER COLUMN ACTIONS */}
            <div className="lg:col-span-2 space-y-6">

              {/* WORKFLOW ROADMAP PATH */}
              <div className="bg-white border border-slate-200/80 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-lg">
                <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#2563eb] flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#2563eb]" /> Corporate Architecture Map
                  </h3>
                  <span className="text-[10px] font-mono text-[#16a34a] border border-[#16a34a]/30 px-2 py-0.5 rounded-md bg-[#16a34a]/10">LIVE ROUTING</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative">
                  {modules.slice(0, 4).map((mod: any, index: number) => {
                    const isActive = activeNode === index;
                    return (
                      <div key={mod.id} className="relative group">
                        <button onClick={() => setActiveNode(index)} className={`w-full p-4 text-left border transition-all rounded-lg ${isActive ? "bg-blue-50/80 border-[#2563eb] text-[#2563eb] shadow-sm font-bold" : "bg-slate-50/50 border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"}`}>
                          <div className={`font-mono text-[10px] font-bold mb-1.5 ${isActive ? 'text-[#2563eb]' : 'text-slate-400'}`}>NODE 0{index + 1}</div>
                          <div className="font-bold text-xs font-sans uppercase tracking-widest line-clamp-2">{mod.title}</div>
                        </button>
                      </div>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  {activeNode !== null && modules[activeNode] && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 p-4 bg-slate-50 border border-slate-200 font-mono text-xs flex justify-between items-center rounded-lg shadow-inner">
                      <div>
                        <span className="text-[#2563eb] font-black uppercase tracking-widest block text-[10px] mb-1">TARGET OBJECTIVE //</span>
                        <p className="text-slate-700 font-bold font-sans text-sm">{modules[activeNode].title}</p>
                      </div>
                      <Link href={`/student/subjects/subject/modules/item?subjectId=${subjectId}&id=${modules[activeNode].id}`}>
                        <Button className="bg-transparent hover:bg-[#2563eb]/10 border border-[#2563eb] text-[#2563eb] text-[10px] font-mono tracking-widest rounded-lg uppercase transition-all shadow-sm">Execute →</Button>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* MODULES AS ANALYTICS WIDGETS */}
              <div className="bg-white border border-slate-200/80 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-lg">
                <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                  <h2 className="text-sm font-black uppercase tracking-widest text-[#2563eb]">MARKET SECTORS (MODULES)</h2>
                  <Link href={`/student/subjects/subject/modules?subjectId=${subjectId}`}>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 hover:text-[#2563eb] transition-colors cursor-pointer border border-transparent hover:border-slate-200 px-2 py-1 rounded-md">View Full Ledger →</span>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modules.slice(0, 4).map((mod: any) => (
                    <Link key={mod.id} href={`/student/subjects/subject/modules/item?subjectId=${subjectId}&id=${mod.id}`}>
                      <div className="bg-slate-50/50 border border-slate-200 p-4 rounded-lg hover:border-[#2563eb] hover:bg-white transition-all flex flex-col justify-between h-full group shadow-sm hover:shadow-md">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xs font-bold font-sans text-slate-700 uppercase tracking-widest line-clamp-2 pr-4">{mod.title}</h3>
                          <span className="text-[10px] font-mono text-[#16a34a] whitespace-nowrap">▲ {Math.floor(Math.random() * 10) + 1}.{Math.floor(Math.random() * 9)}%</span>
                        </div>

                        {/* Fake volume bar */}
                        <div className="w-full flex gap-1 h-3 mt-2 opacity-50 group-hover:opacity-100 transition-opacity">
                          {[...Array(12)].map((_, i) => (
                            <div key={i} className="flex-1 bg-slate-200 group-hover:bg-[#2563eb]/20 rounded-sm" style={{ height: `${Math.max(20, Math.random() * 100)}%`, alignSelf: 'flex-end' }} />
                          ))}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between font-mono text-[10px] text-slate-400">
                          <span>{mod.hours || "3h"} VOL</span>
                          <span className="text-[#2563eb]">{mod.subtopics?.length || 0} UNITS</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* ASSESSMENT TESTING STRATEGY (QUIZZES) */}
              <div className="bg-white border border-slate-200/80 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-lg">
                <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                  <h2 className="text-sm font-black uppercase tracking-widest text-[#2563eb] flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#dc2626]" /> Risk Testing Quadrants
                  </h2>
                  <Link href={`/student/subjects/subject/quizzes?subjectId=${subjectId}`}>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 hover:text-[#2563eb] transition-colors cursor-pointer border border-transparent hover:border-slate-200 px-2 py-1 rounded-md">Run Full Audit →</span>
                  </Link>
                </div>
                <div className="space-y-3">
                  {quizzesWithAttempts.map((quiz: any) => (
                    <div key={quiz.id} className="bg-slate-50/50 border border-slate-200 p-3 flex justify-between items-center rounded-lg hover:border-[#2563eb]/60 hover:bg-white transition-all">
                      <div>
                        <div className="font-sans font-bold text-xs text-slate-700 uppercase tracking-widest">{quiz.title}</div>
                        <div className="text-[#2563eb] mt-1 text-[10px] font-mono opacity-80">{quiz.timeLimit || 30}M LIMIT // {quiz.totalMarks || 100} PTS</div>
                      </div>
                      <Link href={`/student/subjects/subject/quizzes/item?subjectId=${subjectId}&id=${quiz.id}`}>
                        <Button className="bg-[#dc2626]/10 hover:bg-[#dc2626]/20 border border-[#dc2626]/30 text-[#dc2626] font-mono rounded-lg tracking-widest uppercase px-4 text-[10px] shadow-sm">
                          &gt; EXECUTE
                        </Button>
                      </Link>
                    </div>
                  ))}
                  {quizzesWithAttempts.length === 0 && (
                    <div className="p-4 border border-dashed border-slate-200 text-center text-slate-400 font-mono text-xs rounded-lg">NO ACTIVE AUDITS FOUND</div>
                  )}
                </div>
              </div>

              {/* TWO COLUMN GRID FOR FLASHCARDS AND MINDMAPS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* FLASHCARDS SECTION */}
                <div className="bg-white border border-slate-200/80 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-lg">
                  <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                    <h2 className="text-[11px] font-black uppercase tracking-widest text-[#2563eb] flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-[#eab308]" /> Retention Decks
                    </h2>
                    <Link href={`/student/subjects/subject/flashcards?subjectId=${subjectId}`}>
                      <span className="text-[10px] font-mono text-slate-400 hover:text-[#2563eb] cursor-pointer">ALL →</span>
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {flashcardDecks.slice(0, 3).map((deck: any) => (
                      <Link key={deck.id} href={`/student/subjects/subject/flashcards/item?subjectId=${subjectId}&id=${deck.id}`}>
                        <div className="bg-slate-50/50 border border-slate-200 p-3 hover:border-[#eab308]/50 hover:bg-white transition-all flex justify-between items-center rounded-lg group">
                          <span className="font-bold text-xs text-slate-700 font-sans uppercase tracking-widest line-clamp-1">{deck.title}</span>
                          <span className="text-[#eab308] text-[9px] font-mono border border-[#eab308]/30 px-1.5 py-0.5 rounded-md bg-[#eab308]/10 whitespace-nowrap">{deck.cards?.length || 0} CARDS</span>
                        </div>
                      </Link>
                    ))}
                    {flashcardDecks.length === 0 && (
                      <div className="p-3 border border-dashed border-slate-200 text-center text-slate-400 font-mono text-[10px] rounded-lg">EMPTY REPOSITORY</div>
                    )}
                  </div>
                </div>

                {/* MIND MAPS ARCHITECTURE SECTION */}
                <div className="bg-white border border-slate-200/80 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-lg">
                  <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                    <h2 className="text-[11px] font-black uppercase tracking-widest text-[#2563eb] flex items-center gap-2">
                      <Brain className="w-3.5 h-3.5 text-[#a855f7]" /> Visual Mind Maps
                    </h2>
                    <Link href={`/student/subjects/subject/mindmaps?subjectId=${subjectId}`}>
                      <span className="text-[10px] font-mono text-slate-400 hover:text-[#2563eb] cursor-pointer">ALL →</span>
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {mindmaps.slice(0, 3).map((map: any) => (
                      <Link key={map.id} href={`/student/subjects/subject/mindmaps/item?subjectId=${subjectId}&id=${map.id}`}>
                        <div className="bg-slate-50/50 border border-slate-200 p-3 hover:border-[#a855f7]/50 hover:bg-white transition-all flex justify-between items-center font-mono text-xs rounded-lg">
                          <span className="font-bold font-sans text-xs text-slate-700 uppercase tracking-widest line-clamp-1">{map.title}</span>
                          <span className="text-[#a855f7] flex items-center gap-1 text-[9px] border border-[#a855f7]/30 px-1.5 py-0.5 rounded-md bg-[#a855f7]/10">PLOT <ExternalLink className="w-2.5 h-2.5" /></span>
                        </div>
                      </Link>
                    ))}
                    {mindmaps.length === 0 && (
                      <div className="p-3 border border-dashed border-slate-200 text-center text-slate-400 font-mono text-[10px] rounded-lg">NO PLOTS FOUND</div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* SIDEBAR DASHBOARD SYSTEM ASSETS */}
            <div className="space-y-6">

              {/* AI STRATEGY PILOT */}
              <div className="bg-white border border-slate-200 flex flex-col justify-between h-[380px] relative shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-lg overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#2563eb] to-transparent opacity-50" />
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                    <span className="text-xs font-mono font-black text-[#16a34a] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#16a34a] rounded-full animate-pulse shadow-[0_0_4px_#16a34a]" />
                      EXECUTIVE INTEL
                    </span>
                    <span className="text-[9px] bg-slate-50 border border-slate-200 text-[#2563eb] px-1.5 py-0.5 rounded-md font-mono">v4.0.1</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-3 text-[10px] font-mono pr-2 custom-scrollbar">
                    {aiMessages.map((msg, idx) => (
                      <div key={idx} className={`p-2.5 rounded-md border ${msg.role === 'assistant' ? 'bg-[#16a34a]/5 border-[#16a34a]/10 text-slate-800' : 'bg-slate-50 border-slate-200 text-slate-700 text-right'}`}>
                        <p className="leading-relaxed opacity-90">{msg.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border-t border-slate-200">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <span className="text-[#16a34a] font-mono flex items-center pl-1">{`>`}</span>
                    <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder="Query database..." className="bg-transparent text-[10px] font-mono px-2 py-1.5 flex-1 text-slate-700 outline-none placeholder:text-slate-400 focus:border-b focus:border-[#2563eb]/50 transition-all" />
                    <button type="submit" className="bg-[#2563eb]/10 hover:bg-[#2563eb]/20 border border-[#2563eb]/20 text-[#2563eb] px-2 py-1.5 rounded-md transition-colors">
                      <Send className="w-3 h-3" />
                    </button>
                  </form>
                </div>
              </div>

              {/* DOSSIERS & MATERIALS REFERENCE */}
              <div className="bg-white border border-slate-200/80 p-5 rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                <div className="pb-3 border-b border-slate-100 mb-4">
                  <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center text-[#2563eb]">
                    <FileText className="w-3.5 h-3.5 mr-2 text-[#2563eb]" /> REFERENCE DOSSIERS
                  </h3>
                </div>
                <div className="space-y-3">
                  {subjectResources.map((resource: any, idx: number) => (
                    <div key={idx} className="bg-slate-50/50 border border-slate-200 p-2 rounded-lg hover:border-[#2563eb]/50 transition-colors">
                      <SubjectResourceCard title={resource.title} type={resource.type} link={resource.link} />
                    </div>
                  ))}
                  {subjectResources.length === 0 && (
                    <p className="text-[10px] font-mono text-slate-400 text-center py-2 border border-dashed border-slate-200 rounded-lg">NO DATA LOGGED.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER VARIANT C: PYTHON DEVELOPMENT STUDIO (PREMIUM PROFESSIONAL IDE THEME)
  // ==========================================
  if (isPythonProgramming) {
    // Helper to generate file icon
    const getFileIcon = (fileName: string) => {
      if (fileName.endsWith(".py")) {
        return <FileCode className="w-4 h-4 text-[#3776AB] transition-transform duration-200 group-hover:scale-110" />;
      } else if (fileName.endsWith(".json")) {
        return <FileJson className="w-4 h-4 text-amber-600 transition-transform duration-200 group-hover:scale-110" />;
      } else if (fileName.endsWith(".md")) {
        return <FileText className="w-4 h-4 text-emerald-600 transition-transform duration-200 group-hover:scale-110" />;
      }
      return <Code className="w-4 h-4 text-slate-500 transition-transform duration-200 group-hover:scale-110" />;
    };

    // Helper to generate file structure from modules
    const getModuleFiles = (mod: any) => {
      const slug = mod.title.toLowerCase().replace(/[^a-z0-9]+/g, "_");
      return [
        { name: `${slug}.py`, code: getCodeSnippet(`${slug}.py`, mod.title) },
        { name: `test_${slug}.py`, code: getCodeSnippet(`test_${slug}.py`, mod.title) },
        { name: `README.md`, code: getCodeSnippet(`README.md`, mod.title) }
      ];
    };

    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-700 pb-20 relative overflow-hidden font-mono antialiased selection:bg-[#3776AB]/10 selection:text-[#3776AB] font-jetbrains">

        {/* Floating particles in background */}
        {particles.map((p) => (
          <span
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
              fontSize: p.fontSize,
              opacity: 0.08
            }}
          >
            {p.word}
          </span>
        ))}



        {/* CSS font imports and custom utility styles */}
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');
          
          .font-jetbrains {
            font-family: 'JetBrains Mono', 'IBM Plex Mono', monospace;
          }
          .font-ibm {
            font-family: 'IBM Plex Mono', monospace;
          }
          .font-inter {
            font-family: 'Inter', sans-serif;
          }
          @keyframes float-up {
            0% {
              transform: translateY(100vh) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 0.08;
            }
            90% {
              opacity: 0.08;
            }
            100% {
              transform: translateY(-10vh) rotate(360deg);
              opacity: 0;
            }
          }
          .particle {
            position: absolute;
            animation: float-up 25s linear infinite;
            color: #475569;
            font-family: 'JetBrains Mono', monospace;
            font-weight: bold;
            pointer-events: none;
            z-index: 0;
          }
          /* Custom scrollbar for file tree and terminals */
          .custom-dev-scroll::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          .custom-dev-scroll::-webkit-scrollbar-track {
            background: #f1f5f9;
          }
          .custom-dev-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
          }
          .custom-dev-scroll::-webkit-scrollbar-thumb:hover {
            background: #3776AB;
          }
        `}</style>

        <div className="container mx-auto px-4 mt-6 relative z-10 space-y-6">
          {/* Top IDE Header / Status bar */}
          <div className="bg-white border border-slate-200 rounded p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 font-mono text-xs text-slate-655 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5 flex-shrink-0">
                <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
                <span className="w-3 h-3 rounded-full bg-[#eab308]" />
                <span className="w-3 h-3 rounded-full bg-[#22c55e]" />
              </div>
              <span className="text-slate-300">|</span>
              <span className="font-bold text-[#2b5b84]">PYTHON DEVELOPMENT STUDIO</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-600 font-bold uppercase tracking-wider truncate max-w-[200px] md:max-w-none">{subject.name}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto font-ibm">
              {/* Build Metrics */}
              <div className="flex items-center gap-2 bg-blue-50/80 border border-blue-200 px-3 py-1.5 rounded hover:scale-105 hover:shadow-sm transition-all duration-200 cursor-default">
                <span className="text-blue-600 font-semibold">Project Completion:</span>
                <span className="text-[#3776AB] font-bold">88.4%</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50/80 border border-emerald-200 px-3 py-1.5 rounded hover:scale-105 hover:shadow-sm transition-all duration-200 cursor-default">
                <span className="text-emerald-600 font-semibold">Build:</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                  <span className="text-emerald-800 font-bold uppercase">SUCCESSFUL</span>
                </span>
              </div>
              <div className="flex items-center gap-2 bg-purple-50/80 border border-purple-200 px-3 py-1.5 rounded hover:scale-105 hover:shadow-sm transition-all duration-200 cursor-default">
                <span className="text-purple-600 font-semibold">Coverage:</span>
                <span className="text-purple-800 font-bold">92.4%</span>
              </div>
              <div className="flex items-center gap-2 bg-amber-50/80 border border-amber-200 px-3 py-1.5 rounded hover:scale-105 hover:shadow-sm transition-all duration-200 cursor-default font-mono">
                <span className="text-amber-600 font-semibold">Quality:</span>
                <span className="text-amber-800 font-bold px-1.5 py-0.5 bg-amber-100/50 border border-amber-200 rounded">A+</span>
              </div>
            </div>
          </div>

          {/* MAIN IDE WORKSPACE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* LEFT SIDEBAR: File Explorer & Learning Navigation */}
            <div className="lg:col-span-1 bg-slate-50 border border-slate-200 rounded flex flex-col h-[650px] overflow-hidden shadow-sm">
              {/* Sidebar Tabs */}
              <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex justify-between items-center text-xs font-bold text-slate-655">
                <span className="tracking-widest uppercase">File Explorer</span>
                <Settings className="w-3.5 h-3.5 hover:text-[#3776AB] cursor-pointer hover:scale-110 active:scale-90 transition-all duration-200" />
              </div>

              {/* Project Title */}
              <div className="px-4 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-200 flex items-center justify-between">
                <span>📁 PROJECT: STUDENT_WORKSPACE</span>
                <span className="text-[#3776AB]">v3.9</span>
              </div>

              {/* Folders List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-dev-scroll">
                {PYTHON_WORKSPACE_TOPICS.map((topic) => {
                  const isExpanded = expandedFolders[topic.id] || false;
                  const topicFiles = topic.files;
                  return (
                    <div key={topic.id} className="space-y-1">
                      {/* Folder Title Row */}
                      <button
                        onClick={() => setExpandedFolders(prev => ({ ...prev, [topic.id]: !isExpanded }))}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-200/60 hover:translate-x-1 hover:shadow-sm text-left font-mono text-xs text-slate-800 transition-all duration-200 group active:scale-[0.98]"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        )}
                        {isExpanded ? (
                          <FolderOpen className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform flex-shrink-0" />
                        ) : (
                          <Folder className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform flex-shrink-0" />
                        )}
                        <span className="truncate font-semibold group-hover:text-[#3776AB] transition-colors">{topic.title}</span>
                      </button>

                      {/* Folder Files List */}
                      {isExpanded && (
                        <div className="pl-6 space-y-1 border-l border-slate-200 ml-4 my-1">
                          {topicFiles.map((file) => {
                            const isSelected = activeFile.name === file.name;
                            return (
                              <button
                                key={file.name}
                                onClick={() => {
                                  const currentCode = fileCodes[file.name] ?? file.code;
                                  setActiveFile({ name: file.name, folder: topic.title, code: currentCode });
                                  setEditorActiveTab(file.name);
                                }}
                                className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left font-mono text-xs transition-all duration-200 group active:scale-[0.97] ${isSelected
                                  ? "bg-blue-50/80 text-blue-700 border-l-2 border-blue-600 pl-1.5 font-bold shadow-sm"
                                  : "text-slate-650 hover:text-slate-900 hover:bg-slate-200/40 hover:translate-x-1 hover:shadow-xs"
                                  }`}
                              >
                                {getFileIcon(file.name)}
                                <span className="truncate">{file.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CENTER WORKSPACE: Editor & Terminal */}
            <div className="lg:col-span-3 flex flex-col gap-6 h-[650px]">

              {/* CODE EDITOR PANEL */}
              <div className="bg-white border border-slate-200 rounded flex-1 flex flex-col overflow-hidden relative group/editor shadow-sm">
                {/* Editor Tabs Header */}
                <div className="bg-slate-100 border-b border-slate-200 flex justify-between items-center pr-4">
                  <div className="flex overflow-x-auto">
                    {/* Active tab file */}
                    <div className="bg-white border-r border-slate-200 border-t-2 border-t-[#3776AB] px-4 py-2.5 flex items-center gap-2 text-xs font-mono text-slate-800 font-bold select-none group">
                      {getFileIcon(activeFile.name)}
                      <span>{activeFile.name}</span>
                    </div>
                    {/* Fake extra tabs for realism */}
                    <div className="px-4 py-2.5 flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-slate-700 border-r border-slate-200 cursor-pointer select-none group hover:bg-slate-200/40 transition-colors">
                      <FileJson className="w-3.5 h-3.5 text-amber-600 transition-transform duration-200 group-hover:scale-110" />
                      <span>workspace_config.json</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => runCodeInTerminal(activeFile.name)}
                      disabled={isTerminalRunning}
                      className={`flex items-center gap-1.5 font-mono text-[10px] font-bold px-3.5 py-1.5 rounded uppercase tracking-widest transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md ${isTerminalRunning
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                        : "bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-700 shadow-sm"
                        }`}
                    >
                      <Play className="w-3 h-3 fill-current" /> {isTerminalRunning ? "Running..." : "Run Code"}
                    </button>
                  </div>
                </div>

                {/* Editor Code Area */}
                <div className="flex-1 flex bg-white border-b border-slate-200 overflow-hidden font-jetbrains">
                  {/* Line Numbers */}
                  <div className="text-slate-400 select-none text-right pr-3 border-r border-slate-200 py-4 font-mono w-10 bg-slate-50/50">
                    {Array.from({ length: Math.max(12, activeFile.code.split("\n").length) }).map((_, i) => (
                      <div key={i} className="h-6 leading-6 text-xs">{i + 1}</div>
                    ))}
                  </div>
                  {/* Editable Code Editor */}
                  <div className="flex-1 relative h-full">
                    <div className="absolute right-4 top-2 text-[10px] text-slate-400 font-mono tracking-widest select-none uppercase z-10">
                      // {activeFile.folder}
                    </div>
                    <textarea
                      value={activeFile.code}
                      onChange={(e) => {
                        const val = e.target.value;
                        setActiveFile(prev => ({ ...prev, code: val }));
                        setFileCodes(prev => ({ ...prev, [activeFile.name]: val }));
                      }}
                      spellCheck={false}
                      className="w-full h-full p-4 font-mono text-sm leading-6 text-slate-800 bg-transparent border-none outline-none resize-none focus:ring-0 focus:border-none font-jetbrains select-text"
                      style={{ lineHeight: "24px" }}
                    />
                  </div>
                </div>
              </div>

              {/* TERMINAL WIDGET (Light themed bash simulator) */}
              <div className="bg-slate-50 border border-slate-200 rounded overflow-hidden flex flex-col font-mono text-xs h-48 shadow-sm">
                <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex justify-between items-center select-none">
                  <span className="text-slate-700 font-bold flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-[#3776AB]" /> bash (python-sim)
                  </span>
                  <span className="text-[10px] text-slate-400">UTF-8</span>
                </div>
                <div className="bg-white p-4 space-y-1.5 overflow-y-auto text-slate-800 font-ibm flex-1 custom-dev-scroll">
                  <div className="text-slate-500 font-medium">$ python {activeFile.name}</div>
                  {terminalLogs.map((log, idx) => {
                    let logColor = "text-slate-600";
                    if (log.includes("Successful") || log.includes("Passed") || log.includes("✓")) {
                      logColor = "text-emerald-600 font-bold";
                    } else if (log.includes("Error") || log.includes("Failed") || log.includes("✗")) {
                      logColor = "text-rose-600 font-bold";
                    } else if (log.startsWith("[")) {
                      logColor = "text-blue-605 font-medium";
                    }
                    return (
                      <div key={idx} className={logColor}>
                        {log}
                      </div>
                    );
                  })}
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[#3776AB] font-bold">$</span>
                    <span className="w-1.5 h-3.5 bg-slate-400 animate-pulse" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* PYTHON LEARNING MODULES */}
          <div className="bg-white border border-slate-200 rounded p-6 shadow-sm relative z-10">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#2b5b84] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#2b5b84]" /> Python Learning Modules
              </h3>
              <Link href={`/student/subjects/subject/modules?subjectId=${subjectId}`}>
                <Button variant="ghost" className="text-slate-700 hover:text-[#3776AB] font-bold text-xs uppercase hover:bg-slate-100 border border-slate-200/80 rounded px-4 py-2 transition-all inline-flex items-center bg-white shadow-sm flex items-center">
                  <span>View All Modules</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {pythonModules.map((mod: any, idx: number) => {
                const hourLabel = mod.hours ? `${mod.hours} Hours` : "4 Hours";
                const subtopicsCount = mod.subtopics?.length || 0;
                return (
                  <Link key={mod.id} href={`/student/subjects/subject/modules/item?subjectId=${subjectId}&id=${mod.id}`}>
                    <div className="bg-slate-50 border border-slate-200 rounded p-4 hover:border-[#3776AB] hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 group h-full flex flex-col justify-between cursor-pointer">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded font-mono font-bold tracking-widest uppercase">
                            MODULE 0{mod.moduleNo || (idx + 1)}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {hourLabel}
                          </span>
                        </div>
                        <h4 className="font-mono text-xs font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-[#3776AB] transition-colors">
                          {mod.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 line-clamp-2 mb-4 font-sans leading-relaxed">
                          {mod.co || "Master core concepts and build projects."}
                        </p>
                      </div>
                      <div className="pt-2.5 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Book className="w-3.5 h-3.5" /> {subtopicsCount} Subtopics
                        </span>
                        <span className="text-[#3776AB] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                          Study <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* TWO COLUMN GRID FOR DEBUG CHALLENGES AND SYNTAX REFERENCES */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">

            {/* DEBUG CHALLENGES (QUIZZES) */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded p-6 shadow-sm">
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#2b5b84] flex items-center gap-2">
                  <Bug className="w-4 h-4 text-[#2b5b84]" /> Debug Challenges (Active Issues)
                </h3>
                <Link href={`/student/subjects/subject/quizzes?subjectId=${subjectId}`}>
                  <Button variant="ghost" className="text-slate-700 hover:text-[#3776AB] font-bold text-xs uppercase hover:bg-slate-100 border border-slate-200/80 rounded px-4 py-2 transition-all inline-flex items-center bg-white shadow-sm flex items-center">
                    <span>View All Quizzes</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizzesWithAttempts.map((quiz: any, idx: number) => {
                  const difficulty = idx % 2 === 0 ? "Medium" : "Hard";
                  const xp = quiz.totalMarks * 5 || 250;
                  const isHard = difficulty === "Hard";

                  // Color configurations based on difficulty
                  const themeColor = isHard ? "text-rose-700 bg-rose-50 border-rose-200" : "text-amber-700 bg-amber-50 border-amber-200";
                  const btnColorClass = isHard
                    ? "bg-rose-600 hover:bg-rose-700 border-rose-700 shadow-rose-100"
                    : "bg-amber-500 hover:bg-amber-600 border-amber-600 shadow-amber-100";

                  return (
                    <div key={quiz.id} className="bg-slate-50 border border-slate-200 rounded p-4 hover:border-blue-500 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 group">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] ${themeColor} border px-2 py-0.5 rounded font-mono font-bold tracking-widest uppercase`}>🐞 BUG FIX</span>
                        <span className="text-[10px] text-slate-450 font-mono">CODE: {quiz.id.slice(0, 6)}</span>
                      </div>
                      <h4 className="font-mono text-xs font-bold text-slate-800 mb-3 line-clamp-1 group-hover:text-blue-650 transition-colors">{quiz.title}</h4>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-200">
                        <span>Difficulty: <span className={isHard ? "text-rose-600 font-bold" : "text-amber-600 font-bold"}>{difficulty}</span></span>
                        <span>XP Reward: <span className="text-blue-650 font-semibold">+{xp} XP</span></span>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Link href={`/student/subjects/subject/quizzes/item?subjectId=${subjectId}&id=${quiz.id}`}>
                          <Button className={`${btnColorClass} text-white border rounded font-mono text-[10px] py-1.5 px-4 h-8 uppercase tracking-wider hover:scale-105 active:scale-95 hover:shadow-md transition-all duration-200`}>
                            Debug Challenge →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
                {quizzesWithAttempts.length === 0 && (
                  <div className="col-span-2 p-6 border border-dashed border-slate-200 text-center text-slate-450 font-mono text-xs rounded">
                    All unit tests passing. No bug reports active.
                  </div>
                )}
              </div>
            </div>

            {/* SYNTAX REFERENCE CARDS (FLASHCARDS) */}
            <div className="bg-white border border-slate-200 rounded p-6 shadow-sm">
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#2b5b84] flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#2b5b84]" /> Syntax Reference Library
                </h3>
                <Link href={`/student/subjects/subject/flashcards?subjectId=${subjectId}`}>
                  <Button variant="ghost" className="text-slate-700 hover:text-[#3776AB] font-bold text-xs uppercase hover:bg-slate-100 border border-slate-200/80 rounded px-4 py-2 transition-all inline-flex items-center bg-white shadow-sm flex items-center">
                    <span>View All Decks</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {flashcardDecks.slice(0, 4).map((deck: any, idx: number) => {
                  const keywordsList = ["def", "class", "list comprehension", "lambda"];
                  const kw = keywordsList[idx % keywordsList.length];

                  const badgeColors = [
                    "text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100",
                    "text-purple-700 bg-purple-50 border-purple-200 hover:bg-purple-100",
                    "text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
                    "text-pink-700 bg-pink-50 border-pink-200 hover:bg-pink-100"
                  ];
                  const badgeClass = badgeColors[idx % badgeColors.length];

                  return (
                    <Link key={deck.id} href={`/student/subjects/subject/flashcards/item?subjectId=${subjectId}&id=${deck.id}`}>
                      <div className="bg-slate-50 border border-slate-200 p-3.5 rounded hover:border-amber-500 hover:bg-white hover:shadow-md hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex justify-between items-center cursor-pointer group">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className={`font-mono text-[10px] font-bold px-2 py-0.5 border rounded flex-shrink-0 ${badgeClass} transition-colors`}>{kw}</span>
                          <span className="font-mono text-xs text-slate-800 font-semibold group-hover:text-amber-700 transition-colors truncate">{deck.title}</span>
                        </div>
                        <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 border border-blue-100 rounded font-mono font-bold whitespace-nowrap">{deck.cards?.length || 0} CARDS</span>
                      </div>
                    </Link>
                  );
                })}
                {flashcardDecks.length === 0 && (
                  <div className="p-4 border border-dashed border-slate-200 text-center text-slate-450 font-mono text-[10px] rounded">
                    Library index is empty.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* CONNECTED ARCHITECTURE DIAGRAMS (MINDMAPS) & HEATMAP */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">

            {/* ARCHITECTURE DIAGRAM (MINDMAPS) */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#2b5b84] flex items-center gap-2">
                    <Brain className="w-4 h-4 text-[#2b5b84]" /> Architecture & System Topologies
                  </h3>
                  <Link href={`/student/subjects/subject/mindmaps?subjectId=${subjectId}`}>
                    <Button variant="ghost" className="text-slate-700 hover:text-[#3776AB] font-bold text-xs uppercase hover:bg-slate-100 border border-slate-200/80 rounded px-4 py-2 transition-all inline-flex items-center bg-white shadow-sm flex items-center">
                      <span>View All Mind Maps</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                </div>

                <div className="relative flex flex-col items-center justify-center py-6">
                  {/* SVG Connector Lines */}
                  <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
                    <svg className="w-full h-full stroke-slate-200 stroke-[2]" style={{ strokeDasharray: "4 4" }}>
                      <line x1="15%" y1="50%" x2="38%" y2="50%" />
                      <line x1="38%" y1="50%" x2="62%" y2="50%" />
                      <line x1="62%" y1="50%" x2="85%" y2="50%" />
                    </svg>
                  </div>

                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center w-full gap-6 px-4">
                    {mindmaps.slice(0, 4).map((map: any, idx: number) => {
                      const nodeColors = [
                        { bg: "bg-blue-50 text-blue-700 border-blue-200", hover: "group-hover:bg-blue-600 group-hover:border-blue-600" },
                        { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", hover: "group-hover:bg-emerald-600 group-hover:border-emerald-600" },
                        { bg: "bg-purple-50 text-purple-700 border-purple-200", hover: "group-hover:bg-purple-600 group-hover:border-purple-600" },
                        { bg: "bg-amber-50 text-amber-700 border-amber-200", hover: "group-hover:bg-amber-600 group-hover:border-amber-600" },
                      ];
                      const colors = nodeColors[idx % nodeColors.length];

                      return (
                        <Link key={map.id} href={`/student/subjects/subject/mindmaps/item?subjectId=${subjectId}&id=${map.id}`} className="w-full md:w-auto">
                          <div className="bg-slate-50 border border-slate-200 hover:border-blue-500 rounded-lg p-4 text-center group cursor-pointer transition-all duration-300 relative shadow-sm min-w-[130px] transform hover:-translate-y-1.5 hover:scale-105 active:scale-[0.97] hover:bg-white hover:shadow-md">
                            <div className={`w-7 h-7 rounded-full ${colors.bg} border flex items-center justify-center font-bold font-mono text-xs mx-auto mb-2 ${colors.hover} group-hover:text-white transition-all duration-300`}>
                              M0{idx + 1}
                            </div>
                            <h4 className="font-mono text-[10px] font-bold text-slate-800 uppercase tracking-wider line-clamp-1 group-hover:text-blue-650 transition-colors">{map.title}</h4>
                            <p className="text-[9px] text-slate-400 font-mono mt-1">Architecture Node</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* COMMIT ACTIVITY LEDGER (GITHUB HEATMAP) */}
            <div className="bg-white border border-slate-200 rounded p-6 shadow-sm">
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#2b5b84] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2b5b84]" /> Commit activity ledger
                </h3>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Linter Logs</span>
              </div>

              <div className="flex flex-col space-y-3">
                {/* Heatmap Grid */}
                <div className="flex gap-[3px] overflow-x-auto py-1 custom-dev-scroll">
                  {Array.from({ length: 22 }).map((_, weekIdx) => (
                    <div key={weekIdx} className="flex flex-col gap-[3px] flex-shrink-0">
                      {Array.from({ length: 7 }).map((_, dayIdx) => {
                        const levels = ["bg-slate-100", "bg-[#3776AB]/20", "bg-[#3776AB]/50", "bg-[#3776AB]/80", "bg-[#FFD43B]"];
                        const val = (weekIdx * dayIdx + weekIdx) % 5;
                        return (
                          <div
                            key={dayIdx}
                            className={`w-3 h-3 rounded-sm ${levels[val]} hover:ring-2 hover:ring-blue-500 hover:scale-125 transition-all duration-100 cursor-pointer shadow-xs`}
                            title={`Commits: ${val * 3} | Day ${dayIdx + 1}, Week ${weekIdx + 1}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-1">
                  <span>Less active</span>
                  <div className="flex gap-1 items-center">
                    <div className="w-2.5 h-2.5 rounded-sm bg-slate-100" />
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#3776AB]/20" />
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#3776AB]/50" />
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#3776AB]/80" />
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#FFD43B]" />
                  </div>
                  <span>More active</span>
                </div>
              </div>
            </div>

          </div>

          {/* REFERENCE MATERIALS (SIDEBAR RESOURCES) */}
          <div className="bg-white border border-slate-200 rounded p-6 relative z-10 shadow-sm">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#2b5b84] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2b5b84]" /> Workspace Reference materials
              </h3>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Reference Docs</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {subjectResources.map((resource: any, idx: number) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 p-3.5 rounded hover:border-blue-500 hover:bg-white hover:scale-[1.03] active:scale-[0.98] hover:shadow-md transition-all duration-200">
                  <SubjectResourceCard title={resource.title} type={resource.type} link={resource.link} />
                </div>
              ))}
              {subjectResources.length === 0 && (
                <p className="col-span-4 text-xs font-mono text-slate-500 text-center py-4 border border-dashed border-slate-200 rounded">
                  No configuration manuals imported.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER VARIANT B: UI PROGRAMMING & DEFAULT FALLBACK LOOK (NEUBRUTALISM STYLE)
  // ==========================================
  const renderModulePreview = (moduleNo: number, title: string) => {
    const normalizedTitle = title.toLowerCase();

    // Module 1: User Persona Card, User Journey, Profile Layout
    if (normalizedTitle.includes("intro") || normalizedTitle.includes("thinking") || moduleNo === 1) {
      return (
        <svg className="w-full h-full text-[#7C3AED]" viewBox="0 0 200 80" fill="none" stroke="currentColor" strokeWidth="1.2">
          {/* Wireframe box layout */}
          <rect x="15" y="10" width="80" height="60" rx="6" fill="currentColor" fillOpacity="0.03" stroke="#7C3AED" />
          {/* User Persona Avatar */}
          <motion.g
            variants={{
              rest: { y: 0 },
              hover: { y: -2, transition: { type: "spring", stiffness: 300, damping: 15 } }
            }}
          >
            <circle cx="35" cy="30" r="12" stroke="#7C3AED" strokeWidth="1.5" />
            <path d="M23,50 C23,43 28,42 35,42 C42,42 47,43 47,50" stroke="#7C3AED" strokeWidth="1.5" />
          </motion.g>

          {/* Info lines */}
          <line x1="55" y1="24" x2="85" y2="24" stroke="#7C3AED" strokeWidth="2" />
          <line x1="55" y1="32" x2="75" y2="32" stroke="#7C3AED" strokeWidth="1" />
          <line x1="55" y1="40" x2="80" y2="40" stroke="#7C3AED" strokeWidth="1" />

          {/* User Journey Graph line */}
          <motion.path
            d="M110,55 L125,35 L145,45 L165,15 L185,25"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={{
              rest: { pathLength: 1 },
              hover: { pathLength: [0, 1], transition: { duration: 0.8, ease: "easeOut" } }
            }}
          />
          {/* Graph Nodes */}
          <circle cx="110" cy="55" r="3" fill="#10B981" />
          <circle cx="125" cy="35" r="3" fill="#10B981" />
          <circle cx="145" cy="45" r="3" fill="#10B981" />
          <circle cx="165" cy="15" r="3" fill="#10B981" className="animate-ping" />
          <motion.circle
            cx="165" cy="15" r="3" fill="#10B981"
            variants={{
              rest: { scale: 1 },
              hover: { scale: [1, 1.3, 1], transition: { repeat: Infinity, duration: 1.2 } }
            }}
          />
          <circle cx="185" cy="25" r="3" fill="#10B981" />

          {/* Guidelines */}
          <line x1="105" y1="60" x2="190" y2="60" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="105" y1="10" x2="105" y2="60" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      );
    }

    // Module 2: Layout Grids, Wireframes, Spacing Systems
    if (normalizedTitle.includes("flex") || normalizedTitle.includes("layout") || moduleNo === 2) {
      return (
        <svg className="w-full h-full text-[#3B82F6]" viewBox="0 0 200 80" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="15" y="10" width="170" height="60" rx="6" stroke="#E2E8F0" />
          {/* Flex column grid layout */}
          <rect x="25" y="18" width="40" height="44" rx="3" fill="currentColor" fillOpacity="0.04" stroke="#3B82F6" strokeWidth="1.2" />
          <motion.rect
            x="73" y="18" width="54" height="44" rx="3" fill="currentColor" fillOpacity="0.04" stroke="#3B82F6" strokeWidth="1.2"
            variants={{
              rest: { scale: 1, originX: "73px", originY: "18px" },
              hover: { scale: 1.015, originX: "73px", originY: "18px", transition: { type: "spring", stiffness: 300, damping: 15 } }
            }}
          />
          <rect x="135" y="18" width="40" height="44" rx="3" fill="currentColor" fillOpacity="0.04" stroke="#3B82F6" strokeWidth="1.2" />

          {/* Spacing lines / dimension guides */}
          <line x1="65" y1="18" x2="65" y2="62" stroke="#EF4444" strokeWidth="1" strokeDasharray="2 1" />
          <line x1="127" y1="18" x2="127" y2="62" stroke="#EF4444" strokeWidth="1" strokeDasharray="2 1" />
          <motion.line
            x1="65" y1="40" x2="73" y2="40" stroke="#EF4444" strokeWidth="1"
            variants={{
              rest: { opacity: 0.8 },
              hover: { opacity: [0.8, 1, 0.8], transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" } }
            }}
          />
          <motion.line
            x1="127" y1="40" x2="135" y2="40" stroke="#EF4444" strokeWidth="1"
            variants={{
              rest: { opacity: 0.8 },
              hover: { opacity: [0.8, 1, 0.8], transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" } }
            }}
          />

          {/* Dimension Text mockup */}
          <text x="66" y="34" fill="#EF4444" fontSize="6" fontFamily="monospace" stroke="none" fontWeight="bold">8</text>

          {/* Wireframe lines */}
          <line x1="30" y1="28" x2="60" y2="28" stroke="#3B82F6" strokeWidth="1.5" />
          <line x1="30" y1="36" x2="50" y2="36" stroke="#3B82F6" strokeWidth="1" />
          <line x1="79" y1="28" x2="121" y2="28" stroke="#3B82F6" strokeWidth="1.5" />
          <line x1="79" y1="36" x2="110" y2="36" stroke="#3B82F6" strokeWidth="1" />
          <line x1="79" y1="44" x2="100" y2="44" stroke="#3B82F6" strokeWidth="1" />
        </svg>
      );
    }

    // Module 3: Browser Mockup, Navigation Systems, Responsive Layouts
    if (normalizedTitle.includes("styling") || normalizedTitle.includes("tailwind") || normalizedTitle.includes("design system") || moduleNo === 3) {
      return (
        <svg className="w-full h-full text-[#10B981]" viewBox="0 0 200 80" fill="none" stroke="currentColor" strokeWidth="1.2">
          {/* Responsive Browser Mockups */}
          {/* Desktop Browser */}
          <rect x="15" y="10" width="110" height="60" rx="6" fill="white" stroke="#E2E8F0" />
          <motion.g
            variants={{
              rest: { x: 0 },
              hover: { x: -3, transition: { type: "spring", stiffness: 200, damping: 15 } }
            }}
          >
            <rect x="157" y="20" width="30" height="50" rx="4" fill="white" stroke="#E2E8F0" />
            <rect x="162" y="28" width="20" height="4" rx="2" fill="#10B981" stroke="none" />
            <circle cx="172" cy="42" r="6" fill="currentColor" fillOpacity="0.08" stroke="#10B981" strokeWidth="1" />
            <rect x="162" y="54" width="20" height="2" rx="1" fill="#E2E8F0" stroke="none" />
            <rect x="162" y="60" width="14" height="2" rx="1" fill="#E2E8F0" stroke="none" />
          </motion.g>

          {/* Desktop headers */}
          <rect x="15.5" y="10.5" width="109" height="12" rx="5.5" fill="#F8FAFC" stroke="none" />
          <circle cx="21" cy="16.5" r="2" fill="#EF4444" stroke="none" />
          <circle cx="27" cy="16.5" r="2" fill="#F59E0B" stroke="none" />
          <circle cx="33" cy="16.5" r="2" fill="#10B981" stroke="none" />

          {/* Navigation link markers */}
          <rect x="55" y="15" width="15" height="3" rx="1.5" fill="#10B981" stroke="none" />
          <rect x="75" y="15" width="15" height="3" rx="1.5" fill="#E2E8F0" stroke="none" />
          <rect x="95" y="15" width="15" height="3" rx="1.5" fill="#E2E8F0" stroke="none" />

          {/* Desktop Body content */}
          <circle cx="35" cy="40" r="10" fill="currentColor" fillOpacity="0.08" stroke="#10B981" strokeWidth="1.2" />
          <rect x="52" y="34" width="45" height="5" rx="2.5" fill="#10B981" stroke="none" />
          <rect x="52" y="44" width="30" height="3.5" rx="1.7" fill="#E2E8F0" stroke="none" />

          {/* Responsive connector vector line */}
          <motion.path
            d="M130,40 L150,40"
            stroke="#10B981"
            strokeDasharray="3 3"
            strokeWidth="1.5"
            variants={{
              rest: { strokeDashoffset: 0 },
              hover: { strokeDashoffset: [0, -6], transition: { repeat: Infinity, ease: "linear", duration: 0.8 } }
            }}
          />
          <polygon points="146,37 151,40 146,43" fill="#10B981" stroke="none" />
        </svg>
      );
    }

    // Module 4: Tables, Dashboards, Cards, Data Widgets
    if (normalizedTitle.includes("data") || normalizedTitle.includes("handling") || moduleNo === 4) {
      return (
        <svg className="w-full h-full text-[#F59E0B]" viewBox="0 0 200 80" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="15" y="10" width="170" height="60" rx="6" stroke="#E2E8F0" />

          {/* Widget 1: Circular Chart */}
          <rect x="25" y="18" width="40" height="44" rx="4" fill="currentColor" fillOpacity="0.03" stroke="#F59E0B" strokeWidth="1" />
          <circle cx="45" cy="35" r="10" stroke="#E2E8F0" strokeWidth="2.5" />
          <circle cx="45" cy="35" r="10" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="40 60" />
          <text x="38" y="38" fill="#F59E0B" fontSize="7" fontWeight="bold" fontFamily="sans-serif" stroke="none">65%</text>

          {/* Widget 2: Data Bars */}
          <rect x="73" y="18" width="54" height="44" rx="4" fill="currentColor" fillOpacity="0.03" stroke="#F59E0B" strokeWidth="1" />
          <motion.rect
            x="81" y="42" width="6" height="12" rx="1" fill="#F59E0B" stroke="none"
            variants={{
              rest: { scaleY: 1, originY: "54px" },
              hover: { scaleY: [1, 1.1, 1], originY: "54px", transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.1 } }
            }}
          />
          <motion.rect
            x="91" y="32" width="6" height="22" rx="1" fill="#F59E0B" stroke="none"
            variants={{
              rest: { scaleY: 1, originY: "54px" },
              hover: { scaleY: [1, 1.15, 1], originY: "54px", transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" } }
            }}
          />
          <motion.rect
            x="101" y="26" width="6" height="28" rx="1" fill="#F59E0B" stroke="none"
            variants={{
              rest: { scaleY: 1, originY: "54px" },
              hover: { scaleY: [1, 1.08, 1], originY: "54px", transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.2 } }
            }}
          />
          <rect x="111" y="36" width="6" height="18" rx="1" fill="#E2E8F0" stroke="none" />

          {/* Widget 3: Card list grid */}
          <rect x="135" y="18" width="40" height="44" rx="4" fill="currentColor" fillOpacity="0.03" stroke="#F59E0B" strokeWidth="1" />
          <rect x="141" y="24" width="28" height="6" rx="3" fill="#F59E0B" stroke="none" />
          <rect x="141" y="34" width="28" height="6" rx="3" fill="#E2E8F0" stroke="none" />
          <rect x="141" y="44" width="28" height="6" rx="3" fill="#E2E8F0" stroke="none" />
        </svg>
      );
    }

    // Module 5: Mobile Interface Design (Phone shell & Lateral slide-out navigation)
    if (normalizedTitle.includes("mobile") || normalizedTitle.includes("phone") || moduleNo === 5) {
      return (
        <svg className="w-full h-full text-[#EC4899]" viewBox="0 0 200 80" fill="none" stroke="currentColor" strokeWidth="1.2">
          {/* Mobile phone chassis */}
          <rect x="80" y="8" width="40" height="64" rx="6" stroke="#EC4899" strokeWidth="1.5" fill="white" />
          {/* Notch / Speaker */}
          <rect x="95" y="11" width="10" height="2" rx="1" fill="#EC4899" stroke="none" />
          {/* Bottom Nav Bar */}
          <rect x="80.75" y="60" width="38.5" height="11.25" fill="#FFF1F2" stroke="none" />
          <line x1="80" y1="60" x2="120" y2="60" stroke="#EC4899" strokeWidth="0.8" />
          <circle cx="89" cy="65" r="1.5" fill="#EC4899" />
          <circle cx="100" cy="65" r="1.5" fill="#EC4899" />
          <circle cx="111" cy="65" r="1.5" fill="#EC4899" />

          {/* Main Content Area: Info Card */}
          <rect x="85" y="18" width="30" height="16" rx="3" fill="#EC4899" fillOpacity="0.04" stroke="#EC4899" strokeWidth="0.8" />
          <circle cx="92" cy="26" r="3.5" fill="#EC4899" fillOpacity="0.15" stroke="#EC4899" strokeWidth="0.6" />
          <line x1="100" y1="23" x2="111" y2="23" stroke="#EC4899" strokeWidth="1.2" />
          <line x1="100" y1="28" x2="108" y2="28" stroke="#EC4899" strokeWidth="0.8" strokeOpacity="0.6" />

          {/* List Items */}
          <rect x="85" y="38" width="30" height="6" rx="1.5" fill="#EC4899" fillOpacity="0.02" stroke="#EC4899" strokeWidth="0.6" />
          <rect x="85" y="47" width="30" height="6" rx="1.5" fill="#EC4899" fillOpacity="0.02" stroke="#EC4899" strokeWidth="0.6" />
          <line x1="89" y1="41" x2="111" y2="41" stroke="#EC4899" strokeWidth="0.6" strokeOpacity="0.8" />
          <line x1="89" y1="50" x2="105" y2="50" stroke="#EC4899" strokeWidth="0.6" strokeOpacity="0.8" />

          {/* Lateral overlay menu sliding in */}
          <motion.g
            variants={{
              rest: { x: 0 },
              hover: { x: -3, transition: { type: "spring", stiffness: 200, damping: 15 } }
            }}
          >
            <path d="M128,12 L146,12 L146,58 L128,58 Z" stroke="#EC4899" strokeWidth="0.8" strokeDasharray="3 2" fill="white" />
            <line x1="132" y1="18" x2="142" y2="18" stroke="#EC4899" strokeWidth="0.8" />
            <line x1="132" y1="24" x2="139" y2="24" stroke="#EC4899" strokeWidth="0.8" />
            <line x1="132" y1="30" x2="141" y2="30" stroke="#EC4899" strokeWidth="0.8" />
          </motion.g>

          {/* Connection Arrows */}
          <path d="M122,35 L126,35" stroke="#EC4899" strokeWidth="1" strokeLinecap="round" />
          <polygon points="125,33 128,35 125,37" fill="#EC4899" stroke="none" />
        </svg>
      );
    }

    // Default Fallback: Tables, Dashboards, Cards, Data Widgets
    return (
      <svg className="w-full h-full text-[#F59E0B]" viewBox="0 0 200 80" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="15" y="10" width="170" height="60" rx="6" stroke="#E2E8F0" />

        {/* Widget 1: Circular Chart */}
        <rect x="25" y="18" width="40" height="44" rx="4" fill="currentColor" fillOpacity="0.03" stroke="#F59E0B" strokeWidth="1" />
        <circle cx="45" cy="35" r="10" stroke="#E2E8F0" strokeWidth="2.5" />
        <circle cx="45" cy="35" r="10" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="40 60" />
        <text x="38" y="38" fill="#F59E0B" fontSize="7" fontWeight="bold" fontFamily="sans-serif" stroke="none">65%</text>

        {/* Widget 2: Data Bars */}
        <rect x="73" y="18" width="54" height="44" rx="4" fill="currentColor" fillOpacity="0.03" stroke="#F59E0B" strokeWidth="1" />
        <motion.rect
          x="81" y="42" width="6" height="12" rx="1" fill="#F59E0B" stroke="none"
          variants={{
            rest: { scaleY: 1, originY: "54px" },
            hover: { scaleY: [1, 1.1, 1], originY: "54px", transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.1 } }
          }}
        />
        <motion.rect
          x="91" y="32" width="6" height="22" rx="1" fill="#F59E0B" stroke="none"
          variants={{
            rest: { scaleY: 1, originY: "54px" },
            hover: { scaleY: [1, 1.15, 1], originY: "54px", transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" } }
            }}
        />
        <motion.rect
          x="101" y="26" width="6" height="28" rx="1" fill="#F59E0B" stroke="none"
          variants={{
            rest: { scaleY: 1, originY: "54px" },
            hover: { scaleY: [1, 1.08, 1], originY: "54px", transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.2 } }
          }}
        />
        <rect x="111" y="36" width="6" height="18" rx="1" fill="#E2E8F0" stroke="none" />

        {/* Widget 3: Card list grid */}
        <rect x="135" y="18" width="40" height="44" rx="4" fill="currentColor" fillOpacity="0.03" stroke="#F59E0B" strokeWidth="1" />
        <rect x="141" y="24" width="28" height="6" rx="3" fill="#F59E0B" stroke="none" />
        <rect x="141" y="34" width="28" height="6" rx="3" fill="#E2E8F0" stroke="none" />
        <rect x="141" y="44" width="28" height="6" rx="3" fill="#E2E8F0" stroke="none" />
      </svg>
    );
  };

  const renderQuizPreview = (quizIndex: number, title: string) => {
    const normalizedTitle = title.toLowerCase();

    if (normalizedTitle.includes("layout") || normalizedTitle.includes("concept") || quizIndex === 1) {
      return (
        <svg className="w-full h-full text-[#7C3AED]" viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="50" cy="40" r="28" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="50" cy="40" r="18" stroke="#7C3AED" strokeWidth="1.2" strokeOpacity="0.5" />
          <circle cx="50" cy="40" r="8" stroke="#7C3AED" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
          <circle cx="50" cy="40" r="3" fill="#7C3AED" />
          <line x1="50" y1="6" x2="50" y2="74" stroke="#7C3AED" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.4" />
          <line x1="16" y1="40" x2="84" y2="40" stroke="#7C3AED" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.4" />
          <motion.path
            d="M32,58 L46,44 M42,42 L47,41 L48,46"
            stroke="#7C3AED"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ x: [0, 2, 0], y: [0, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      );
    }

    if (normalizedTitle.includes("component") || normalizedTitle.includes("design") || quizIndex === 2) {
      return (
        <svg className="w-full h-full text-[#7C3AED]" viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="15" y="15" width="70" height="50" rx="4" stroke="#E2E8F0" fill="currentColor" fillOpacity="0.02" />
          <rect x="25" y="24" width="22" height="10" rx="5" fill="#7C3AED" fillOpacity="0.1" stroke="#7C3AED" strokeWidth="1" />
          <motion.circle
            cx="40" cy="29" r="3"
            fill="#7C3AED"
            animate={{ cx: [30, 40, 30] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <rect x="25" y="42" width="22" height="10" rx="5" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
          <circle cx="30" cy="47" r="3" fill="#94A3B8" />
          <path d="M53,29 L68,29 M53,47 L68,47" stroke="#7C3AED" strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity="0.6" />
          <circle cx="70" cy="29" r="2" fill="#7C3AED" />
          <circle cx="70" cy="47" r="2" fill="#CBD5E1" />
        </svg>
      );
    }

    return (
      <svg className="w-full h-full text-[#7C3AED]" viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="50" cy="44" r="22" stroke="#E2E8F0" strokeWidth="2.5" />
        <circle cx="50" cy="44" r="22" stroke="#7C3AED" strokeWidth="2.5" strokeDasharray="30 110" />
        <rect x="47" y="16" width="6" height="6" rx="1" fill="#7C3AED" />
        <line x1="50" y1="44" x2="50" y2="30" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" />
        <motion.line
          x1="50" y1="44" x2="62" y2="44"
          stroke="#7C3AED"
          strokeWidth="1.2"
          strokeLinecap="round"
          animate={{ rotate: 360 }}
          style={{ originX: "50px", originY: "44px" }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        <circle cx="50" cy="44" r="2" fill="#7C3AED" />
      </svg>
    );
  };

  const renderFlashcardPreview = (moduleNo: number, title: string) => {
    return (
      <svg className="w-full h-full text-[#7C3AED]" viewBox="0 0 150 80" fill="none" stroke="currentColor" strokeWidth="1.2">
        <motion.rect
          x="35" y="25" width="80" height="42" rx="4"
          fill="currentColor" fillOpacity="0.02"
          stroke="#7C3AED" strokeOpacity="0.3"
          variants={{
            rest: { x: 0, y: 0, rotate: 0 },
            hover: { x: 12, y: -8, rotate: 4 }
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
        <motion.rect
          x="35" y="22" width="80" height="42" rx="4"
          fill="currentColor" fillOpacity="0.04"
          stroke="#7C3AED" strokeOpacity="0.6"
          variants={{
            rest: { x: 0, y: 0, rotate: 0 },
            hover: { x: 6, y: -4, rotate: -2 }
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
        <rect x="35" y="18" width="80" height="42" rx="4" fill="white" stroke="#7C3AED" strokeWidth="1.5" />
        <line x1="45" y1="28" x2="75" y2="28" stroke="#7C3AED" strokeWidth="2.5" />
        <line x1="45" y1="36" x2="105" y2="36" stroke="#7C3AED" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="45" y1="44" x2="95" y2="44" stroke="#7C3AED" strokeWidth="1" strokeOpacity="0.5" />
        <circle cx="103" cy="28" r="4" fill="#7C3AED" fillOpacity="0.1" stroke="#7C3AED" strokeWidth="0.8" />
        <path d="M101.5,28 L102.5,29 L104.5,27" stroke="#7C3AED" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  const themeKey = isUiProgramming ? "ui programming" : (subjectNameLower.includes("python") ? "python programming" : "");
  const t = THEME_MAP[themeKey] || DEFAULT_THEME;
  const isPremiumTheme = isUiProgramming;

  return (
    <div className={`min-h-screen relative ${t.bg} ${t.pattern} pb-16 pt-8 brutalist-transition transition-colors duration-300 overflow-hidden`}>

      {/* Structural Embedded CSS Overrides */}
      <style jsx global>{`
        .brutalist-transition {
          transition: all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .ui-blueprint-grid {
          background-color: #F8F9FC;
          position: relative;
        }
        .python-matrix-terminal {
          background-size: 40px 40px;
          background-image: linear-gradient(to bottom, rgba(55, 118, 171, 0.03) 50%, rgba(0, 0, 0, 0) 50%), 
                            linear-gradient(to right, rgba(255, 212, 59, 0.02) 1px, transparent 1px);
        }
        /* Style fixes for the Python Dark Mode Variant */
        .python-matrix-terminal .text-zinc-900,
        .python-matrix-terminal .text-zinc-800,
        .python-matrix-terminal h2,
        .python-matrix-terminal h3 { color: #ffffff !important; }
        .python-matrix-terminal .text-zinc-500,
        .python-matrix-terminal p { color: #a1a1aa !important; }
        .python-matrix-terminal span { color: #e4e4e7 !important; }

        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(0.5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.04; }
          50% { opacity: 0.08; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        /* Microinteractions: grows underline from left */
        .design-studio-link {
          position: relative;
          color: #7C3AED;
          font-weight: 600;
        }
        .design-studio-link::after {
          content: '';
          position: absolute;
          width: 100%;
          transform: scaleX(0);
          height: 2px;
          bottom: -2px;
          left: 0;
          background-color: #7C3AED;
          transform-origin: bottom left;
          transition: transform 0.25s ease-out;
        }
        .design-studio-link:hover::after {
          transform: scaleX(1);
        }
      `}</style>

      {/* Layered Design-System inspired Background */}
      {isPremiumTheme && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
          {/* Subtle Grid Pattern (2%-6% opacity overall) */}
          <div className="absolute inset-0 bg-[#F8F9FC]" style={{
            backgroundImage: "radial-gradient(circle, rgba(148, 163, 184, 0.12) 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px"
          }} />

          {/* Blueprint-style guides, nodes, outlines and connections */}
          <svg className="absolute inset-0 w-full h-full text-slate-400" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="ruler-x" width="100" height="20" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1" opacity="0.04" />
                <line x1="10" y1="0" x2="10" y2="5" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="20" y1="0" x2="20" y2="5" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="30" y1="0" x2="30" y2="5" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="40" y1="0" x2="40" y2="5" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="50" y1="0" x2="50" y2="8" stroke="currentColor" strokeWidth="1" opacity="0.04" />
                <line x1="60" y1="0" x2="60" y2="5" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="70" y1="0" x2="70" y2="5" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="80" y1="0" x2="80" y2="5" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="90" y1="0" x2="90" y2="5" stroke="currentColor" strokeWidth="1" opacity="0.03" />
              </pattern>
              <pattern id="ruler-y" width="20" height="100" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="10" y2="0" stroke="currentColor" strokeWidth="1" opacity="0.04" />
                <line x1="0" y1="10" x2="5" y2="10" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="0" y1="20" x2="5" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="0" y1="30" x2="5" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="0" y1="40" x2="5" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="0" y1="50" x2="8" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.04" />
                <line x1="0" y1="60" x2="5" y2="60" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="0" y1="70" x2="5" y2="70" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="0" y1="80" x2="5" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.03" />
                <line x1="0" y1="90" x2="5" y2="90" stroke="currentColor" strokeWidth="1" opacity="0.03" />
              </pattern>
            </defs>

            {/* Ruler guides */}
            <rect x="0" y="0" width="100%" height="20" fill="url(#ruler-x)" />
            <rect x="0" y="0" width="20" height="100%" fill="url(#ruler-y)" />

            {/* Connection lines and node circles (opacity 2% - 6%) */}
            <line x1="15%" y1="0" x2="15%" y2="100%" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.03" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.02" />
            <line x1="82%" y1="0" x2="82%" y2="100%" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.03" />
            <line x1="0" y1="220" x2="100%" y2="220" stroke="currentColor" strokeWidth="1" opacity="0.03" />
            <line x1="0" y1="720" x2="100%" y2="720" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.03" />

            {/* Large Design Circles */}
            <circle cx="20%" cy="35%" r="300" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.03" />
            <circle cx="85%" cy="60%" r="400" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="8 8" opacity="0.02" />

            {/* Outlines of UI Components */}
            <rect x="8%" y="150" width="160" height="120" rx="8" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.03" />
            <circle cx="8%" cy="150" r="3" fill="currentColor" opacity="0.04" />
            <circle cx="168" cy="270" r="3" fill="currentColor" opacity="0.04" />

            <rect x="44%" y="500" width="260" height="130" rx="8" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 5" fill="none" opacity="0.03" />

            {/* Abstract node networks */}
            <g opacity="0.04">
              <circle cx="78%" cy="260" r="4.5" fill="currentColor" />
              <circle cx="84%" cy="320" r="4.5" fill="currentColor" />
              <circle cx="75%" cy="360" r="4.5" fill="currentColor" />
              <circle cx="90%" cy="280" r="4.5" fill="currentColor" />
              <line x1="78%" y1="260" x2="84%" y2="320" stroke="currentColor" strokeWidth="1" />
              <line x1="84%" y1="320" x2="75%" y2="360" stroke="currentColor" strokeWidth="1" />
              <line x1="78%" y1="260" x2="90%" y2="280" stroke="currentColor" strokeWidth="1" />
              <line x1="90%" y1="280" x2="84%" y2="320" stroke="currentColor" strokeWidth="1" />
            </g>

            {/* Technical text canvas indicators */}
            <text x="35" y="45" fill="currentColor" opacity="0.04" fontSize="9" fontFamily="monospace">GRID_SCALE: 24PX</text>
            <text x="83%" y="90" fill="currentColor" opacity="0.04" fontSize="9" fontFamily="monospace">WORKSPACE // 1920X1080</text>
          </svg>

          {/* Glowing colorful auras for design depth */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-[#7C3AED]/5 to-[#3B82F6]/5 rounded-full blur-3xl opacity-60 animate-pulse-slow" />
          <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#10B981]/5 to-[#F59E0B]/5 rounded-full blur-3xl opacity-40 animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        {/* Welcome & Top Stats Banner Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className={`${isPremiumTheme
              ? 'bg-white/90 backdrop-blur-md border-none shadow-[0_8px_32px_rgba(0,0,0,0.04)]'
              : t.borderClass + ' ' + t.cardBg + ' ' + t.shadowClass
              } brutalist-transition overflow-hidden relative h-full rounded-[22px]`}>

              {/* Thin gradient border simulation overlay */}
              {isPremiumTheme && (
                <div className="absolute inset-0 rounded-[22px] pointer-events-none p-[1.2px] bg-gradient-to-br from-white/80 via-[#7C3AED]/20 to-slate-200/50 -z-10" />
              )}

              {/* Showcase visual graphics (Desktop, Cursor, Snippets, Tokens) */}
              {isPremiumTheme ? (
                <>
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.15] z-0">
                    {/* Dotted backdrop layout */}
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle, #7C3AED 1px, transparent 1px)`,
                      backgroundSize: '16px 16px'
                    }} />
                  </div>

                  {/* Floating SaaS wireframe component showcase inside Browser Mockup */}
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 w-80 h-52 pointer-events-none select-none hidden md:block z-20">
                    <svg className="w-full h-full" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Browser window frame */}
                      <rect x="10" y="10" width="300" height="200" rx="12" fill="white" stroke="#E2E8F0" strokeWidth="1.5" className="shadow-lg" />
                      {/* Browser top header */}
                      <rect x="10.75" y="10.75" width="298.5" height="30" rx="11.25" fill="#F8FAFC" />
                      <circle cx="28" cy="25" r="4.5" fill="#EF4444" />
                      <circle cx="42" cy="25" r="4.5" fill="#F59E0B" />
                      <circle cx="56" cy="25" r="4.5" fill="#10B981" />
                      <rect x="80" y="20" width="160" height="10" rx="5" fill="#E2E8F0" opacity="0.7" />

                      {/* Dotted canvas inside browser */}
                      <g opacity="0.3">
                        <line x1="10" y1="40" x2="310" y2="40" stroke="#E2E8F0" />
                        <line x1="70" y1="40" x2="70" y2="210" stroke="#E2E8F0" strokeDasharray="3 3" />
                      </g>

                      {/* Floating Design Component 1: Typography Block */}
                      <motion.g
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
                      >
                        <rect x="25" y="55" width="110" height="50" rx="8" fill="white" stroke="#7C3AED" strokeWidth="1.2" className="shadow-md" />
                        <rect x="35" y="65" width="20" height="20" rx="4" fill="#7C3AED" fillOpacity="0.1" />
                        <text x="41" y="78" fill="#7C3AED" fontSize="10" fontWeight="bold" fontFamily="sans-serif">H1</text>
                        <rect x="62" y="67" width="60" height="6" rx="3" fill="#1E293B" />
                        <rect x="62" y="78" width="45" height="4" rx="2" fill="#64748B" />
                        <rect x="62" y="86" width="30" height="4" rx="2" fill="#94A3B8" opacity="0.5" />
                      </motion.g>

                      {/* Floating Design Component 2: Design Tokens */}
                      <motion.g
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 11, ease: "easeInOut", repeat: Infinity }}
                      >
                        <rect x="25" y="120" width="110" height="75" rx="8" fill="white" stroke="#3B82F6" strokeWidth="1.2" className="shadow-md" />
                        <text x="35" y="138" fill="#3B82F6" fontSize="9" fontWeight="bold" fontFamily="monospace">tokens.json</text>
                        <rect x="35" y="148" width="90" height="4" rx="2" fill="#E2E8F0" />
                        <rect x="35" y="158" width="75" height="4" rx="2" fill="#3B82F6" fillOpacity="0.3" />
                        <circle cx="40" cy="178" r="6" fill="#7C3AED" />
                        <circle cx="56" cy="178" r="6" fill="#3B82F6" />
                        <circle cx="72" cy="178" r="6" fill="#10B981" />
                        <circle cx="88" cy="178" r="6" fill="#F59E0B" />
                      </motion.g>

                      {/* Floating Design Component 3: Button wireframe with cursor */}
                      <motion.g
                        animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
                        transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
                      >
                        <rect x="155" y="65" width="135" height="65" rx="8" fill="white" stroke="#10B981" strokeWidth="1.2" className="shadow-md" />
                        <rect x="167" y="78" width="110" height="24" rx="6" fill="#10B981" fillOpacity="0.08" stroke="#10B981" strokeWidth="1.2" />
                        <circle cx="182" cy="90" r="5" fill="#10B981" />
                        <rect x="195" y="87" width="55" height="6" rx="3" fill="#10B981" />
                        <line x1="262" y1="78" x2="262" y2="102" stroke="#10B981" strokeWidth="1" strokeDasharray="2 2" />
                        <text x="167" y="122" fill="#94A3B8" fontSize="7" fontFamily="monospace">btn-primary</text>
                      </motion.g>

                      {/* Floating Design Component 4: Small Code Snippet */}
                      <motion.g
                        animate={{ y: [0, 6, 0], x: [0, -4, 0] }}
                        transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
                      >
                        <rect x="155" y="145" width="135" height="50" rx="8" fill="#1E293B" className="shadow-lg" />
                        <rect x="165" y="157" width="85" height="4" rx="2" fill="#38BDF8" />
                        <rect x="165" y="167" width="105" height="4" rx="2" fill="#F472B6" />
                        <rect x="165" y="177" width="60" height="4" rx="2" fill="#34D399" />
                        <circle cx="265" cy="180" r="8" fill="#7C3AED" fillOpacity="0.4" className="animate-ping" />
                        <circle cx="265" cy="180" r="4" fill="#7C3AED" />
                      </motion.g>

                      {/* Drifting Figma Cursor */}
                      <motion.g
                        animate={{
                          x: [180, 220, 200, 180],
                          y: [120, 95, 135, 120]
                        }}
                        transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
                      >
                        <path d="M0,0 L0,16 L4.5,12.5 L8.5,20 L11.5,18.5 L7.5,11 L13,11 Z" fill="#7C3AED" stroke="white" strokeWidth="1" />
                        <rect x="14" y="14" width="48" height="15" rx="3" fill="#7C3AED" />
                        <text x="18" y="24" fill="white" fontSize="8" fontWeight="bold" fontFamily="sans-serif">DESIGN</text>
                      </motion.g>
                    </svg>
                  </div>
                </>
              ) : (
                <div className={`absolute top-0 left-0 right-0 h-4 ${t.btnPrimary.split(" ")[0] || "bg-black"} border-b-4 border-black`} />
              )}
              <CardHeader className="pt-8 pb-6 relative z-10">
                <div className="max-w-[60%]">
                  <CardTitle className={`text-3xl md:text-4xl ${t.textHeading}`}>
                    Welcome to {subject.name}
                  </CardTitle>
                  <CardDescription className={`${t.textMuted} mt-2 text-base`}>
                    {subject.description || "Explore modules, quizzes, and resources."}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Quick Resume Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <DesignStudioCard isPremium={isPremiumTheme} className="h-full relative overflow-hidden bg-white/92 backdrop-blur-md border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
              {/* Aurora background glow */}
              {isPremiumTheme && (
                <div className="absolute inset-0 pointer-events-none -z-10 opacity-30">
                  <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] blur-3xl" />
                </div>
              )}
              {isPremiumTheme && (
                <motion.div
                  className="absolute bottom-6 right-8 text-[#7C3AED] pointer-events-none select-none z-10"
                  animate={{
                    x: [0, -25, -10, 0],
                    y: [0, -15, -25, 0]
                  }}
                  transition={{
                    duration: 8,
                    ease: "easeInOut",
                    repeat: Infinity
                  }}
                >
                  <MousePointer className="w-8 h-8 fill-current stroke-white stroke-[1.5]" />
                  <span className="absolute left-6 top-6 bg-[#7C3AED] text-[8px] text-white px-1.5 py-0.5 rounded font-sans font-bold shadow-sm whitespace-nowrap">Interactive</span>
                </motion.div>
              )}
              <CardHeader>
                <CardTitle className={`text-lg flex items-center font-bold uppercase tracking-tight text-slate-800`}>
                  {isPremiumTheme ? (
                    <span className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-50"></span>
                      </span>
                      Active Workspace
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-5 h-5 mr-2" /> Active Module
                    </span>
                  )}
                </CardTitle>
                <CardDescription className={t.textMuted}>Resume your training session</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeModule ? (
                  <>
                    <div className="space-y-2">
                      <div className={`text-sm font-semibold tracking-tight text-slate-850 line-clamp-2`}>
                        {activeModule.title}
                      </div>
                      {isPremiumTheme && (
                        <div className="flex gap-2 items-center text-[10px] font-mono text-slate-400">
                          <span className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200/60 uppercase text-[9px] font-bold">ACTIVE</span>
                          <span>PROGRESS // 0%</span>
                        </div>
                      )}
                    </div>
                    <Link href={`/student/subjects/subject/modules/item?subjectId=${subjectId}&id=${activeModule.id}`}>
                      <motion.div
                        whileHover={isPremiumTheme ? { y: -3 } : {}}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        <Button className={`w-full mt-2 group relative overflow-hidden transition-all duration-300 ${isPremiumTheme
                          ? "bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] hover:shadow-[0_20px_40px_rgba(124,58,237,0.25)] border-none text-white font-medium text-sm rounded-xl py-5"
                          : t.btnPrimary
                          }`}>
                          <span>Start Module</span>
                          <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1.5" />
                        </Button>
                      </motion.div>
                    </Link>
                  </>
                ) : (
                  <div className="py-6 text-center text-zinc-400 font-bold text-sm">
                    No active modules available.
                  </div>
                )}
              </CardContent>
            </DesignStudioCard>
          </motion.div>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-10">

            {/* 1. Learning Modules */}
            <div>
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className={`text-2xl ${t.textHeading} flex items-center`}>
                    {isPremiumTheme ? <Layers className="w-6 h-6 mr-2 text-[#7C3AED]" /> : <Layers className="w-6 h-6 mr-2" />} Learning Modules
                  </h2>
                  <p className={`text-sm ${t.textMuted} mt-1`}>Explore all the topics for this subject</p>
                </div>
                <Link href={`/student/subjects/subject/modules?subjectId=${subjectId}`}>
                  <Button variant="ghost" className={`${t.btnGhost} flex items-center`}>
                    <span>View All Modules</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.slice(0, 4).map((mod: any) => {
                  return (
                    <Link key={mod.id} href={`/student/subjects/subject/modules/item?subjectId=${subjectId}&id=${mod.id}`}>
                      <motion.div
                        whileHover={isPremiumTheme ? "hover" : ""}
                        animate="rest"
                        className="h-full"
                      >
                        <motion.div
                          variants={{
                            rest: { y: 0, scale: 1 },
                            hover: { y: -8, scale: 1.012 }
                          }}
                          transition={{ type: "spring", stiffness: 350, damping: 22 }}
                          className="h-full"
                        >
                          <DesignStudioCard isPremium={isPremiumTheme} className={`h-full ${isPremiumTheme
                            ? 'bg-gradient-to-br from-white/98 via-white/95 to-[#7C3AED]/10 hover:from-[#8B5CF6] hover:via-[#8B5CF6] hover:to-[#8B5CF6] backdrop-blur-md border border-slate-200/80 group-hover:border-[#7C3AED] shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] rounded-[22px]'
                            : t.borderClass + ' ' + t.cardBg + ' ' + t.shadowClass + ' flex flex-col justify-between'
                            } brutalist-transition overflow-hidden group`}
                          >
                            <CardHeader className={isPremiumTheme ? "p-3 md:p-4 pb-1.5 md:pb-2 relative z-10" : "pb-3 relative z-10"}>
                              {/* Badge */}
                              <div className="flex justify-between items-start mb-2">
                                <motion.span
                                  variants={{
                                    rest: { y: 0, boxShadow: "0 0px 0px rgba(0,0,0,0)" },
                                    hover: { y: -2, boxShadow: "0 4px 12px rgba(124, 58, 237, 0.08)" }
                                  }}
                                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                  className={`text-xs px-2.5 py-1 transition-all duration-300 ${isPremiumTheme
                                    ? "bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20 rounded-md font-bold group-hover:bg-white group-hover:text-[#8B5CF6] group-hover:border-white"
                                    : t.badge
                                    }`}
                                >
                                  Module {mod.moduleNo}
                                </motion.span>
                              </div>

                              {/* ── ILLUSTRATION — PROTECTED ZONE, NO CHANGES ON HOVER ── */}
                              {isPremiumTheme && (
                                <div className="w-full h-20 bg-white border border-slate-100 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                                  <motion.div
                                    variants={{ hover: { x: 6, y: -4 } }}
                                    className="w-full h-full"
                                  >
                                    {renderModulePreview(mod.moduleNo, mod.title)}
                                  </motion.div>
                                  <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
                                    backgroundImage: `linear-gradient(to right, #7C3AED 1px, transparent 1px), linear-gradient(to bottom, #7C3AED 1px, transparent 1px)`,
                                    backgroundSize: '8px 8px'
                                  }} />
                                </div>
                              )}

                              {/* Title */}
                              <CardTitle className={`text-lg transition-colors duration-300 line-clamp-2 ${isPremiumTheme
                                ? 'font-semibold font-sans tracking-tight text-slate-800 group-hover:text-white'
                                : t.titleHover + ' font-black leading-tight'
                                }`}>
                                {mod.title}
                              </CardTitle>
                            </CardHeader>

                            <CardContent className={isPremiumTheme ? "p-3 md:p-4 pt-0 relative z-10" : "flex-1 flex flex-col justify-between"}>
                              <div className={`pt-2 flex justify-between items-center text-xs font-bold transition-all duration-300 ${isPremiumTheme
                                ? 'border-t border-slate-100 text-slate-400 font-sans group-hover:text-white/85 group-hover:border-white/20'
                                : 'border-t-2 border-black text-zinc-500'
                                }`}>
                                <div className="flex gap-3">
                                  <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {mod.hours || 3} Hours</span>
                                  <span className="flex items-center"><Book className="w-3.5 h-3.5 mr-1" /> {mod.subtopics?.length || 0} Units</span>
                                </div>
                                {isPremiumTheme && (
                                  <motion.span
                                    variants={{ hover: { x: 8 } }}
                                    className="text-[#7C3AED] group-hover:text-white flex items-center transition-colors duration-300"
                                  >
                                    <ArrowRight className="w-4 h-4" />
                                  </motion.span>
                                )}
                              </div>
                            </CardContent>
                          </DesignStudioCard>
                        </motion.div>
                      </motion.div>
                    </Link>
                  );
                })}
                {modules.length === 0 && (
                  <div className={`col-span-full py-8 text-center font-bold ${t.borderClass} ${t.cardBg} border-dashed`}>
                    No modules available yet.
                  </div>
                )}
              </div>
            </div>

            {/* 2. Available Quizzes */}
            <div>
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className={`text-2xl ${t.textHeading} flex items-center`}>
                    {isPremiumTheme ? <Component className="w-6 h-6 mr-2 text-[#7C3AED]" /> : <Target className="w-6 h-6 mr-2" />} Quizzes & Assessments
                  </h2>
                  <p className={`text-sm ${t.textMuted} mt-1`}>Test your knowledge</p>
                </div>
                <Link href={`/student/subjects/subject/quizzes?subjectId=${subjectId}`}>
                  <Button variant="ghost" className={`${t.btnGhost} flex items-center`}>
                    <span>View All Quizzes</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {quizzesWithAttempts.slice(0, 3).map((quiz: any) => {
                  return (
                    <motion.div
                      key={quiz.id}
                      className="h-full"
                      whileHover={isPremiumTheme ? "hover" : ""}
                      animate="rest"
                    >
                      <motion.div
                        variants={{
                          rest: { y: 0, scale: 1 },
                          hover: { y: -8, scale: 1.012 }
                        }}
                        transition={{ type: "spring", stiffness: 350, damping: 22 }}
                      >
                        <DesignStudioCard isPremium={isPremiumTheme} className={`h-full ${isPremiumTheme
                          ? 'bg-gradient-to-br from-white/98 via-white/95 to-[#7C3AED]/10 hover:from-[#8B5CF6] hover:via-[#8B5CF6] hover:to-[#8B5CF6] backdrop-blur-md border border-slate-200/80 group-hover:border-[#7C3AED] shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] rounded-[22px]'
                          : t.borderClass + ' ' + t.cardBg + ' ' + t.shadowClass + ' flex flex-col justify-between'
                          } brutalist-transition overflow-hidden group`}
                        >
                          <div className="flex flex-col sm:flex-row relative z-10">
                            {/* ── ILLUSTRATION SIDEBAR — PROTECTED ZONE ── */}
                            {isPremiumTheme && (
                              <div className="w-full sm:w-28 bg-white border-b sm:border-b-0 sm:border-r border-slate-100 flex items-center justify-center p-3 flex-shrink-0 relative overflow-hidden transition-all duration-300">
                                <motion.div
                                  variants={{ hover: { x: 6, y: -4 } }}
                                  className="w-full h-16 flex items-center justify-center"
                                >
                                  {renderQuizPreview(quizzesWithAttempts.indexOf(quiz) + 1, quiz.title)}
                                </motion.div>
                                <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
                                  backgroundImage: `linear-gradient(to right, #7C3AED 1px, transparent 1px), linear-gradient(to bottom, #7C3AED 1px, transparent 1px)`,
                                  backgroundSize: '6px 6px'
                                }} />
                              </div>
                            )}
                            <div className="p-5 flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <motion.span
                                  variants={{
                                    rest: { y: 0, boxShadow: "0 0px 0px rgba(0,0,0,0)" },
                                    hover: { y: -2, boxShadow: "0 4px 12px rgba(124, 58, 237, 0.08)" }
                                  }}
                                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                  className={`text-xs px-2.5 py-1 transition-all duration-300 ${isPremiumTheme
                                    ? "bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20 rounded-md font-bold group-hover:bg-white group-hover:text-[#8B5CF6] group-hover:border-white"
                                    : t.badge
                                    }`}
                                >
                                  Module {quiz.module?.moduleNo || "?"}
                                </motion.span>
                              </div>
                              <h3 className={`text-lg transition-colors mb-2 ${isPremiumTheme
                                ? 'font-semibold font-sans tracking-tight text-slate-800 group-hover:text-white'
                                : t.titleHover + ' font-black leading-tight'
                                }`}>
                                {quiz.title}
                              </h3>
                              <div className="flex items-center gap-4 text-xs font-semibold font-mono text-slate-500 group-hover:text-white/85 transition-colors duration-300">
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {quiz.timeLimit || 30} mins</span>
                                <span className="flex items-center gap-1"><Target className="w-4 h-4" /> {quiz.totalMarks || 100} Marks</span>
                              </div>
                            </div>
                            <div className={`p-5 flex flex-col justify-center items-center ${isPremiumTheme
                              ? 'min-w-[150px] border-l border-slate-100 group-hover:bg-white/10 group-hover:border-white/20'
                              : 'border-t sm:border-t-0 sm:border-l-4 border-black ' + (themeKey === 'python programming' ? 'bg-zinc-900' : 'bg-zinc-100')
                              } transition-all duration-300`}
                            >
                              <Link href={`/student/subjects/subject/quizzes/item?subjectId=${subjectId}&id=${quiz.id}`} className="w-full">
                                <Button className={`w-full group/btn ${isPremiumTheme ? "font-semibold tracking-normal text-sm group-hover:bg-white group-hover:text-[#8B5CF6] group-hover:border-white transition-all duration-300" : "font-black uppercase tracking-wider"} ${t.btnPrimary}`}>
                                  <span>Start Quiz</span>
                                  {isPremiumTheme && <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover/btn:translate-x-1.5" />}
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </DesignStudioCard>
                      </motion.div>
                    </motion.div>
                  );
                })}
                {quizzesWithAttempts.length === 0 && (
                  <div className={`py-8 text-center font-bold ${t.borderClass} ${t.cardBg} border-dashed`}>
                    No quizzes assigned yet.
                  </div>
                )}
              </div>
            </div>

            {/* 3. Flashcard Decks */}
            <div>
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className={`text-2xl ${t.textHeading} flex items-center`}>
                    {isPremiumTheme ? <Palette className="w-6 h-6 mr-2 text-[#7C3AED]" /> : <Zap className="w-6 h-6 mr-2" />} Flashcard Decks
                  </h2>
                  <p className={`text-sm ${t.textMuted} mt-1`}>Quick revision decks</p>
                </div>
                <Link href={`/student/subjects/subject/flashcards?subjectId=${subjectId}`}>
                  <Button variant="ghost" className={`${t.btnGhost} flex items-center`}>
                    <span>View All Decks</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                {flashcardDecks.slice(0, 4).map((deck: any) => {
                  return (
                    <Link key={deck.id} href={`/student/subjects/subject/flashcards/item?subjectId=${subjectId}&id=${deck.id}`} className="block h-full">
                      <motion.div
                        whileHover={isPremiumTheme ? "hover" : ""}
                        animate="rest"
                        className="h-full"
                      >
                        <motion.div
                          variants={{
                            rest: { y: 0, scale: 1 },
                            hover: { y: -8, scale: 1.012 }
                          }}
                          transition={{ type: "spring", stiffness: 350, damping: 22 }}
                          className="h-full relative group"
                        >
                          {/* Stack offset backgrounds — frozen, no hover changes */}
                          {isPremiumTheme && (
                            <>
                              <div
                                className="absolute inset-0 bg-slate-100 rounded-[22px] border border-slate-200/80 translate-y-1.5 translate-x-1.5 pointer-events-none transition-opacity duration-200 group-hover:opacity-0"
                              />
                              <div
                                className="absolute inset-0 bg-slate-50 rounded-[22px] border border-slate-200/60 translate-y-3 translate-x-3 pointer-events-none transition-opacity duration-200 opacity-60 group-hover:opacity-0"
                              />
                            </>
                          )}
                          <DesignStudioCard isPremium={isPremiumTheme} className={`h-full ${isPremiumTheme
                            ? 'bg-gradient-to-br from-white/98 via-white/95 to-[#7C3AED]/10 hover:from-[#8B5CF6] hover:via-[#8B5CF6] hover:to-[#8B5CF6] backdrop-blur-md border border-slate-200/80 group-hover:border-[#7C3AED] shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] rounded-[22px]'
                            : t.borderClass + ' ' + t.cardBg + ' ' + t.shadowClass + ' flex flex-col justify-between'
                            } brutalist-transition relative z-10 overflow-hidden group`}
                          >
                            <CardHeader className="p-3 md:p-4 pb-1.5 md:pb-2">
                              <div className="flex justify-between items-start mb-2">
                                <motion.span
                                  variants={{
                                    rest: { y: 0, boxShadow: "0 0px 0px rgba(0,0,0,0)" },
                                    hover: { y: -2, boxShadow: "0 4px 12px rgba(124, 58, 237, 0.08)" }
                                  }}
                                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                  className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all duration-300 ${isPremiumTheme
                                    ? "bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20 group-hover:bg-white group-hover:text-[#8B5CF6] group-hover:border-white"
                                    : t.badge
                                    }`}
                                >
                                  Module {deck.module?.moduleNo || "?"}
                                </motion.span>
                              </div>
                              {/* ── ILLUSTRATION — PROTECTED ZONE ── */}
                              {isPremiumTheme && (
                                <div className="w-full h-24 bg-white border border-slate-100 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden transition-all duration-300">
                                  <motion.div
                                    variants={{ hover: { x: 6, y: -4 } }}
                                    className="w-full h-full flex items-center justify-center"
                                  >
                                    {renderFlashcardPreview(deck.module?.moduleNo || 0, deck.title)}
                                  </motion.div>
                                  <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
                                    backgroundImage: `linear-gradient(to right, #7C3AED 1px, transparent 1px), linear-gradient(to bottom, #7C3AED 1px, transparent 1px)`,
                                    backgroundSize: '6px 6px'
                                  }} />
                                </div>
                              )}
                              <CardTitle
                                className={`text-lg transition-colors line-clamp-2 ${isPremiumTheme
                                  ? 'font-semibold font-sans tracking-tight text-slate-800 group-hover:text-white'
                                  : t.titleHover + ' font-black leading-tight'
                                  }`}
                              >
                                {deck.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 md:p-4 pt-0">
                              <div
                                className={`flex items-center text-sm font-bold transition-colors duration-300 ${isPremiumTheme ? 'text-[#7C3AED] group-hover:text-white' : 'text-zinc-500'}`}
                              >
                                <Layers
                                  className={`w-4 h-4 mr-1.5 transition-colors duration-300 ${isPremiumTheme ? 'text-[#7C3AED] group-hover:text-white' : 'text-zinc-500'}`}
                                />
                                {deck.cards?.length || 0} Cards
                              </div>
                            </CardContent>
                          </DesignStudioCard>
                        </motion.div>
                      </motion.div>
                    </Link>
                  );
                })}
                {flashcardDecks.length === 0 && (
                  <div className={`col-span-full py-8 text-center font-bold ${t.borderClass} ${t.cardBg} border-dashed`}>
                    No flashcard decks available yet.
                  </div>
                )}
              </div>
            </div>

            {/* 4. Mind Maps */}
            <div>
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className={`text-2xl ${t.textHeading} flex items-center`}>
                    {isPremiumTheme ? <Grid className="w-6 h-6 mr-2 text-[#7C3AED]" /> : <Brain className="w-6 h-6 mr-2" />} Interactive Mind Maps
                  </h2>
                  <p className={`text-sm ${t.textMuted} mt-1`}>Explore visual topic structures</p>
                </div>
                <Link href={`/student/subjects/subject/mindmaps?subjectId=${subjectId}`}>
                  <Button variant="ghost" className={`${t.btnGhost} flex items-center`}>
                    <span>View All Mind Maps</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mindmaps.slice(0, 4).map((map: any) => {
                  return (
                    <Link key={map.id} href={`/student/subjects/subject/mindmaps/item?subjectId=${subjectId}&id=${map.id}`} className="block h-full">
                      <motion.div
                        whileHover={isPremiumTheme ? "hover" : ""}
                        animate="rest"
                        className="h-full"
                      >
                        <motion.div
                          variants={{
                            rest: { y: 0, scale: 1 },
                            hover: { y: -8, scale: 1.012 }
                          }}
                          transition={{ type: "spring", stiffness: 350, damping: 22 }}
                          className="h-full"
                        >
                          <DesignStudioCard isPremium={isPremiumTheme} className={`h-full ${isPremiumTheme
                            ? 'bg-gradient-to-br from-white/98 via-white/95 to-[#7C3AED]/10 hover:from-[#8B5CF6] hover:via-[#8B5CF6] hover:to-[#8B5CF6] backdrop-blur-md border border-slate-200/80 group-hover:border-[#7C3AED] shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] rounded-[22px]'
                            : t.borderClass + ' ' + t.cardBg + ' ' + t.shadowClass + ' flex flex-col justify-between'
                            } brutalist-transition overflow-hidden group`}
                          >
                            <CardHeader className="p-3 md:p-4 pb-1.5 md:pb-2">
                              <div className="flex justify-between items-start mb-2">
                                <motion.span
                                  variants={{
                                    rest: { y: 0, boxShadow: "0 0px 0px rgba(0,0,0,0)" },
                                    hover: { y: -2, boxShadow: "0 4px 12px rgba(124, 58, 237, 0.08)" }
                                  }}
                                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                  className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all duration-300 ${isPremiumTheme
                                    ? "bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20 group-hover:bg-white group-hover:text-[#8B5CF6] group-hover:border-white"
                                    : t.badge
                                    }`}
                                >
                                  Mind Map
                                </motion.span>
                              </div>
                              {/* ── ILLUSTRATION — PROTECTED ZONE ── */}
                              {isPremiumTheme && (
                                <div className="w-full h-12 bg-white border border-slate-100 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden transition-all duration-300">
                                  <motion.div
                                    variants={{ hover: { x: 6, y: -4 } }}
                                    className="w-full h-full flex items-center justify-center"
                                  >
                                    <svg className="w-full h-full text-[#7C3AED]/60" viewBox="0 0 150 40" fill="none" stroke="currentColor" strokeWidth="1.2">
                                      <circle cx="20" cy="20" r="4" fill="currentColor" />
                                      <circle cx="75" cy="20" r="4" fill="currentColor" />
                                      <circle cx="130" cy="20" r="4" fill="currentColor" />
                                      <path d="M24,20 L71,20 M79,20 L126,20" stroke="currentColor" strokeDasharray="3 3" />
                                      <path d="M75,20 L75,10 M75,20 L75,30" stroke="currentColor" strokeWidth="1" />
                                    </svg>
                                  </motion.div>
                                </div>
                              )}
                              <CardTitle
                                className={`text-lg transition-colors line-clamp-2 ${isPremiumTheme
                                  ? 'font-semibold font-sans tracking-tight text-slate-800 group-hover:text-white'
                                  : t.titleHover + ' font-black leading-tight'
                                  }`}
                              >
                                {map.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 md:p-4 pt-0">
                              <div
                                className={`flex items-center text-sm font-bold transition-colors duration-300 ${isPremiumTheme ? 'text-[#7C3AED] group-hover:text-white' : 'text-zinc-500'}`}
                              >
                                <ExternalLink
                                  className={`w-4 h-4 mr-1.5 transition-colors duration-300 ${isPremiumTheme ? 'text-[#7C3AED] group-hover:text-white' : 'text-zinc-500'}`}
                                />
                                Interactive View
                              </div>
                            </CardContent>
                          </DesignStudioCard>
                        </motion.div>
                      </motion.div>
                    </Link>
                  );
                })}
                {mindmaps.length === 0 && (
                  <div className={`col-span-full py-8 text-center font-bold ${t.borderClass} ${t.cardBg} border-dashed`}>
                    No mind maps available yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <motion.div
                whileHover={isPremiumTheme ? "hover" : ""}
                animate="rest"
                className="relative group"
              >
                {/* Paper Stack Decor — frozen */}
                {isPremiumTheme && (
                  <>
                    <div
                      className="absolute inset-x-4 -top-1.5 h-3 rounded-t-[22px] bg-white/80 border-t border-x border-slate-200/80 -z-10 transition-opacity duration-200 group-hover:opacity-0"
                    />
                    <div
                      className="absolute inset-x-8 -top-3 h-3 rounded-t-[22px] bg-white/65 border-t border-x border-slate-200/60 -z-20 transition-opacity duration-200 group-hover:opacity-0"
                    />
                  </>
                )}
                <motion.div
                  variants={{
                    rest: { y: 0, scale: 1 },
                    hover: { y: -8, scale: 1.012 }
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                >
                  <DesignStudioCard isPremium={isPremiumTheme} className={`${isPremiumTheme
                    ? 'bg-gradient-to-br from-white/98 via-white/95 to-[#7C3AED]/10 hover:from-[#8B5CF6] hover:via-[#8B5CF6] hover:to-[#8B5CF6] backdrop-blur-md border border-slate-200/80 group-hover:border-[#7C3AED] shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] rounded-[22px]'
                    : t.borderClass + ' ' + t.cardBg + ' ' + t.shadowClass
                    } brutalist-transition`}
                  >
                    <CardHeader className={`pb-4 relative overflow-hidden transition-colors duration-300 ${isPremiumTheme ? 'border-b border-slate-100 group-hover:border-white/20' : 'border-b-4 border-black'}`}>
                      {isPremiumTheme && (
                        <div className="absolute right-4 top-1.5 opacity-30 select-none pointer-events-none">
                          <motion.div
                            animate={{ y: [0, -6, 0], rotate: [0, 4, 0] }}
                            transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
                          >
                            <FileText className="w-10 h-10 text-[#7C3AED] group-hover:text-white transition-colors duration-300" />
                          </motion.div>
                        </div>
                      )}
                      <CardTitle
                        className={`text-lg flex items-center transition-colors duration-300 ${isPremiumTheme ? 'font-extrabold tracking-tight text-[#111827] group-hover:text-white' : t.textHeading}`}
                      >
                        {isPremiumTheme ? (
                          <span className="flex items-center gap-2">
                            <Columns className="w-5 h-5 text-[#7C3AED] group-hover:text-white transition-colors duration-300" />
                            Reference Materials
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Reference Materials
                          </span>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      {subjectResources.map((resource: any, index: number) => (
                        <div key={index} className="brutalist-resource-item transition-all duration-200 hover:translate-x-1.5">
                          <SubjectResourceCard
                            title={resource.title}
                            type={resource.type}
                            link={resource.link}
                          />
                        </div>
                      ))}
                      {subjectResources.length === 0 && (
                        <p className={`text-sm font-bold text-center py-2 transition-colors duration-300 ${isPremiumTheme ? 'text-slate-400 group-hover:text-white/85' : 'text-zinc-500'}`}>No resources provided yet.</p>
                      )}
                    </CardContent>
                  </DesignStudioCard>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}