export interface SolutionApproach {
  id: number;
  title: string;
  desc: string;
  timeComplexity: string;
  spaceComplexity: string;
  code: string;
}

export interface ExampleCase {
  id?: number;
  input: string;
  output: string;
  explanation?: string;
}

export interface CodingChallenge {
  id: string;
  title: string;
  desc: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  code: string;
}

export interface ChallengeDetails extends CodingChallenge {
  problemStatement: {
    title: string;
    objective: string;
    description: string;
    inputDesc: string;
    outputDesc: string;
    takeaways: string[];
    examples: ExampleCase[];
    constraints: string[];
    companies: string[];
    acceptanceRate: string;
    totalAccepted: string;
  };
  inputFormat: string;
  outputFormat: string;
  exampleCases: ExampleCase[];
  constraints: string[];
  solutions: SolutionApproach[];
}

export const CODING_CHALLENGES: CodingChallenge[] = [
  {
    id: "easy_twosum",
    title: "Two Sum Indices",
    desc: "Find two elements in nums that sum to target.",
    difficulty: "easy",
    category: "Arrays & Hash Map",
    code: `// Easy Challenge: Two Sum
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> m;
    for (int i = 0; i < nums.size(); i++) {
        int diff = target - nums[i];
        if (m.count(diff)) return {m[diff], i};
        m[nums[i]] = i;
    }
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> res = twoSum(nums, target);
    cout << "Indices: " << res[0] << ", " << res[1] << endl;
    return 0;
}`
  },
  {
    id: "easy_revstring",
    title: "Reverse String",
    desc: "Reverse a character vector in-place.",
    difficulty: "easy",
    category: "Two Pointers",
    code: `// Easy Challenge: Reverse String
#include <iostream>
#include <vector>
using namespace std;

void reverseString(vector<char>& s) {
    int l = 0, r = s.size() - 1;
    while (l < r) {
        swap(s[l], s[r]);
        l++; r--;
    }
}

int main() {
    vector<char> s = {'h', 'e', 'l', 'l', 'o'};
    reverseString(s);
    for(char c : s) cout << c;
    cout << endl;
    return 0;
}`
  },
  {
    id: "easy_fizzbuzz",
    title: "FizzBuzz Solver",
    desc: "Generate numbers 1 to n mapping to string lists.",
    difficulty: "easy",
    category: "Math & Strings",
    code: `// Easy Challenge: FizzBuzz
#include <iostream>
#include <vector>
#include <string>
using namespace std;

vector<string> fizzBuzz(int n) {
    vector<string> res;
    for (int i = 1; i <= n; i++) {
        if (i % 3 == 0 && i % 5 == 0) res.push_back("FizzBuzz");
        else if (i % 3 == 0) res.push_back("Fizz");
        else if (i % 5 == 0) res.push_back("Buzz");
        else res.push_back(to_string(i));
    }
    return res;
}

int main() {
    vector<string> fb = fizzBuzz(15);
    for(const string& s : fb) cout << s << " ";
    cout << endl;
    return 0;
}`
  },
  {
    id: "easy_palindrome",
    title: "Palindrome Checker",
    desc: "Verify if string is equal backwards.",
    difficulty: "easy",
    category: "String Manipulation",
    code: `// Easy Challenge: Palindrome Checker
#include <iostream>
#include <string>
using namespace std;

bool isPalindrome(string s) {
    int l = 0, r = s.length() - 1;
    while (l < r) {
        if (s[l] != s[r]) return false;
        l++; r--;
    }
    return true;
}

int main() {
    cout << "radar: " << isPalindrome("radar") << endl;
    cout << "hello: " << isPalindrome("hello") << endl;
    return 0;
}`
  },
  {
    id: "med_revlist",
    title: "Reverse Linked List",
    desc: "Reverse node pointer chains in-place.",
    difficulty: "medium",
    category: "Linked Lists",
    code: `// Medium Challenge: Reverse List
#include <iostream>
using namespace std;

struct Node {
    int val; Node* next;
    Node(int x) : val(x), next(nullptr) {}
};

Node* reverseList(Node* head) {
    Node* prev = nullptr; Node* curr = head;
    while (curr) {
        Node* nextTemp = curr->next;
        curr->next = prev;
        prev = curr; curr = nextTemp;
    }
    return prev;
}

int main() {
    Node* head = new Node(1); head->next = new Node(2);
    Node* rev = reverseList(head);
    while (rev) { cout << rev->val << " "; rev = rev->next; }
    cout << endl; return 0;
}`
  },
  {
    id: "med_brackets",
    title: "Valid Parentheses",
    desc: "Validate brackets ordering logic.",
    difficulty: "medium",
    category: "Stack & Strings",
    code: `// Medium Challenge: Valid Parentheses
#include <iostream>
#include <string>
#include <stack>
using namespace std;

bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') st.push(c);
        else {
            if (st.empty()) return false;
            if (c == ')' && st.top() != '(') return false;
            if (c == '}' && st.top() != '{') return false;
            if (c == ']' && st.top() != '[') return false;
            st.pop();
        }
    }
    return st.empty();
}

int main() {
    cout << "([]){}: " << isValid("([]){}") << endl;
    return 0;
}`
  },
  {
    id: "med_binsearch",
    title: "Binary Search",
    desc: "Divide-and-conquer target lookup.",
    difficulty: "medium",
    category: "Binary Search",
    code: `// Medium Challenge: Binary Search
#include <iostream>
#include <vector>
using namespace std;

int binarySearch(vector<int>& arr, int target) {
    int lo = 0, hi = arr.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}

int main() {
    vector<int> arr = {1, 3, 5, 7, 9, 11};
    cout << "Index of 7: " << binarySearch(arr, 7) << endl;
    return 0;
}`
  },
  {
    id: "med_fibonacci",
    title: "Fibonacci Memoization",
    desc: "Dynamic programming calculation.",
    difficulty: "medium",
    category: "Dynamic Programming",
    code: `// Medium Challenge: Fibonacci DP
#include <iostream>
#include <vector>
using namespace std;

int fibDP(int n) {
    if (n <= 1) return n;
    vector<int> memo(n + 1, 0);
    memo[1] = 1;
    for (int i = 2; i <= n; i++) {
        memo[i] = memo[i-1] + memo[i-2];
    }
    return memo[n];
}

int main() {
    cout << "fib(10) = " << fibDP(10) << endl;
    return 0;
}`
  },
  {
    id: "hard_queens",
    title: "N-Queens Solver",
    desc: "Backtracking configuration solver.",
    difficulty: "hard",
    category: "Backtracking",
    code: `// Hard Challenge: N-Queens
#include <iostream>
#include <vector>
using namespace std;

bool isSafe(vector<int>& board, int row, int col) {
    for (int i = 0; i < row; i++) {
        if (board[i] == col || abs(board[i] - col) == abs(i - row)) return false;
    }
    return true;
}

bool solve(vector<int>& board, int row, int n) {
    if (row == n) return true;
    for (int col = 0; col < n; col++) {
        if (isSafe(board, row, col)) {
            board[row] = col;
            if (solve(board, row + 1, n)) return true;
        }
    }
    return false;
}

int main() {
    int n = 4;
    vector<int> board(n, 0);
    if (solve(board, 0, n)) {
        for (int i = 0; i < n; i++) cout << board[i] << " ";
        cout << endl;
    }
    return 0;
}`
  },
  {
    id: "hard_mergelists",
    title: "Merge K Lists",
    desc: "Unify linked list arrays.",
    difficulty: "hard",
    category: "Heap / Divide & Conquer",
    code: `// Hard Challenge: Merge K Sorted Lists
#include <iostream>
#include <vector>
using namespace std;

struct Node {
    int val; Node* next;
    Node(int x) : val(x), next(nullptr) {}
};

Node* mergeTwo(Node* l1, Node* l2) {
    if (!l1) return l2; if (!l2) return l1;
    if (l1->val < l2->val) { l1->next = mergeTwo(l1->next, l2); return l1; }
    else { l2->next = mergeTwo(l1, l2->next); return l2; }
}

Node* mergeKLists(vector<Node*>& lists) {
    if (lists.empty()) return nullptr;
    while (lists.size() > 1) {
        lists[0] = mergeTwo(lists[0], lists.back());
        lists.pop_back();
    }
    return lists[0];
}

int main() {
    Node* n1 = new Node(1); n1->next = new Node(4);
    Node* n2 = new Node(2); n2->next = new Node(3);
    vector<Node*> lists = {n1, n2};
    Node* merged = mergeKLists(lists);
    while (merged) { cout << merged->val << " "; merged = merged->next; }
    cout << endl; return 0;
}`
  },
  {
    id: "hard_lrucache",
    title: "LRU Cache Solver",
    desc: "Page eviction cache simulator.",
    difficulty: "hard",
    category: "Data Structures Design",
    code: `// Hard Challenge: LRU Cache
#include <iostream>
#include <unordered_map>
#include <list>
using namespace std;

class LRUCache {
    int capacity;
    list<pair<int, int>> order;
    unordered_map<int, list<pair<int, int>>::iterator> cache;
public:
    LRUCache(int cap) : capacity(cap) {}
    
    int get(int key) {
        if (!cache.count(key)) return -1;
        auto it = cache[key];
        int val = it->second;
        order.erase(it);
        order.push_front({key, val});
        cache[key] = order.begin();
        return val;
    }
    
    void put(int key, int value) {
        if (cache.count(key)) {
            order.erase(cache[key]);
        } else if (order.size() == capacity) {
            cache.erase(order.back().first);
            order.pop_back();
        }
        order.push_front({key, value});
        cache[key] = order.begin();
    }
};

int main() {
    LRUCache lru(2);
    lru.put(1, 10); lru.put(2, 20);
    cout << "get(1): " << lru.get(1) << endl;
    lru.put(3, 30);
    cout << "get(2): " << lru.get(2) << endl;
    return 0;
}`
  },
  {
    id: "hard_longestvalid",
    title: "Longest Parentheses",
    desc: "Longest balanced nested subset.",
    difficulty: "hard",
    category: "Stack & Dynamic Programming",
    code: `// Hard Challenge: Longest Balanced Parentheses
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int longestValid(string s) {
    int maxLen = 0;
    vector<int> st = {-1};
    for (int i = 0; i < s.length(); i++) {
        if (s[i] == '(') st.push_back(i);
        else {
            st.pop_back();
            if (st.empty()) st.push_back(i);
            else maxLen = max(maxLen, i - st.back());
        }
    }
    return maxLen;
}

int main() {
    cout << ")(()()): " << longestValid(")(()())") << endl;
    return 0;
}`
  }
];

export function getChallengeDetails(id: string): ChallengeDetails {
  const base = CODING_CHALLENGES.find(c => c.id === id) || CODING_CHALLENGES[0];

  const problemStatementMap: Record<string, ChallengeDetails['problemStatement']> = {
    easy_twosum: {
      title: "Two Sum Indices",
      objective: "Given an integer array nums and an integer target, find the two distinct indices i and j such that nums[i] + nums[j] == target. Return the pair [i, j].",
      description: "Each input has exactly one valid solution. You may not use the same element twice. The returned indices must be in ascending order. Your solution should run in O(N) time.",
      inputDesc: "Line 1: N (size of array). Line 2: N space-separated integers. Line 3: integer target.",
      outputDesc: "Two space-separated integers: the 0-based indices i and j where nums[i] + nums[j] == target.",
      takeaways: [
        "Hash Map lookup converts O(N^2) brute force into O(N) single-pass",
        "Store complement (target - nums[i]) as key, index i as value in unordered_map",
        "Watch for edge cases: duplicate values, negative numbers, exactly 2 elements"
      ],
      examples: [
        { id: 1, input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9, so return [0, 1]." },
        { id: 2, input: "nums = [3, 2, 4], target = 6", output: "[1, 2]", explanation: "nums[1] + nums[2] = 2 + 4 = 6, so return [1, 2]." },
        { id: 3, input: "nums = [3, 3], target = 6", output: "[0, 1]", explanation: "Both elements are 3. nums[0] + nums[1] = 6, return [0, 1]." }
      ],
      constraints: [
        "2 <= nums.length <= 10^4",
        "-10^9 <= nums[i] <= 10^9",
        "-10^9 <= target <= 10^9",
        "Exactly one valid answer exists"
      ],
      companies: ["Google", "Amazon", "Apple", "Microsoft", "Meta"],
      acceptanceRate: "54.2%",
      totalAccepted: "14,500,000"
    },
    easy_revstring: {
      title: "Reverse String",
      objective: "Given a character array s, reverse the entire array in-place so that the first character becomes the last and vice versa. Do NOT allocate a new array.",
      description: "You must solve it using O(1) extra memory. Use the two-pointer technique: initialize left = 0 and right = s.size() - 1, then swap s[left] and s[right] while moving both pointers inward until they meet.",
      inputDesc: "Line 1: N (number of characters). Line 2: N space-separated characters.",
      outputDesc: "N space-separated characters in reversed order (printed on a single line).",
      takeaways: [
        "Two-pointer swap: left pointer starts at index 0, right pointer starts at index N-1",
        "Each iteration swaps s[left] with s[right], then left++, right--",
        "Total swaps = N/2, giving O(N) time and O(1) space"
      ],
      examples: [
        { id: 1, input: "s = ['h', 'e', 'l', 'l', 'o']", output: "['o', 'l', 'l', 'e', 'h']", explanation: "h swaps with o, e swaps with l. Middle l stays. Result: o l l e h." },
        { id: 2, input: "s = ['H', 'a', 'n', 'n', 'a', 'h']", output: "['h', 'a', 'n', 'n', 'a', 'H']", explanation: "Even-length array. H swaps with h, a swaps with a, n swaps with n." },
        { id: 3, input: "s = ['A']", output: "['A']", explanation: "Single character array is already reversed." }
      ],
      constraints: [
        "1 <= s.length <= 10^5",
        "s[i] is a printable ASCII character",
        "Must use O(1) extra space"
      ],
      companies: ["Amazon", "Microsoft", "Apple", "Adobe"],
      acceptanceRate: "78.9%",
      totalAccepted: "3,100,000"
    },
    easy_fizzbuzz: {
      title: "FizzBuzz Solver",
      objective: "Given a positive integer n, return a string array answer (1-indexed) where: answer[i] is \"FizzBuzz\" if i is divisible by both 3 and 5, \"Fizz\" if divisible by 3 only, \"Buzz\" if divisible by 5 only, or the string representation of i otherwise.",
      description: "Iterate from 1 to n inclusive. For each number, check divisibility by 15 first (for FizzBuzz), then by 3 (Fizz), then by 5 (Buzz), and finally convert the number to a string. Append each result to the output vector.",
      inputDesc: "Line 1: a single integer n (1 <= n <= 10^4).",
      outputDesc: "N lines, each containing one string: the FizzBuzz value for that position (1-indexed).",
      takeaways: [
        "Order of checks matters: test divisibility by 15 before 3 or 5 individually",
        "to_string(i) converts integer i to its string representation in C++",
        "Classic interview warm-up testing conditional logic and modulo operations"
      ],
      examples: [
        { id: 1, input: "n = 3", output: "[\"1\", \"2\", \"Fizz\"]", explanation: "1 and 2 are not divisible by 3 or 5. 3 is divisible by 3, so output Fizz." },
        { id: 2, input: "n = 5", output: "[\"1\", \"2\", \"Fizz\", \"4\", \"Buzz\"]", explanation: "5 is divisible by 5 but not 3, so output Buzz." },
        { id: 3, input: "n = 15", output: "[\"1\", \"2\", \"Fizz\", \"4\", \"Buzz\", \"Fizz\", \"7\", \"8\", \"Fizz\", \"Buzz\", \"11\", \"Fizz\", \"13\", \"14\", \"FizzBuzz\"]", explanation: "15 is divisible by both 3 and 5, producing FizzBuzz at position 15." }
      ],
      constraints: [
        "1 <= n <= 10^4",
        "Output must be exactly n strings",
        "Time Limit: 1.0s",
        "Memory Limit: 256MB"
      ],
      companies: ["Goldman Sachs", "Bloomberg", "Cisco", "Oracle", "Infosys"],
      acceptanceRate: "72.4%",
      totalAccepted: "2,800,000"
    },
    easy_palindrome: {
      title: "Palindrome Checker",
      objective: "Given a string s consisting of lowercase English letters, determine whether it reads the same forwards and backwards. Return true if s is a palindrome, false otherwise.",
      description: "Compare characters from both ends moving inward. If at any point s[left] != s[right], immediately return false. If all pairs match (or the pointers cross), return true. The check runs in O(N/2) comparisons.",
      inputDesc: "Line 1: a single string s (lowercase a-z only, no spaces).",
      outputDesc: "A single line: 1 if the string is a palindrome, 0 otherwise.",
      takeaways: [
        "Two-pointer comparison: left pointer at 0, right pointer at length - 1",
        "Early exit: return false immediately on first mismatch for efficiency",
        "Odd-length strings have a middle character that does not need comparison"
      ],
      examples: [
        { id: 1, input: "s = \"radar\"", output: "1 (true)", explanation: "r == r, a == a, d is the middle. All pairs match, so it is a palindrome." },
        { id: 2, input: "s = \"hello\"", output: "0 (false)", explanation: "h != o at the outermost pair. Immediately return false." },
        { id: 3, input: "s = \"abacaba\"", output: "1 (true)", explanation: "a==a, b==b, a==a, c is middle. All pairs match." },
        { id: 4, input: "s = \"a\"", output: "1 (true)", explanation: "Single character strings are always palindromes." }
      ],
      constraints: [
        "1 <= s.length <= 10^5",
        "s contains only lowercase English letters (a-z)",
        "Time Limit: 1.0s",
        "Memory Limit: 256MB"
      ],
      companies: ["Meta", "Apple", "Uber", "LinkedIn", "Spotify"],
      acceptanceRate: "68.1%",
      totalAccepted: "5,900,000"
    },
    med_revlist: {
      title: "Reverse Linked List",
      objective: "Given the head of a singly linked list, reverse the list so the last node becomes the first, the second-to-last becomes the second, and so on. Return the new head of the reversed list.",
      description: "Traverse the list while maintaining three pointers: prev (initially nullptr), curr (initially head), and nextTemp. At each step, save curr->next into nextTemp, point curr->next to prev, advance prev to curr, then advance curr to nextTemp. When curr becomes nullptr, prev is the new head.",
      inputDesc: "Line 1: N (number of nodes). Line 2: N space-separated integers representing node values from head to tail.",
      outputDesc: "N space-separated integers representing the reversed list from new head to new tail.",
      takeaways: [
        "Iterative reversal uses O(1) space with three pointers: prev, curr, nextTemp",
        "Recursive reversal uses O(N) call stack space but reads more elegantly",
        "Edge cases: empty list (head == nullptr) and single-node list (no reversal needed)"
      ],
      examples: [
        { id: 1, input: "head = [1, 2, 3, 4, 5]", output: "[5, 4, 3, 2, 1]", explanation: "Each pointer is reversed: 5->4->3->2->1->nullptr." },
        { id: 2, input: "head = [1, 2]", output: "[2, 1]", explanation: "Two-node list: 2->1->nullptr after one swap iteration." },
        { id: 3, input: "head = [1]", output: "[1]", explanation: "Single node list has nothing to reverse. Return head as-is." },
        { id: 4, input: "head = []", output: "[]", explanation: "Empty list (head is nullptr). Return nullptr." }
      ],
      constraints: [
        "0 <= N <= 5000",
        "-5000 <= Node.val <= 5000",
        "Time Limit: 1.0s",
        "Memory Limit: 256MB"
      ],
      companies: ["Amazon", "Microsoft", "Bloomberg", "Adobe", "Samsung"],
      acceptanceRate: "75.3%",
      totalAccepted: "6,200,000"
    },
    med_brackets: {
      title: "Valid Parentheses",
      objective: "Given a string s containing only the characters '(', ')', '{', '}', '[', and ']', determine if the input string is valid. A string is valid if every open bracket is closed by the same type of bracket in the correct order.",
      description: "Use a stack data structure. For each character: if it is an opening bracket, push it onto the stack. If it is a closing bracket, check that the stack is not empty and that the top of the stack is the matching opening bracket — then pop. After processing all characters, the string is valid only if the stack is empty.",
      inputDesc: "Line 1: a single string s containing only characters from the set { '(', ')', '{', '}', '[', ']' }.",
      outputDesc: "A single line: 1 if the string has valid bracket nesting, 0 otherwise.",
      takeaways: [
        "Stack-based matching: push openers, pop and compare on closers",
        "Mismatched closer or non-empty stack at end both mean invalid",
        "O(N) time single pass, O(N) worst-case stack space for all-openers input"
      ],
      examples: [
        { id: 1, input: "s = \"()\"", output: "1 (true)", explanation: "Single pair of parentheses. ( pushed, ) matches top and pops. Stack empty -> valid." },
        { id: 2, input: "s = \"()[]{}\"", output: "1 (true)", explanation: "Three consecutive matching pairs. Each closer matches its opener. Stack empties -> valid." },
        { id: 3, input: "s = \"(]\"", output: "0 (false)", explanation: "( is pushed, then ] does not match ( on the stack top. Mismatch -> invalid." },
        { id: 4, input: "s = \"([{}])\"", output: "1 (true)", explanation: "Nested brackets: [ inside (, { inside [. Each closer matches in correct LIFO order." }
      ],
      constraints: [
        "1 <= s.length <= 10^4",
        "s consists of parentheses only: '(){}[]'",
        "Time Limit: 1.0s",
        "Memory Limit: 256MB"
      ],
      companies: ["Google", "Amazon", "Meta", "Apple", "Uber"],
      acceptanceRate: "42.8%",
      totalAccepted: "8,400,000"
    },
    med_binsearch: {
      title: "Binary Search",
      objective: "Given an array of integers nums sorted in ascending order and a target value, write a function to search target in nums. If target exists, return its index. Otherwise, return -1.",
      description: "You must write an algorithm with O(log n) runtime complexity. Use the classic binary search pattern: maintain lo and hi boundaries, compute mid = lo + (hi - lo) / 2, then narrow the search window based on comparison with target.",
      inputDesc: "Line 1: N (size of sorted array). Line 2: N space-separated integers in ascending order. Line 3: integer target.",
      outputDesc: "A single integer: the 0-based index of target in nums, or -1 if not found.",
      takeaways: [
        "Divide-and-conquer halves the search space every iteration: O(log N) time",
        "Use mid = lo + (hi - lo) / 2 instead of (lo + hi) / 2 to avoid integer overflow",
        "Array must be sorted; does not work on unsorted input"
      ],
      examples: [
        { id: 1, input: "nums = [-1, 0, 3, 5, 9, 12], target = 9", output: "4", explanation: "9 exists at index 4 in the sorted array." },
        { id: 2, input: "nums = [-1, 0, 3, 5, 9, 12], target = 2", output: "-1", explanation: "2 does not exist in the array, return -1." },
        { id: 3, input: "nums = [5], target = 5", output: "0", explanation: "Single-element array containing the target. Return index 0." }
      ],
      constraints: [
        "1 <= nums.length <= 10^4",
        "-10^4 < nums[i], target < 10^4",
        "All integers in nums are unique",
        "nums is sorted in ascending order"
      ],
      companies: ["Google", "Amazon", "Meta", "NVIDIA"],
      acceptanceRate: "57.8%",
      totalAccepted: "4,200,000"
    },
    med_fibonacci: {
      title: "Fibonacci Memoization",
      objective: "Given an integer n (0-indexed), compute the nth Fibonacci number. The Fibonacci sequence is defined as: F(0) = 0, F(1) = 1, and F(n) = F(n-1) + F(n-2) for n >= 2.",
      description: "Use bottom-up dynamic programming (tabulation) to compute F(n) in O(N) time and O(N) space. Allocate a memo array of size n+1, initialize memo[0] = 0 and memo[1] = 1, then iterate from 2 to n filling memo[i] = memo[i-1] + memo[i-2]. Return memo[n].",
      inputDesc: "Line 1: a single non-negative integer n (0 <= n <= 45).",
      outputDesc: "A single integer: the nth Fibonacci number F(n).",
      takeaways: [
        "Naive recursion is O(2^N) — memoization or tabulation reduces it to O(N)",
        "Bottom-up tabulation avoids recursion stack overflow for large n",
        "Space can be optimized to O(1) by keeping only the last two values"
      ],
      examples: [
        { id: 1, input: "n = 0", output: "0", explanation: "F(0) = 0 by definition." },
        { id: 2, input: "n = 1", output: "1", explanation: "F(1) = 1 by definition." },
        { id: 3, input: "n = 10", output: "55", explanation: "F(10) = 55. Sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55." },
        { id: 4, input: "n = 30", output: "832040", explanation: "F(30) = 832040. Tabulation computes this in exactly 29 additions." }
      ],
      constraints: [
        "0 <= n <= 45",
        "Answer fits in a 32-bit signed integer for n <= 45",
        "Time Limit: 1.0s",
        "Memory Limit: 256MB"
      ],
      companies: ["Google", "Microsoft", "Goldman Sachs", "JPMorgan", "Qualcomm"],
      acceptanceRate: "71.6%",
      totalAccepted: "3,500,000"
    },
    hard_queens: {
      title: "N-Queens Solver",
      objective: "Place n queens on an n x n chessboard such that no two queens attack each other. Return the 0-based column indices of queens placed in each row [0..n-1] for the first valid configuration found.",
      description: "A queen can attack horizontally, vertically, and diagonally. Use backtracking to place queens row by row from row 0 to row n-1. Maintain safety checks for column conflicts (board[i] == col) and diagonal conflicts (abs(board[i] - col) == abs(i - row)).",
      inputDesc: "Line 1: a single integer n (1 <= n <= 9), representing board dimensions.",
      outputDesc: "N space-separated integers: board[0], board[1], ..., board[n-1], where board[r] is the column index of the queen in row r.",
      takeaways: [
        "Backtracking systematically prunes illegal search tree branches early",
        "Diagonal safety check abs(c1 - c2) == abs(r1 - r2) verifies main & anti-diagonals",
        "State space is O(N!), bitmask optimization achieves maximum solver speed"
      ],
      examples: [
        { id: 1, input: "n = 4", output: "[1, 3, 0, 2]", explanation: "Row 0 -> col 1, Row 1 -> col 3, Row 2 -> col 0, Row 3 -> col 2. No queens attack." },
        { id: 2, input: "n = 1", output: "[0]", explanation: "Single 1x1 board with 1 queen placed at (0, 0)." },
        { id: 3, input: "n = 8", output: "[0, 4, 7, 5, 2, 6, 1, 3]", explanation: "Standard 8-Queens puzzle first solution configuration." }
      ],
      constraints: [
        "1 <= n <= 9",
        "Time Limit: 1.0s",
        "Memory Limit: 256MB"
      ],
      companies: ["Google", "Meta", "Amazon", "Uber", "Oracle"],
      acceptanceRate: "68.4%",
      totalAccepted: "950,000"
    },
    hard_mergelists: {
      title: "Merge K Sorted Lists",
      objective: "You are given an array of k linked-lists, each sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return its head.",
      description: "Use a Min-Heap (priority queue) or Divide-and-Conquer pairing algorithm. In Min-Heap approach, push head nodes into heap, extract smallest, append to result list, and push next node until heap is empty. Runtime is O(N log k).",
      inputDesc: "Line 1: k (number of sorted lists). Following k lines: list length followed by space-separated elements.",
      outputDesc: "Space-separated integers of the unified merged sorted linked list.",
      takeaways: [
        "Min-Heap / Priority Queue achieves optimal O(N log k) time complexity where N is total nodes",
        "Divide & conquer pairing achieves O(N log k) time with O(1) auxiliary space",
        "Edge cases: k = 0, empty sublists, duplicate values across lists"
      ],
      examples: [
        { id: 1, input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]", explanation: "All 3 sorted lists merged into a single sorted chain." },
        { id: 2, input: "lists = []", output: "[]", explanation: "No lists provided. Return nullptr." },
        { id: 3, input: "lists = [[]]", output: "[]", explanation: "Array contains 1 empty list. Return nullptr." }
      ],
      constraints: [
        "0 <= k <= 10^4",
        "0 <= total nodes <= 10^5",
        "-10^4 <= Node.val <= 10^4",
        "Time Limit: 1.0s",
        "Memory Limit: 256MB"
      ],
      companies: ["Meta", "Amazon", "Google", "Microsoft", "ByteDance"],
      acceptanceRate: "53.1%",
      totalAccepted: "1,850,000"
    },
    hard_lrucache: {
      title: "LRU Cache Solver",
      objective: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) average time complexity for both get and put operations.",
      description: "Combine a Hash Map (unordered_map) with a Doubly Linked List (list). Hash map stores key to node iterator for O(1) lookups. Doubly linked list maintains access order: most recently used items at front, least recently used at back. Evict back element when capacity is exceeded.",
      inputDesc: "Line 1: capacity. Following lines: operation commands PUT key val or GET key.",
      outputDesc: "Results of GET operations (-1 if key not found, value if key exists).",
      takeaways: [
        "Doubly linked list allows O(1) node deletion and insertion at head",
        "Hash map iterator caching enables direct O(1) node access without traversal",
        "Eviction policy pops from list tail and erases key from map when size > capacity"
      ],
      examples: [
        { id: 1, input: "LRUCache(2); put(1,10); put(2,20); get(1); put(3,30); get(2);", output: "get(1)->10, get(2)->-1", explanation: "put(3,30) evicts key 2 because key 1 was recently accessed by get(1)." },
        { id: 2, input: "LRUCache(1); put(2,1); get(2); put(3,2); get(2);", output: "get(2)->1, get(2)->-1", explanation: "Capacity is 1. put(3,2) evicts key 2." }
      ],
      constraints: [
        "1 <= capacity <= 3000",
        "0 <= key <= 10^4",
        "0 <= value <= 10^5",
        "Time Limit: 1.0s",
        "Memory Limit: 256MB"
      ],
      companies: ["Amazon", "Google", "Microsoft", "Apple", "Bloomberg"],
      acceptanceRate: "43.5%",
      totalAccepted: "1,600,000"
    },
    hard_longestvalid: {
      title: "Longest Balanced Parentheses",
      objective: "Given a string s containing just the characters '(' and ')', return the length of the longest valid (well-formed) parentheses substring.",
      description: "Use a stack initialized with -1 to serve as a boundary base index. For each char at index i: if '(', push i. If ')', pop top. If stack becomes empty, push i as new base boundary. Otherwise, calculate max length as max(maxLen, i - stack.top()).",
      inputDesc: "Line 1: a single string s consisting of '(' and ')' characters.",
      outputDesc: "A single integer representing the length of the longest valid parentheses substring.",
      takeaways: [
        "Base index -1 in stack handles valid substrings starting at index 0",
        "Pushing current index on empty stack resets boundary after invalid closing bracket",
        "Runs in single pass O(N) time with O(N) stack space; O(1) space alternative uses left/right counters"
      ],
      examples: [
        { id: 1, input: "s = \")(()())\"", output: "6", explanation: "The longest valid parentheses substring is \"(()())\" of length 6." },
        { id: 2, input: "s = \"(()\"", output: "2", explanation: "The longest valid parentheses substring is \"()\" of length 2." },
        { id: 3, input: "s = \")()())\"", output: "4", explanation: "The longest valid parentheses substring is \"()()\" of length 4." },
        { id: 4, input: "s = \"\"", output: "0", explanation: "Empty string has length 0." }
      ],
      constraints: [
        "0 <= s.length <= 3 * 10^4",
        "s[i] is '(' or ')'",
        "Time Limit: 1.0s",
        "Memory Limit: 256MB"
      ],
      companies: ["Meta", "Google", "Amazon", "Microsoft", "ByteDance"],
      acceptanceRate: "34.7%",
      totalAccepted: "890,000"
    }
  };

  const fallbackStatement: ChallengeDetails['problemStatement'] = {
    title: base.title,
    objective: `Solve the ${base.title} challenge efficiently in C++.`,
    description: base.desc + " Handle all edge cases, empty input parameters, and performance constraints.",
    inputDesc: "Standard C++ parameters passed to function signature.",
    outputDesc: "Calculated return value or modified reference.",
    takeaways: [
      "Optimal C++ algorithm implementation",
      "Empirical execution time & memory optimization",
      "Handled edge cases and boundary conditions"
    ],
    examples: [
      { id: 1, input: "Sample Input 1", output: "Sample Output 1", explanation: "Verifies basic algorithm functionality." }
    ],
    constraints: ["Time Limit: 1.0s", "Memory Limit: 256MB"],
    companies: ["Google", "Amazon", "Microsoft", "Meta"],
    acceptanceRate: "65.0%",
    totalAccepted: "1,250,000"
  };

  const problemStatement = problemStatementMap[base.id] || fallbackStatement;
  const inputFormat = problemStatement.inputDesc;
  const outputFormat = problemStatement.outputDesc;
  const exampleCases = problemStatement.examples;
  const constraints = problemStatement.constraints;

  const defaultSolutions: SolutionApproach[] = [
    {
      id: 1,
      title: "1. Optimal Hash Map / Single-Pass Solution",
      desc: "Optimal approach using unordered_map for O(1) average lookup and O(N) total runtime.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(N)",
      code: base.code
    },
    {
      id: 2,
      title: "2. Two-Pass Lookup / Pointer Approach",
      desc: "Alternative solution separating data population and evaluation pass.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(N)",
      code: `// Approach 2: Alternative Solution\n${base.code}`
    },
    {
      id: 3,
      title: "3. Sorting & Binary Search Variant",
      desc: "Sorts input first to leverage O(log N) lookup binary divide and conquer.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)",
      code: `// Approach 3: Sorted Search\n${base.code}`
    }
  ];

  return {
    ...base,
    problemStatement,
    inputFormat,
    outputFormat,
    exampleCases,
    constraints,
    solutions: defaultSolutions
  };
}

export function getDailyChallenge(d: Date = new Date()) {
  const oneDay = 1000 * 60 * 60 * 24;
  const epochDays = Math.floor(d.getTime() / oneDay);
  const index = Math.abs(epochDays) % CODING_CHALLENGES.length;
  
  const formattedDate = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return {
    challenge: CODING_CHALLENGES[index],
    index,
    formattedDate,
    dateString: d.toISOString().split("T")[0]
  };
}

export function getTimeUntilNextDaily() {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const diffMs = Math.max(0, tomorrow.getTime() - now.getTime());
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
  return { hours, mins, secs, diffMs };
}
