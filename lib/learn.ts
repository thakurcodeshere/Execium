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
  id: number; // 1 to 10
  name: string;
  category: string;
  description: string;
  prosCons: string;
  timeComplexity: string;
  spaceComplexity: string;
  isFree: boolean; // true for approaches 1 & 2; false for 3..10 (payable)
  code: string; // Unique solution code for this specific mental model
  lineBreakdown: LineBreakdown[]; // Unique line-by-line breakdown for this specific mental model!
}

export interface LearnModule {
  id: string;
  title: string;
  shortDesc: string;
  traceKey: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  problemStatement: {
    title: string;
    objective: string;
    inputDesc: string;
    outputDesc: string;
    takeaways: string[];
  };
  approaches: LearnApproach[];
  fullCode: string;
}

// ── RAW DATA SEED FOR ALL 100 C++ MODULES ──
const RAW_MODULE_TOPICS: Array<{
  id: string;
  title: string;
  shortDesc: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  traceKey: string;
}> = [
  // ── EASY MODE (1 - 35) ──
  { id: "easy_hello", title: "1. Hello World & I/O Streams", shortDesc: "Input/output streams using std::cout, std::cin, and std::endl.", difficulty: "easy", category: "Fundamentals", traceKey: "for_loop" },
  { id: "easy_vars", title: "2. Primitive Types & Integer Bounds", shortDesc: "Primitive types (int, double, char, bool) and overflow behavior.", difficulty: "easy", category: "Fundamentals", traceKey: "for_loop" },
  { id: "easy_conditionals", title: "3. If-Else & Ternary Operator", shortDesc: "Conditional branching and ternary selector expressions.", difficulty: "easy", category: "Fundamentals", traceKey: "for_loop" },
  { id: "easy_loops", title: "4. For, While, & Do-While Loops", shortDesc: "Iterative loop counters, exit conditions, and incrementors.", difficulty: "easy", category: "Fundamentals", traceKey: "for_loop" },
  { id: "easy_functions", title: "5. Function Signatures & Parameters", shortDesc: "Pass-by-value vs pass-by-reference parameter passing.", difficulty: "easy", category: "Fundamentals", traceKey: "for_loop" },
  { id: "easy_arrays", title: "6. Fixed-Size Contiguous Arrays", shortDesc: "Fixed-length stack arrays and 0-based index lookup.", difficulty: "easy", category: "Fundamentals", traceKey: "bubble_sort" },
  { id: "easy_strings", title: "7. String Operations (std::string)", shortDesc: "String concatenation, substr, find, and length checks.", difficulty: "easy", category: "STL Containers", traceKey: "for_loop" },
  { id: "easy_vector", title: "8. Dynamic Vectors (std::vector)", shortDesc: "Dynamic resizing arrays, push_back, size, and capacity.", difficulty: "easy", category: "STL Containers", traceKey: "bubble_sort" },
  { id: "easy_pointers", title: "9. Raw Pointers & Address-of (&)", shortDesc: "Pointer declarations, memory addresses, and dereferencing (*).", difficulty: "easy", category: "Memory & Pointers", traceKey: "linked_list" },
  { id: "easy_structs", title: "10. Structs & Member Access", shortDesc: "Grouping data members with struct and access operators (. and ->).", difficulty: "easy", category: "OOP Basics", traceKey: "linked_list" },
  { id: "easy_enums", title: "11. Scoped Enums (enum class)", shortDesc: "Strongly typed scoped enums for type-safe state machines.", difficulty: "easy", category: "Fundamentals", traceKey: "for_loop" },
  { id: "easy_math", title: "12. CMath Library Operations", shortDesc: "Mathematical functions: sqrt, pow, abs, ceil, and floor.", difficulty: "easy", category: "Fundamentals", traceKey: "for_loop" },
  { id: "easy_switch", title: "13. Switch Case Statements", shortDesc: "Multi-branch switch execution and break statements.", difficulty: "easy", category: "Fundamentals", traceKey: "for_loop" },
  { id: "easy_const", title: "14. Const Correctness & Read-Only", shortDesc: "Immutability with const variables, references, and pointers.", difficulty: "easy", category: "Fundamentals", traceKey: "for_loop" },
  { id: "easy_auto", title: "15. Auto Type Deduction (C++11)", shortDesc: "Compiler automatic type inference with auto keyword.", difficulty: "easy", category: "Modern C++", traceKey: "for_loop" },
  { id: "easy_range_for", title: "16. Range-Based For Loops", shortDesc: "Clean container iteration syntax: for (const auto& elem : vec).", difficulty: "easy", category: "Modern C++", traceKey: "bubble_sort" },
  { id: "easy_pass_ref", title: "17. Const Reference Passing", shortDesc: "Efficient parameter passing (const T&) avoiding copies.", difficulty: "easy", category: "Fundamentals", traceKey: "binary_search" },
  { id: "easy_default_args", title: "18. Default Parameter Values", shortDesc: "Optional function parameters with default fallback values.", difficulty: "easy", category: "Fundamentals", traceKey: "for_loop" },
  { id: "easy_overloading", title: "19. Function Overloading", shortDesc: "Same function name with different parameter signatures.", difficulty: "easy", category: "Fundamentals", traceKey: "for_loop" },
  { id: "easy_namespaces", title: "20. Namespaces & Scope Resolution", shortDesc: "Preventing naming collisions using namespace and :: operator.", difficulty: "easy", category: "Fundamentals", traceKey: "for_loop" },
  { id: "easy_static_var", title: "21. Static Local Variables", shortDesc: "State persistence across function calls using static local vars.", difficulty: "easy", category: "Fundamentals", traceKey: "for_loop" },
  { id: "easy_typedef", title: "22. Type Aliases (using vs typedef)", shortDesc: "Creating modern type aliases using the using keyword.", difficulty: "easy", category: "Fundamentals", traceKey: "for_loop" },
  { id: "easy_cstring", title: "23. C-Style Null-Terminated Strings", shortDesc: "Working with char arrays, strlen, and null terminator '\\0'.", difficulty: "easy", category: "Fundamentals", traceKey: "for_loop" },
  { id: "easy_pair", title: "24. Pair Container (std::pair)", shortDesc: "Storing two heterogeneous objects together with std::pair.", difficulty: "easy", category: "STL Containers", traceKey: "for_loop" },
  { id: "easy_tuple_basic", title: "25. Tuples (std::tuple & std::get)", shortDesc: "Fixed-size collection of heterogeneous values with std::tuple.", difficulty: "easy", category: "STL Containers", traceKey: "for_loop" },
  { id: "easy_stack_std", title: "26. Standard Stack (std::stack)", shortDesc: "LIFO (Last In First Out) container adapter: push, pop, top.", difficulty: "easy", category: "Data Structures", traceKey: "factorial" },
  { id: "easy_queue_std", title: "27. Standard Queue (std::queue)", shortDesc: "FIFO (First In First Out) container adapter: push, pop, front.", difficulty: "easy", category: "Data Structures", traceKey: "for_loop" },
  { id: "easy_set_std", title: "28. Ordered Set (std::set)", shortDesc: "Self-balancing BST storing unique sorted elements.", difficulty: "easy", category: "Data Structures", traceKey: "binary_search" },
  { id: "easy_map_std", title: "29. Ordered Map (std::map)", shortDesc: "Key-value associative container sorted by keys.", difficulty: "easy", category: "Data Structures", traceKey: "binary_search" },
  { id: "easy_unordered_map", title: "30. Hash Map (std::unordered_map)", shortDesc: "O(1) average lookup key-value store using hashing.", difficulty: "easy", category: "Data Structures", traceKey: "for_loop" },
  { id: "easy_algorithms_basic", title: "31. Basic STL Algorithms", shortDesc: "std::sort, std::reverse, std::min, std::max, and std::count.", difficulty: "easy", category: "STL Algorithms", traceKey: "bubble_sort" },
  { id: "easy_recursion_basic", title: "32. Introduction to Recursion", shortDesc: "Recursive base cases and self-referencing function calls.", difficulty: "easy", category: "Recursion", traceKey: "factorial" },
  { id: "easy_bit_basic", title: "33. Bitwise Operators (&, |, ^, ~)", shortDesc: "Bit manipulation, bit shifts (<<, >>), and mask evaluations.", difficulty: "easy", category: "Bit Manipulation", traceKey: "for_loop" },
  { id: "easy_exception_basic", title: "34. Exception Handling (try/catch)", shortDesc: "Handling runtime errors with try, catch, and throw.", difficulty: "easy", category: "Fundamentals", traceKey: "for_loop" },
  { id: "easy_class_basic", title: "35. Classes & Access Modifiers", shortDesc: "Object-oriented encapsulation with public and private members.", difficulty: "easy", category: "OOP Basics", traceKey: "linked_list" },

  // ── MEDIUM MODE (36 - 75) ──
  { id: "med_raii", title: "36. Unique Pointers (std::unique_ptr)", shortDesc: "Exclusive RAII ownership and automatic heap memory release.", difficulty: "medium", category: "Memory & Pointers", traceKey: "smart_ptr" },
  { id: "med_shared_ptr", title: "37. Shared & Weak Pointers", shortDesc: "Reference counted ownership with std::shared_ptr & std::weak_ptr.", difficulty: "medium", category: "Memory & Pointers", traceKey: "smart_ptr" },
  { id: "med_move_semantics", title: "38. Move Semantics & Rvalue References", shortDesc: "Zero-copy resource transfers using std::move and T&&.", difficulty: "medium", category: "Modern C++", traceKey: "smart_ptr" },
  { id: "med_lambdas", title: "39. Lambda Closures & Captures", shortDesc: "Anonymous functions with capture clauses ([=], [&]) and mutable.", difficulty: "medium", category: "Modern C++", traceKey: "bubble_sort" },
  { id: "med_templates_func", title: "40. Function Templates", shortDesc: "Generic programming using template<typename T> for functions.", difficulty: "medium", category: "Templates", traceKey: "binary_search" },
  { id: "med_templates_class", title: "41. Class Templates", shortDesc: "Generic data structures using template<class T> classes.", difficulty: "medium", category: "Templates", traceKey: "linked_list" },
  { id: "med_constructors", title: "42. Special Member Functions", shortDesc: "Constructors, copy constructors, move constructors, & Rule of 5.", difficulty: "medium", category: "OOP Basics", traceKey: "linked_list" },
  { id: "med_destructors", title: "43. Virtual Destructors & Cleanup", shortDesc: "Preventing memory leaks during polymorphic class deletion.", difficulty: "medium", category: "OOP Basics", traceKey: "linked_list" },
  { id: "med_op_overload", title: "44. Operator Overloading", shortDesc: "Overloading +, ==, <<, and [] operators for custom objects.", difficulty: "medium", category: "OOP Basics", traceKey: "for_loop" },
  { id: "med_inheritance", title: "45. Inheritance & Protected Members", shortDesc: "Base and derived classes, access levels, and base initialization.", difficulty: "medium", category: "OOP Basics", traceKey: "linked_list" },
  { id: "med_virtual_func", title: "46. Polymorphism & Virtual Functions", shortDesc: "Dynamic dispatch using virtual functions, override, and VTables.", difficulty: "medium", category: "OOP Basics", traceKey: "linked_list" },
  { id: "med_abstract_class", title: "47. Pure Virtual & Abstract Interfaces", shortDesc: "Creating abstract base interfaces using pure virtual functions (= 0).", difficulty: "medium", category: "OOP Basics", traceKey: "linked_list" },
  { id: "med_linked_list", title: "48. Singly Linked List In-Place", shortDesc: "Manual node pointer linkage, insertion, deletion, and reversal.", difficulty: "medium", category: "Data Structures", traceKey: "linked_list" },
  { id: "med_doubly_linked", title: "49. Doubly Linked List Operations", shortDesc: "Bi-directional node traversal using prev and next pointers.", difficulty: "medium", category: "Data Structures", traceKey: "linked_list" },
  { id: "med_binary_tree", title: "50. Binary Tree Traversals", shortDesc: "Inorder, Preorder, Postorder, and Level-Order traversals.", difficulty: "medium", category: "Data Structures", traceKey: "factorial" },
  { id: "med_bst", title: "51. Binary Search Tree (BST)", shortDesc: "Insert, search, and delete nodes maintaining BST property.", difficulty: "medium", category: "Data Structures", traceKey: "binary_search" },
  { id: "med_heap", title: "52. Min-Heap & Max-Heap Arrays", shortDesc: "Binary heap implementation with sift-up and sift-down operations.", difficulty: "medium", category: "Data Structures", traceKey: "bubble_sort" },
  { id: "med_priority_queue", title: "53. Priority Queue Comparators", shortDesc: "std::priority_queue with custom struct comparators.", difficulty: "medium", category: "Data Structures", traceKey: "bubble_sort" },
  { id: "med_graph_bfs", title: "54. Graph BFS (Breadth-First)", shortDesc: "Level-by-level queue traversal for shortest unweighted paths.", difficulty: "medium", category: "Graph Algorithms", traceKey: "for_loop" },
  { id: "med_graph_dfs", title: "55. Graph DFS (Depth-First)", shortDesc: "Recursive depth-first graph traversal and component counting.", difficulty: "medium", category: "Graph Algorithms", traceKey: "factorial" },
  { id: "med_two_pointers", title: "56. Two-Pointer Technique", shortDesc: "Optimizing array search windows with converging pointers.", difficulty: "medium", category: "Algorithms", traceKey: "binary_search" },
  { id: "med_sliding_window", title: "57. Sliding Window Technique", shortDesc: "Fixed and variable length window optimization over arrays.", difficulty: "medium", category: "Algorithms", traceKey: "bubble_sort" },
  { id: "med_binary_search", title: "58. Binary Search Deep Dive", shortDesc: "Overflow-safe midpoint formula and boundary condition rules.", difficulty: "medium", category: "Algorithms", traceKey: "binary_search" },
  { id: "med_quick_sort", title: "59. QuickSort Partitioning", shortDesc: "Hoare & Lomuto partition schemes for divide-and-conquer sort.", difficulty: "medium", category: "Algorithms", traceKey: "bubble_sort" },
  { id: "med_merge_sort", title: "60. MergeSort Recursive Divide", shortDesc: "Stable O(N log N) recursive sorting with array merging.", difficulty: "medium", category: "Algorithms", traceKey: "factorial" },
  { id: "med_dp_1d", title: "61. 1D Dynamic Programming", shortDesc: "Tabulation and memoization for subproblem optimization.", difficulty: "medium", category: "Dynamic Programming", traceKey: "factorial" },
  { id: "med_dp_knapsack", title: "62. 0/1 Knapsack DP Problem", shortDesc: "Optimal subset selection under weight capacity bounds.", difficulty: "medium", category: "Dynamic Programming", traceKey: "factorial" },
  { id: "med_backtracking", title: "63. Backtracking Subsets Generator", shortDesc: "State space tree search with recursive choice and undo step.", difficulty: "medium", category: "Backtracking", traceKey: "factorial" },
  { id: "med_bit_manipulation", title: "64. Bitwise Tricks & Bitmasks", shortDesc: "Brian Kernighan's bit count, XOR single number, and bitmasks.", difficulty: "medium", category: "Bit Manipulation", traceKey: "for_loop" },
  { id: "med_custom_alloc", title: "65. Manual Heap Memory Allocation", shortDesc: "Low-level memory management with new[], delete[], and placement new.", difficulty: "medium", category: "Memory & Pointers", traceKey: "smart_ptr" },
  { id: "med_optional", title: "66. Optional Values (std::optional)", shortDesc: "Type-safe optional value wrapper without null pointers (C++17).", difficulty: "medium", category: "Modern C++", traceKey: "for_loop" },
  { id: "med_variant", title: "67. Type-Safe Unions (std::variant)", shortDesc: "Tagged unions with std::variant and std::visit pattern matching.", difficulty: "medium", category: "Modern C++", traceKey: "for_loop" },
  { id: "med_any", title: "68. Type-Agnostic Containers (std::any)", shortDesc: "Holding arbitrary types safely using std::any and std::any_cast.", difficulty: "medium", category: "Modern C++", traceKey: "for_loop" },
  { id: "med_string_view", title: "69. Zero-Copy Strings (std::string_view)", shortDesc: "Non-owning read-only string references avoiding allocations.", difficulty: "medium", category: "Modern C++", traceKey: "for_loop" },
  { id: "med_type_traits", title: "70. Type Traits (std::is_same)", shortDesc: "Compile-time type inspection with <type_traits>.", difficulty: "medium", category: "Metaprogramming", traceKey: "for_loop" },
  { id: "med_threads_basic", title: "71. Multithreading (std::thread)", shortDesc: "Spawning worker threads, join(), and detach() lifecycle.", difficulty: "medium", category: "Concurrency", traceKey: "for_loop" },
  { id: "med_mutex_lock", title: "72. Mutexes & Lock Guards", shortDesc: "Preventing race conditions using std::mutex & std::lock_guard.", difficulty: "medium", category: "Concurrency", traceKey: "for_loop" },
  { id: "med_atomics", title: "73. Atomic Operations (std::atomic)", shortDesc: "Lock-free thread-safe atomic counters and memory ordering.", difficulty: "medium", category: "Concurrency", traceKey: "for_loop" },
  { id: "med_async_future", title: "74. Async Tasks & Futures", shortDesc: "Asynchronous task execution using std::async & std::future.", difficulty: "medium", category: "Concurrency", traceKey: "for_loop" },
  { id: "med_constexpr", title: "75. Compile-Time Evaluation (constexpr)", shortDesc: "Executing calculations at compile-time using constexpr & consteval.", difficulty: "medium", category: "Modern C++", traceKey: "for_loop" },

  // ── HARD MODE (76 - 100) ──
  { id: "hard_variadic_templates", title: "76. Variadic Templates & Fold Expressions", shortDesc: "Accepting arbitrary parameter packs (typename... Args) & C++17 fold expressions.", difficulty: "hard", category: "Metaprogramming", traceKey: "factorial" },
  { id: "hard_sfinae", title: "77. SFINAE & std::enable_if", shortDesc: "Substitution Failure Is Not An Error for template overload resolution.", difficulty: "hard", category: "Metaprogramming", traceKey: "for_loop" },
  { id: "hard_concepts", title: "78. C++20 Concepts & Constraints", shortDesc: "Constraining template type arguments using requires clauses & concepts.", difficulty: "hard", category: "Modern C++", traceKey: "binary_search" },
  { id: "hard_ranges", title: "79. C++20 Ranges & Views Pipeline", shortDesc: "Composable lazy evaluation pipelines with std::views::filter & transform.", difficulty: "hard", category: "Modern C++", traceKey: "bubble_sort" },
  { id: "hard_coroutines", title: "80. C++20 Coroutines (co_yield & co_await)", shortDesc: "Resumable functions using co_yield generators and co_await futures.", difficulty: "hard", category: "Modern C++", traceKey: "factorial" },
  { id: "hard_custom_iterator", title: "81. Custom STL-Compatible Iterators", shortDesc: "Building custom iterators satisfying std::iterator_traits requirements.", difficulty: "hard", category: "Templates", traceKey: "linked_list" },
  { id: "hard_avl_tree", title: "82. Self-Balancing AVL Tree Rotations", shortDesc: "Maintaining balance factor strictly via Left and Right rotations.", difficulty: "hard", category: "Advanced Data Structures", traceKey: "binary_search" },
  { id: "hard_red_black", title: "83. Red-Black Tree Invariants", shortDesc: "Node coloring and rotation rules for std::map underlying tree.", difficulty: "hard", category: "Advanced Data Structures", traceKey: "binary_search" },
  { id: "hard_trie", title: "84. Prefix Tree (Trie) Implementation", shortDesc: "Fast O(L) string insertion, prefix lookup, and autocomplete.", difficulty: "hard", category: "Advanced Data Structures", traceKey: "linked_list" },
  { id: "hard_segment_tree", title: "85. Segment Tree Range Queries", shortDesc: "O(log N) range sum/min queries and point update operations.", difficulty: "hard", category: "Advanced Data Structures", traceKey: "binary_search" },
  { id: "hard_fenwick", title: "86. Fenwick Tree (Binary Indexed Tree)", shortDesc: "Bitwise lowbit manipulations for prefix sum updates in O(log N).", difficulty: "hard", category: "Advanced Data Structures", traceKey: "for_loop" },
  { id: "hard_dsu", title: "87. Disjoint Set Union (DSU / Union-Find)", shortDesc: "Path compression and union by rank for dynamic component tracking.", difficulty: "hard", category: "Advanced Data Structures", traceKey: "bubble_sort" },
  { id: "hard_dijkstra", title: "88. Dijkstra's Shortest Path Algorithm", shortDesc: "Priority queue greedy search on non-negative weighted graphs.", difficulty: "hard", category: "Graph Algorithms", traceKey: "bubble_sort" },
  { id: "hard_bellman_ford", title: "89. Bellman-Ford Shortest Path", shortDesc: "Edge relaxation algorithm detecting negative weight cycles.", difficulty: "hard", category: "Graph Algorithms", traceKey: "for_loop" },
  { id: "hard_floyd_warshall", title: "90. Floyd-Warshall All-Pairs Shortest Path", shortDesc: "Matrix DP algorithm computing all-pairs shortest distances.", difficulty: "hard", category: "Graph Algorithms", traceKey: "for_loop" },
  { id: "hard_kruskal", title: "91. Kruskal's Minimum Spanning Tree (MST)", shortDesc: "Greedy edge sorting with DSU cycle prevention.", difficulty: "hard", category: "Graph Algorithms", traceKey: "bubble_sort" },
  { id: "hard_prim", title: "92. Prim's Minimum Spanning Tree", shortDesc: "Priority queue vertex expansion for connected MST construction.", difficulty: "hard", category: "Graph Algorithms", traceKey: "bubble_sort" },
  { id: "hard_topo_sort", title: "93. Topological Sort (Kahn's Algorithm)", shortDesc: "In-degree dependency ordering for Directed Acyclic Graphs (DAG).", difficulty: "hard", category: "Graph Algorithms", traceKey: "for_loop" },
  { id: "hard_n_queens", title: "94. N-Queens Backtracking Engine", shortDesc: "Diagonal safety checks and state space backtracking for N queens.", difficulty: "hard", category: "Backtracking", traceKey: "factorial" },
  { id: "hard_sudoku", title: "95. 9x9 Sudoku Backtracking Solver", shortDesc: "Grid constraint validation and recursive trial-and-error solver.", difficulty: "hard", category: "Backtracking", traceKey: "factorial" },
  { id: "hard_dp_2d", title: "96. 2D DP (Longest Common Subsequence)", shortDesc: "Matrix state transitions for string sequence alignment.", difficulty: "hard", category: "Dynamic Programming", traceKey: "factorial" },
  { id: "hard_dp_bitmask", title: "97. Bitmask DP (Traveling Salesperson)", shortDesc: "Exponential state representation using integer bitmasks.", difficulty: "hard", category: "Dynamic Programming", traceKey: "factorial" },
  { id: "hard_lockfree_queue", title: "98. Lock-Free Concurrent Queue", shortDesc: "Atomic compare-and-swap (CAS) lockless queue implementation.", difficulty: "hard", category: "Concurrency", traceKey: "smart_ptr" },
  { id: "hard_thread_pool", title: "99. Multi-Threaded Task Worker Pool", shortDesc: "Producer-consumer queue with worker threads and condition vars.", difficulty: "hard", category: "Concurrency", traceKey: "for_loop" },
  { id: "hard_custom_allocator", title: "100. Custom Memory Allocator", shortDesc: "Implementing a custom C++ STL compliant allocator with arena pool.", difficulty: "hard", category: "Memory & Pointers", traceKey: "smart_ptr" }
];

// Generates 10 TRULY DISTINCT approaches with UNIQUE C++ CODE and UNIQUE LINE BREAKDOWNS for every topic
function generate10Approaches(metaTitle: string, category: string): LearnApproach[] {
  const configs: Array<{
    num: number;
    title: string;
    category: string;
    isFree: boolean;
    timeComp: string;
    spaceComp: string;
    desc: string;
    code: string;
    lineBreakdown: LineBreakdown[];
  }> = [
    {
      num: 1,
      title: "Approach 1: Standard Iterative Loop (FREE)",
      category: "FREE / Standard",
      isFree: true,
      timeComp: "O(N)",
      spaceComp: "O(1)",
      desc: `Direct sequential iterative calculation for ${metaTitle} using plain C++ loop constructs.`,
      code: `// Approach 1: Standard Iterative (${metaTitle})\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nint solveIterative(const vector<int>& data) {\n    int accumulator = 0;\n    for (size_t i = 0; i < data.size(); i++) {\n        if (data[i] > 0) accumulator += data[i];\n    }\n    return accumulator;\n}\n\nint main() {\n    vector<int> nums = {10, 20, 30, 40};\n    cout << "Iterative Result: " << solveIterative(nums) << endl;\n    return 0;\n}`,
      lineBreakdown: [
        {
          lineNum: 1,
          codeSnippet: `int solveIterative(const vector<int>& data) {`,
          constructType: "Function Signature",
          title: "Iterative Function Entry & Const Reference",
          explanation: "Passes input vector by const reference to avoid unnecessary memory allocations.",
          keyDetails: [{ variableOrConstruct: "const vector<int>& data", role: "Read-only Parameter", whyThisWay: "Prevents vector copying on stack." }]
        },
        {
          lineNum: 2,
          codeSnippet: `int accumulator = 0;`,
          constructType: "Variable & Initializer",
          title: "Result Accumulator Initializer",
          explanation: "Initializes local accumulator integer variable to 0.",
          keyDetails: [{ variableOrConstruct: "int accumulator = 0", role: "Accumulator State", whyThisWay: "Serves as running total variable." }]
        },
        {
          lineNum: 3,
          codeSnippet: `for (size_t i = 0; i < data.size(); i++) {`,
          constructType: "Loop Construct",
          title: "Standard 0-Indexed For Loop",
          explanation: "Iterates sequentially through data array using size_t counter variable.",
          keyDetails: [{ variableOrConstruct: "size_t i = 0", role: "Index Counter", whyThisWay: "Matches vector size_t unsigned type." }]
        },
        {
          lineNum: 4,
          codeSnippet: `if (data[i] > 0) accumulator += data[i];`,
          constructType: "Condition & Branch",
          title: "Element Validation Check",
          explanation: "Inspects element at data[i] and adds positive values to accumulator.",
          keyDetails: [{ variableOrConstruct: "accumulator += data[i]", role: "State Accumulation", whyThisWay: "In-place addition assignment." }]
        },
        {
          lineNum: 5,
          codeSnippet: `return accumulator;`,
          constructType: "Return / Cleanup",
          title: "Iterative Result Return",
          explanation: "Returns the computed accumulator value to caller.",
          keyDetails: [{ variableOrConstruct: "return accumulator", role: "Return Output", whyThisWay: "Passes computed value back on stack." }]
        }
      ]
    },
    {
      num: 2,
      title: "Approach 2: STL Standard Library Algorithms (FREE)",
      category: "FREE / STL",
      isFree: true,
      timeComp: "O(N log N)",
      spaceComp: "O(1)",
      desc: `Modern C++ STL implementation using std::accumulate, std::sort, and std::find_if.`,
      code: `// Approach 2: STL Algorithms (${metaTitle})\n#include <iostream>\n#include <vector>\n#include <numeric>\n#include <algorithm>\nusing namespace std;\n\nint solveSTL(vector<int> data) {\n    std::sort(data.begin(), data.end());\n    auto positiveIt = std::find_if(data.begin(), data.end(), [](int x){ return x > 0; });\n    return std::accumulate(positiveIt, data.end(), 0);\n}\n\nint main() {\n    vector<int> nums = {-5, 10, 20, 30};\n    cout << "STL Result: " << solveSTL(nums) << endl;\n    return 0;\n}`,
      lineBreakdown: [
        {
          lineNum: 1,
          codeSnippet: `std::sort(data.begin(), data.end());`,
          constructType: "Function Signature",
          title: "STL Range Sort (IntroSort)",
          explanation: "Sorts input elements using C++ IntroSort algorithm in O(N log N) time.",
          keyDetails: [{ variableOrConstruct: "std::sort", role: "STL Sorting Algorithm", whyThisWay: "Establishes ordered range for fast iterator lookup." }]
        },
        {
          lineNum: 2,
          codeSnippet: `auto positiveIt = std::find_if(data.begin(), data.end(), [](int x){ return x > 0; });`,
          constructType: "Variable & Initializer",
          title: "Iterator Lookup with Lambda Predicate",
          explanation: "Finds the first positive iterator position using a unary predicate lambda.",
          keyDetails: [{ variableOrConstruct: "auto positiveIt", role: "Range Iterator", whyThisWay: "Points to first element matching condition." }]
        },
        {
          lineNum: 3,
          codeSnippet: `return std::accumulate(positiveIt, data.end(), 0);`,
          constructType: "Return / Cleanup",
          title: "Numeric Range Accumulation",
          explanation: "Sums all elements from positiveIt up to data.end() starting from base 0.",
          keyDetails: [{ variableOrConstruct: "std::accumulate", role: "Numeric Reduction", whyThisWay: "Declarative functional range reduction." }]
        }
      ]
    },
    {
      num: 3,
      title: "Approach 3: Recursive Subproblem Breakdown (PRO)",
      category: "PRO / Recursion",
      isFree: false,
      timeComp: "O(N)",
      spaceComp: "O(N) Call Stack",
      desc: `Recursive subproblem solver for ${metaTitle} utilizing function call stack unwinding.`,
      code: `// Approach 3: Recursive Breakdown (${metaTitle})\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nint solveRecursive(const vector<int>& data, int index) {\n    if (index >= data.size()) return 0; // Base case guard\n    int currentVal = data[index] > 0 ? data[index] : 0;\n    return currentVal + solveRecursive(data, index + 1); // Recursive call\n}\n\nint main() {\n    vector<int> nums = {10, 20, 30};\n    cout << "Recursive Result: " << solveRecursive(nums, 0) << endl;\n    return 0;\n}`,
      lineBreakdown: [
        {
          lineNum: 1,
          codeSnippet: `if (index >= data.size()) return 0;`,
          constructType: "Condition & Branch",
          title: "Recursive Base Case Guard",
          explanation: "Prevents infinite recursion by returning 0 when index reaches end of array.",
          keyDetails: [{ variableOrConstruct: "index >= data.size()", role: "Termination Condition", whyThisWay: "Halts stack frame growth." }]
        },
        {
          lineNum: 2,
          codeSnippet: `int currentVal = data[index] > 0 ? data[index] : 0;`,
          constructType: "Variable & Initializer",
          title: "Frame State Calculation",
          explanation: "Evaluates value at current frame index using ternary expression.",
          keyDetails: [{ variableOrConstruct: "int currentVal", role: "Frame Contribution", whyThisWay: "Stores local frame value." }]
        },
        {
          lineNum: 3,
          codeSnippet: `return currentVal + solveRecursive(data, index + 1);`,
          constructType: "Return / Cleanup",
          title: "Recursive Step & Combination",
          explanation: "Invokes subproblem solveRecursive(data, index + 1) and adds returned subproblem value.",
          keyDetails: [{ variableOrConstruct: "solveRecursive(data, index + 1)", role: "Subproblem Invocation", whyThisWay: "Advances index parameter towards base case." }]
        }
      ]
    },
    {
      num: 4,
      title: "Approach 4: Converging Two-Pointer Window (PRO)",
      category: "PRO / Two Pointers",
      isFree: false,
      timeComp: "O(N)",
      spaceComp: "O(1)",
      desc: `Dual pointer convergence strategy starting at both array boundaries.`,
      code: `// Approach 4: Converging Two Pointers (${metaTitle})\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nint solveTwoPointers(const vector<int>& data) {\n    int left = 0, right = data.size() - 1;\n    int totalSum = 0;\n    while (left <= right) {\n        if (left == right) { totalSum += data[left]; break; }\n        totalSum += data[left] + data[right];\n        left++; right--;\n    }\n    return totalSum;\n}\n\nint main() {\n    vector<int> nums = {1, 2, 3, 4, 5};\n    cout << "Two Pointer Result: " << solveTwoPointers(nums) << endl;\n    return 0;\n}`,
      lineBreakdown: [
        {
          lineNum: 1,
          codeSnippet: `int left = 0, right = data.size() - 1;`,
          constructType: "Variable & Initializer",
          title: "Dual Boundary Pointer Initializers",
          explanation: "Sets left pointer to array start (0) and right pointer to array tail.",
          keyDetails: [
            { variableOrConstruct: "int left = 0", role: "Start Pointer", whyThisWay: "Advances rightwards." },
            { variableOrConstruct: "int right = data.size() - 1", role: "End Pointer", whyThisWay: "Advances leftwards." }
          ]
        },
        {
          lineNum: 2,
          codeSnippet: `while (left <= right) {`,
          constructType: "Loop Construct",
          title: "Pointer Convergence Loop",
          explanation: "Continues loop while left pointer is less than or equal to right pointer.",
          keyDetails: [{ variableOrConstruct: "left <= right", role: "Convergence Guard", whyThisWay: "Ensures array center is evaluated." }]
        },
        {
          lineNum: 3,
          codeSnippet: `totalSum += data[left] + data[right];\nleft++; right--;`,
          constructType: "Condition & Branch",
          title: "Dual Pointer Step & Increment",
          explanation: "Processes elements at both ends simultaneously and steps pointers inward.",
          keyDetails: [
            { variableOrConstruct: "left++", role: "Left Increment", whyThisWay: "Moves lower bound right." },
            { variableOrConstruct: "right--", role: "Right Decrement", whyThisWay: "Moves upper bound left." }
          ]
        }
      ]
    },
    {
      num: 5,
      title: "Approach 5: Raw Memory Pointer Arithmetic (PRO)",
      category: "PRO / Memory",
      isFree: false,
      timeComp: "O(N)",
      spaceComp: "O(1)",
      desc: `Direct memory pointer manipulation using raw pointer increments and dereferencing.`,
      code: `// Approach 5: Pointer Arithmetic (${metaTitle})\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nint solveRawPointers(const vector<int>& data) {\n    const int* ptr = data.data();\n    const int* endPtr = ptr + data.size();\n    int sum = 0;\n    while (ptr < endPtr) {\n        sum += *ptr;\n        ptr++; // Address increment\n    }\n    return sum;\n}\n\nint main() {\n    vector<int> nums = {100, 200, 300};\n    cout << "Raw Pointer Result: " << solveRawPointers(nums) << endl;\n    return 0;\n}`,
      lineBreakdown: [
        {
          lineNum: 1,
          codeSnippet: `const int* ptr = data.data();\nconst int* endPtr = ptr + data.size();`,
          constructType: "Variable & Initializer",
          title: "Raw Memory Address Assignments",
          explanation: "Retrieves raw memory address using data.data() and computes end address.",
          keyDetails: [
            { variableOrConstruct: "const int* ptr", role: "Raw Address Pointer", whyThisWay: "Points directly to heap contiguous memory." },
            { variableOrConstruct: "ptr + data.size()", role: "Sentinel Address", whyThisWay: "Memory location right after vector end." }
          ]
        },
        {
          lineNum: 2,
          codeSnippet: `sum += *ptr;\nptr++;`,
          constructType: "Loop Construct",
          title: "Pointer Dereference & Address Step",
          explanation: "Dereferences *ptr to fetch value, adds to sum, and increments ptr address by sizeof(int).",
          keyDetails: [
            { variableOrConstruct: "*ptr", role: "Dereference Operator", whyThisWay: "Fetches value stored at memory location." },
            { variableOrConstruct: "ptr++", role: "Address Increment", whyThisWay: "Advances address pointer by 4 bytes." }
          ]
        }
      ]
    },
    {
      num: 6,
      title: "Approach 6: Modern C++ Lambda Closures (PRO)",
      category: "PRO / Functional",
      isFree: false,
      timeComp: "O(N)",
      spaceComp: "O(1)",
      desc: `Declarative processing pipeline using anonymous lambdas with reference captures.`,
      code: `// Approach 6: Lambda Closures (${metaTitle})\n#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint solveLambda(const vector<int>& data) {\n    int sum = 0;\n    auto processLambda = [&sum](int val) {\n        if (val > 0) sum += val;\n    };\n    std::for_each(data.begin(), data.end(), processLambda);\n    return sum;\n}\n\nint main() {\n    vector<int> nums = {5, 15, 25};\n    cout << "Lambda Result: " << solveLambda(nums) << endl;\n    return 0;\n}`,
      lineBreakdown: [
        {
          lineNum: 1,
          codeSnippet: `auto processLambda = [&sum](int val) { if (val > 0) sum += val; };`,
          constructType: "Variable & Initializer",
          title: "Lambda Expression & Capture Clause",
          explanation: "Defines an anonymous lambda functor capturing outer variable sum by reference [&sum].",
          keyDetails: [{ variableOrConstruct: "[&sum]", role: "Reference Capture", whyThisWay: "Allows lambda body to mutate sum directly." }]
        },
        {
          lineNum: 2,
          codeSnippet: `std::for_each(data.begin(), data.end(), processLambda);`,
          constructType: "Loop Construct",
          title: "STL for_each Functor Dispatch",
          explanation: "Applies processLambda functor to every element in data range.",
          keyDetails: [{ variableOrConstruct: "std::for_each", role: "Functional Loop", whyThisWay: "Eliminates explicit index counters." }]
        }
      ]
    },
    {
      num: 7,
      title: "Approach 7: Bitwise Bitmask & Shifts (PRO)",
      category: "PRO / Bitwise",
      isFree: false,
      timeComp: "O(N)",
      spaceComp: "O(1)",
      desc: `Bit manipulation techniques using bitwise AND (&), OR (|), and bit shifts (<<).`,
      code: `// Approach 7: Bitwise Bitmask (${metaTitle})\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nint solveBitwise(const vector<int>& data) {\n    int maskAccumulator = 0;\n    for (size_t i = 0; i < data.size(); i++) {\n        maskAccumulator ^= (data[i] & 0xFF);\n    }\n    return maskAccumulator;\n}\n\nint main() {\n    vector<int> nums = {0b101, 0b011, 0b110};\n    cout << "Bitwise Mask Result: " << solveBitwise(nums) << endl;\n    return 0;\n}`,
      lineBreakdown: [
        {
          lineNum: 1,
          codeSnippet: `maskAccumulator ^= (data[i] & 0xFF);`,
          constructType: "Condition & Branch",
          title: "Bitwise Mask & XOR Toggle",
          explanation: "Masks element with 0xFF (lower byte) and toggles bits into maskAccumulator using XOR (^).",
          keyDetails: [
            { variableOrConstruct: "data[i] & 0xFF", role: "Bitmask Filter", whyThisWay: "Retains lowest 8 bits." },
            { variableOrConstruct: "^=", role: "Bitwise XOR Assignment", whyThisWay: "Toggles bits efficiently." }
          ]
        }
      ]
    },
    {
      num: 8,
      title: "Approach 8: Template Metaprogramming & Concepts (PRO)",
      category: "PRO / Metaprogramming",
      isFree: false,
      timeComp: "O(N)",
      spaceComp: "O(1)",
      desc: `Generic template implementation with type constraints using static_assert & constexpr.`,
      code: `// Approach 8: Template Concepts (${metaTitle})\n#include <iostream>\n#include <vector>\n#include <type_traits>\nusing namespace std;\n\ntemplate<typename Container>\nauto solveTemplate(const Container& c) {\n    static_assert(std::is_integral_v<typename Container::value_type>, "Container elements must be integral!");\n    typename Container::value_type sum = 0;\n    for (const auto& elem : c) sum += elem;\n    return sum;\n}\n\nint main() {\n    vector<int> nums = {7, 14, 21};\n    cout << "Template Result: " << solveTemplate(nums) << endl;\n    return 0;\n}`,
      lineBreakdown: [
        {
          lineNum: 1,
          codeSnippet: `template<typename Container>`,
          constructType: "Function Signature",
          title: "Template Header Declaration",
          explanation: "Declares a generic function template accepting arbitrary container types.",
          keyDetails: [{ variableOrConstruct: "template<typename Container>", role: "Type Parameter", whyThisWay: "Enables generic type instantiation." }]
        },
        {
          lineNum: 2,
          codeSnippet: `static_assert(std::is_integral_v<typename Container::value_type>);`,
          constructType: "Condition & Branch",
          title: "Compile-Time Static Assertion",
          explanation: "Verifies at compile-time that Container::value_type is an integer type.",
          keyDetails: [{ variableOrConstruct: "static_assert", role: "Compile-Time Check", whyThisWay: "Fails build early with descriptive error if invalid type." }]
        }
      ]
    },
    {
      num: 9,
      title: "Approach 9: Multithreaded Async Workers (PRO)",
      category: "PRO / Concurrency",
      isFree: false,
      timeComp: "O(N / Threads)",
      spaceComp: "O(Threads)",
      desc: `Asynchronous multi-core task partition using std::async & std::future.`,
      code: `// Approach 9: Multithreaded Async (${metaTitle})\n#include <iostream>\n#include <vector>\n#include <future>\n#include <numeric>\nusing namespace std;\n\nint solveConcurrent(const vector<int>& data) {\n    size_t mid = data.size() / 2;\n    auto f1 = std::async(std::launch::async, [&]() {\n        return std::accumulate(data.begin(), data.begin() + mid, 0);\n    });\n    auto f2 = std::async(std::launch::async, [&]() {\n        return std::accumulate(data.begin() + mid, data.end(), 0);\n    });\n    return f1.get() + f2.get(); // Join async futures\n}\n\nint main() {\n    vector<int> nums = {10, 20, 30, 40, 50, 60};\n    cout << "Concurrent Result: " << solveConcurrent(nums) << endl;\n    return 0;\n}`,
      lineBreakdown: [
        {
          lineNum: 1,
          codeSnippet: `auto f1 = std::async(std::launch::async, [...](){...});`,
          constructType: "Variable & Initializer",
          title: "Asynchronous Worker Thread Launch",
          explanation: "Spawns worker thread computing first half of array concurrently on background CPU core.",
          keyDetails: [{ variableOrConstruct: "std::async(launch::async)", role: "Async Future", whyThisWay: "Executes work in parallel." }]
        },
        {
          lineNum: 2,
          codeSnippet: `return f1.get() + f2.get();`,
          constructType: "Return / Cleanup",
          title: "Future Join & Result Synthesis",
          explanation: "Blocks until both background thread futures complete and combines their results.",
          keyDetails: [{ variableOrConstruct: "f1.get()", role: "Future Synchronizer", whyThisWay: "Retrieves return value from background thread." }]
        }
      ]
    },
    {
      num: 10,
      title: "Approach 10: C++20 Lazy Ranges Pipeline (PRO)",
      category: "PRO / C++20 Ranges",
      isFree: false,
      timeComp: "O(N)",
      spaceComp: "O(1) Lazy View",
      desc: `Modern C++20 ranges pipeline using std::views::filter & transform.`,
      code: `// Approach 10: C++20 Ranges (${metaTitle})\n#include <iostream>\n#include <vector>\n#include <ranges>\n#include <numeric>\nusing namespace std;\n\nint solveRanges(const vector<int>& data) {\n    auto view = data \n        | std::views::filter([](int x){ return x > 0; })\n        | std::views::transform([](int x){ return x * 2; });\n    int sum = 0;\n    for (int elem : view) sum += elem;\n    return sum;\n}\n\nint main() {\n    vector<int> nums = {1, 2, -3, 4};\n    cout << "Ranges Result: " << solveRanges(nums) << endl;\n    return 0;\n}`,
      lineBreakdown: [
        {
          lineNum: 1,
          codeSnippet: `auto view = data | std::views::filter(...) | std::views::transform(...);`,
          constructType: "Variable & Initializer",
          title: "C++20 Lazy Composable View Pipeline",
          explanation: "Composes range adapters using pipe operator (|) without instantiating intermediate vectors.",
          keyDetails: [
            { variableOrConstruct: "std::views::filter", role: "Range Filter", whyThisWay: "Evaluated lazily during iteration." },
            { variableOrConstruct: "std::views::transform", role: "Range Mapping", whyThisWay: "Applies transformation on-the-fly." }
          ]
        },
        {
          lineNum: 2,
          codeSnippet: `for (int elem : view) sum += elem;`,
          constructType: "Loop Construct",
          title: "Lazy Range Pipeline Iteration",
          explanation: "Iterates through composed view pipeline evaluating elements lazily.",
          keyDetails: [{ variableOrConstruct: "for (int elem : view)", role: "View Traversal", whyThisWay: "Triggers pipeline evaluation element-by-element." }]
        }
      ]
    }
  ];

  return configs.map(c => ({
    id: c.num,
    name: c.title,
    category: c.category,
    description: c.desc,
    prosCons: c.isFree ? "Pros: Unlocked for all users. Cons: Standard approach." : "Pros: High-performance Pro technique. Cons: Requires Pro access.",
    timeComplexity: c.timeComp,
    spaceComplexity: c.spaceComp,
    isFree: c.isFree,
    code: c.code,
    lineBreakdown: c.lineBreakdown
  }));
}

// Helper to construct a full LearnModule from topic metadata
export function getLearnModuleDetails(id: string): LearnModule {
  const meta = RAW_MODULE_TOPICS.find(m => m.id === id) || RAW_MODULE_TOPICS[0];

  const problemStatement = {
    title: meta.title,
    objective: `Master ${meta.title} in C++. Choose up to 10 Mental Model Approaches (2 Free, 8 Pro) with distinct solution codes and line-by-line breakdowns.`,
    inputDesc: `Standard parameters and initialization suitable for ${meta.category}.`,
    outputDesc: `Expected output demonstrating correct execution and state mutation.`,
    takeaways: [
      `10 distinct mental model approaches (2 Free, 8 Pro)`,
      `Unique C++ code implementation per approach`,
      `Distinct line-by-line construct breakdown per approach`,
      `Performance characteristics (${meta.difficulty.toUpperCase()} complexity bounds)`
    ]
  };

  const approaches = generate10Approaches(meta.title, meta.category);

  return {
    ...meta,
    problemStatement,
    approaches,
    fullCode: approaches[0].code
  };
}

export const LEARN_MODULES: LearnModule[] = RAW_MODULE_TOPICS.map(t => getLearnModuleDetails(t.id));
