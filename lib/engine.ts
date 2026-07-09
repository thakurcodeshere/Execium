// Execium Ω∞ — Execution Engine
import { FOR_LOOP_CODE, FOR_LOOP_STEPS, FACTORIAL_CODE, FACTORIAL_STEPS } from './dense-traces';
export type StepType = 'declaration'|'assignment'|'call'|'return'|'loop'|'compare'|'output'|'alloc'|'dealloc'|'recursion'|'condition';
export type HlColor = 'blue'|'green'|'yellow'|'purple'|'orange'|'red'|'cyan'|'pink';

export interface MemVar { id:string; name:string; type:string; value:string; addr:string; size:number; isPtr?:boolean; pointsTo?:string; isNew?:boolean; isMut?:boolean; scope:string; }
export interface Frame  { id:string; fn:string; vars:MemVar[]; line:number; depth:number; active:boolean; retVal?:string; }
export interface Heap   { id:string; addr:string; size:number; type:string; vals:string[]; freed:boolean; by:string; isNew?:boolean; }
export interface Step   {
  id:string; line:number; code:string; type:StepType; hl:HlColor;
  frames:Frame[]; heap:Heap[]; output:string[];
  explain:string; explainBeg:string; ops:number;
  changed:string[]; newIds:string[];
}

const v=(id:string,name:string,type:string,value:string,addr:string,size:number,opts:Partial<MemVar>={})
  :MemVar=>({id,name,type,value,addr,size,scope:'',isNew:false,isMut:false,...opts});

const f=(id:string,fn:string,line:number,depth:number,vars:MemVar[],active=true,retVal?:string):Frame=>
  ({id,fn,vars,line,depth,active,retVal});

const h=(id:string,addr:string,size:number,type:string,vals:string[],by:string,freed=false,isNew=false):Heap=>
  ({id,addr,size,type,vals,freed,by,isNew});

const s=(id:string,line:number,code:string,type:StepType,hl:HlColor,frames:Frame[],heap:Heap[],output:string[],explain:string,explainBeg:string,ops:number,changed:string[]=[],newIds:string[]=[]):Step=>
  ({id,line,code,type,hl,frames,heap,output,explain,explainBeg,ops,changed,newIds});

/* ─── Programs ─── */
export const PROGRAMS: Record<string,{title:string;category:string;description:string;icon:string;code:string;steps:Step[]}> = {

for_loop: {
  title:'For Loop', category:'Basics', icon:'🔄',
  description:'Every single line of a for loop traced step-by-step: init, condition, body, increment, output.',
  code:FOR_LOOP_CODE, steps:FOR_LOOP_STEPS,
},

factorial: {
  title:'Factorial (Recursion)', category:'Recursion', icon:'🔢',
  description:'Recursive factorial(4) — every line traced: calls, base case, returns, stack collapse.',
  code:FACTORIAL_CODE, steps:FACTORIAL_STEPS,
},


fibonacci: {
  title:'Fibonacci Recursion', category:'Recursion', icon:'🌀',
  description:'Deep recursive call stack with parameter propagation and return-value collapse.',
  code:`#include <iostream>
using namespace std;

int fib(int n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2);
}

int main() {
    int result = fib(5);
    cout << "fib(5) = " << result;
    return 0;
}`,
  steps:[
    s('f0',9,'int result = fib(5);','call','blue',
      [f('main','main',9,0,[],true)],[],[],'Calling fib(5) — new stack frame pushed','We ask: what is the 5th Fibonacci number?',1),
    s('f1',4,'int fib(int n) { // n=5','call','purple',
      [f('main','main',9,0,[],false),
       f('fib5','fib',4,1,[v('n5','n','int','5','0x1004',4,{scope:'fib',isNew:true})],true)],
      [],[],'fib(5) entered — frame depth 1, n=5','A new memory box is created for fib(5) with n=5',2,[],['n5']),
    s('f2',5,'if (n<=1) // 5<=1 → false','compare','blue',
      [f('main','main',9,0,[],false),
       f('fib5','fib',5,1,[v('n5','n','int','5','0x1004',4,{scope:'fib'})],true)],
      [],[],'Base case check: 5≤1 → false. Recurse.','Is n small enough to stop? No! 5>1, keep going.',3),
    s('f3',6,'return fib(n-1) + fib(n-2) → fib(4)','recursion','purple',
      [f('main','main',9,0,[],false),
       f('fib5','fib',6,1,[v('n5','n','int','5','0x1004',4,{scope:'fib'})],false),
       f('fib4','fib',4,2,[v('n4','n','int','4','0x1104',4,{scope:'fib',isNew:true})],true)],
      [],[],'fib(4) called recursively — stack depth: 2','To find fib(5) we need fib(4) first. Stack grows!',4,[],['n4']),
    s('f4',6,'fib(3) called — depth 3','recursion','purple',
      [f('main','main',9,0,[],false),
       f('fib5','fib',6,1,[v('n5','n','int','5','0x1004',4,{scope:'fib'})],false),
       f('fib4','fib',6,2,[v('n4','n','int','4','0x1104',4,{scope:'fib'})],false),
       f('fib3','fib',4,3,[v('n3','n','int','3','0x1204',4,{scope:'fib',isNew:true})],true)],
      [],[],'fib(3) called — stack depth: 3','Getting deeper… fib(5)→fib(4)→fib(3)',5,[],['n3']),
    s('f5',5,'if (n<=1) // n=1 → BASE CASE!','return','green',
      [f('main','main',9,0,[],false),
       f('fib5','fib',6,1,[v('n5','n','int','5','0x1004',4,{scope:'fib'})],false),
       f('fib4','fib',6,2,[v('n4','n','int','4','0x1104',4,{scope:'fib'})],false),
       f('fib3','fib',6,3,[v('n3','n','int','3','0x1204',4,{scope:'fib'})],false),
       f('fib1','fib',5,4,[v('n1','n','int','1','0x1304',4,{scope:'fib'})],true,'1')],
      [],[],'Base case! fib(1)=1 → frame popped, returning 1','Bottom reached! fib(1)=1. Now stack unwinds.',9),
    s('f6',9,'int result = fib(5) // = 5','assignment','green',
      [f('main','main',9,0,[v('res','result','int','5','0x0800',4,{scope:'main',isNew:true})],true)],
      [],[],'All recursion resolved. result = 5 stored in main','Done! fib(5)=5 stored in result.',15,[],['res']),
    s('f7',10,'cout << "fib(5) = " << result','output','cyan',
      [f('main','main',10,0,[v('res','result','int','5','0x0800',4,{scope:'main'})],true)],
      [],['fib(5) = 5'],'Output: "fib(5) = 5" printed to stdout','Printing the answer: fib(5) = 5 ✓',16),
  ]
},

linked_list: {
  title:'Linked List', category:'Data Structures', icon:'🔗',
  description:'Heap-allocated nodes with pointer chain visualization.',
  code:`#include <iostream>
using namespace std;

struct Node { int data; Node* next; };

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
    while (curr) {
        cout << curr->data << " → ";
        curr = curr->next;
    }
    cout << "null";
}`,
  steps:[
    s('l0',13,'Node* head = createNode(1);','alloc','orange',
      [f('main','main',13,0,[v('head','head','Node*','0x2000','0x0800',8,{scope:'main',isNew:true,isPtr:true,pointsTo:'0x2000'})],true)],
      [h('n1','0x2000',16,'Node',['data:1','next:null'],'main',false,true)],
      [],'new Node() allocated at 0x2000. head→0x2000','We create a box in heap memory. head points to it!',3,[],['head','n1']),
    s('l1',14,'head->next = createNode(2);','alloc','orange',
      [f('main','main',14,0,[v('head','head','Node*','0x2000','0x0800',8,{scope:'main',isPtr:true,pointsTo:'0x2000'})],true)],
      [h('n1','0x2000',16,'Node',['data:1','next:0x2010'],'main',false,false),
       h('n2','0x2010',16,'Node',['data:2','next:null'],'main',false,true)],
      [],'Node2 at 0x2010. Node1.next→Node2. Chain begins!','We link box1 to box2 with a pointer arrow!',6,[],['n2']),
    s('l2',15,'head->next->next = createNode(3);','alloc','orange',
      [f('main','main',15,0,[v('head','head','Node*','0x2000','0x0800',8,{scope:'main',isPtr:true,pointsTo:'0x2000'})],true)],
      [h('n1','0x2000',16,'Node',['data:1','next:0x2010'],'main'),
       h('n2','0x2010',16,'Node',['data:2','next:0x2020'],'main',false,false),
       h('n3','0x2020',16,'Node',['data:3','next:null'],'main',false,true)],
      [],'3-node chain: 0x2000→0x2010→0x2020→null','Three boxes chained together! 1→2→3→null',9,[],['n3']),
    s('l3',19,'while(curr) cout<<curr->data','output','green',
      [f('main','main',19,0,[
        v('head','head','Node*','0x2000','0x0800',8,{scope:'main',isPtr:true,pointsTo:'0x2000'}),
        v('curr','curr','Node*','null','0x0808',8,{scope:'main',isPtr:true,isNew:true})
      ],true)],
      [h('n1','0x2000',16,'Node',['data:1','next:0x2010'],'main'),
       h('n2','0x2010',16,'Node',['data:2','next:0x2020'],'main'),
       h('n3','0x2020',16,'Node',['data:3','next:null'],'main')],
      ['1 → ','2 → ','3 → ','null'],'Traversal complete. curr walked all 3 nodes.','Walking the chain: 1→2→3→null ✓',15),
  ]
},

bubble_sort: {
  title:'Bubble Sort', category:'Algorithms', icon:'🫧',
  description:'O(n²) sorting with element comparison and swap visualization.',
  code:`#include <iostream>
using namespace std;

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                swap(arr[j], arr[j+1]);
            }
        }
    }
}

int main() {
    int arr[] = {64, 34, 25, 12, 22};
    bubbleSort(arr, 5);
    for (int x : arr) cout << x << " ";
}`,
  steps:[
    s('b0',15,'int arr[] = {64,34,25,12,22};','declaration','green',
      [f('main','main',15,0,[v('arr','arr','int[]','[64,34,25,12,22]','0x0820',20,{scope:'main',isNew:true})],true)],
      [],[],'Array declared in stack at 0x0820 — 5×4B contiguous','5 boxes in a row in memory, holding the numbers!',1,[],['arr']),
    s('b1',5,'for(int i=0; i<n-1; i++) // Pass 1','loop','blue',
      [f('main','main',16,0,[v('arr','arr','int[]','[64,34,25,12,22]','0x0820',20,{scope:'main'})],false),
       f('bsort','bubbleSort',5,1,[v('i','i','int','0','0x1008',4,{scope:'bsort',isNew:true})],true)],
      [],[],'Outer loop: i=0. Pass 1 — largest bubbles to end.','First pass through the array. Biggest will float up!',2,[],['i']),
    s('b2',7,'arr[0]=64 > arr[1]=34 → SWAP','compare','yellow',
      [f('main','main',16,0,[v('arr','arr','int[]','[34,64,25,12,22]','0x0820',20,{scope:'main',isMut:true})],false),
       f('bsort','bubbleSort',7,1,[
         v('i','i','int','0','0x1008',4,{scope:'bsort'}),
         v('j','j','int','0','0x100C',4,{scope:'bsort',isNew:true}),
       ],true)],
      [],[],'64>34 → swap! arr becomes [34,64,25,12,22]','64 is bigger than 34 — they swap places!',4,['arr'],['j']),
    s('b3',7,'arr[1]=64 > arr[2]=25 → SWAP','compare','yellow',
      [f('main','main',16,0,[v('arr','arr','int[]','[34,25,64,12,22]','0x0820',20,{scope:'main',isMut:true})],false),
       f('bsort','bubbleSort',7,1,[v('i','i','int','0','0x1008',4,{scope:'bsort'}),v('j','j','int','1','0x100C',4,{scope:'bsort',isMut:true})],true)],
      [],[],'64>25 → swap! arr becomes [34,25,64,12,22]','64 keeps bubbling rightward — it\'s the biggest!',6,['arr']),
    s('b4',19,'Output sorted array','output','green',
      [f('main','main',19,0,[v('arr','arr','int[]','[12,22,25,34,64]','0x0820',20,{scope:'main',isMut:true})],true)],
      [],['12 22 25 34 64 '],'Sorted! All passes complete. arr = [12,22,25,34,64]','Array perfectly sorted smallest→largest ✓',25,['arr']),
  ]
},

smart_ptr: {
  title:'Smart Pointers', category:'Memory', icon:'🧠',
  description:'RAII ownership, unique_ptr lifetime, and automatic deallocation.',
  code:`#include <iostream>
#include <memory>
using namespace std;

struct Resource {
    int value;
    Resource(int v) : value(v) {
        cout << "Resource(" << v << ") created\\n";
    }
    ~Resource() {
        cout << "Resource(" << value << ") destroyed\\n";
    }
};

int main() {
    {
        unique_ptr<Resource> p = make_unique<Resource>(42);
        cout << "value = " << p->value << "\\n";
    } // p goes out of scope → auto destroy
    cout << "After scope\\n";
}`,
  steps:[
    s('sp0',18,'auto p = make_unique<Resource>(42)','alloc','orange',
      [f('main','main',18,0,[v('p','p','unique_ptr<Resource>','0x3000','0x0800',8,{scope:'main',isNew:true,isPtr:true,pointsTo:'0x3000'})],true)],
      [h('r1','0x3000',4,'Resource',['value:42'],'make_unique',false,true)],
      ['Resource(42) created'],'make_unique heap-allocates Resource(42). unique_ptr owns it exclusively.','A smart pointer is created — it OWNS the Resource box.',3,[],['p','r1']),
    s('sp1',19,'cout << p->value','output','cyan',
      [f('main','main',19,0,[v('p','p','unique_ptr<Resource>','0x3000','0x0800',8,{scope:'main',isPtr:true,pointsTo:'0x3000'})],true)],
      [h('r1','0x3000',4,'Resource',['value:42'],'make_unique')],
      ['Resource(42) created','value = 42'],'p->value dereferences the unique_ptr, reading 42.','We peek inside the box through the smart pointer.',4),
    s('sp2',20,'} // p leaves scope → destructor','dealloc','red',
      [f('main','main',21,0,[],true)],
      [h('r1','0x3000',4,'Resource',['value:42'],'make_unique',true)],
      ['Resource(42) created','value = 42','Resource(42) destroyed'],'Scope ends → unique_ptr destructor called → heap memory freed automatically!','Magic! When p disappears, it automatically frees the memory. No memory leak!',6),
    s('sp3',21,'cout << "After scope"','output','green',
      [f('main','main',21,0,[],true)],
      [],['Resource(42) created','value = 42','Resource(42) destroyed','After scope'],'Program continues. Heap is clean — no leaks. RAII guarantee.','Heap is clean. Smart pointers prevent ALL memory leaks. ✓',7),
  ]
},

binary_search: {
  title:'Binary Search', category:'Algorithms', icon:'🔍',
  description:'O(log n) divide-and-conquer search with search-space visualization.',
  code:`#include <iostream>
using namespace std;

int binarySearch(int arr[], int n, int target) {
    int lo = 0, hi = n - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}

int main() {
    int arr[] = {2, 5, 9, 13, 21, 37, 45, 68};
    int idx = binarySearch(arr, 8, 21);
    cout << "Found at index " << idx;
}`,
  steps:[
    s('bs0',15,'int arr[]={2,5,9,13,21,37,45,68}','declaration','green',
      [f('main','main',15,0,[v('arr','arr','int[]','[2,5,9,13,21,37,45,68]','0x0820',32,{scope:'main',isNew:true})],true)],
      [],[],'Sorted array of 8 ints declared in stack memory','We have 8 sorted boxes in memory. Finding 21.',1,[],['arr']),
    s('bs1',5,'lo=0 hi=7 mid=3 arr[3]=13<21→lo=4','loop','blue',
      [f('main','main',16,0,[v('arr','arr','int[]','[...]','0x0820',32,{scope:'main'})],false),
       f('bsrch','binarySearch',5,1,[
         v('lo','lo','int','4','0x1008',4,{scope:'bsrch',isNew:true,isMut:true}),
         v('hi','hi','int','7','0x100C',4,{scope:'bsrch',isNew:true}),
         v('mid','mid','int','3','0x1010',4,{scope:'bsrch',isNew:true}),
       ],true)],
      [],[],'Pass 1: mid=3, arr[3]=13 < 21 → search right half','We check the middle: 13 < 21, so 21 must be on the right!',3,[],['lo','hi','mid']),
    s('bs2',5,'lo=4 hi=7 mid=5 arr[5]=37>21→hi=4','loop','yellow',
      [f('main','main',16,0,[v('arr','arr','int[]','[...]','0x0820',32,{scope:'main'})],false),
       f('bsrch','binarySearch',5,1,[
         v('lo','lo','int','4','0x1008',4,{scope:'bsrch',isMut:true}),
         v('hi','hi','int','4','0x100C',4,{scope:'bsrch',isMut:true}),
         v('mid','mid','int','5','0x1010',4,{scope:'bsrch',isMut:true}),
       ],true)],
      [],[],'Pass 2: mid=5, arr[5]=37 > 21 → search left half','37 is too big! 21 must be to the left.',5,['lo','hi','mid']),
    s('bs3',7,'arr[4]=21 == target → return 4','return','green',
      [f('main','main',16,0,[v('arr','arr','int[]','[...]','0x0820',32,{scope:'main'})],false),
       f('bsrch','binarySearch',7,1,[
         v('lo','lo','int','4','0x1008',4,{scope:'bsrch'}),
         v('hi','hi','int','4','0x100C',4,{scope:'bsrch'}),
         v('mid','mid','int','4','0x1010',4,{scope:'bsrch',isMut:true}),
       ],true,'4')],
      [],[],'Found! arr[4]=21 matches target. Return index 4.','Found it at index 4! Only 3 steps to find from 8 elements. O(log n)!',7),
    s('bs4',17,'cout << "Found at index " << idx','output','cyan',
      [f('main','main',17,0,[
        v('arr','arr','int[]','[...]','0x0820',32,{scope:'main'}),
        v('idx','idx','int','4','0x0810',4,{scope:'main',isNew:true}),
      ],true)],
      [],['Found at index 4'],'Binary search complete in O(log₂8)=3 iterations.','Done in just 3 checks. Binary search is super fast! ✓',8,[],['idx']),
  ]
},
};

export const getProgramList = () =>
  Object.entries(PROGRAMS).map(([id,p])=>({id,title:p.title,category:p.category,icon:p.icon,description:p.description}));
