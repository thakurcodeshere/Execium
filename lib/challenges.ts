export interface CodingChallenge {
  id: string;
  title: string;
  desc: string;
  difficulty: 'easy' | 'medium' | 'hard';
  code: string;
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
