// C++ Code Template Library — all versions C++11 through C++23
export type CppVersion = 'cpp11' | 'cpp14' | 'cpp17' | 'cpp20' | 'cpp23';

export interface CodeTemplate {
  id: string;
  title: string;
  category: string;
  version: CppVersion;
  description: string;
  icon: string;
  code: string;
  traceKey?: string; // maps to PROGRAMS key if a trace exists
}

// ─── Trace Detection ──────────────────────────────────────────────────────────
// Maps user-written code to a known simulation trace
export function detectTrace(code: string): string | null {
  const c = code.toLowerCase().replace(/\s+/g, ' ');
  if ((c.includes('for') && c.includes('sum') && c.includes('i++'))) return 'for_loop';
  if (c.includes('factorial') && c.includes('n - 1')) return 'factorial';
  if (c.includes('factorial') && c.includes('n-1'))   return 'factorial';
  if (c.includes('fibonacci') || c.includes('fib('))  return 'fibonacci';
  if (c.includes('bubblesort') || (c.includes('bubble') && c.includes('swap'))) return 'bubble_sort';
  if (c.includes('node') && c.includes('next') && c.includes('->')) return 'linked_list';
  if (c.includes('unique_ptr') || c.includes('make_unique')) return 'smart_pointers';
  if (c.includes('binary') && c.includes('mid') && c.includes('search')) return 'binary_search';
  return null;
}

// ─── Template Library ─────────────────────────────────────────────────────────
export const TEMPLATES: CodeTemplate[] = [

  // ── BASICS ────────────────────────────────────────────────────────────────
  {
    id: 'for_loop', title: 'For Loop', category: 'Basics', version: 'cpp11',
    icon: '🔄', traceKey: 'for_loop',
    description: 'Classic for loop accumulating sum — every line traced',
    code: `#include <iostream>
using namespace std;

int main() {
    int sum = 0;
    for (int i = 1; i <= 5; i++) {
        sum = sum + i;
        cout << "i=" << i << " sum=" << sum << endl;
    }
    cout << "Final: " << sum << endl;
    return 0;
}`,
  },

  {
    id: 'while_loop', title: 'While Loop', category: 'Basics', version: 'cpp11',
    icon: '🔁',
    description: 'While loop countdown with condition checking',
    code: `#include <iostream>
using namespace std;

int main() {
    int n = 5;
    while (n > 0) {
        cout << "Count: " << n << endl;
        n--;
    }
    cout << "Done!" << endl;
    return 0;
}`,
  },

  {
    id: 'do_while', title: 'Do-While', category: 'Basics', version: 'cpp11',
    icon: '🔁',
    description: 'Do-while executes body at least once',
    code: `#include <iostream>
using namespace std;

int main() {
    int i = 1;
    do {
        cout << "i = " << i << endl;
        i++;
    } while (i <= 3);
    return 0;
}`,
  },

  {
    id: 'if_else', title: 'If-Else Branching', category: 'Basics', version: 'cpp11',
    icon: '🔀',
    description: 'Conditional branching with if/else if/else',
    code: `#include <iostream>
using namespace std;

int main() {
    int x = 42;
    if (x < 0) {
        cout << "Negative" << endl;
    } else if (x == 0) {
        cout << "Zero" << endl;
    } else {
        cout << "Positive: " << x << endl;
    }
    return 0;
}`,
  },

  {
    id: 'switch_stmt', title: 'Switch Statement', category: 'Basics', version: 'cpp11',
    icon: '🔀',
    description: 'Switch-case control flow',
    code: `#include <iostream>
using namespace std;

int main() {
    int day = 3;
    switch (day) {
        case 1: cout << "Monday" << endl; break;
        case 2: cout << "Tuesday" << endl; break;
        case 3: cout << "Wednesday" << endl; break;
        case 4: cout << "Thursday" << endl; break;
        case 5: cout << "Friday" << endl; break;
        default: cout << "Weekend" << endl;
    }
    return 0;
}`,
  },

  // ── FUNCTIONS ─────────────────────────────────────────────────────────────
  {
    id: 'factorial', title: 'Factorial (Recursion)', category: 'Recursion', version: 'cpp11',
    icon: '🔢', traceKey: 'factorial',
    description: 'Recursive factorial(4) — full stack trace',
    code: `#include <iostream>
using namespace std;

int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}

int main() {
    int result = factorial(4);
    cout << "4! = " << result << endl;
    return 0;
}`,
  },

  {
    id: 'fibonacci', title: 'Fibonacci (Recursion)', category: 'Recursion', version: 'cpp11',
    icon: '🌀', traceKey: 'fibonacci',
    description: 'Recursive Fibonacci with deep call stack',
    code: `#include <iostream>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}

int main() {
    int result = fibonacci(5);
    cout << "fib(5) = " << result << endl;
    return 0;
}`,
  },

  {
    id: 'power', title: 'Power Function', category: 'Recursion', version: 'cpp11',
    icon: '⚡',
    description: 'Recursive power — base^exp',
    code: `#include <iostream>
using namespace std;

double power(double base, int exp) {
    if (exp == 0) return 1.0;
    if (exp < 0) return 1.0 / power(base, -exp);
    return base * power(base, exp - 1);
}

int main() {
    cout << "2^10 = " << power(2, 10) << endl;
    cout << "3^5  = " << power(3, 5) << endl;
    return 0;
}`,
  },

  // ── SORTING ────────────────────────────────────────────────────────────────
  {
    id: 'bubble_sort', title: 'Bubble Sort', category: 'Algorithms', version: 'cpp11',
    icon: '🫧', traceKey: 'bubble_sort',
    description: 'O(n²) sorting with visual swap trace',
    code: `#include <iostream>
using namespace std;

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}

int main() {
    int arr[] = {64, 34, 25, 12, 22};
    int n = 5;
    bubbleSort(arr, n);
    for (int i = 0; i < n; i++)
        cout << arr[i] << " ";
    cout << endl;
    return 0;
}`,
  },

  {
    id: 'selection_sort', title: 'Selection Sort', category: 'Algorithms', version: 'cpp11',
    icon: '🎯',
    description: 'O(n²) selection sort — find minimum each pass',
    code: `#include <iostream>
using namespace std;

void selectionSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        int minIdx = i;
        for (int j = i+1; j < n; j++) {
            if (arr[j] < arr[minIdx])
                minIdx = j;
        }
        swap(arr[minIdx], arr[i]);
    }
}

int main() {
    int arr[] = {64, 25, 12, 22, 11};
    int n = 5;
    selectionSort(arr, n);
    for (int i = 0; i < n; i++)
        cout << arr[i] << " ";
    return 0;
}`,
  },

  {
    id: 'binary_search', title: 'Binary Search', category: 'Algorithms', version: 'cpp11',
    icon: '🔍', traceKey: 'binary_search',
    description: 'O(log n) divide-and-conquer search',
    code: `#include <iostream>
using namespace std;

int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

int main() {
    int arr[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int n = 10;
    int idx = binarySearch(arr, n, 23);
    cout << "Found 23 at index: " << idx << endl;
    return 0;
}`,
  },

  // ── DATA STRUCTURES ────────────────────────────────────────────────────────
  {
    id: 'linked_list', title: 'Linked List', category: 'Data Structures', version: 'cpp11',
    icon: '🔗', traceKey: 'linked_list',
    description: 'Heap-allocated linked list with pointer chain',
    code: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
};

Node* createNode(int val) {
    Node* n = new Node();
    n->data = val;
    n->next = nullptr;
    return n;
}

int main() {
    Node* head = createNode(1);
    head->next = createNode(2);
    head->next->next = createNode(3);
    Node* curr = head;
    while (curr != nullptr) {
        cout << curr->data << " -> ";
        curr = curr->next;
    }
    cout << "null" << endl;
    return 0;
}`,
  },

  {
    id: 'stack_impl', title: 'Stack (Array-based)', category: 'Data Structures', version: 'cpp11',
    icon: '📚',
    description: 'LIFO stack — push, pop, peek operations',
    code: `#include <iostream>
using namespace std;

class Stack {
    int data[100];
    int top;
public:
    Stack() : top(-1) {}
    void push(int x) { data[++top] = x; }
    int pop() { return data[top--]; }
    int peek() { return data[top]; }
    bool isEmpty() { return top == -1; }
};

int main() {
    Stack s;
    s.push(10);
    s.push(20);
    s.push(30);
    cout << "Top: " << s.peek() << endl;
    cout << "Pop: " << s.pop() << endl;
    cout << "Top: " << s.peek() << endl;
    return 0;
}`,
  },

  // ── C++14 ─────────────────────────────────────────────────────────────────
  {
    id: 'lambda_cpp14', title: 'Lambda Functions', category: 'C++14', version: 'cpp14',
    icon: 'λ',
    description: 'Lambda expressions with capture lists',
    code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> nums = {5, 2, 8, 1, 9, 3};

    // Lambda to sort
    sort(nums.begin(), nums.end(), [](int a, int b) {
        return a < b;
    });

    // Lambda with capture
    int factor = 3;
    auto multiply = [factor](int x) { return x * factor; };

    for (int n : nums)
        cout << multiply(n) << " ";
    cout << endl;
    return 0;
}`,
  },

  // ── C++17 ─────────────────────────────────────────────────────────────────
  {
    id: 'structured_bindings', title: 'Structured Bindings', category: 'C++17', version: 'cpp17',
    icon: '🔗',
    description: 'C++17 structured bindings with auto [a, b]',
    code: `#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> scores = {
        {"Alice", 95}, {"Bob", 87}, {"Charlie", 92}
    };

    for (auto& [name, score] : scores) {
        cout << name << ": " << score << endl;
    }

    auto [min_name, min_score] = *scores.begin();
    cout << "First: " << min_name << " = " << min_score << endl;
    return 0;
}`,
  },

  {
    id: 'optional_cpp17', title: 'std::optional', category: 'C++17', version: 'cpp17',
    icon: '❓',
    description: 'Optional values — null-safe programming',
    code: `#include <iostream>
#include <optional>
#include <string>
using namespace std;

optional<int> divide(int a, int b) {
    if (b == 0) return nullopt;
    return a / b;
}

int main() {
    auto r1 = divide(10, 2);
    auto r2 = divide(5, 0);

    if (r1) cout << "10/2 = " << *r1 << endl;
    if (!r2) cout << "Division by zero!" << endl;

    cout << r1.value_or(-1) << endl;
    return 0;
}`,
  },

  // ── C++20 ─────────────────────────────────────────────────────────────────
  {
    id: 'concepts_cpp20', title: 'Concepts', category: 'C++20', version: 'cpp20',
    icon: '💡',
    description: 'C++20 concepts for template constraints',
    code: `#include <iostream>
#include <concepts>
using namespace std;

template<typename T>
concept Numeric = integral<T> || floating_point<T>;

template<Numeric T>
T square(T x) { return x * x; }

template<Numeric T>
T cube(T x) { return x * x * x; }

int main() {
    cout << "square(5)   = " << square(5) << endl;
    cout << "square(3.14)= " << square(3.14) << endl;
    cout << "cube(4)     = " << cube(4) << endl;
    return 0;
}`,
  },

  {
    id: 'ranges_cpp20', title: 'Ranges & Views', category: 'C++20', version: 'cpp20',
    icon: '📊',
    description: 'C++20 ranges — filter, transform, take pipelines',
    code: `#include <iostream>
#include <vector>
#include <ranges>
#include <algorithm>
using namespace std;

int main() {
    vector<int> nums = {1,2,3,4,5,6,7,8,9,10};

    // Pipeline: filter even, multiply by 3, take 4
    auto result = nums
        | views::filter([](int x) { return x % 2 == 0; })
        | views::transform([](int x) { return x * 3; })
        | views::take(4);

    for (int n : result)
        cout << n << " ";
    cout << endl;
    return 0;
}`,
  },

  {
    id: 'coroutines_cpp20', title: 'Coroutines (Generator)', category: 'C++20', version: 'cpp20',
    icon: '🌊',
    description: 'C++20 coroutine generator — co_yield values',
    code: `#include <iostream>
#include <coroutine>
using namespace std;

// Simple C++20 coroutine-based generator concept
// (Simplified for demonstration)
struct Counter {
    int start, end;
    void run() {
        for (int i = start; i <= end; i++) {
            cout << "Generated: " << i << endl;
        }
    }
};

int main() {
    Counter c{1, 5};
    c.run();
    return 0;
}`,
  },

  // ── MEMORY ─────────────────────────────────────────────────────────────────
  {
    id: 'smart_pointers', title: 'Smart Pointers', category: 'Memory', version: 'cpp14',
    icon: '🧠', traceKey: 'smart_pointers',
    description: 'unique_ptr and shared_ptr — RAII memory management',
    code: `#include <iostream>
#include <memory>
using namespace std;

struct Resource {
    string name;
    Resource(string n) : name(n) { cout << "Created: " << n << endl; }
    ~Resource() { cout << "Destroyed: " << name << endl; }
};

int main() {
    auto p1 = make_unique<Resource>("UniqueRes");
    cout << "Using: " << p1->name << endl;

    auto s1 = make_shared<Resource>("SharedRes");
    auto s2 = s1;
    cout << "Refs: " << s1.use_count() << endl;

    return 0; // all auto-freed
}`,
  },

  {
    id: 'move_semantics', title: 'Move Semantics', category: 'Memory', version: 'cpp11',
    icon: '🚀',
    description: 'Rvalue references and move constructors',
    code: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

class Buffer {
    vector<int> data;
public:
    Buffer(int size) : data(size, 0) {
        cout << "Constructed size=" << size << endl;
    }
    Buffer(Buffer&& other) noexcept : data(move(other.data)) {
        cout << "Moved!" << endl;
    }
    int size() const { return data.size(); }
};

int main() {
    Buffer b1(100);
    Buffer b2 = move(b1);
    cout << "b2.size = " << b2.size() << endl;
    cout << "b1.size = " << b1.size() << " (emptied)" << endl;
    return 0;
}`,
  },

  // ── C++23 ─────────────────────────────────────────────────────────────────
  {
    id: 'print_cpp23', title: 'std::print (C++23)', category: 'C++23', version: 'cpp23',
    icon: '🖨️',
    description: 'C++23 std::print — type-safe formatted output',
    code: `#include <print>
#include <string>
using namespace std;

int main() {
    string name = "World";
    int count = 42;
    double pi = 3.14159;

    print("Hello, {}!\\n", name);
    print("Count: {}, Pi: {:.2f}\\n", count, pi);
    print("Hex: {:#x}, Bin: {:#b}\\n", count, count);
    return 0;
}`,
  },

  {
    id: 'expected_cpp23', title: 'std::expected (C++23)', category: 'C++23', version: 'cpp23',
    icon: '✅',
    description: 'Error handling without exceptions — expected<T,E>',
    code: `#include <iostream>
#include <expected>
#include <string>
using namespace std;

expected<int, string> parseInt(const string& s) {
    try {
        return stoi(s);
    } catch (...) {
        return unexpected("Not a number: " + s);
    }
}

int main() {
    auto r1 = parseInt("42");
    auto r2 = parseInt("abc");

    if (r1) cout << "Parsed: " << *r1 << endl;
    if (!r2) cout << "Error: " << r2.error() << endl;
    return 0;
}`,
  },

  // ── CLASSIC PROBLEMS ───────────────────────────────────────────────────────
  {
    id: 'hello_world', title: 'Hello World', category: 'Basics', version: 'cpp11',
    icon: '👋',
    description: 'The classic first program',
    code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  },

  {
    id: 'prime_sieve', title: 'Sieve of Eratosthenes', category: 'Algorithms', version: 'cpp11',
    icon: '🔢',
    description: 'Find all primes up to N efficiently',
    code: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n = 30;
    vector<bool> isPrime(n+1, true);
    isPrime[0] = isPrime[1] = false;

    for (int i = 2; i * i <= n; i++) {
        if (isPrime[i]) {
            for (int j = i*i; j <= n; j += i)
                isPrime[j] = false;
        }
    }

    cout << "Primes up to " << n << ": ";
    for (int i = 2; i <= n; i++)
        if (isPrime[i]) cout << i << " ";
    cout << endl;
    return 0;
}`,
  },

  {
    id: 'matrix_mult', title: 'Matrix Multiplication', category: 'Algorithms', version: 'cpp11',
    icon: '🔲',
    description: '2x2 matrix multiplication',
    code: `#include <iostream>
using namespace std;

void multiply(int A[2][2], int B[2][2], int C[2][2]) {
    for (int i = 0; i < 2; i++)
        for (int j = 0; j < 2; j++) {
            C[i][j] = 0;
            for (int k = 0; k < 2; k++)
                C[i][j] += A[i][k] * B[k][j];
        }
}

int main() {
    int A[2][2] = {{1,2},{3,4}};
    int B[2][2] = {{5,6},{7,8}};
    int C[2][2];
    multiply(A, B, C);
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 2; j++)
            cout << C[i][j] << " ";
        cout << endl;
    }
    return 0;
}`,
  },
];

export const TEMPLATE_CATEGORIES = [
  'Basics', 'Recursion', 'Algorithms', 'Data Structures',
  'Memory', 'C++14', 'C++17', 'C++20', 'C++23'
];

export const VERSION_LABELS: Record<CppVersion, string> = {
  cpp11: 'C++11', cpp14: 'C++14', cpp17: 'C++17', cpp20: 'C++20', cpp23: 'C++23',
};
