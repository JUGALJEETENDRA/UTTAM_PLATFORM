"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fetchGAS } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { GoogleLogin } from "@react-oauth/google";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubjectResourceCard } from "@/components/cards/SubjectResourceCard";
import FloatingBackground from "@/components/ui/FloatingBackground";
import ResourceHeader from "@/components/ui/ResourceHeader";
import {
  TrendingUp, TrendingDown, Layers, Target, Zap, Brain, FileText,
  ArrowRight, Clock, Book, ExternalLink, Globe, Activity, ShieldAlert, Send, BookOpen,
  Folder, FolderOpen, FileCode, Terminal, Play, CheckCircle, Calendar, Bug, Settings, Code,
  ChevronDown, ChevronRight, FileJson, Component, Palette, Monitor, Grid, MousePointer, Layout, Columns,
  Search, Bookmark, Award, Info, Check
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
    bg: "bg-slate-50 text-slate-800 font-sans",
    cardBg: "bg-white",
    borderClass: "border border-slate-200 rounded-xl",
    shadowClass: "shadow-sm transition-all duration-200",
    btnPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs py-2.5 px-4 transition-all font-sans",
    btnGhost: "text-slate-550 hover:text-indigo-650 font-sans text-xs hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 transition-all inline-flex items-center bg-white shadow-sm",
    titleHover: "group-hover:text-indigo-600",
    textHeading: "text-slate-900 font-bold tracking-tight font-sans",
    textMuted: "text-slate-500 font-medium font-sans",
    badge: "font-sans text-[10px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded-lg",
    pattern: ""
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
  titleHover: "group-hover:text-[#2dd4bf]",
  textHeading: "text-black font-black uppercase",
  textMuted: "text-zinc-700 font-medium",
  badge: "bg-zinc-200 text-black border-2 border-black rounded-none",
  pattern: "",
  iconColor: "text-[#2dd4bf]"
};

const brutalistThemeColors = [
  { bg: "bg-[#2dd4bf]", text: "text-[#2dd4bf]", hover: "group-hover:text-[#2dd4bf]" },
  { bg: "bg-[#f43f5e]", text: "text-[#f43f5e]", hover: "group-hover:text-[#f43f5e]" },
  { bg: "bg-[#fbbf24]", text: "text-[#fbbf24]", hover: "group-hover:text-[#fbbf24]" },
  { bg: "bg-[#a855f7]", text: "text-[#a855f7]", hover: "group-hover:text-[#a855f7]" },
  { bg: "bg-[#3b82f6]", text: "text-[#3b82f6]", hover: "group-hover:text-[#3b82f6]" },
  { bg: "bg-[#4ade80]", text: "text-[#4ade80]", hover: "group-hover:text-[#4ade80]" },
  { bg: "bg-[#ec4899]", text: "text-[#ec4899]", hover: "group-hover:text-[#ec4899]" },
];

const getDynamicTheme = (subjectId: string | null) => {
  if (!subjectId) return DEFAULT_THEME;
  let hash = 0;
  for (let i = 0; i < subjectId.length; i++) {
    hash = subjectId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % brutalistThemeColors.length;
  const theme = brutalistThemeColors[colorIndex];
  
  return {
    ...DEFAULT_THEME,
    btnPrimary: `${theme.bg} text-black hover:opacity-90 border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`,
    iconColor: theme.text,
    titleHover: theme.hover,
  };
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

// Premium 3D Tilt Card (Overlays removed per request)
const DesignStudioCard = ({ children, className = "", style = {}, isPremium, label, ...props }: any) => {
  return (
    <div
      className={`relative transition-all duration-300 ease-out rounded-md ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

const CASE_STUDIES = [
  {
    id: "netflix",
    company: "Netflix",
    tag: "Media & Entertainment",
    tagClass: "bg-rose-50 text-rose-700 border-rose-200/60",
    svgClass: "text-rose-600",
    summary: "From DVD rentals to global streaming platform.",
    watermark: "streaming",
    detailedBrief: {
      headline: "The DVD to Streaming Revolution",
      strategicShift: "Business model transition from physical asset logistics (mailing DVDs) to digital cloud distribution.",
      keyEnablers: [
        "Infrastructure migration to AWS cloud to support infinite scaling.",
        "Data-driven recommendation algorithms to drive engagement.",
        "Aggressive capital reinvestment in original IP production."
      ],
      outcome: "Dominant global entertainment platform with over 260M subscribers, replacing traditional cable bundles."
    }
  },
  {
    id: "amazon",
    company: "Amazon",
    tag: "E-Commerce & Cloud",
    tagClass: "bg-amber-50 text-amber-700 border-amber-200/60",
    svgClass: "text-amber-500",
    summary: "From online bookstore to digital ecosystem.",
    watermark: "ecosystem",
    detailedBrief: {
      headline: "Constructing the Ultimate Platform Ecosystem",
      strategicShift: "Evolution from a narrow retail merchant to a multi-sided marketplace platform and web infrastructure provider.",
      keyEnablers: [
        "Synergistic fly-wheel: low prices and wide selection attract customers, driving third-party merchant traffic.",
        "Amazon Web Services (AWS): Monetizing internal infrastructure capacity into a global utility computing giant.",
        "Prime membership program lock-in as a strategic consumer moat."
      ],
      outcome: "The world's most pervasive digital retail and computing ecosystem, generating over $570B in annual revenue."
    }
  },
  {
    id: "uber",
    company: "Uber",
    tag: "Mobility & Platform",
    tagClass: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    svgClass: "text-emerald-500",
    summary: "How platform business models transformed transportation.",
    watermark: "mobility",
    detailedBrief: {
      headline: "Disrupting Transit with Double-Sided Markets",
      strategicShift: "Replacing asset-heavy taxi services with an asset-light transaction matching platform.",
      keyEnablers: [
        "Real-time supply/demand matching via dynamic pricing algorithms.",
        "Low-friction consumer and driver application networks.",
        "Cross-network effects between ride-sharing, food delivery (Uber Eats), and freight."
      ],
      outcome: "Global mobility leader processing billions of trips annually, proving the viability of the sharing economy model."
    }
  },
  {
    id: "adobe",
    company: "Adobe",
    tag: "Software & SaaS",
    tagClass: "bg-blue-50 text-blue-700 border-blue-200/60",
    svgClass: "text-indigo-500",
    summary: "Transition from software licensing to SaaS subscriptions.",
    watermark: "creative",
    detailedBrief: {
      headline: "The Adobe Creative Suite SaaS Evolution",
      strategicShift: "Pioneering transition of creative desktop suites to the Creative Cloud subscription model.",
      keyEnablers: [
        "Shifting from $2,500 upfront desktop boxed licenses to low-barrier, high-LTV monthly subscriptions.",
        "Cloud file synchronization, asset collaboration, and cloud-native workflows.",
        "Constant incremental updates, eliminating long, multi-year product update cycles."
      ],
      outcome: "Consistent recurring revenue growth, high margin predictability, and massive customer acquisition expansion."
    }
  }
];

const getQuizDisplayTitle = (quiz: any, modules: any[] = []) => {
  const titleStr = String(quiz.title || "").trim();
  const isNumeric = /^\d+(\.\d+)?$/.test(titleStr);
  
  if (isNumeric) {
    const module = quiz.module || (Array.isArray(modules) && modules.find((m: any) => m.id === quiz.moduleId || m.moduleNo === parseInt(titleStr.split(".")[0], 10)));
    if (module) {
      const parts = titleStr.split(".");
      const subNo = parts.length === 2 ? parseInt(parts[1], 10) : (quiz.subtopicId || 1);
      const subtopic = (module.subtopics || []).find((st: any) => st.subtopicNo === subNo || st.order === subNo);
      if (subtopic && subtopic.title) {
        let cleanSubTitle = subtopic.title.trim();
        const prefixRegex = new RegExp(`^(Quiz\\s+)?${titleStr.replace(".", "\\.")}[:\\s-]*|^(Quiz\\s+)?\\d+\\.\\d+[:\\s-]*`, 'i');
        cleanSubTitle = cleanSubTitle.replace(prefixRegex, "").trim();
        return `Quiz ${titleStr}: ${cleanSubTitle}`;
      }
    }
  }
  return quiz.title;
};

const getFlashcardDisplayTitle = (deck: any, modules: any[] = []) => {
  const titleStr = String(deck.title || "").trim();
  const isNumeric = /^\d+(\.\d+)?$/.test(titleStr);
  
  if (isNumeric) {
    const module = deck.module || (Array.isArray(modules) && modules.find((m: any) => m.id === deck.moduleId || m.moduleNo === parseInt(titleStr.split(".")[0], 10)));
    if (module) {
      const parts = titleStr.split(".");
      const subNo = parts.length === 2 ? parseInt(parts[1], 10) : (deck.subtopicId || 1);
      const subtopic = (module.subtopics || []).find((st: any) => st.subtopicNo === subNo || st.order === subNo);
      if (subtopic && subtopic.title) {
        return subtopic.title;
      }
    }
  }
  return deck.title;
};

export default function StudentDashboard() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get('subjectId');

  const [data, setData] = useState<any>(null);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNode, setActiveNode] = useState<number | null>(0);
  const [tickerX, setTickerX] = useState(0);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState([
    { role: "assistant", content: "Executive Strategy Portal active. Quarterly targets prioritize Module 1 operational scalability. Proceed?" }
  ]);
  const [isLocked, setIsLocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isValidatingPassword, setIsValidatingPassword] = useState(false);

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

  useEffect(() => {
    // Check if user is already unlocked for this subject
    if (data && data.subject) {
      if (data.subject.isPublic === "true" || data.subject.isPublic === true) {
        setIsLocked(false);
        return;
      }
      
      const expirationStr = localStorage.getItem(`subject_unlocked_expiry_${data.subject.id}`);
      if (expirationStr) {
        const expirationTime = parseInt(expirationStr, 10);
        if (Date.now() < expirationTime) {
          setIsLocked(false);
          return;
        } else {
          // Token expired, clear it
          localStorage.removeItem(`subject_unlocked_expiry_${data.subject.id}`);
        }
      }
      setIsLocked(true);
    } else if (data && data.encrypted) {
      setIsLocked(true);
    }
  }, [data]);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (isValidatingPassword) return;
    setIsValidatingPassword(true);
    setPasswordError("");
    try {
      const result = await fetchGAS("verifyStudentAccess", {
        subjectId: subjectId,
        credential: credentialResponse.credential,
      });
      if (result?.authorized) {
        const expirationTime = Date.now() + 6 * 60 * 60 * 1000;
        localStorage.setItem(`subject_unlocked_expiry_${subjectId}`, expirationTime.toString());
        if (result.dataKey) {
           localStorage.setItem(`subject_key_${subjectId}`, result.dataKey);
        }
        setIsLocked(false);
        setPasswordError("");
        window.location.reload();
      } else {
        setPasswordError(result?.error || "You are not authorized for this subject. Please contact faculty.");
      }
    } catch (err) {
      setPasswordError("Verification failed. Please try again.");
    } finally {
      setIsValidatingPassword(false);
    }
  };

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

  if (!data || (!data.subject && !data.encrypted)) {
    return (
      <div className="p-8 text-center text-[#F43F5E] font-bold border-4 border-[#F43F5E] bg-white max-w-xl mx-auto mt-20">
        CRITICAL FAILURE: INSTANCE CONNECT PATHWAY TERMINATED.
      </div>
    );
  }

  const isActuallyLocked = isLocked || (data && data.encrypted && !data.subject);

  if (isActuallyLocked) {
    if (isValidatingPassword) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
          <div className="flex flex-col items-center text-indigo-600 space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-indigo-600 animate-pulse" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Verifying Access...</h2>
            <p className="text-slate-500 text-sm animate-pulse">Communicating with authorization servers</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-slate-200">
          <CardHeader className="text-center space-y-2 pb-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <ShieldAlert className="w-6 h-6 text-indigo-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">Protected Subject</CardTitle>
            <CardDescription className="text-slate-500">
              Please sign in with your authorized Google account to access this subject.<br/>
              <span className="font-semibold text-indigo-600 mt-2 inline-block">(Please use your Somaiya email ID)</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="w-full flex justify-center py-4">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setPasswordError("Google login failed")}
              />
            </div>
            {passwordError && <p className="text-sm text-red-500 mt-4 text-center">{passwordError}</p>}
          </CardContent>
        </Card>
      </div>
    );
  }

  let { subject, modules = [], quizzesWithAttempts = [], flashcardDecks = [], mindmaps = [], infographics = [], subjectResources = [] } = data;

  // Filter out invisible subtopics
  modules = modules.map((mod: any) => ({
    ...mod,
    subtopics: (mod.subtopics || []).filter((st: any) => st.isVisible !== false)
  }));

  const activeModule = modules.length > 0 ? modules[0] : null;

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
  const subjectNameLower = String(subject?.name || "").toLowerCase();
  const isDigitalBusiness = subjectId === 'id_pryay1ykw' || subjectNameLower.includes("digital business");
  const isUiProgramming = subjectId === 'id_mn573l5e5' || subjectNameLower.includes("ui programming");
  const isPythonProgramming = subjectId === 'id_hdzqxse2n' || subjectNameLower.includes("python");

  const pythonModules = isPythonProgramming
    ? ((modules && modules.length > 0) ? modules : PYTHON_FALLBACK_MODULES)
    : [];  // ==========================================
  // RENDER VARIANT C: UI PROGRAMMING REDESIGN (PREMIUM SaaS STYLE)
  // ==========================================
  if (isUiProgramming) {
    const filteredModules = modules.filter((mod: any) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        String(mod.title || "").toLowerCase().includes(query) ||
        String(mod.description || "").toLowerCase().includes(query) ||
        (mod.subtopics || []).some((st: any) => String(st.title || "").toLowerCase().includes(query))
      );
    });

    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-20 relative overflow-hidden font-sans antialiased selection:bg-blue-600/10 selection:text-blue-600">
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />
        <FloatingBackground />
        
        <div className="container mx-auto px-4 mt-8 relative z-10 max-w-6xl space-y-8">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-[#64748B] font-medium" aria-label="Breadcrumb">
            <Link href="/student/subjects" className="hover:text-blue-650 transition-colors">
              Subjects
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-[#0F172A] font-semibold">{subject.name}</span>
          </nav>

          {/* Premium Subject Header Hero */}
          <header className="relative bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] uppercase font-mono tracking-widest text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  Course
                </span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A] font-sans">
                {subject.name}
              </h1>
              <p className="text-[#64748B] text-sm font-sans max-w-2xl leading-relaxed">
                {subject.description || "Master the concepts of modern typography, layouts, user centered wireframes, interface hierarchies, and usability rules."}
              </p>
              
              {/* Search within subject */}
              <div className="relative max-w-sm w-full pt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search topics or modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg outline-hidden focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-sans"
                />
              </div>
            </div>
          </header>

          {/* Quick Actions Navigation Grid */}
          <nav className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4" aria-label="Quick Actions">
            <a 
              href="#journey-section"
              className="bg-white border border-[#E2E8F0] rounded-lg p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 hover:border-blue-500 hover:shadow-xs transition-all duration-150 group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-150">
                <Layers className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[#0F172A]">Learning Path</div>
                <div className="text-[10px] text-[#64748B]">{modules.length} Modules</div>
              </div>
            </a>

            <a 
              href="#quizzes-section"
              className="bg-white border border-[#E2E8F0] rounded-lg p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 hover:border-blue-500 hover:shadow-xs transition-all duration-150 group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#16A34A] group-hover:bg-[#16A34A] group-hover:text-white transition-all duration-150">
                <Target className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[#0F172A]">Assessments</div>
                <div className="text-[10px] text-[#64748B]">{quizzesWithAttempts.length} Quizzes</div>
              </div>
            </a>

            <a 
              href="#flashcards-section"
              className="bg-white border border-[#E2E8F0] rounded-lg p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 hover:border-blue-500 hover:shadow-xs transition-all duration-150 group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-[#F59E0B] group-hover:bg-[#F59E0B] group-hover:text-white transition-all duration-150">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[#0F172A]">Revision Decks</div>
                <div className="text-[10px] text-[#64748B]">{flashcardDecks.length} Decks</div>
              </div>
            </a>

            <a 
              href="#visuals-section"
              className="bg-white border border-[#E2E8F0] rounded-lg p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 hover:border-blue-500 hover:shadow-xs transition-all duration-150 group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-150">
                <Brain className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[#0F172A]">Visual Aids</div>
                <div className="text-[10px] text-[#64748B]">{mindmaps.length + infographics.length} Topologies</div>
              </div>
            </a>
          </nav>

          {/* Learning Journey Timeline & Modules */}
          <section id="journey-section" className="space-y-6">
            <div className="flex justify-between items-end pb-3 border-b border-[#E2E8F0]">
              <ResourceHeader 
                type="journey" 
                title="Learning Journey" 
                subtitle="Follow your structured learning path." 
              />
              {searchQuery && (
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded px-2.5 py-1">
                  Found {filteredModules.length} matches
                </span>
              )}
            </div>

            <div className="relative pl-6 md:pl-8 border-l-2 border-[#E2E8F0] space-y-8 py-2">
              {filteredModules.map((mod: any) => {
                const difficultyLabel = mod.moduleNo <= 2 ? "Beginner" : mod.moduleNo <= 4 ? "Intermediate" : "Advanced";
                const difficultyColor = mod.moduleNo <= 2 
                  ? "bg-slate-50 text-[#64748B] border-[#E2E8F0]" 
                  : mod.moduleNo <= 4 
                    ? "bg-amber-50 text-[#F59E0B] border-amber-200" 
                    : "bg-red-50 text-[#DC2626] border-red-200";

                return (
                  <article key={mod.id} className="relative group">
                    {/* Timeline circle node anchor */}
                    <div className="absolute -left-[31px] md:-left-[39px] top-6 w-4 h-4 rounded-full border-4 border-slate-200 bg-white" />

                    <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 md:p-6 shadow-xs hover:shadow-sm hover:border-slate-350 transition-all duration-150 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono font-bold tracking-wider text-[#64748B] uppercase">Module 0{mod.moduleNo}</span>
                          <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded border ${difficultyColor}`}>{difficultyLabel}</span>
                          <span className="text-xs text-[#64748B] font-medium flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {mod.hours || 4} Hrs</span>
                        </div>

                        <h3 className="text-lg font-bold text-[#0F172A] tracking-tight">
                          {mod.title ? mod.title.replace(/^[●•]\s*/, "") : ""}
                        </h3>
                        <p className="text-sm text-[#64748B] leading-relaxed max-w-2xl">
                          {mod.description || "Master custom visual interfaces, structured wireframes, dynamic typographic scales, padding grids, and responsive components."}
                        </p>

                        {/* Chips for topics */}
                        {mod.subtopics && mod.subtopics.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {mod.subtopics.map((st: any) => (
                              <span key={st.id} className="text-[11px] bg-slate-50 text-[#64748B] px-2.5 py-0.5 rounded-lg border border-[#E2E8F0] font-medium">
                                {st.title}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex-shrink-0 w-full md:w-auto">
                        <Link href={`/student/subjects/subject/modules/item?subjectId=${subjectId}&id=${mod.id}`}>
                          <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 flex items-center justify-center gap-1.5 transition-all duration-150 shadow-xs">
                            <span>View Module</span>
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
              {filteredModules.length === 0 && (
                <div className="text-center py-10 border border-dashed border-[#E2E8F0] bg-white rounded-lg">
                  <Info className="w-8 h-8 mx-auto text-slate-350" />
                  <p className="text-sm text-[#64748B] mt-2">No matching modules found in this subject.</p>
                </div>
              )}
            </div>
          </section>

          {/* Quizzes & Flashcards Double Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quizzes Column */}
            <section id="quizzes-section" className="bg-white border border-[#E2E8F0] rounded-lg p-6 shadow-xs space-y-5">
              <div className="flex justify-between items-end pb-3 border-b border-[#E2E8F0]">
                <ResourceHeader 
                  type="quizzes" 
                  title="Quizzes & Assessments" 
                  subtitle="Test your understanding with adaptive quizzes." 
                />
                <Link href={`/student/subjects/subject/quizzes?subjectId=${subjectId}`}>
                  <span className="text-[10px] font-mono font-bold uppercase text-blue-600 hover:text-blue-700 cursor-pointer">View All →</span>
                </Link>
              </div>

              <div className="space-y-3">
                {quizzesWithAttempts.slice(0, 4).map((quiz: any) => (
                  <div key={quiz.id} className="border border-[#E2E8F0] hover:border-slate-350 p-4 rounded-lg flex justify-between items-center gap-4 transition-all duration-150 bg-[#F8FAFC]">
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono text-[#64748B] uppercase">Module {quiz.module?.moduleNo || quiz.title.split(".")[0]}</span>
                      <h4 className="text-sm font-semibold text-[#0F172A] tracking-tight truncate mt-0.5">
                        {getQuizDisplayTitle(quiz, modules)}
                      </h4>
                    </div>
                    <Link href={`/student/subjects/subject/quizzes/item?subjectId=${subjectId}&id=${quiz.id}`} className="flex-shrink-0">
                      <Button className="bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#0F172A] text-xs font-semibold px-3 py-1.5 h-8 rounded-lg shadow-2xs">
                        Start
                      </Button>
                    </Link>
                  </div>
                ))}
                {quizzesWithAttempts.length === 0 && (
                  <div className="text-center py-6 text-xs text-[#64748B] border border-dashed border-[#E2E8F0] rounded-lg font-medium bg-slate-50">
                    No quizzes assigned.
                  </div>
                )}
              </div>
            </section>

            {/* Flashcards Column */}
            <section id="flashcards-section" className="bg-white border border-[#E2E8F0] rounded-lg p-6 shadow-xs space-y-5">
              <div className="flex justify-between items-end pb-3 border-b border-[#E2E8F0]">
                <ResourceHeader 
                  type="flashcards" 
                  title="Revision Flashcards" 
                  subtitle="Practice with active recall and spaced repetition." 
                />
                <Link href={`/student/subjects/subject/flashcards?subjectId=${subjectId}`}>
                  <span className="text-[10px] font-mono font-bold uppercase text-blue-600 hover:text-blue-700 cursor-pointer">View All →</span>
                </Link>
              </div>

              <div className="space-y-3">
                {flashcardDecks.slice(0, 4).map((deck: any) => (
                  <Link key={deck.id} href={`/student/subjects/subject/flashcards/item?subjectId=${subjectId}&id=${deck.id}`} className="block">
                    <div className="border border-[#E2E8F0] hover:border-slate-350 p-4 rounded-lg flex justify-between items-center gap-4 transition-all duration-150 bg-[#F8FAFC] group">
                      <div className="min-w-0">
                        <span className="text-[9px] font-mono text-[#64748B] uppercase">Module {deck.module?.moduleNo || deck.title.split(".")[0]}</span>
                        <h4 className="text-sm font-semibold text-[#0F172A] tracking-tight truncate group-hover:text-blue-600 transition-colors mt-0.5">
                          {getFlashcardDisplayTitle(deck, modules)}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono bg-white text-[#64748B] border border-[#E2E8F0] px-2 py-0.5 rounded-md font-bold flex-shrink-0">
                        {deck.cards?.length || 0} Cards
                      </span>
                    </div>
                  </Link>
                ))}
                {flashcardDecks.length === 0 && (
                  <div className="text-center py-6 text-xs text-[#64748B] border border-dashed border-[#E2E8F0] rounded-lg font-medium bg-slate-50">
                    No flashcard decks logged.
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Visual Aids section (Mind Maps & Infographics) */}
          <section id="visuals-section" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mind Maps Card */}
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 shadow-xs space-y-5">
              <div className="flex justify-between items-end pb-3 border-b border-[#E2E8F0]">
                <ResourceHeader 
                  type="mindmaps" 
                  title="Subject Mind Maps" 
                  subtitle="Explore relationships between concepts." 
                />
                <Link href={`/student/subjects/subject/mindmaps?subjectId=${subjectId}`}>
                  <span className="text-[10px] font-mono font-bold uppercase text-blue-600 hover:text-blue-700 cursor-pointer">View All →</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mindmaps.slice(0, 4).map((map: any, idx: number) => (
                  <Link key={map.id} href={`/student/subjects/subject/mindmaps/item?subjectId=${subjectId}&id=${map.id}`} className="block">
                    <div className="border border-[#E2E8F0] hover:border-slate-350 p-4 rounded-lg text-center transition-all duration-150 bg-[#F8FAFC] group flex flex-col justify-between items-center h-28">
                      <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-bold text-xs font-mono group-hover:bg-purple-600 group-hover:text-white transition-all duration-150">
                        M0{idx + 1}
                      </div>
                      <h4 className="text-xs font-bold text-[#0F172A] line-clamp-2 px-1 text-center w-full leading-normal">
                        {map.title}
                      </h4>
                    </div>
                  </Link>
                ))}
                {mindmaps.length === 0 && (
                  <div className="col-span-2 text-center py-6 text-xs text-[#64748B] border border-dashed border-[#E2E8F0] rounded-lg font-medium bg-slate-50">
                    No mind maps available.
                  </div>
                )}
              </div>
            </div>

            {/* Infographics Card */}
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 shadow-xs space-y-5">
              <div className="flex justify-between items-end pb-3 border-b border-[#E2E8F0]">
                <ResourceHeader 
                  type="infographics" 
                  title="Visual Infographics" 
                  subtitle="Visual explanations of key concepts." 
                />
                <Link href={`/student/subjects/subject/infographics?subjectId=${subjectId}`}>
                  <span className="text-[10px] font-mono font-bold uppercase text-blue-600 hover:text-blue-700 cursor-pointer">View All →</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {infographics.slice(0, 4).map((info: any, idx: number) => (
                  <Link key={info.id} href={`/student/subjects/subject/infographics/item?subjectId=${subjectId}&id=${info.id}`} className="block">
                    <div className="border border-[#E2E8F0] hover:border-slate-350 p-4 rounded-lg text-center transition-all duration-150 bg-[#F8FAFC] group flex flex-col justify-between items-center h-28">
                      <div className="w-7 h-7 rounded-full bg-pink-50 text-pink-650 border border-pink-100 flex items-center justify-center font-bold text-xs font-mono group-hover:bg-pink-600 group-hover:text-white transition-all duration-150">
                        I0{idx + 1}
                      </div>
                      <h4 className="text-xs font-bold text-[#0F172A] line-clamp-2 px-1 text-center w-full leading-normal">
                        {info.title}
                      </h4>
                    </div>
                  </Link>
                ))}
                {infographics.length === 0 && (
                  <div className="col-span-2 text-center py-6 text-xs text-[#64748B] border border-dashed border-[#E2E8F0] rounded-lg font-medium bg-slate-50">
                    No infographics topologies.
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Reference resources */}
          <section className="bg-white border border-[#E2E8F0] rounded-lg p-6 shadow-xs space-y-5">
            <div className="flex justify-between items-end pb-3 border-b border-[#E2E8F0]">
              <ResourceHeader 
                type="resources" 
                title="Reference Materials" 
                subtitle="Browse notes, PDFs and supporting resources." 
              />
              <span className="text-[10px] font-mono text-[#64748B] uppercase">Reference Docs</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {subjectResources.map((resource: any, index: number) => (
                <div key={index} className="transition-all duration-150 hover:-translate-y-0.5">
                  <SubjectResourceCard
                    title={resource.title}
                    type={resource.type}
                    link={resource.link}
                  />
                </div>
              ))}
              {subjectResources.length === 0 && (
                <p className="col-span-4 text-xs font-mono text-[#64748B] text-center py-4 border border-dashed border-[#E2E8F0] rounded-lg bg-slate-50">
                  No resources uploaded yet.
                </p>
              )}
            </div>
          </section>

        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER VARIANT A: DIGITAL BUSINESS & TRANSFORMATION (PREMIUM LIGHT THEME)
  // ==========================================
  if (isDigitalBusiness) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-20 relative overflow-hidden font-sans antialiased selection:bg-[#3b82f6]/10 selection:text-[#3b82f6]">
        {/* Strategy-board dot pattern grid overlay */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          backgroundImage: `radial-gradient(#e2e8f0 1.2px, transparent 1.2px)`,
          backgroundSize: "24px 24px"
        }} />

        <div className="container mx-auto px-4 mt-8 relative z-10">

          {/* HEADER SECTION - CSS Stock Market Theme */}
          <div className="relative overflow-hidden bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8 flex flex-col md:flex-row justify-between items-center w-full mb-8">
            {/* Left Side (Typography - High Z-Index) */}
            <div className="z-10 relative max-w-2xl w-full">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#0F766E] font-bold bg-[#0F766E]/5 px-2 py-0.5 rounded border border-[#0F766E]/10">
                  Workspace
                </span>
                <span className="text-[10px] font-mono text-slate-400">course.console</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 font-sans">
                {subject.name}
              </h1>
              <p className="text-slate-500 text-xs font-sans mt-1.5">
                Portal for Digital Business & Transformation course, modules, quizzes, and resources.
              </p>
            </div>

            {/* Right Side (Status Badge - High Z-Index) */}
            <div className="z-10 relative mt-4 md:mt-0 flex-shrink-0">
              <div className="bg-white/90 backdrop-blur-xs px-3 py-1.5 border border-slate-200/80 flex items-center font-mono text-[10px] text-slate-655 rounded-md shadow-xs">
                <span className="flex items-center gap-1.5 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#0F766E]" />
                  STATUS: ACTIVE
                </span>
              </div>
            </div>

            {/* Background Art (Stock Market Chart - Low Z-Index) */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 z-0 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%)] pointer-events-none select-none">
              {/* Element A: The Data Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-70" />

              {/* Element C: CSS Candlesticks */}
              {/* Candlestick 1 - Green */}
              <div className="absolute bottom-[20%] left-[10%] flex flex-col items-center">
                <div className="w-[1.5px] h-12 bg-emerald-500/40" />
                <div className="absolute top-2 w-2.5 h-6 bg-emerald-500 rounded-[1.5px]" />
              </div>

              {/* Candlestick 2 - Green */}
              <div className="absolute bottom-[35%] left-[25%] flex flex-col items-center">
                <div className="w-[1.5px] h-16 bg-emerald-500/40" />
                <div className="absolute top-3 w-2.5 h-8 bg-emerald-500 rounded-[1.5px]" />
              </div>

              {/* Candlestick 3 - Red */}
              <div className="absolute bottom-[25%] left-[40%] flex flex-col items-center">
                <div className="w-[1.5px] h-10 bg-rose-400/40" />
                <div className="absolute top-2.5 w-2.5 h-5 bg-rose-400 rounded-[1.5px]" />
              </div>

              {/* Candlestick 4 - Green */}
              <div className="absolute bottom-[50%] left-[55%] flex flex-col items-center">
                <div className="w-[1.5px] h-18 bg-emerald-500/40" />
                <div className="absolute top-4 w-2.5 h-9 bg-emerald-500 rounded-[1.5px]" />
              </div>

              {/* Candlestick 5 - Red */}
              <div className="absolute bottom-[40%] left-[70%] flex flex-col items-center">
                <div className="w-[1.5px] h-12 bg-rose-400/40" />
                <div className="absolute top-3 w-2.5 h-5 bg-rose-400 rounded-[1.5px]" />
              </div>

              {/* Candlestick 6 - Green */}
              <div className="absolute bottom-[65%] left-[85%] flex flex-col items-center">
                <div className="w-[1.5px] h-20 bg-emerald-500/40" />
                <div className="absolute top-4 w-2.5 h-11 bg-emerald-500 rounded-[1.5px]" />
              </div>

              {/* Element B: Upward trend line with shadow glow */}
              <svg className="absolute inset-0 w-full h-full text-teal-500" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M 0 85 L 20 65 L 35 72 L 55 45 L 70 52 L 90 25 L 100 15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: "drop-shadow(0px 3px 6px rgba(20, 184, 166, 0.4))" }}
                />
              </svg>
            </div>
          </div>

          {/* BUSINESS TRANSFORMATION CASE STUDY SPOTLIGHT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {CASE_STUDIES.map((study) => (
              <div
                key={study.id}
                onClick={() => setSelectedCaseStudy(study)}
                className={`bg-white border border-slate-200 p-5 rounded-lg relative shadow-sm transition-all duration-300 group cursor-pointer overflow-hidden flex flex-col justify-between min-h-[180px] hover:-translate-y-1 
                  ${study.id === "netflix" ? "hover:border-rose-350 hover:bg-rose-50/20 hover:shadow-[0_8px_30px_rgba(244,63,94,0.06)]" : ""}
                  ${study.id === "amazon" ? "hover:border-amber-350 hover:bg-amber-50/20 hover:shadow-[0_8px_30px_rgba(245,158,11,0.06)]" : ""}
                  ${study.id === "uber" ? "hover:border-emerald-350 hover:bg-emerald-50/20 hover:shadow-[0_8px_30px_rgba(16,185,129,0.06)]" : ""}
                  ${study.id === "adobe" ? "hover:border-indigo-350 hover:bg-indigo-50/20 hover:shadow-[0_8px_30px_rgba(99,102,241,0.06)]" : ""}
                `}
              >
                {/* Watermark SVGs */}
                {study.watermark === "streaming" && (
                  <svg className={`absolute right-2 bottom-2 w-28 h-28 ${study.svgClass} pointer-events-none opacity-[0.08] group-hover:opacity-[0.26] group-hover:scale-105 transition-all duration-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="2" y="4" width="20" height="12" rx="1.5" />
                    <path d="M6 20h12M12 16v4" />
                    <path d="M9 7l6 3-6 3V7z" fill="currentColor" fillOpacity="0.1" />
                  </svg>
                )}
                {study.watermark === "ecosystem" && (
                  <svg className={`absolute right-2 bottom-2 w-28 h-28 ${study.svgClass} pointer-events-none opacity-[0.08] group-hover:opacity-[0.26] group-hover:scale-105 transition-all duration-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <circle cx="12" cy="12" r="4" strokeDasharray="2 2" />
                    <circle cx="12" cy="12" r="8" />
                    <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
                    <circle cx="12" cy="4" r="1.5" fill="currentColor" />
                    <circle cx="12" cy="20" r="1.5" fill="currentColor" />
                    <circle cx="4" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="20" cy="12" r="1.5" fill="currentColor" />
                  </svg>
                )}
                {study.watermark === "mobility" && (
                  <svg className={`absolute right-2 bottom-2 w-28 h-28 ${study.svgClass} pointer-events-none opacity-[0.08] group-hover:opacity-[0.26] group-hover:scale-105 transition-all duration-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M3 5h18M3 12h18M3 19h18" strokeDasharray="3 3" />
                    <path d="M7 2v20M17 2v20" strokeDasharray="3 3" />
                    <path d="M7 19h5a2 2 0 002-2v-5a2 2 0 012-2h5" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="7" cy="19" r="2.5" fill="currentColor" fillOpacity="0.2" />
                    <circle cx="21" cy="10" r="2.5" fill="currentColor" fillOpacity="0.2" />
                  </svg>
                )}
                {study.watermark === "creative" && (
                  <svg className={`absolute right-2 bottom-2 w-28 h-28 ${study.svgClass} pointer-events-none opacity-[0.08] group-hover:opacity-[0.26] group-hover:scale-105 transition-all duration-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M4 18c4-12 12-12 16 0" strokeWidth="1.5" />
                    <circle cx="4" cy="18" r="2" fill="currentColor" />
                    <circle cx="20" cy="18" r="2" fill="currentColor" />
                    <circle cx="12" cy="9.5" r="2.5" fill="currentColor" />
                    <path d="M12 9.5l-4-4M12 9.5l4-4" strokeDasharray="1 1" />
                    <circle cx="8" cy="5.5" r="1" />
                    <circle cx="16" cy="5.5" r="1" />
                  </svg>
                )}

                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <h3 className={`text-lg font-bold font-sans text-slate-900 tracking-tight transition-colors duration-300
                      ${study.id === "netflix" ? "group-hover:text-rose-700" : ""}
                      ${study.id === "amazon" ? "group-hover:text-amber-700" : ""}
                      ${study.id === "uber" ? "group-hover:text-emerald-700" : ""}
                      ${study.id === "adobe" ? "group-hover:text-indigo-700" : ""}
                    `}>
                      {study.company}
                    </h3>
                    <span className={`text-[9px] font-mono font-bold ${study.tagClass} border px-2 py-0.5 rounded uppercase tracking-wider`}>
                      {study.tag}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-500 font-sans mt-3 leading-relaxed">
                    {study.summary}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex justify-between items-center relative z-10">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-colors
                    ${study.id === "netflix" ? "text-rose-750 group-hover:text-rose-800" : ""}
                    ${study.id === "amazon" ? "text-amber-750 group-hover:text-amber-800" : ""}
                    ${study.id === "uber" ? "text-emerald-750 group-hover:text-emerald-800" : ""}
                    ${study.id === "adobe" ? "text-indigo-750 group-hover:text-indigo-800" : ""}
                  `}>
                    View Insight
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">case.spotlight</span>
                </div>
              </div>
            ))}
          </div>

          {/* TWO COLUMN MATRIX CONTAINER */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT & CENTER COLUMN ACTIONS */}
            <div className="lg:col-span-2 space-y-6">

              {/* MODULES AS WORKSTREAMS BRIEF */}
              <div className="bg-white border border-slate-200 p-6 shadow-sm rounded-lg">
                <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-150">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-sans">Modules</h2>
                  <Link href={`/student/subjects/subject/modules?subjectId=${subjectId}`}>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-650 hover:border-indigo-300/80 transition-colors cursor-pointer border border-slate-200 px-2.5 py-1 rounded bg-white shadow-xs view-all-btn inline-block">View All Modules →</span>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modules.slice(0, 4).map((mod: any, index: number) => (
                    <Link key={mod.id} href={`/student/subjects/subject/modules/item?subjectId=${subjectId}&id=${mod.id}`}>
                      <div className="bg-white border border-slate-200 p-5 rounded-lg hover:border-[#1E3A8A] hover:bg-slate-50/30 hover:shadow-[0_8px_30px_rgba(30,58,138,0.06)] hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between h-full group shadow-xs">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                              Module 0{index + 1}
                            </span>
                            <span className="text-[9px] font-mono text-teal-700 border border-teal-200/60 px-1.5 py-0.5 rounded bg-teal-500/10 font-semibold uppercase group-hover:bg-teal-650 group-hover:text-white group-hover:border-teal-650 transition-colors duration-300">
                              Active
                            </span>
                          </div>
                          <h3 className="text-[13.5px] font-bold font-sans text-slate-800 tracking-tight leading-snug group-hover:text-[#1E3A8A] transition-colors pr-2">
                            {mod.title ? mod.title.replace(/^[●•]\s*/, "") : ""}
                          </h3>
                          <p className="text-[11px] text-slate-500 font-sans mt-2 line-clamp-3 leading-relaxed">
                            {mod.description || "Analyze digital business transformation models, legacy IT architectures, and core strategic optimization parameters."}
                          </p>
                        </div>

                        <div className="mt-5 pt-3.5 border-t border-slate-100 flex justify-end items-center font-mono text-[9.5px] text-slate-400">
                          <span className="text-[#1E3A8A] font-semibold flex items-center gap-1 group-hover:text-indigo-750 transition-colors duration-300">
                            {mod.subtopics?.length || 0} Units
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* ASSESSMENT STRATEGIES (QUIZZES) */}
              <div className="bg-white border border-slate-200 p-6 shadow-sm rounded-lg">
                <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-150">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 font-sans">
                    Quizzes
                  </h2>
                  <Link href={`/student/subjects/subject/quizzes?subjectId=${subjectId}`}>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-655 hover:border-indigo-300/80 transition-colors cursor-pointer border border-slate-200 px-2.5 py-1 rounded bg-white shadow-xs view-all-btn inline-block">View All Quizzes →</span>
                  </Link>
                </div>
                <div className="space-y-3">
                  {quizzesWithAttempts.slice(0, 6).map((quiz: any) => (
                    <div key={quiz.id} className="bg-white border border-slate-200 p-4 flex justify-between items-center rounded-lg hover:border-[#1E3A8A] hover:bg-slate-50/30 hover:shadow-[0_8px_30px_rgba(30,58,138,0.06)] hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 shadow-xs group">
                      <div>
                        <div className="font-sans font-bold text-xs text-slate-800 tracking-tight group-hover:text-[#1E3A8A] transition-colors duration-300">{getQuizDisplayTitle(quiz, modules)}</div>
                      </div>
                      <Link href={`/student/subjects/subject/quizzes/item?subjectId=${subjectId}&id=${quiz.id}`}>
                        <Button className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-mono rounded-md font-semibold tracking-wider uppercase px-4 text-[10px] h-8 border-none shadow-md group-hover:scale-105 transition-all duration-300 flex items-center gap-1">
                          Start Quiz
                        </Button>
                      </Link>
                    </div>
                  ))}
                  {quizzesWithAttempts.length === 0 && (
                    <div className="p-4 border border-dashed border-slate-200 text-center text-slate-400 font-mono text-xs rounded-lg">NO ACTIVE QUIZZES FOUND</div>
                  )}
                </div>
              </div>

              {/* TWO COLUMN GRID FOR FLASHCARDS AND MINDMAPS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 p-6 shadow-sm rounded-lg">
                  <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-150">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 font-sans">
                      <Zap className="w-3.5 h-3.5 text-amber-600" /> Flashcard Decks
                    </h2>
                    <Link href={`/student/subjects/subject/flashcards?subjectId=${subjectId}`}>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-650 hover:border-indigo-300/80 transition-colors cursor-pointer border border-slate-200 px-2.5 py-1 rounded bg-white shadow-xs view-all-btn inline-block">View All Decks →</span>
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {flashcardDecks.slice(0, 3).map((deck: any) => (
                      <Link key={deck.id} href={`/student/subjects/subject/flashcards/item?subjectId=${subjectId}&id=${deck.id}`}>
                        <div className="bg-white border border-slate-200 p-3 hover:border-[#1E3A8A] hover:bg-slate-50/30 hover:shadow-[0_8px_30px_rgba(30,58,138,0.06)] hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 flex justify-between items-center rounded-lg group shadow-xs">
                          <span className="font-semibold text-xs text-slate-700 font-sans tracking-tight line-clamp-1 group-hover:text-[#1E3A8A] transition-colors duration-300">{getFlashcardDisplayTitle(deck, modules)}</span>
                          <span className="text-slate-550 text-[9px] font-mono border border-slate-200 px-1.5 py-0.5 rounded bg-slate-50 font-bold whitespace-nowrap group-hover:bg-[#1E3A8A] group-hover:text-white group-hover:border-[#1E3A8A] transition-all duration-300">{deck.cards?.length || 0} CARDS</span>
                        </div>
                      </Link>
                    ))}
                    {flashcardDecks.length === 0 && (
                      <div className="p-3 border border-dashed border-slate-200 text-center text-slate-400 font-mono text-[9.5px] rounded-lg">EMPTY REPOSITORY</div>
                    )}
                  </div>
                </div>

                {/* MIND MAPS ARCHITECTURE SECTION */}
                <div className="bg-white border border-slate-200 p-6 shadow-sm rounded-lg">
                  <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-150">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 font-sans">
                      <Brain className="w-3.5 h-3.5 text-purple-650" /> Mind Maps
                    </h2>
                    <Link href={`/student/subjects/subject/mindmaps?subjectId=${subjectId}`}>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-650 hover:border-indigo-300/80 transition-colors cursor-pointer border border-slate-200 px-2.5 py-1 rounded bg-white shadow-xs view-all-btn inline-block">View All Mind Maps →</span>
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {mindmaps.slice(0, 3).map((map: any) => (
                      <Link key={map.id} href={`/student/subjects/subject/mindmaps/item?subjectId=${subjectId}&id=${map.id}`}>
                        <div className="bg-white border border-slate-200 p-3 hover:border-[#1E3A8A] hover:bg-slate-50/30 hover:shadow-[0_8px_30px_rgba(30,58,138,0.06)] hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 flex justify-between items-center font-mono text-xs rounded-lg group shadow-xs">
                          <span className="font-semibold text-xs text-slate-700 tracking-tight line-clamp-1 group-hover:text-[#1E3A8A] transition-colors duration-300">{map.title}</span>
                          <span className="text-slate-550 flex items-center gap-1 text-[9px] font-mono border border-slate-200 px-1.5 py-0.5 rounded bg-slate-50 font-bold group-hover:bg-[#1E3A8A] group-hover:text-white group-hover:border-[#1E3A8A] transition-all duration-300">
                            PLOT <ExternalLink className="w-2.5 h-2.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                          </span>
                        </div>
                      </Link>
                    ))}
                    {mindmaps.length === 0 && (
                      <div className="p-3 border border-dashed border-slate-200 text-center text-slate-400 font-mono text-[9.5px] rounded-lg">NO MIND MAPS LOGGED</div>
                    )}
                  </div>
                </div>

                {/* INFOGRAPHICS ARCHITECTURE SECTION */}
                <div className="bg-white border border-slate-200 p-6 shadow-sm rounded-lg">
                  <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-150">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 font-sans">
                      <Brain className="w-3.5 h-3.5 text-pink-600" /> Infographics
                    </h2>
                    <Link href={`/student/subjects/subject/infographics?subjectId=${subjectId}`}>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-650 hover:border-indigo-300/80 transition-colors cursor-pointer border border-slate-200 px-2.5 py-1 rounded bg-white shadow-xs view-all-btn inline-block">View All Infographics →</span>
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {infographics.slice(0, 3).map((info: any) => (
                      <Link key={info.id} href={`/student/subjects/subject/infographics/item?subjectId=${subjectId}&id=${info.id}`}>
                        <div className="bg-white border border-slate-200 p-3 hover:border-[#1E3A8A] hover:bg-slate-50/30 hover:shadow-[0_8px_30px_rgba(30,58,138,0.06)] hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 flex justify-between items-center font-mono text-xs rounded-lg group shadow-xs">
                          <span className="font-semibold text-xs text-slate-700 tracking-tight line-clamp-1 group-hover:text-[#1E3A8A] transition-colors duration-300">{info.title}</span>
                          <span className="text-slate-550 flex items-center gap-1 text-[9px] font-mono border border-slate-200 px-1.5 py-0.5 rounded bg-slate-50 font-bold group-hover:bg-[#1E3A8A] group-hover:text-white group-hover:border-[#1E3A8A] transition-all duration-300">
                            VIEW <ExternalLink className="w-2.5 h-2.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                          </span>
                        </div>
                      </Link>
                    ))}
                    {infographics.length === 0 && (
                      <div className="p-3 border border-dashed border-slate-200 text-center text-slate-400 font-mono text-[9.5px] rounded-lg">NO INFOGRAPHICS LOGGED</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SIDEBAR DASHBOARD SYSTEM ASSETS */}
            <div className="space-y-6">

              {/* REFERENCE DOSSIERS */}
              <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm">
                <div className="pb-3 border-b border-slate-150 mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider flex items-center text-slate-900 font-sans">
                    <FileText className="w-4 h-4 mr-2 text-[#1E3A8A]" /> Resources
                  </h3>
                </div>
                <div className="space-y-3">
                  {subjectResources.map((resource: any, idx: number) => (
                    <div key={idx} className="bg-white border border-slate-200 p-2.5 rounded-lg hover:border-[#1E3A8A] transition-colors shadow-xs">
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

        {/* CASE STUDY DETAIL MODAL */}
        <AnimatePresence>
          {selectedCaseStudy && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCaseStudy(null)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
              />

              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="relative bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden z-10 flex flex-col pt-[4px]"
              >
                {/* Top Brand Gradient Line */}
                <div className={`absolute top-0 left-0 right-0 h-[4px]
                  ${selectedCaseStudy.id === "netflix" ? "bg-rose-600" : ""}
                  ${selectedCaseStudy.id === "amazon" ? "bg-amber-500" : ""}
                  ${selectedCaseStudy.id === "uber" ? "bg-emerald-500" : ""}
                  ${selectedCaseStudy.id === "adobe" ? "bg-indigo-600" : ""}
                `} />

                {/* Header */}
                <div className="p-6 border-b border-slate-105 flex justify-between items-start bg-slate-50/50">
                  <div>
                    <span className={`text-[9px] font-mono font-bold border px-2 py-0.5 rounded uppercase tracking-wider ${selectedCaseStudy.tagClass}`}>
                      {selectedCaseStudy.tag}
                    </span>
                    <h2 className="text-2xl font-extrabold text-slate-900 font-sans mt-2 tracking-tight">
                      {selectedCaseStudy.company}
                    </h2>
                    <p className="text-slate-500 text-xs font-sans mt-1">
                      {selectedCaseStudy.summary}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCaseStudy(null)}
                    className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-full hover:bg-slate-100 font-mono text-xs uppercase"
                  >
                    Close [×]
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5 flex-1 overflow-y-auto">
                  <div>
                    <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">Strategic Vector</h4>
                    <p className="text-sm font-bold text-slate-800 font-sans leading-snug">
                      {selectedCaseStudy.detailedBrief.headline}
                    </p>
                    <p className="text-xs text-slate-550 font-sans mt-2 leading-relaxed">
                      {selectedCaseStudy.detailedBrief.strategicShift}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">Key Transformation Enablers</h4>
                    <ul className="space-y-2.5">
                      {selectedCaseStudy.detailedBrief.keyEnablers.map((enabler: string, index: number) => (
                        <li key={index} className="text-xs text-slate-650 font-sans flex items-start gap-2.5 leading-relaxed">
                          <span className={`text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded mt-0.5
                            ${selectedCaseStudy.id === "netflix" ? "text-rose-700 bg-rose-50 border border-rose-100" : ""}
                            ${selectedCaseStudy.id === "amazon" ? "text-amber-700 bg-amber-50 border border-amber-100" : ""}
                            ${selectedCaseStudy.id === "uber" ? "text-emerald-700 bg-emerald-50 border border-emerald-100" : ""}
                            ${selectedCaseStudy.id === "adobe" ? "text-indigo-750 bg-indigo-50 border border-indigo-100" : ""}
                          `}>
                            0{index + 1}
                          </span>
                          <span className="flex-1">{enabler}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={`p-4 rounded-lg border transition-all duration-300
                    ${selectedCaseStudy.id === "netflix" ? "bg-rose-500/5 border-rose-200/40 text-rose-950" : ""}
                    ${selectedCaseStudy.id === "amazon" ? "bg-amber-500/5 border-amber-200/40 text-amber-950" : ""}
                    ${selectedCaseStudy.id === "uber" ? "bg-emerald-500/5 border-emerald-200/40 text-emerald-950" : ""}
                    ${selectedCaseStudy.id === "adobe" ? "bg-indigo-500/5 border-indigo-200/40 text-indigo-950" : ""}
                  `}>
                    <h4 className={`text-[10px] font-mono font-bold uppercase tracking-widest mb-1.5
                      ${selectedCaseStudy.id === "netflix" ? "text-rose-800" : ""}
                      ${selectedCaseStudy.id === "amazon" ? "text-amber-800" : ""}
                      ${selectedCaseStudy.id === "uber" ? "text-emerald-800" : ""}
                      ${selectedCaseStudy.id === "adobe" ? "text-indigo-850" : ""}
                    `}>business outcome</h4>
                    <p className="text-xs font-sans leading-relaxed">
                      {selectedCaseStudy.detailedBrief.outcome}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>EXECUTIVE BRIEFING SERIES</span>
                  <span>CONFIDENTIAL</span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }
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
        { name: `${slug}.py`, code: getCodeSnippet(`${slug}.py`, mod?.title || "") },
        { name: `test_${slug}.py`, code: getCodeSnippet(`test_${slug}.py`, mod?.title || "") },
        { name: `README.md`, code: getCodeSnippet(`README.md`, mod?.title || "") }
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

          {/* PYTHON LEARNING MODULES */}
          <div className="bg-white border border-slate-200 rounded p-6 shadow-sm relative z-10">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#2b5b84] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#2b5b84]" /> Python Learning Modules
              </h3>
              <Link href={`/student/subjects/subject/modules?subjectId=${subjectId}`}>
                <Button variant="ghost" className="text-slate-700 hover:text-[#3776AB] font-bold text-xs uppercase hover:bg-slate-100 border border-slate-200/80 rounded px-4 py-2 transition-all inline-flex items-center bg-white shadow-sm flex items-center view-all-btn">
                  <span>View All Modules</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {pythonModules.map((mod: any, idx: number) => {
                const subtopicsCount = mod.subtopics?.length || 0;
                return (
                  <Link key={mod.id} href={`/student/subjects/subject/modules/item?subjectId=${subjectId}&id=${mod.id}`}>
                    <div className="bg-slate-50 border border-slate-200 rounded p-4 hover:border-[#3776AB] hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 group h-full flex flex-col justify-between cursor-pointer">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded font-mono font-bold tracking-widest uppercase">
                            MODULE 0{mod.moduleNo || (idx + 1)}
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

          {/* TWO COLUMN GRID FOR DEBUG QUIZ CHALLENGES AND PYTHON FLASHCARD DECKS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">

            {/* DEBUG QUIZ CHALLENGES (QUIZZES) */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded p-6 shadow-sm">
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#2b5b84] flex items-center gap-2">
                  <Bug className="w-4 h-4 text-[#2b5b84]" /> Debug Quiz Challenges (Active Issues)
                </h3>
                <Link href={`/student/subjects/subject/quizzes?subjectId=${subjectId}`}>
                  <Button variant="ghost" className="text-slate-700 hover:text-[#3776AB] font-bold text-xs uppercase hover:bg-slate-100 border border-slate-200/80 rounded px-4 py-2 transition-all inline-flex items-center bg-white shadow-sm flex items-center view-all-btn">
                    <span>View All Quizzes</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizzesWithAttempts.slice(0, 6).map((quiz: any, idx: number) => {
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
                      <div className="flex justify-start items-start mb-2">
                        <span className={`text-[10px] ${themeColor} border px-2 py-0.5 rounded font-mono font-bold tracking-widest uppercase`}>🐞 BUG FIX</span>
                      </div>
                      <h4 className="font-mono text-xs font-bold text-slate-800 mb-3 line-clamp-1 group-hover:text-blue-650 transition-colors">{getQuizDisplayTitle(quiz, modules)}</h4>
                      <div className="mt-4 flex justify-end">
                        <Link href={`/student/subjects/subject/quizzes/item?subjectId=${subjectId}&id=${quiz.id}`}>
                          <Button className={`${btnColorClass} text-white border rounded font-mono text-[10px] py-1.5 px-4 h-8 uppercase tracking-wider hover:scale-105 active:scale-95 hover:shadow-md transition-all duration-200`}>
                            Debug Quiz Challenge →
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

            {/* PYTHON FLASHCARD DECKS (FLASHCARDS) */}
            <div className="bg-white border border-slate-200 rounded p-6 shadow-sm">
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#2b5b84] flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#2b5b84]" /> Python Flashcard Decks
                </h3>
                <Link href={`/student/subjects/subject/flashcards?subjectId=${subjectId}`}>
                  <Button variant="ghost" className="text-slate-700 hover:text-[#3776AB] font-bold text-xs uppercase hover:bg-slate-100 border border-slate-200/80 rounded px-4 py-2 transition-all inline-flex items-center bg-white shadow-sm flex items-center view-all-btn">
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
                          <span className="font-mono text-xs text-slate-800 font-semibold group-hover:text-amber-700 transition-colors truncate">{getFlashcardDisplayTitle(deck, modules)}</span>
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

          {/* CONNECTED ARCHITECTURE DIAGRAMS (MINDMAPS) */}
          <div className="w-full relative z-10">

            {/* ARCHITECTURE DIAGRAM (MINDMAPS) */}
            <div className="bg-white border border-slate-200 rounded p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#2b5b84] flex items-center gap-2">
                    <Brain className="w-4 h-4 text-[#2b5b84]" /> Python Mind Maps
                  </h3>
                  <Link href={`/student/subjects/subject/mindmaps?subjectId=${subjectId}`}>
                    <Button variant="ghost" className="text-slate-700 hover:text-[#3776AB] font-bold text-xs uppercase hover:bg-slate-100 border border-slate-200/80 rounded px-4 py-2 transition-all inline-flex items-center bg-white shadow-sm flex items-center view-all-btn">
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

                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 w-full px-4">
                    {mindmaps.slice(0, 4).map((map: any, idx: number) => {
                      const nodeColors = [
                        { bg: "bg-blue-50 text-blue-700 border-blue-200", hover: "group-hover:bg-blue-600 group-hover:border-blue-600" },
                        { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", hover: "group-hover:bg-emerald-600 group-hover:border-emerald-600" },
                        { bg: "bg-purple-50 text-purple-700 border-purple-200", hover: "group-hover:bg-purple-600 group-hover:border-purple-600" },
                        { bg: "bg-amber-50 text-amber-700 border-amber-200", hover: "group-hover:bg-amber-600 group-hover:border-amber-600" },
                      ];
                      const colors = nodeColors[idx % nodeColors.length];

                      return (
                        <Link key={map.id} href={`/student/subjects/subject/mindmaps/item?subjectId=${subjectId}&id=${map.id}`} className="w-full h-full flex">
                          <div className="bg-slate-50 border border-slate-200 hover:border-blue-500 rounded-lg p-4 text-center group cursor-pointer transition-all duration-300 relative shadow-sm w-full h-full transform hover:-translate-y-1.5 hover:scale-105 active:scale-[0.97] hover:bg-white hover:shadow-md flex flex-col justify-between items-center gap-2">
                            <div className="w-full flex flex-col items-center">
                              <div className={`w-7 h-7 rounded-full ${colors.bg} border flex items-center justify-center font-bold font-mono text-xs mx-auto mb-2 ${colors.hover} group-hover:text-white transition-all duration-300`}>
                                M0{idx + 1}
                              </div>
                              <h4 className="font-mono text-[10px] font-bold text-slate-800 uppercase tracking-wider line-clamp-2 group-hover:text-blue-650 transition-colors px-1 leading-normal">{map.title}</h4>
                            </div>
                            <p className="text-[9px] text-slate-400 font-mono mt-auto">Architecture Node</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* CONNECTED ARCHITECTURE DIAGRAMS (INFOGRAPHICS) */}
          <div className="w-full relative z-10 mt-6">

            {/* ARCHITECTURE DIAGRAM (INFOGRAPHICS) */}
            <div className="bg-white border border-slate-200 rounded p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#842b6a] flex items-center gap-2">
                    <Brain className="w-4 h-4 text-[#842b6a]" /> Infographics Topologies
                  </h3>
                  <Link href={`/student/subjects/subject/infographics?subjectId=${subjectId}`}>
                    <Button variant="ghost" className="text-slate-700 hover:text-[#AB3788] font-bold text-xs uppercase hover:bg-slate-100 border border-slate-200/80 rounded px-4 py-2 transition-all inline-flex items-center bg-white shadow-sm flex items-center view-all-btn">
                      <span>View All Infographics</span>
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

                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 w-full px-4">
                    {infographics.slice(0, 4).map((info: any, idx: number) => {
                      const nodeColors = [
                        { bg: "bg-pink-50 text-pink-700 border-pink-200", hover: "group-hover:bg-pink-600 group-hover:border-pink-600" },
                        { bg: "bg-teal-50 text-teal-700 border-teal-200", hover: "group-hover:bg-teal-600 group-hover:border-teal-600" },
                        { bg: "bg-orange-50 text-orange-700 border-orange-200", hover: "group-hover:bg-orange-600 group-hover:border-orange-600" },
                        { bg: "bg-indigo-50 text-indigo-700 border-indigo-200", hover: "group-hover:bg-indigo-600 group-hover:border-indigo-600" },
                      ];
                      const colors = nodeColors[idx % nodeColors.length];

                      return (
                        <Link key={info.id} href={`/student/subjects/subject/infographics/item?subjectId=${subjectId}&id=${info.id}`} className="w-full h-full flex">
                          <div className="bg-slate-50 border border-slate-200 hover:border-pink-500 rounded-lg p-4 text-center group cursor-pointer transition-all duration-300 relative shadow-sm w-full h-full transform hover:-translate-y-1.5 hover:scale-105 active:scale-[0.97] hover:bg-white hover:shadow-md flex flex-col justify-between items-center gap-2">
                            <div className="w-full flex flex-col items-center">
                              <div className={`w-7 h-7 rounded-full ${colors.bg} border flex items-center justify-center font-bold font-mono text-xs mx-auto mb-2 ${colors.hover} group-hover:text-white transition-all duration-300`}>
                                I0{idx + 1}
                              </div>
                              <h4 className="font-mono text-[10px] font-bold text-slate-800 uppercase tracking-wider line-clamp-2 group-hover:text-pink-650 transition-colors px-1 leading-normal">{info.title}</h4>
                            </div>
                            <p className="text-[9px] text-slate-400 font-mono mt-auto">Infographic Node</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
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
                <div key={idx} className="bg-slate-50 border border-slate-200 p-3.5 rounded hover:scale-[1.03] active:scale-[0.98] hover:shadow-md transition-all duration-200">
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

          {/* MAIN IDE WORKSPACE AREA (MOVED TO BOTTOM OF PAGE) */}
          <div className="flex flex-col gap-6 mt-6 relative z-10">

            {/* CODE EDITOR PANEL (FULL WIDTH AT TOP) */}
            <div className="bg-white border border-slate-200 rounded flex flex-col h-[500px] overflow-hidden relative group/editor shadow-sm">
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
                    <Play className="w-3.5 h-3.5 fill-current" /> {isTerminalRunning ? "Running..." : "Run Code"}
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

            {/* BOTTOM UTILITY DRAWERS: File Explorer & Terminal side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

              {/* File Explorer (Bottom Left) */}
              <div className="lg:col-span-1 bg-slate-50 border border-slate-200 rounded flex flex-col h-[320px] overflow-hidden shadow-sm">
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
                                    : "text-slate-655 hover:text-slate-900 hover:bg-slate-200/40 hover:translate-x-1 hover:shadow-xs"
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

              {/* Terminal / Compiler Widget (Bottom Right) */}
              <div className="lg:col-span-3 bg-slate-50 border border-slate-200 rounded overflow-hidden flex flex-col font-mono text-xs h-[320px] shadow-sm">
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

        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER VARIANT B: UI PROGRAMMING & DEFAULT FALLBACK LOOK (NEUBRUTALISM STYLE)
  // ==========================================
  const renderModulePreview = (moduleNo: number, title?: string) => {
    const normalizedTitle = String(title || "").toLowerCase();

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
          <circle cx="165" cy="15" r="3" fill="#10B981" />
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
            initial={{ strokeDashoffset: 0 }}
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

  const renderQuizPreview = (quizIndex: number, title?: string) => {
    const normalizedTitle = String(title || "").toLowerCase();

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

  const renderFlashcardPreview = (moduleNo: number, title?: string) => {
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
  const t = THEME_MAP[themeKey] || getDynamicTheme(subject?.id || subjectId);
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

      {/* Layered Design-System inspired Background - Disabled for Clean EdTech Minimal */}

      <div className="container mx-auto px-4 mt-6 relative z-10 space-y-6">
        
        {/* Top IDE Header / Status bar styled as DESIGN STUDIO */}
        <div className="bg-white border border-slate-200 rounded p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 font-mono text-xs text-slate-655 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5 flex-shrink-0">
              <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <span className="w-3 h-3 rounded-full bg-[#eab308]" />
              <span className="w-3 h-3 rounded-full bg-[#22c55e]" />
            </div>
            <span className="text-slate-300">|</span>
            <span className="font-bold text-[#7C3AED]">DESIGN STUDIO</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600 font-bold uppercase tracking-wider truncate max-w-[200px] md:max-w-none">{subject.name}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto font-ibm">
            {/* Design Metrics */}
            <div className="flex items-center gap-2 bg-indigo-50/80 border border-indigo-200 px-3 py-1.5 rounded hover:scale-105 hover:shadow-sm transition-all duration-200 cursor-default">
              <span className="text-indigo-600 font-semibold">Design System:</span>
              <span className="text-[#7C3AED] font-bold">88.4%</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50/80 border border-emerald-200 px-3 py-1.5 rounded hover:scale-105 hover:shadow-sm transition-all duration-200 cursor-default">
              <span className="text-emerald-600 font-semibold">Figma Sync:</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                <span className="text-emerald-800 font-bold uppercase">SUCCESSFUL</span>
              </span>
            </div>
            <div className="flex items-center gap-2 bg-purple-50/80 border border-purple-200 px-3 py-1.5 rounded hover:scale-105 hover:shadow-sm transition-all duration-200 cursor-default">
              <span className="text-purple-600 font-semibold">Accessibility:</span>
              <span className="text-purple-800 font-bold">98.4%</span>
            </div>
            <div className="flex items-center gap-2 bg-amber-50/80 border border-amber-200 px-3 py-1.5 rounded hover:scale-105 hover:shadow-sm transition-all duration-200 cursor-default font-mono">
              <span className="text-amber-600 font-semibold">UX Score:</span>
              <span className="text-amber-800 font-bold px-1.5 py-0.5 bg-amber-100/50 border border-amber-200 rounded">A+</span>
            </div>
          </div>
        </div>

          {/* UI LEARNING MODULES */}
          <div className="bg-white border border-slate-200 rounded p-6 shadow-sm relative z-10">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#7C3AED] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#7C3AED]" /> UI Learning Modules
              </h3>
              <Link href={`/student/subjects/subject/modules?subjectId=${subjectId}`}>
                <Button variant="ghost" className="text-slate-700 hover:text-[#7C3AED] font-bold text-xs uppercase hover:bg-slate-100 border border-slate-200/80 rounded px-4 py-2 transition-all inline-flex items-center bg-white shadow-sm flex items-center view-all-btn">
                  <span>View All Modules</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {modules.slice(0, 5).map((mod: any, idx: number) => {
                const subtopicsCount = mod.subtopics?.length || 0;
                return (
                  <Link key={mod.id} href={`/student/subjects/subject/modules/item?subjectId=${subjectId}&id=${mod.id}`}>
                    <div className="bg-slate-50 border border-slate-200 rounded p-4 hover:border-indigo-400 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 group h-full flex flex-col justify-between cursor-pointer relative overflow-hidden">
                      {/* Subtle accent bar for UI premium feel */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded font-mono font-bold tracking-widest uppercase">
                            MODULE 0{mod.moduleNo || (idx + 1)}
                          </span>
                        </div>
                        <h4 className="font-mono text-xs font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                          {mod.title ? mod.title.replace(/^[●•]\s*/, "") : ""}
                        </h4>
                        <p className="text-[10px] text-slate-500 line-clamp-2 mb-4 font-sans leading-relaxed">
                          {mod.co || "Introduces core concepts and key terminology."}
                        </p>
                      </div>
                      <div className="pt-2.5 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Book className="w-3.5 h-3.5" /> {subtopicsCount} Subtopics
                        </span>
                        <span className="text-indigo-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                          Study <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
              {modules.length === 0 && (
                <div className="col-span-full py-8 text-center font-bold text-slate-400 border border-dashed border-slate-200 rounded">
                  No modules available yet.
                </div>
              )}
            </div>
          </div>

            {/* TWO COLUMN GRID FOR QUIZZES AND FLASHCARDS (Like Python) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 w-full">

              {/* 2. Quizzes & Assessments */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded p-6 shadow-sm">
                <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#7C3AED] flex items-center gap-2">
                    <Component className="w-4 h-4 text-[#7C3AED]" /> Interactive Design Challenges
                  </h3>
                  <Link href={`/student/subjects/subject/quizzes?subjectId=${subjectId}`}>
                    <Button variant="ghost" className="text-slate-700 hover:text-[#7C3AED] font-bold text-xs uppercase hover:bg-slate-100 border border-slate-200/80 rounded px-4 py-2 transition-all inline-flex items-center bg-white shadow-sm flex items-center view-all-btn">
                      <span>View All Quizzes</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quizzesWithAttempts.slice(0, 6).map((quiz: any, idx: number) => {
                    const difficulty = idx % 2 === 0 ? "Medium" : "Hard";
                    const isHard = difficulty === "Hard";

                    // Color configurations for UI Programming
                    const themeColor = isHard ? "text-purple-700 bg-purple-50 border-purple-200" : "text-indigo-700 bg-indigo-50 border-indigo-200";
                    const btnColorClass = isHard
                      ? "bg-purple-600 hover:bg-purple-700 border-purple-700 shadow-purple-100"
                      : "bg-indigo-500 hover:bg-indigo-600 border-indigo-600 shadow-indigo-100";

                    return (
                      <div key={quiz.id} className="bg-slate-50 border border-slate-200 rounded p-4 hover:border-indigo-400 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 group">
                        <div className="flex justify-start items-start mb-2">
                          <span className={`text-[10px] ${themeColor} border px-2 py-0.5 rounded font-mono font-bold tracking-widest uppercase`}>🎨 UI CHALLENGE</span>
                        </div>
                        <h4 className="font-sans text-xs font-bold text-slate-800 mb-3 line-clamp-1 group-hover:text-indigo-600 transition-colors">{getQuizDisplayTitle(quiz, modules)}</h4>
                        <div className="mt-4 flex justify-end">
                          <Link href={`/student/subjects/subject/quizzes/item?subjectId=${subjectId}&id=${quiz.id}`}>
                            <Button className={`${btnColorClass} text-white border rounded font-mono text-[10px] py-1.5 px-4 h-8 uppercase tracking-wider hover:scale-105 active:scale-95 hover:shadow-md transition-all duration-200`}>
                              Start Challenge →
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                  {quizzesWithAttempts.length === 0 && (
                    <div className="col-span-2 p-6 border border-dashed border-slate-200 text-center text-slate-450 font-mono text-xs rounded">
                      All design specs met. No active challenges.
                    </div>
                  )}
                </div>
              </div>

            {/* 3. Flashcard Decks */}
            <div className="bg-white border border-slate-200 rounded p-6 shadow-sm">
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#7C3AED] flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#7C3AED]" /> UI Flashcard Decks
                </h3>
                <Link href={`/student/subjects/subject/flashcards?subjectId=${subjectId}`}>
                  <Button variant="ghost" className="text-slate-700 hover:text-[#7C3AED] font-bold text-xs uppercase hover:bg-slate-100 border border-slate-200/80 rounded px-4 py-2 transition-all inline-flex items-center bg-white shadow-sm flex items-center view-all-btn">
                    <span>View All Decks</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {flashcardDecks.slice(0, 4).map((deck: any, idx: number) => {
                  const keywordsList = ["Figma", "Spacing", "Colors", "A11y"];
                  const kw = keywordsList[idx % keywordsList.length];

                  const badgeColors = [
                    "text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
                    "text-purple-700 bg-purple-50 border-purple-200 hover:bg-purple-100",
                    "text-pink-700 bg-pink-50 border-pink-200 hover:bg-pink-100",
                    "text-fuchsia-700 bg-fuchsia-50 border-fuchsia-200 hover:bg-fuchsia-100"
                  ];
                  const badgeClass = badgeColors[idx % badgeColors.length];

                  return (
                    <Link key={deck.id} href={`/student/subjects/subject/flashcards/item?subjectId=${subjectId}&id=${deck.id}`}>
                      <div className="bg-slate-50 border border-slate-200 p-3.5 rounded hover:border-purple-400 hover:bg-white hover:shadow-md hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex justify-between items-center cursor-pointer group">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className={`font-mono text-[10px] font-bold px-2 py-0.5 border rounded flex-shrink-0 ${badgeClass} transition-colors`}>{kw}</span>
                          <span className="font-sans text-xs text-slate-800 font-semibold group-hover:text-purple-700 transition-colors truncate">{getFlashcardDisplayTitle(deck, modules)}</span>
                        </div>
                        <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 border border-indigo-100 rounded font-mono font-bold whitespace-nowrap">{deck.cards?.length || 0} CARDS</span>
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

            {/* CONNECTED ARCHITECTURE DIAGRAMS (MINDMAPS) */}
            <div className="w-full relative z-10 mt-6">
              <div className="bg-white border border-slate-200 rounded p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#7C3AED] flex items-center gap-2">
                      <Grid className="w-4 h-4 text-[#7C3AED]" /> UI Mind Maps
                    </h3>
                    <Link href={`/student/subjects/subject/mindmaps?subjectId=${subjectId}`}>
                      <Button variant="ghost" className="text-slate-700 hover:text-[#7C3AED] font-bold text-xs uppercase hover:bg-slate-100 border border-slate-200/80 rounded px-4 py-2 transition-all inline-flex items-center bg-white shadow-sm flex items-center view-all-btn">
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

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 w-full px-4">
                      {mindmaps.slice(0, 4).map((map: any, idx: number) => {
                        const nodeColors = [
                          { bg: "bg-indigo-50 text-indigo-700 border-indigo-200", hover: "group-hover:bg-indigo-600 group-hover:border-indigo-600" },
                          { bg: "bg-purple-50 text-purple-700 border-purple-200", hover: "group-hover:bg-purple-600 group-hover:border-purple-600" },
                          { bg: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200", hover: "group-hover:bg-fuchsia-600 group-hover:border-fuchsia-600" },
                          { bg: "bg-violet-50 text-violet-700 border-violet-200", hover: "group-hover:bg-violet-600 group-hover:border-violet-600" },
                        ];
                        const colors = nodeColors[idx % nodeColors.length];

                        return (
                          <Link key={map.id} href={`/student/subjects/subject/mindmaps/item?subjectId=${subjectId}&id=${map.id}`} className="w-full h-full flex">
                            <div className="bg-slate-50 border border-slate-200 hover:border-indigo-400 rounded-lg p-4 text-center group cursor-pointer transition-all duration-300 relative shadow-sm w-full h-full transform hover:-translate-y-1.5 hover:scale-105 active:scale-[0.97] hover:bg-white hover:shadow-md flex flex-col justify-between items-center gap-2">
                              <div className="w-full flex flex-col items-center">
                                <div className={`w-7 h-7 rounded-full ${colors.bg} border flex items-center justify-center font-bold font-mono text-xs mx-auto mb-2 ${colors.hover} group-hover:text-white transition-all duration-300`}>
                                  M0{idx + 1}
                                </div>
                                <h4 className="font-sans text-[10px] font-bold text-slate-800 uppercase tracking-wider line-clamp-2 group-hover:text-indigo-600 transition-colors px-1 leading-normal">{map.title}</h4>
                              </div>
                              <p className="text-[9px] text-slate-400 font-mono mt-auto">Design Node</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CONNECTED ARCHITECTURE DIAGRAMS (INFOGRAPHICS) */}
            <div className="w-full relative z-10 mt-6">
              <div className="bg-white border border-slate-200 rounded p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#ec4899] flex items-center gap-2">
                      <Grid className="w-4 h-4 text-[#ec4899]" /> Infographics Topologies
                    </h3>
                    <Link href={`/student/subjects/subject/infographics?subjectId=${subjectId}`}>
                      <Button variant="ghost" className="text-slate-700 hover:text-[#ec4899] font-bold text-xs uppercase hover:bg-slate-100 border border-slate-200/80 rounded px-4 py-2 transition-all inline-flex items-center bg-white shadow-sm flex items-center view-all-btn">
                        <span>View All Infographics</span>
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

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 w-full px-4">
                      {infographics.slice(0, 4).map((info: any, idx: number) => {
                        const nodeColors = [
                          { bg: "bg-pink-50 text-pink-700 border-pink-200", hover: "group-hover:bg-pink-600 group-hover:border-pink-600" },
                          { bg: "bg-rose-50 text-rose-700 border-rose-200", hover: "group-hover:bg-rose-600 group-hover:border-rose-600" },
                          { bg: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200", hover: "group-hover:bg-fuchsia-600 group-hover:border-fuchsia-600" },
                          { bg: "bg-purple-50 text-purple-700 border-purple-200", hover: "group-hover:bg-purple-600 group-hover:border-purple-600" },
                        ];
                        const colors = nodeColors[idx % nodeColors.length];

                        return (
                          <Link key={info.id} href={`/student/subjects/subject/infographics/item?subjectId=${subjectId}&id=${info.id}`} className="w-full h-full flex">
                            <div className="bg-slate-50 border border-slate-200 hover:border-pink-400 rounded-lg p-4 text-center group cursor-pointer transition-all duration-300 relative shadow-sm w-full h-full transform hover:-translate-y-1.5 hover:scale-105 active:scale-[0.97] hover:bg-white hover:shadow-md flex flex-col justify-between items-center gap-2">
                              <div className="w-full flex flex-col items-center">
                                <div className={`w-7 h-7 rounded-full ${colors.bg} border flex items-center justify-center font-bold font-mono text-xs mx-auto mb-2 ${colors.hover} group-hover:text-white transition-all duration-300`}>
                                  I0{idx + 1}
                                </div>
                                <h4 className="font-sans text-[10px] font-bold text-slate-800 uppercase tracking-wider line-clamp-2 group-hover:text-pink-600 transition-colors px-1 leading-normal">{info.title}</h4>
                              </div>
                              <p className="text-[9px] text-slate-400 font-mono mt-auto">Infographic Node</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>


          {/* Reference Materials (Bottom Column) */}
          <div className="w-full relative z-10 mt-6 pb-20">
            <div className="bg-white border border-slate-200 rounded p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-[#7C3AED]" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#7C3AED]">Design Resources & Documentation</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {subjectResources.slice(0, 4).map((resource: any, index: number) => (
                  <a key={index} href={resource.link} target="_blank" rel="noopener noreferrer" className="block w-full">
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded hover:bg-indigo-50/50 hover:border-indigo-400 hover:shadow-sm transition-all duration-200 flex items-start gap-3 group h-full">
                      <div className="bg-white border border-slate-200 rounded p-1.5 mt-0.5 group-hover:border-indigo-400 transition-colors">
                        <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700 group-hover:text-indigo-700 transition-colors line-clamp-1">{resource.title}</p>
                        <p className="text-[9px] text-slate-400 font-mono mt-0.5 uppercase tracking-wider">{resource.type}</p>
                      </div>
                    </div>
                  </a>
                ))}
                {subjectResources.length === 0 && (
                  <div className="col-span-full py-4 text-center text-slate-400 text-xs font-mono border border-dashed rounded">
                    No official design assets linked.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}