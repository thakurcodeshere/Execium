export interface SolutionApproach {
  id: number;
  title: string;
  desc: string;
  timeComplexity: string;
  spaceComplexity: string;
  code: string;
}

export interface CodingChallenge {
  id: string;
  title: string;
  desc: string;
  difficulty: 'easy' | 'medium' | 'hard';
  code: string;
}

export interface ChallengeDetails extends CodingChallenge {
  problemStatement: string;
  inputFormat: string;
  outputFormat: string;
  exampleCases: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  solutions: SolutionApproach[];
}

export const CODING_CHALLENGES: CodingChallenge[] = [
  {
    id: "easy_twosum",
    title: "Two Sum Indices",
    desc: "Find two elements in nums that sum to target.",
    difficulty: "easy",
    code: `// Easy Challenge: Two Sum\n#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> m;\n    for (int i = 0; i < nums.size(); i++) {\n        int diff = target - nums[i];\n        if (m.count(diff)) return {m[diff], i};\n        m[nums[i]] = i;\n    }\n    return {};\n}\n\nint main() {\n    vector<int> nums = {2, 7, 11, 15};\n    int target = 9;\n    vector<int> res = twoSum(nums, target);\n    cout << "Indices: " << res[0] << ", " << res[1] << endl;\n    return 0;\n}`
  },
  {
    id: "easy_revstring",
    title: "Reverse String",
    desc: "Reverse a character vector in-place.",
    difficulty: "easy",
    code: `// Easy Challenge: Reverse String\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nvoid reverseString(vector<char>& s) {\n    int l = 0, r = s.size() - 1;\n    while (l < r) {\n        swap(s[l], s[r]);\n        l++; r--;\n    }\n}\n\nint main() {\n    vector<char> s = {'h', 'e', 'l', 'l', 'o'};\n    reverseString(s);\n    for(char c : s) cout << c;\n    cout << endl;\n    return 0;\n}`
  },
  {
    id: "easy_fizzbuzz",
    title: "FizzBuzz Solver",
    desc: "Generate numbers 1 to n mapping to string lists.",
    difficulty: "easy",
    code: `// Easy Challenge: FizzBuzz\n#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\nvector<string> fizzBuzz(int n) {\n    vector<string> res;\n    for (int i = 1; i <= n; i++) {\n        if (i % 3 == 0 && i % 5 == 0) res.push_back("FizzBuzz");\n        else if (i % 3 == 0) res.push_back("Fizz");\n        else if (i % 5 == 0) res.push_back("Buzz");\n        else res.push_back(to_string(i));\n    }\n    return res;\n}\n\nint main() {\n    vector<string> fb = fizzBuzz(15);\n    for(const string& s : fb) cout << s << " ";\n    cout << endl;\n    return 0;\n}`
  },
  {
    id: "easy_palindrome",
    title: "Palindrome Checker",
    desc: "Verify if string is equal backwards.",
    difficulty: "easy",
    code: `// Easy Challenge: Palindrome Checker\n#include <iostream>\n#include <string>\nusing namespace std;\n\nbool isPalindrome(string s) {\n    int l = 0, r = s.length() - 1;\n    while (l < r) {\n        if (s[l] != s[r]) return false;\n        l++; r--;\n    }\n    return true;\n}\n\nint main() {\n    cout << "radar: " << isPalindrome("radar") << endl;\n    cout << "hello: " << isPalindrome("hello") << endl;\n    return 0;\n}`
  },
  {
    id: "med_revlist",
    title: "Reverse Linked List",
    desc: "Reverse node pointer chains in-place.",
    difficulty: "medium",
    code: `// Medium Challenge: Reverse List\n#include <iostream>\nusing namespace std;\n\nstruct Node {\n    int val; Node* next;\n    Node(int x) : val(x), next(nullptr) {}\n};\n\nNode* reverseList(Node* head) {\n    Node* prev = nullptr; Node* curr = head;\n    while (curr) {\n        Node* nextTemp = curr->next;\n        curr->next = prev;\n        prev = curr; curr = nextTemp;\n    }\n    return prev;\n}\n\nint main() {\n    Node* head = new Node(1); head->next = new Node(2);\n    Node* rev = reverseList(head);\n    while (rev) { cout << rev->val << " "; rev = rev->next; }\n    cout << endl; return 0;\n}`
  },
  {
    id: "med_brackets",
    title: "Valid Parentheses",
    desc: "Validate brackets ordering logic.",
    difficulty: "medium",
    code: `// Medium Challenge: Valid Parentheses\n#include <iostream>\n#include <string>\n#include <stack>\nusing namespace std;\n\nbool isValid(string s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == '(' || c == '{' || c == '[') st.push(c);\n        else {\n            if (st.empty()) return false;\n            if (c == ')' && st.top() != '(') return false;\n            if (c == '}' && st.top() != '{') return false;\n            if (c == ']' && st.top() != '[') return false;\n            st.pop();\n        }\n    }\n    return st.empty();\n}\n\nint main() {\n    cout << "([]){}: " << isValid("([]){}") << endl;\n    return 0;\n}`
  },
  {
    id: "med_binsearch",
    title: "Binary Search",
    desc: "Divide-and-conquer target lookup.",
    difficulty: "medium",
    code: `// Medium Challenge: Binary Search\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nint binarySearch(vector<int>& arr, int target) {\n    int lo = 0, hi = arr.size() - 1;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}\n\nint main() {\n    vector<int> arr = {1, 3, 5, 7, 9, 11};\n    cout << "Index of 7: " << binarySearch(arr, 7) << endl;\n    return 0;\n}`
  },
  {
    id: "med_fibonacci",
    title: "Fibonacci Memoization",
    desc: "Dynamic programming calculation.",
    difficulty: "medium",
    code: `// Medium Challenge: Fibonacci DP\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nint fibDP(int n) {\n    if (n <= 1) return n;\n    vector<int> memo(n + 1, 0);\n    memo[1] = 1;\n    for (int i = 2; i <= n; i++) {\n        memo[i] = memo[i-1] + memo[i-2];\n    }\n    return memo[n];\n}\n\nint main() {\n    cout << "fib(10) = " << fibDP(10) << endl;\n    return 0;\n}`
  },
  {
    id: "hard_queens",
    title: "N-Queens Solver",
    desc: "Backtracking configuration solver.",
    difficulty: "hard",
    code: `// Hard Challenge: N-Queens\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nbool isSafe(vector<int>& board, int row, int col) {\n    for (int i = 0; i < row; i++) {\n        if (board[i] == col || abs(board[i] - col) == abs(i - row)) return false;\n    }\n    return true;\n}\n\nbool solve(vector<int>& board, int row, int n) {\n    if (row == n) return true;\n    for (int col = 0; col < n; col++) {\n        if (isSafe(board, row, col)) {\n            board[row] = col;\n            if (solve(board, row + 1, n)) return true;\n        }\n    }\n    return false;\n}\n\nint main() {\n    int n = 4;\n    vector<int> board(n, 0);\n    if (solve(board, 0, n)) {\n        for (int i = 0; i < n; i++) cout << board[i] << " ";\n        cout << endl;\n    }\n    return 0;\n}`
  },
  {
    id: "hard_mergelists",
    title: "Merge K Lists",
    desc: "Unify linked list arrays.",
    difficulty: "hard",
    code: `// Hard Challenge: Merge K Sorted Lists\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nstruct Node {\n    int val; Node* next;\n    Node(int x) : val(x), next(nullptr) {}\n};\n\nNode* mergeTwo(Node* l1, Node* l2) {\n    if (!l1) return l2; if (!l2) return l1;\n    if (l1->val < l2->val) { l1->next = mergeTwo(l1->next, l2); return l1; }\n    else { l2->next = mergeTwo(l1, l2->next); return l2; }\n}\n\nNode* mergeKLists(vector<Node*>& lists) {\n    if (lists.empty()) return nullptr;\n    while (lists.size() > 1) {\n        lists[0] = mergeTwo(lists[0], lists.back());\n        lists.pop_back();\n    }\n    return lists[0];\n}\n\nint main() {\n    Node* n1 = new Node(1); n1->next = new Node(4);\n    Node* n2 = new Node(2); n2->next = new Node(3);\n    vector<Node*> lists = {n1, n2};\n    Node* merged = mergeKLists(lists);\n    while (merged) { cout << merged->val << " "; merged = merged->next; }\n    cout << endl; return 0;\n}`
  },
  {
    id: "hard_lrucache",
    title: "LRU Cache Solver",
    desc: "Page eviction cache simulator.",
    difficulty: "hard",
    code: `// Hard Challenge: LRU Cache\n#include <iostream>\n#include <unordered_map>\n#include <list>\nusing namespace std;\n\nclass LRUCache {\n    int capacity;\n    list<pair<int, int>> order;\n    unordered_map<int, list<pair<int, int>>::iterator> cache;\npublic:\n    LRUCache(int cap) : capacity(cap) {}\n    \n    int get(int key) {\n        if (!cache.count(key)) return -1;\n        auto it = cache[key];\n        int val = it->second;\n        order.erase(it);\n        order.push_front({key, val});\n        cache[key] = order.begin();\n        return val;\n    }\n    \n    void put(int key, int value) {\n        if (cache.count(key)) {\n            order.erase(cache[key]);\n        } else if (order.size() == capacity) {\n            cache.erase(order.back().first);\n            order.pop_back();\n        }\n        order.push_front({key, value});\n        cache[key] = order.begin();\n    }\n};\n\nint main() {\n    LRUCache lru(2);\n    lru.put(1, 10); lru.put(2, 20);\n    cout << "get(1): " << lru.get(1) << endl;\n    lru.put(3, 30);\n    cout << "get(2): " << lru.get(2) << endl;\n    return 0;\n}`
  },
  {
    id: "hard_longestvalid",
    title: "Longest Parentheses",
    desc: "Longest balanced nested subset.",
    difficulty: "hard",
    code: `// Hard Challenge: Longest Balanced Parentheses\n#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n\nint longestValid(string s) {\n    int maxLen = 0;\n    vector<int> st = {-1};\n    for (int i = 0; i < s.length(); i++) {\n        if (s[i] == '(') st.push_back(i);\n        else {\n            st.pop_back();\n            if (st.empty()) st.push_back(i);\n            else maxLen = max(maxLen, i - st.back());\n        }\n    }\n    return maxLen;\n}\n\nint main() {\n    cout << ")(()()): " << longestValid(")(()())") << endl;\n    return 0;\n}`
  }
];

export function getChallengeDetails(id: string): ChallengeDetails {
  const base = CODING_CHALLENGES.find(c => c.id === id) || CODING_CHALLENGES[0];

  const problemStatement = `Given an input dataset, solve the "${base.title}" problem by writing an optimal C++ algorithm. Your code will be executed and verified against hidden test cases. Make sure to handle edge cases, empty bounds, and performance constraints.`;

  const inputFormat = `Standard input parameters according to function signature (e.g. vector<int> / string / Node* head).`;
  const outputFormat = `Return the calculated result or mutate data in-place as specified.`;

  const exampleCases = [
    { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", explanation: "nums[0] + nums[1] == 9, so return [0, 1]." },
    { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]", explanation: "nums[1] + nums[2] == 6, so return [1, 2]." },
    { input: "nums = [3, 3], target = 6", output: "[0, 1]", explanation: "nums[0] + nums[1] == 6, so return [0, 1]." }
  ];

  const constraints = [
    "1 <= N <= 10^5 elements",
    "-10^9 <= nums[i] <= 10^9",
    "Time Limit: 1.0s",
    "Memory Limit: 256MB"
  ];

  // Up to 10 solutions per challenge
  const solutions: SolutionApproach[] = [
    {
      id: 1,
      title: "1. Hash Map Single-Pass (Optimal)",
      desc: "Store numbers in an unordered_map as you iterate. Checks if target - current exists in map in O(1) average time.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(N)",
      code: `// Approach 1: Single-pass Hash Map\n#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> solveOptimal(vector<int>& nums, int target) {\n    unordered_map<int, int> seen;\n    for (int i = 0; i < nums.size(); i++) {\n        int complement = target - nums[i];\n        if (seen.find(complement) != seen.end()) {\n            return {seen[complement], i};\n        }\n        seen[nums[i]] = i;\n    }\n    return {};\n}`
    },
    {
      id: 2,
      title: "2. Two-Pass Hash Table",
      desc: "First populate the hash map with all elements, then make a second pass to look up target - nums[i].",
      timeComplexity: "O(N)",
      spaceComplexity: "O(N)",
      code: `// Approach 2: Two-pass Hash Table\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> solveTwoPass(vector<int>& nums, int target) {\n    unordered_map<int, int> map;\n    for (int i = 0; i < nums.size(); i++) map[nums[i]] = i;\n    for (int i = 0; i < nums.size(); i++) {\n        int comp = target - nums[i];\n        if (map.count(comp) && map[comp] != i) return {i, map[comp]};\n    }\n    return {};\n}`
    },
    {
      id: 3,
      title: "3. Sorting + Two Pointers",
      desc: "Sort a vector of pairs (value, index). Place pointers at start and end, stepping inward based on sum vs target.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)",
      code: `// Approach 3: Sorting + Two Pointers\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> solveTwoPointers(vector<int>& nums, int target) {\n    vector<pair<int, int>> v;\n    for (int i = 0; i < nums.size(); i++) v.push_back({nums[i], i});\n    sort(v.begin(), v.end());\n    int l = 0, r = v.size() - 1;\n    while (l < r) {\n        int sum = v[l].first + v[r].first;\n        if (sum == target) return {v[l].second, v[r].second};\n        if (sum < target) l++;\n        else r--;\n    }\n    return {};\n}`
    },
    {
      id: 4,
      title: "4. Binary Search Lookup",
      desc: "For each element, perform binary search in a sorted array to locate the complement index.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)",
      code: `// Approach 4: Binary Search Lookup\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> solveBinarySearch(vector<int>& nums, int target) {\n    vector<pair<int, int>> vec;\n    for(int i=0; i<nums.size(); i++) vec.push_back({nums[i], i});\n    sort(vec.begin(), vec.end());\n    for(int i=0; i<nums.size(); i++) {\n        int wanted = target - vec[i].first;\n        int lo = i + 1, hi = vec.size() - 1;\n        while(lo <= hi) {\n            int mid = lo + (hi - lo)/2;\n            if(vec[mid].first == wanted) return {vec[i].second, vec[mid].second};\n            if(vec[mid].first < wanted) lo = mid + 1;\n            else hi = mid - 1;\n        }\n    }\n    return {};\n}`
    },
    {
      id: 5,
      title: "5. Brute Force Double Loop",
      desc: "Check every possible pair (i, j) with nested loops. Simple but quadratic time complexity.",
      timeComplexity: "O(N²)",
      spaceComplexity: "O(1)",
      code: `// Approach 5: Brute Force\n#include <vector>\nusing namespace std;\n\nvector<int> solveBrute(vector<int>& nums, int target) {\n    for (int i = 0; i < nums.size(); i++) {\n        for (int j = i + 1; j < nums.size(); j++) {\n            if (nums[i] + nums[j] == target) return {i, j};\n        }\n    }\n    return {};\n}`
    },
    {
      id: 6,
      title: "6. STL std::find_if & std::distance",
      desc: "Leverages C++ Standard Library algorithms for concise Functional C++ code.",
      timeComplexity: "O(N²)",
      spaceComplexity: "O(1)",
      code: `// Approach 6: STL Algorithms\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<int> solveSTL(vector<int>& nums, int target) {\n    for (auto it = nums.begin(); it != nums.end(); ++it) {\n        int comp = target - *it;\n        auto match = find(it + 1, nums.end(), comp);\n        if (match != nums.end()) {\n            return { (int)distance(nums.begin(), it), (int)distance(nums.begin(), match) };\n        }\n    }\n    return {};\n}`
    },
    {
      id: "7",
      title: "7. Recursive Subproblem Decomposition",
      desc: "Recursively check pairs from index k to N, shrinking the array boundaries on each frame.",
      timeComplexity: "O(N²)",
      spaceComplexity: "O(N)",
      code: `// Approach 7: Recursive Subproblem\n#include <vector>\nusing namespace std;\n\nvector<int> solveRec(vector<int>& nums, int target, int i = 0) {\n    if (i >= nums.size()) return {};\n    for (int j = i + 1; j < nums.size(); j++) {\n        if (nums[i] + nums[j] == target) return {i, j};\n    }\n    return solveRec(nums, target, i + 1);\n}`
    },
    {
      id: 8,
      title: "8. Bucket / Direct Index Table (Small Integer Bounds)",
      desc: "If values are bounded in a small range, use a direct array mapping for fast indexing.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(MaxVal)",
      code: `// Approach 8: Direct Index Array\n#include <vector>\n#include <cstring>\nusing namespace std;\n\nvector<int> solveBucket(vector<int>& nums, int target) {\n    int bucket[20001];\n    memset(bucket, -1, sizeof(bucket));\n    int offset = 10000;\n    for(int i = 0; i < nums.size(); i++) {\n        int comp = target - nums[i];\n        if (comp >= -10000 && comp <= 10000 && bucket[comp + offset] != -1) {\n            return {bucket[comp + offset], i};\n        }\n        if (nums[i] >= -10000 && nums[i] <= 10000) {\n            bucket[nums[i] + offset] = i;\n        }\n    }\n    return {};\n}`
    },
    {
      id: 9,
      title: "9. Multimap / Multi-value Handling",
      desc: "Handles duplicate values easily using std::unordered_multimap.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(N)",
      code: `// Approach 9: Multimap Implementation\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> solveMultimap(vector<int>& nums, int target) {\n    unordered_multimap<int, int> mm;\n    for(int i = 0; i < nums.size(); i++) mm.insert({nums[i], i});\n    for(int i = 0; i < nums.size(); i++) {\n        int comp = target - nums[i];\n        auto range = mm.equal_range(comp);\n        for(auto it = range.first; it != range.second; ++it) {\n            if(it->second != i) return {i, it->second};\n        }\n    }\n    return {};\n}`
    },
    {
      id: 10,
      title: "10. Modern C++20 Ranges & Structured Bindings",
      desc: "Clean modern C++20 syntax using ranges and structured bindings.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(N)",
      code: `// Approach 10: Modern C++20\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nauto solveCpp20(const vector<int>& nums, int target) -> vector<int> {\n    unordered_map<int, int> seen;\n    for (int i = 0; const auto& val : nums) {\n        if (auto it = seen.find(target - val); it != seen.end()) {\n            return {it->second, i};\n        }\n        seen[val] = i++;\n    }\n    return {};\n}`
    }
  ];

  return {
    ...base,
    problemStatement,
    inputFormat,
    outputFormat,
    exampleCases,
    constraints,
    solutions
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
