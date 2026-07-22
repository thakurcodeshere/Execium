export interface LineBreakdown {
  lineNum: number;
  codeSnippet: string;
  constructType: 'Header / Include' | 'Function Signature' | 'Variable & Initializer' | 'Loop Construct' | 'Condition & Branch' | 'Return / Cleanup';
  title: string;
  explanation: string;
  keyDetails: {
    variableOrConstruct: string;
    role: string;
    whyThisWay: string;
  }[];
}

export interface LearnApproach {
  id: string;
  name: string;
  category: string;
  description: string;
  prosCons: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface LearnModule {
  id: string;
  title: string;
  shortDesc: string;
  traceKey: string;
  category: string;
  problemStatement: {
    title: string;
    objective: string;
    inputDesc: string;
    outputDesc: string;
    takeaways: string[];
  };
  approaches: LearnApproach[];
  lineBreakdown: LineBreakdown[];
  fullCode: string;
}

export const LEARN_MODULES: LearnModule[] = [
  {
    id: "searching",
    title: "Binary Search & Divide & Conquer",
    shortDesc: "Master logarithmic searching, pointers, loop conditions, and overflow-safe mid calculation.",
    traceKey: "binary_search",
    category: "Algorithms",
    problemStatement: {
      title: "Target Value Search in a Sorted Array",
      objective: "Given a sorted vector of integers `arr` and a target value `target`, find the 0-based index of `target` in logarithmic time O(log N). If the target does not exist, return -1.",
      inputDesc: "Sorted vector `arr` = [1, 3, 5, 7, 9, 11, 15], `target` = 7",
      outputDesc: "Index `3` (since arr[3] == 7)",
      takeaways: [
        "Divide and conquer search space halving",
        "Overflow-safe midpoint formula calculation",
        "Loop boundary condition termination (`lo <= hi`)",
        "Boundary adjustment (`lo = mid + 1` vs `hi = mid - 1`)"
      ]
    },
    approaches: [
      {
        id: "binary_search",
        name: "Approach 1: Divide and Conquer (Binary Search)",
        category: "Optimal",
        description: "Divide the sorted array into two halves at each step. By comparing target with mid element, eliminate half of the search space every iteration.",
        prosCons: "Pros: Extremely fast logarithmic O(log N) time. Cons: Array MUST be sorted beforehand.",
        timeComplexity: "O(log N)",
        spaceComplexity: "O(1)"
      },
      {
        id: "linear_search",
        name: "Approach 2: Linear Scan (Naive Sequential Search)",
        category: "Alternative",
        description: "Iterate through every single index from 0 to N-1 and compare elements sequentially until target is found.",
        prosCons: "Pros: Works on unsorted arrays. Cons: Slow linear O(N) time for large datasets.",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)"
      }
    ],
    lineBreakdown: [
      {
        lineNum: 1,
        codeSnippet: "#include <iostream>\n#include <vector>",
        constructType: "Header / Include",
        title: "Standard Library Headers",
        explanation: "Include `<iostream>` for output printing (`std::cout`) and `<vector>` for dynamic sequence containers (`std::vector`).",
        keyDetails: [
          { variableOrConstruct: "#include <vector>", role: "Library import", whyThisWay: "Enables `std::vector` contiguous memory array structure." }
        ]
      },
      {
        lineNum: 2,
        codeSnippet: "int binarySearch(const vector<int>& arr, int target)",
        constructType: "Function Signature",
        title: "Function Signature & Parameters",
        explanation: "Pass `arr` by `const vector<int>&` (constant reference) to prevent costly copying of elements while guaranteeing read-only access.",
        keyDetails: [
          { variableOrConstruct: "const vector<int>& arr", role: "Input Parameter", whyThisWay: "Avoids memory duplication (O(1) parameter passing) and protects input array from mutation." },
          { variableOrConstruct: "int target", role: "Value Parameter", whyThisWay: "Primitive int passed by value efficiently in a CPU register." }
        ]
      },
      {
        lineNum: 3,
        codeSnippet: "int lo = 0;\nint hi = arr.size() - 1;",
        constructType: "Variable & Initializer",
        title: "Range Pointer Initializers",
        explanation: "Initialize `lo` to 0 (start index) and `hi` to `arr.size() - 1` (last index). These two integer variables define our active search window boundaries.",
        keyDetails: [
          { variableOrConstruct: "int lo = 0", role: "Lower Bound Pointer", whyThisWay: "Starts at the first valid array index." },
          { variableOrConstruct: "int hi = arr.size() - 1", role: "Upper Bound Pointer", whyThisWay: "Points to the last element. Using size() - 1 prevents out-of-bounds indexing." }
        ]
      },
      {
        lineNum: 4,
        codeSnippet: "while (lo <= hi)",
        constructType: "Loop Construct",
        title: "Loop Condition Check",
        explanation: "The while loop continues as long as `lo <= hi`. When `lo > hi`, the search window has collapsed to zero size, meaning target is absent.",
        keyDetails: [
          { variableOrConstruct: "lo <= hi", role: "Loop Termination Condition", whyThisWay: "Ensures single-element search windows (`lo == hi`) are evaluated before terminating." }
        ]
      },
      {
        lineNum: 5,
        codeSnippet: "int mid = lo + (hi - lo) / 2;",
        constructType: "Variable & Initializer",
        title: "Overflow-Safe Midpoint Calculation",
        explanation: "Compute `mid` using `lo + (hi - lo) / 2` instead of `(lo + hi) / 2` to prevent potential 32-bit signed integer overflow when `lo + hi` exceeds `2,147,483,647`.",
        keyDetails: [
          { variableOrConstruct: "int mid", role: "Sub-array Index Counter", whyThisWay: "Serves as the pivot index to inspect the middle element in each step." },
          { variableOrConstruct: "lo + (hi - lo) / 2", role: "Math Formula", whyThisWay: "Mathematically equivalent to `(lo+hi)/2` but safe against integer overflow." }
        ]
      },
      {
        lineNum: 6,
        codeSnippet: "if (arr[mid] == target) return mid;",
        constructType: "Condition & Branch",
        title: "Target Element Check",
        explanation: "Inspect element at `arr[mid]`. If it matches `target`, we immediately return `mid` as the solution index.",
        keyDetails: [
          { variableOrConstruct: "arr[mid] == target", role: "Match Condition", whyThisWay: "Direct O(1) element lookup check." }
        ]
      },
      {
        lineNum: 7,
        codeSnippet: "if (arr[mid] < target) lo = mid + 1;\nelse hi = mid - 1;",
        constructType: "Condition & Branch",
        title: "Search Window Halving Adjustments",
        explanation: "If `arr[mid] < target`, target must lie in the right half, so advance `lo = mid + 1`. Otherwise, target lies in the left half, so shrink `hi = mid - 1`.",
        keyDetails: [
          { variableOrConstruct: "lo = mid + 1", role: "Lower Bound Shift", whyThisWay: "Excludes `mid` and all elements to its left." },
          { variableOrConstruct: "hi = mid - 1", role: "Upper Bound Shift", whyThisWay: "Excludes `mid` and all elements to its right." }
        ]
      },
      {
        lineNum: 8,
        codeSnippet: "return -1;",
        constructType: "Return / Cleanup",
        title: "Fallback Return Value",
        explanation: "If the loop terminates without finding target, return `-1` to signal to caller that target is not present in the vector.",
        keyDetails: [
          { variableOrConstruct: "return -1", role: "Sentinel Return", whyThisWay: "Standard C++ convention for invalid/not-found index." }
        ]
      }
    ],
    fullCode: `// Learn: Binary Search Algorithm\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nint binarySearch(const vector<int>& arr, int target) {\n    int lo = 0;\n    int hi = arr.size() - 1;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}\n\nint main() {\n    vector<int> arr = {1, 3, 5, 7, 9, 11, 15};\n    int target = 7;\n    int idx = binarySearch(arr, target);\n    cout << "Target " << target << " found at index: " << idx << endl;\n    return 0;\n}`
  },
  {
    id: "raii",
    title: "Smart Pointers & RAII Memory Model",
    shortDesc: "Understand automatic heap deallocation, ownership transfer, unique_ptr vs shared_ptr.",
    traceKey: "smart_ptr",
    category: "Memory Management",
    problemStatement: {
      title: "Resource Acquisition Is Initialization (RAII)",
      objective: "Manage dynamically allocated heap objects safely without manual `delete` calls, eliminating memory leaks, dangling pointers, and double-free crashes.",
      inputDesc: "Creating a heap object `Entity` and wrapping it in `std::unique_ptr<Entity>`",
      outputDesc: "Automatic destructor invocation upon scope exit",
      takeaways: [
        "Scope-bound dynamic lifetime management",
        "Exclusive ownership semantics with `std::unique_ptr`",
        "Move semantics (`std::move`) for ownership transfer",
        "Zero-overhead abstraction compared to raw pointers"
      ]
    },
    approaches: [
      {
        id: "unique_ptr",
        name: "Approach 1: Exclusive Ownership (std::unique_ptr)",
        category: "Optimal",
        description: "Enforces strict single ownership. When unique_ptr leaves scope, destructor is called automatically.",
        prosCons: "Pros: Zero runtime overhead, impossible to leak. Cons: Cannot be copied (only moved).",
        timeComplexity: "O(1)",
        spaceComplexity: "O(1)"
      },
      {
        id: "shared_ptr",
        name: "Approach 2: Reference Counted (std::shared_ptr)",
        category: "Alternative",
        description: "Shares ownership among multiple pointers using internal control block ref-counts.",
        prosCons: "Pros: Multi-owner sharing. Cons: Slight atomic ref-count overhead.",
        timeComplexity: "O(1)",
        spaceComplexity: "O(1) extra control block"
      }
    ],
    lineBreakdown: [
      {
        lineNum: 1,
        codeSnippet: "#include <iostream>\n#include <memory>",
        constructType: "Header / Include",
        title: "Memory Library Import",
        explanation: "Include `<memory>` header to access `std::unique_ptr`, `std::make_unique`, and `std::shared_ptr`.",
        keyDetails: [
          { variableOrConstruct: "#include <memory>", role: "STL Memory Header", whyThisWay: "Required for all C++ smart pointer types." }
        ]
      },
      {
        lineNum: 2,
        codeSnippet: "auto ptr = make_unique<int>(42);",
        constructType: "Variable & Initializer",
        title: "Heap Allocation & RAII Initialization",
        explanation: "Allocates integer `42` on the heap and binds ownership to `ptr`. `make_unique` provides exception-safe allocation.",
        keyDetails: [
          { variableOrConstruct: "make_unique<int>(42)", role: "Heap Allocation Factory", whyThisWay: "Prevents memory leaks during complex expression evaluation." },
          { variableOrConstruct: "auto ptr", role: "Smart Pointer Owner", whyThisWay: "Auto deduces `std::unique_ptr<int>` type." }
        ]
      },
      {
        lineNum: 3,
        codeSnippet: "*ptr = 100;",
        constructType: "Condition & Branch",
        title: "Dereference & Value Mutation",
        explanation: "Use `*` operator to access and mutate the underlying heap integer value directly.",
        keyDetails: [
          { variableOrConstruct: "*ptr", role: "Dereference Operator", whyThisWay: "Behaves like a raw pointer while retaining RAII ownership." }
        ]
      },
      {
        lineNum: 4,
        codeSnippet: "auto ptr2 = std::move(ptr);",
        constructType: "Variable & Initializer",
        title: "Ownership Transfer via Move Semantics",
        explanation: "Transfers heap ownership from `ptr` to `ptr2`. `ptr` becomes `nullptr`, while `ptr2` becomes sole owner.",
        keyDetails: [
          { variableOrConstruct: "std::move(ptr)", role: "Ownership Transfer", whyThisWay: "unique_ptr copy constructor is deleted; move transfer required." }
        ]
      }
    ],
    fullCode: `// Learn: Smart Pointers & RAII\n#include <iostream>\n#include <memory>\nusing namespace std;\n\nint main() {\n    // Allocate heap integer with RAII management\n    auto ptr = make_unique<int>(42);\n    cout << "Original Value: " << *ptr << endl;\n    \n    *ptr = 100;\n    cout << "Mutated Value: " << *ptr << endl;\n    \n    // Move ownership to ptr2\n    auto ptr2 = move(ptr);\n    if (!ptr) cout << "ptr is now null (ownership moved)" << endl;\n    cout << "ptr2 value: " << *ptr2 << endl;\n    \n    return 0;\n    // Automatic deallocation occurs here on scope exit\n}`
  },
  {
    id: "recursion",
    title: "Recursion & Stack Frame Dimension",
    shortDesc: "Understand function call stacks, base cases, unwind phases, and stack overflow limits.",
    traceKey: "factorial",
    category: "Recursion",
    problemStatement: {
      title: "Factorial & Recursion Stack Tracing",
      objective: "Compute factorial `N!` recursively while observing stack frames pushed on call and popped on return unwind.",
      inputDesc: "Integer `N = 4`",
      outputDesc: "Factorial result `24`",
      takeaways: [
        "Call stack frame allocation per recursive invocation",
        "Base case guard condition (`n <= 1`)",
        "Subproblem reduction step (`n * fact(n-1)`)",
        "Stack frame unwind & return value bubble up"
      ]
    },
    approaches: [
      {
        id: "recursion_head",
        name: "Approach 1: Recursive Breakdown",
        category: "Optimal",
        description: "Breaks problem N into smaller subproblem N-1 until base case is reached.",
        prosCons: "Pros: Elegant mathematical representation. Cons: Consumes O(N) stack frame memory.",
        timeComplexity: "O(N)",
        spaceComplexity: "O(N) stack frames"
      },
      {
        id: "iterative_loop",
        name: "Approach 2: Iterative Loop Accumulator",
        category: "Alternative",
        description: "Uses a for loop counter from 1 to N to multiply result sequentially.",
        prosCons: "Pros: O(1) space, no stack overflow risk. Cons: Less expressive for recursive tree structures.",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)"
      }
    ],
    lineBreakdown: [
      {
        lineNum: 1,
        codeSnippet: "int fact(int n)",
        constructType: "Function Signature",
        title: "Recursive Function Declaration",
        explanation: "Takes integer `n` as parameter and returns computed factorial result.",
        keyDetails: [
          { variableOrConstruct: "int n", role: "Stack Frame Input State", whyThisWay: "Unique copy stored in each call stack frame." }
        ]
      },
      {
        lineNum: 2,
        codeSnippet: "if (n <= 1) return 1;",
        constructType: "Condition & Branch",
        title: "Base Case Guard",
        explanation: "CRITICAL: Base case prevents infinite recursion. Returns 1 when `n <= 1` to halt call stack expansion.",
        keyDetails: [
          { variableOrConstruct: "n <= 1", role: "Termination Guard", whyThisWay: "Without base case, function triggers infinite stack frames and SegFault." }
        ]
      },
      {
        lineNum: 3,
        codeSnippet: "return n * fact(n - 1);",
        constructType: "Return / Cleanup",
        title: "Recursive Call & Combination Step",
        explanation: "Pushes a new call frame `fact(n-1)` onto the stack. After return, multiplies `n` with returned result.",
        keyDetails: [
          { variableOrConstruct: "fact(n - 1)", role: "Subproblem Invocation", whyThisWay: "Reduces problem size towards base case." }
        ]
      }
    ],
    fullCode: `// Learn: Recursive Call Stack Mechanics\n#include <iostream>\nusing namespace std;\n\nint fact(int n) {\n    if (n <= 1) return 1; // Base case guard\n    return n * fact(n - 1); // Recursive reduction\n}\n\nint main() {\n    int n = 4;\n    cout << "fact(" << n << ") = " << fact(n) << endl;\n    return 0;\n}`
  },
  {
    id: "sorting",
    title: "Bubble Sort & Array Swapping Mechanics",
    shortDesc: "Understand nested loops, adjacent element comparison, swap passes, and array mutation.",
    traceKey: "bubble_sort",
    category: "Algorithms",
    problemStatement: {
      title: "Array Sorting via Adjacent Swaps",
      objective: "Sort an unsorted integer array in non-decreasing order by repeatedly swapping adjacent elements that are out of order.",
      inputDesc: "Unsorted vector `arr` = [5, 2, 8, 1, 9]",
      outputDesc: "Sorted vector `arr` = [1, 2, 5, 8, 9]",
      takeaways: [
        "Outer pass loop counter (`i`)",
        "Inner comparison loop boundary (`j < n - i - 1`)",
        "In-place swap mechanics (`std::swap`)",
        "Bubble-up maximum element behavior per pass"
      ]
    },
    approaches: [
      {
        id: "bubble_sort",
        name: "Approach 1: Bubble Sort Passes",
        category: "Educational",
        description: "Compares adjacent items and bubbles largest element to the end in each pass.",
        prosCons: "Pros: In-place O(1) space. Cons: Quadratic O(N²) time complexity.",
        timeComplexity: "O(N²)",
        spaceComplexity: "O(1)"
      },
      {
        id: "std_sort",
        name: "Approach 2: STL std::sort (IntroSort)",
        category: "Optimal",
        description: "Hybrid of QuickSort, HeapSort, and InsertionSort used in C++ standard library.",
        prosCons: "Pros: Highly optimized O(N log N). Cons: Hides underlying comparison steps.",
        timeComplexity: "O(N log N)",
        spaceComplexity: "O(log N)"
      }
    ],
    lineBreakdown: [
      {
        lineNum: 1,
        codeSnippet: "for (int i = 0; i < n - 1; i++)",
        constructType: "Loop Construct",
        title: "Outer Pass Loop",
        explanation: "Runs `n - 1` passes. After pass `i`, the largest `i` elements are sorted at the end.",
        keyDetails: [
          { variableOrConstruct: "int i = 0", role: "Pass Counter", whyThisWay: "Tracks number of completed sorting passes." }
        ]
      },
      {
        lineNum: 2,
        codeSnippet: "for (int j = 0; j < n - i - 1; j++)",
        constructType: "Loop Construct",
        title: "Inner Adjacent Comparison Loop",
        explanation: "Iterates through unsorted elements. `n - i - 1` skips elements already bubbled to the end.",
        keyDetails: [
          { variableOrConstruct: "j < n - i - 1", role: "Optimized Loop Bound", whyThisWay: "Avoids re-checking already sorted tail elements." }
        ]
      },
      {
        lineNum: 3,
        codeSnippet: "if (arr[j] > arr[j + 1]) swap(arr[j], arr[j + 1]);",
        constructType: "Condition & Branch",
        title: "Adjacent Comparison & In-Place Swap",
        explanation: "Compares left and right adjacent elements. If left > right, swaps values in memory.",
        keyDetails: [
          { variableOrConstruct: "swap(arr[j], arr[j+1])", role: "In-Place Swap", whyThisWay: "Swaps values using temp variable or std::swap." }
        ]
      }
    ],
    fullCode: `// Learn: Bubble Sort Pass Mechanics\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nvoid bubbleSort(vector<int>& arr) {\n    int n = arr.size();\n    for (int i = 0; i < n - 1; i++) {\n        for (int j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                swap(arr[j], arr[j + 1]);\n            }\n        }\n    }\n}\n\nint main() {\n    vector<int> arr = {5, 2, 8, 1, 9};\n    bubbleSort(arr);\n    for (int val : arr) cout << val << " ";\n    cout << endl;\n    return 0;\n}`
  },
  {
    id: "lists",
    title: "Pointer Chains & Linked List Nodes",
    shortDesc: "Understand dynamic heap node allocation, next pointers, traversing, and in-place reversal.",
    traceKey: "linked_list",
    category: "Data Structures",
    problemStatement: {
      title: "Dynamic Node Linkage & Traversal",
      objective: "Build a singly linked list with node pointers (`Node* next`) and traverse the chain step-by-step.",
      inputDesc: "Nodes [1] -> [2] -> [3] -> nullptr",
      outputDesc: "Sequential print: 1 -> 2 -> 3 -> nullptr",
      takeaways: [
        "Struct definition with value and pointer fields",
        "Heap allocation using `new Node(val)`",
        "Pointer reassignment (`curr = curr->next`)",
        "Null pointer sentinel check (`curr != nullptr`)"
      ]
    },
    approaches: [
      {
        id: "pointer_traversal",
        name: "Approach 1: Pointer Iteration",
        category: "Optimal",
        description: "Uses a current pointer `curr` initialized to head, stepping to `curr->next` until null.",
        prosCons: "Pros: Simple O(N) traversal. Cons: Non-contiguous memory (cache misses).",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)"
      }
    ],
    lineBreakdown: [
      {
        lineNum: 1,
        codeSnippet: "struct Node {\n    int val;\n    Node* next;\n    Node(int x) : val(x), next(nullptr) {}\n};",
        constructType: "Variable & Initializer",
        title: "Node Struct Definition",
        explanation: "Defines a self-referential Node struct holding data `val` and pointer `next` to another Node.",
        keyDetails: [
          { variableOrConstruct: "Node* next", role: "Linkage Pointer", whyThisWay: "Points to next memory location on heap." },
          { variableOrConstruct: "Node(int x) : val(x), next(nullptr)", role: "Constructor", whyThisWay: "Initializes node data and sets next to nullptr safely." }
        ]
      },
      {
        lineNum: 2,
        codeSnippet: "Node* head = new Node(1);\nhead->next = new Node(2);",
        constructType: "Variable & Initializer",
        title: "Heap Node Chain Allocation",
        explanation: "Allocates nodes on heap with `new` and connects `head->next` to second node.",
        keyDetails: [
          { variableOrConstruct: "new Node(1)", role: "Heap Allocation", whyThisWay: "Dynamically creates node persisting beyond local scope." }
        ]
      },
      {
        lineNum: 3,
        codeSnippet: "while (curr != nullptr) {\n    cout << curr->val << \" \";\n    curr = curr->next;\n}",
        constructType: "Loop Construct",
        title: "Pointer Step Traversal Loop",
        explanation: "Advances `curr` pointer through node chain until reaching `nullptr`.",
        keyDetails: [
          { variableOrConstruct: "curr = curr->next", role: "Pointer Step", whyThisWay: "Moves pointer to next memory address in linked chain." }
        ]
      }
    ],
    fullCode: `// Learn: Pointer Chains & Linked List Nodes\n#include <iostream>\nusing namespace std;\n\nstruct Node {\n    int val;\n    Node* next;\n    Node(int x) : val(x), next(nullptr) {}\n};\n\nint main() {\n    Node* head = new Node(1);\n    head->next = new Node(2);\n    head->next->next = new Node(3);\n    \n    Node* curr = head;\n    while (curr != nullptr) {\n        cout << curr->val << " -> ";\n        curr = curr->next;\n    }\n    cout << "nullptr" << endl;\n    return 0;\n}`
  }
];

export function getLearnModuleDetails(id: string): LearnModule {
  return LEARN_MODULES.find(m => m.id === id) || LEARN_MODULES[0];
}
