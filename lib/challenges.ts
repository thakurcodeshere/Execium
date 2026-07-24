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
      objective: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      description: "You may assume that each input would have exactly one solution, and you may not use the same element twice. Return the indices in zero-indexed order.",
      inputDesc: "std::vector<int>& nums, int target",
      outputDesc: "std::vector<int> containing the 2-index pair",
      takeaways: [
        "Single-pass Hash Map achieves O(N) time by looking up complement target - nums[i]",
        "Space complexity is O(N) to store visited values and their indices in unordered_map",
        "Edge Cases: Duplicates, negative target values, array size = 2"
      ],
      examples: [
        { id: 1, input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", explanation: "nums[0] + nums[1] == 2 + 7 == 9." },
        { id: 2, input: "nums = [3, 2, 4], target = 6", output: "[1, 2]", explanation: "nums[1] + nums[2] == 2 + 4 == 6." },
        { id: 3, input: "nums = [3, 3], target = 6", output: "[0, 1]", explanation: "nums[0] + nums[1] == 3 + 3 == 6." }
      ],
      constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
      companies: ["Google", "Amazon", "Apple", "Microsoft", "Meta"],
      acceptanceRate: "54.2%",
      totalAccepted: "14,500,000"
    },
    easy_revstring: {
      title: "Reverse String",
      objective: "Write a function that reverses a string array in-place with O(1) extra memory.",
      description: "Do not allocate another array for another string. You must modify the input array in-place with O(1) extra memory using two pointers.",
      inputDesc: "std::vector<char>& s",
      outputDesc: "Void function modifying vector<char>& in-place",
      takeaways: [
        "Two-pointer technique (left & right pointers) swapping elements inward",
        "Requires O(1) extra memory space",
        "Runs in O(N/2) swaps -> O(N) time"
      ],
      examples: [
        { id: 1, input: "s = ['h','e','l','l','o']", output: "['o','l','l','e','h']", explanation: "Swaps first and last character inward." },
        { id: 2, input: "s = ['H','a','n','n','a','h']", output: "['h','a','n','n','a','H']", explanation: "Reverses even length character vector in-place." }
      ],
      constraints: ["1 <= s.length <= 10^5", "s[i] is a printable ascii character."],
      companies: ["Amazon", "Microsoft", "Apple", "Adobe"],
      acceptanceRate: "78.9%",
      totalAccepted: "3,100,000"
    },
    med_binsearch: {
      title: "Binary Search",
      objective: "Given an array of integers nums sorted in ascending order and a target value, write a function to search target in nums.",
      description: "If target exists, return its index. Otherwise, return -1. You must write an algorithm with O(log n) runtime complexity.",
      inputDesc: "std::vector<int>& arr, int target",
      outputDesc: "int index of target or -1",
      takeaways: [
        "Divide and conquer halves search space on every iteration",
        "Middle index formula mid = lo + (hi - lo) / 2 avoids integer overflow",
        "Requires strictly sorted input array"
      ],
      examples: [
        { id: 1, input: "nums = [-1, 0, 3, 5, 9, 12], target = 9", output: "4", explanation: "9 exists in nums and its index is 4." },
        { id: 2, input: "nums = [-1, 0, 3, 5, 9, 12], target = 2", output: "-1", explanation: "2 does not exist in nums so return -1." }
      ],
      constraints: ["1 <= nums.length <= 10^4", "All integers in nums are unique and sorted in ascending order."],
      companies: ["Google", "Amazon", "Meta", "NVIDIA"],
      acceptanceRate: "57.8%",
      totalAccepted: "4,200,000"
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
