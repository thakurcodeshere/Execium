// Dense line-by-line traces for Execium
import { Step, Frame, MemVar, Heap, StepType, HlColor } from './engine';

const v=(id:string,name:string,type:string,value:string,addr:string,size:number,opts:Partial<MemVar>={}):MemVar=>({id,name,type,value,addr,size,scope:'',isNew:false,isMut:false,...opts});
const f=(id:string,fn:string,line:number,depth:number,vars:MemVar[],active=true,retVal?:string):Frame=>({id,fn,vars,line,depth,active,retVal});
const s=(id:string,line:number,code:string,type:StepType,hl:HlColor,frames:Frame[],heap:Heap[],output:string[],explain:string,explainBeg:string,ops:number,changed:string[]=[],newIds:string[]=[]):Step=>({id,line,code,type,hl,frames,heap,output,explain,explainBeg,ops,changed,newIds});

export const FOR_LOOP_CODE = `#include <iostream>
using namespace std;

int main() {
    int sum = 0;
    for (int i = 1; i <= 5; i++) {
        sum = sum + i;
        cout << "i=" << i << " sum=" << sum << endl;
    }
    cout << "Final: " << sum << endl;
    return 0;
}`;

export const FOR_LOOP_STEPS: Step[] = [
  s('fl0', 4, 'int main() {', 'call', 'blue', [f('m','main',4,0,[],true)], [], [],
    'main() entered — program starts here', 'Program begins! main() is called.', 1),

  s('fl1', 5, 'int sum = 0;', 'declaration', 'green',
    [f('m','main',5,0,[v('sum','sum','int','0','0x100',4,{scope:'main',isNew:true})],true)], [], [],
    'sum declared and initialized to 0 on the stack', 'sum is created in memory and set to 0.', 2, [], ['sum']),

  s('fl2', 6, 'for (int i = 1; ...)', 'declaration', 'blue',
    [f('m','main',6,0,[v('sum','sum','int','0','0x100',4,{scope:'main'}),v('i','i','int','1','0x104',4,{scope:'main',isNew:true})],true)], [], [],
    'Loop init: i declared = 1', 'Loop starts! i is created and set to 1.', 3, [], ['i']),

  s('fl3', 6, 'i <= 5  →  1 <= 5  →  true', 'compare', 'yellow',
    [f('m','main',6,0,[v('sum','sum','int','0','0x100',4,{scope:'main'}),v('i','i','int','1','0x104',4,{scope:'main'})],true)], [], [],
    'Condition check: 1 ≤ 5 → true. Enter loop body.', '1 ≤ 5 is true, so we go inside the loop!', 4),

  s('fl4', 7, 'sum = sum + i  →  sum = 0 + 1 = 1', 'assignment', 'green',
    [f('m','main',7,0,[v('sum','sum','int','1','0x100',4,{scope:'main',isMut:true}),v('i','i','int','1','0x104',4,{scope:'main'})],true)], [], [],
    'sum = 0 + 1 = 1. sum updated.', 'sum gets i added to it: 0+1=1', 5, ['sum']),

  s('fl5', 8, 'cout << "i=1 sum=1"', 'output', 'cyan',
    [f('m','main',8,0,[v('sum','sum','int','1','0x100',4,{scope:'main'}),v('i','i','int','1','0x104',4,{scope:'main'})],true)], [],
    ['i=1 sum=1'],
    'Line 8 outputs: i=1 sum=1 to stdout', 'Printing current values of i and sum.', 6),

  s('fl6', 6, 'i++  →  i = 2', 'assignment', 'blue',
    [f('m','main',6,0,[v('sum','sum','int','1','0x100',4,{scope:'main'}),v('i','i','int','2','0x104',4,{scope:'main',isMut:true})],true)], [],
    ['i=1 sum=1'],
    'i incremented: i = 2', 'i goes up by 1, now i=2.', 7, ['i']),

  s('fl7', 6, 'i <= 5  →  2 <= 5  →  true', 'compare', 'yellow',
    [f('m','main',6,0,[v('sum','sum','int','1','0x100',4,{scope:'main'}),v('i','i','int','2','0x104',4,{scope:'main'})],true)], [],
    ['i=1 sum=1'],
    'Condition: 2 ≤ 5 → true. Loop continues.', '2 ≤ 5, still true — keep looping!', 8),

  s('fl8', 7, 'sum = 1 + 2 = 3', 'assignment', 'green',
    [f('m','main',7,0,[v('sum','sum','int','3','0x100',4,{scope:'main',isMut:true}),v('i','i','int','2','0x104',4,{scope:'main'})],true)], [],
    ['i=1 sum=1'],
    'sum = 1 + 2 = 3', 'sum now equals 3!', 9, ['sum']),

  s('fl9', 8, 'cout << "i=2 sum=3"', 'output', 'cyan',
    [f('m','main',8,0,[v('sum','sum','int','3','0x100',4,{scope:'main'}),v('i','i','int','2','0x104',4,{scope:'main'})],true)], [],
    ['i=1 sum=1','i=2 sum=3'],
    'Line 8 outputs: i=2 sum=3', 'Printing: i=2 sum=3', 10),

  s('fl10', 6, 'i++  →  i = 3', 'assignment', 'blue',
    [f('m','main',6,0,[v('sum','sum','int','3','0x100',4,{scope:'main'}),v('i','i','int','3','0x104',4,{scope:'main',isMut:true})],true)], [],
    ['i=1 sum=1','i=2 sum=3'],
    'i = 3', 'i goes up to 3.', 11, ['i']),

  s('fl11', 6, 'i <= 5  →  3 <= 5  →  true', 'compare', 'yellow',
    [f('m','main',6,0,[v('sum','sum','int','3','0x100',4,{scope:'main'}),v('i','i','int','3','0x104',4,{scope:'main'})],true)], [],
    ['i=1 sum=1','i=2 sum=3'],
    'Condition: 3 ≤ 5 → true.', '3 ≤ 5 still true — another iteration!', 12),

  s('fl12', 7, 'sum = 3 + 3 = 6', 'assignment', 'green',
    [f('m','main',7,0,[v('sum','sum','int','6','0x100',4,{scope:'main',isMut:true}),v('i','i','int','3','0x104',4,{scope:'main'})],true)], [],
    ['i=1 sum=1','i=2 sum=3'],
    'sum = 3 + 3 = 6', 'sum is now 6!', 13, ['sum']),

  s('fl13', 8, 'cout << "i=3 sum=6"', 'output', 'cyan',
    [f('m','main',8,0,[v('sum','sum','int','6','0x100',4,{scope:'main'}),v('i','i','int','3','0x104',4,{scope:'main'})],true)], [],
    ['i=1 sum=1','i=2 sum=3','i=3 sum=6'],
    'Output: i=3 sum=6', 'Printing: i=3 sum=6', 14),

  s('fl14', 6, 'i++  →  i = 4', 'assignment', 'blue',
    [f('m','main',6,0,[v('sum','sum','int','6','0x100',4,{scope:'main'}),v('i','i','int','4','0x104',4,{scope:'main',isMut:true})],true)], [],
    ['i=1 sum=1','i=2 sum=3','i=3 sum=6'],
    'i = 4', 'i becomes 4.', 15, ['i']),

  s('fl15', 6, 'i <= 5  →  4 <= 5  →  true', 'compare', 'yellow',
    [f('m','main',6,0,[v('sum','sum','int','6','0x100',4,{scope:'main'}),v('i','i','int','4','0x104',4,{scope:'main'})],true)], [],
    ['i=1 sum=1','i=2 sum=3','i=3 sum=6'],
    'Condition: 4 ≤ 5 → true.', '4 ≤ 5 — one more iteration!', 16),

  s('fl16', 7, 'sum = 6 + 4 = 10', 'assignment', 'green',
    [f('m','main',7,0,[v('sum','sum','int','10','0x100',4,{scope:'main',isMut:true}),v('i','i','int','4','0x104',4,{scope:'main'})],true)], [],
    ['i=1 sum=1','i=2 sum=3','i=3 sum=6'],
    'sum = 6 + 4 = 10', 'sum becomes 10!', 17, ['sum']),

  s('fl17', 8, 'cout << "i=4 sum=10"', 'output', 'cyan',
    [f('m','main',8,0,[v('sum','sum','int','10','0x100',4,{scope:'main'}),v('i','i','int','4','0x104',4,{scope:'main'})],true)], [],
    ['i=1 sum=1','i=2 sum=3','i=3 sum=6','i=4 sum=10'],
    'Output: i=4 sum=10', 'Printing: i=4 sum=10', 18),

  s('fl18', 6, 'i++  →  i = 5', 'assignment', 'blue',
    [f('m','main',6,0,[v('sum','sum','int','10','0x100',4,{scope:'main'}),v('i','i','int','5','0x104',4,{scope:'main',isMut:true})],true)], [],
    ['i=1 sum=1','i=2 sum=3','i=3 sum=6','i=4 sum=10'],
    'i = 5', 'i becomes 5.', 19, ['i']),

  s('fl19', 6, 'i <= 5  →  5 <= 5  →  true', 'compare', 'yellow',
    [f('m','main',6,0,[v('sum','sum','int','10','0x100',4,{scope:'main'}),v('i','i','int','5','0x104',4,{scope:'main'})],true)], [],
    ['i=1 sum=1','i=2 sum=3','i=3 sum=6','i=4 sum=10'],
    'Condition: 5 ≤ 5 → true. Last iteration!', '5 ≤ 5 — this is the final loop!', 20),

  s('fl20', 7, 'sum = 10 + 5 = 15', 'assignment', 'green',
    [f('m','main',7,0,[v('sum','sum','int','15','0x100',4,{scope:'main',isMut:true}),v('i','i','int','5','0x104',4,{scope:'main'})],true)], [],
    ['i=1 sum=1','i=2 sum=3','i=3 sum=6','i=4 sum=10'],
    'sum = 10 + 5 = 15 (1+2+3+4+5)', 'sum is now 15 — that\'s 1+2+3+4+5!', 21, ['sum']),

  s('fl21', 8, 'cout << "i=5 sum=15"', 'output', 'cyan',
    [f('m','main',8,0,[v('sum','sum','int','15','0x100',4,{scope:'main'}),v('i','i','int','5','0x104',4,{scope:'main'})],true)], [],
    ['i=1 sum=1','i=2 sum=3','i=3 sum=6','i=4 sum=10','i=5 sum=15'],
    'Output: i=5 sum=15', 'Printing: i=5 sum=15', 22),

  s('fl22', 6, 'i++  →  i = 6', 'assignment', 'blue',
    [f('m','main',6,0,[v('sum','sum','int','15','0x100',4,{scope:'main'}),v('i','i','int','6','0x104',4,{scope:'main',isMut:true})],true)], [],
    ['i=1 sum=1','i=2 sum=3','i=3 sum=6','i=4 sum=10','i=5 sum=15'],
    'i incremented to 6', 'i becomes 6.', 23, ['i']),

  s('fl23', 6, 'i <= 5  →  6 <= 5  →  false', 'compare', 'red',
    [f('m','main',6,0,[v('sum','sum','int','15','0x100',4,{scope:'main'}),v('i','i','int','6','0x104',4,{scope:'main'})],true)], [],
    ['i=1 sum=1','i=2 sum=3','i=3 sum=6','i=4 sum=10','i=5 sum=15'],
    'Condition: 6 ≤ 5 → false! Loop exits.', '6 > 5, loop is done! Exiting.', 24),

  s('fl24', 10, 'cout << "Final: 15"', 'output', 'green',
    [f('m','main',10,0,[v('sum','sum','int','15','0x100',4,{scope:'main'})],true)], [],
    ['i=1 sum=1','i=2 sum=3','i=3 sum=6','i=4 sum=10','i=5 sum=15','Final: 15'],
    'Final output: sum = 15 (1+2+3+4+5)', 'Printing the final answer: 15!', 25),

  s('fl25', 11, 'return 0;', 'return', 'blue',
    [f('m','main',11,0,[],true,'0')], [],
    ['i=1 sum=1','i=2 sum=3','i=3 sum=6','i=4 sum=10','i=5 sum=15','Final: 15'],
    'main() returns 0 — program exits successfully.', 'Program done! return 0 means success.', 26),
];

export const FACTORIAL_CODE = `#include <iostream>
using namespace std;

int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}

int main() {
    int result = factorial(4);
    cout << "4! = " << result << endl;
    return 0;
}`;

export const FACTORIAL_STEPS: Step[] = [
  s('fc0', 9, 'int main() {', 'call', 'blue', [f('m','main',9,0,[],true)], [], [],
    'main() starts execution', 'Program begins!', 1),
  s('fc1', 10, 'factorial(4) called', 'call', 'purple',
    [f('m','main',10,0,[],false), f('f4','factorial',4,1,[v('n4','n','int','4','0x200',4,{scope:'factorial',isNew:true})],true)], [], [],
    'factorial(4): new frame pushed, n=4', 'Calling factorial with n=4. New stack frame!', 2,[],['n4']),
  s('fc2', 5, 'n==0? → 4==0 → false', 'compare', 'yellow',
    [f('m','main',10,0,[],false), f('f4','factorial',5,1,[v('n4','n','int','4','0x200',4,{scope:'factorial'})],true)], [], [],
    'n=4, not 0. No base case. Continue recursing.', '4 is not 0, so we recurse deeper.', 3),
  s('fc3', 6, 'factorial(3) called', 'recursion', 'purple',
    [f('m','main',10,0,[],false), f('f4','factorial',6,1,[v('n4','n','int','4','0x200',4,{scope:'factorial'})],false),
     f('f3','factorial',4,2,[v('n3','n','int','3','0x300',4,{scope:'factorial',isNew:true})],true)], [], [],
    'factorial(3): stack depth 2, n=3', 'Going deeper: factorial(3)! Stack grows.', 4,[],['n3']),
  s('fc4', 5, 'n==0? → 3==0 → false', 'compare', 'yellow',
    [f('m','main',10,0,[],false), f('f4','factorial',6,1,[v('n4','n','int','4','0x200',4,{scope:'factorial'})],false),
     f('f3','factorial',5,2,[v('n3','n','int','3','0x300',4,{scope:'factorial'})],true)], [], [],
    'n=3, not 0. Keep recursing.', '3 is not 0, go deeper!', 5),
  s('fc5', 6, 'factorial(2) called', 'recursion', 'purple',
    [f('m','main',10,0,[],false), f('f4','factorial',6,1,[v('n4','n','int','4','0x200',4,{scope:'factorial'})],false),
     f('f3','factorial',6,2,[v('n3','n','int','3','0x300',4,{scope:'factorial'})],false),
     f('f2','factorial',4,3,[v('n2','n','int','2','0x400',4,{scope:'factorial',isNew:true})],true)], [], [],
    'factorial(2): stack depth 3', 'Stack depth 3 — factorial(2)!', 6,[],['n2']),
  s('fc6', 5, 'n==0? → 2==0 → false', 'compare', 'yellow',
    [f('m','main',10,0,[],false), f('f4','factorial',6,1,[v('n4','n','int','4','0x200',4,{scope:'factorial'})],false),
     f('f3','factorial',6,2,[v('n3','n','int','3','0x300',4,{scope:'factorial'})],false),
     f('f2','factorial',5,3,[v('n2','n','int','2','0x400',4,{scope:'factorial'})],true)], [], [],
    'n=2, not 0. Recurse.', '2 is not 0. One more level!', 7),
  s('fc7', 6, 'factorial(1) called', 'recursion', 'purple',
    [f('m','main',10,0,[],false), f('f4','factorial',6,1,[v('n4','n','int','4','0x200',4,{scope:'factorial'})],false),
     f('f3','factorial',6,2,[v('n3','n','int','3','0x300',4,{scope:'factorial'})],false),
     f('f2','factorial',6,3,[v('n2','n','int','2','0x400',4,{scope:'factorial'})],false),
     f('f1','factorial',4,4,[v('n1','n','int','1','0x500',4,{scope:'factorial',isNew:true})],true)], [], [],
    'factorial(1): stack depth 4', 'Going deeper still — factorial(1)!', 8,[],['n1']),
  s('fc8', 5, 'n==0? → 1==0 → false', 'compare', 'yellow',
    [f('m','main',10,0,[],false), f('f4','factorial',6,1,[v('n4','n','int','4','0x200',4,{scope:'factorial'})],false),
     f('f3','factorial',6,2,[v('n3','n','int','3','0x300',4,{scope:'factorial'})],false),
     f('f2','factorial',6,3,[v('n2','n','int','2','0x400',4,{scope:'factorial'})],false),
     f('f1','factorial',5,4,[v('n1','n','int','1','0x500',4,{scope:'factorial'})],true)], [], [],
    'n=1, not 0. Recurse one more time.', '1 is not 0, one more!', 9),
  s('fc9', 6, 'factorial(0) → BASE CASE!', 'recursion', 'green',
    [f('m','main',10,0,[],false), f('f4','factorial',6,1,[v('n4','n','int','4','0x200',4,{scope:'factorial'})],false),
     f('f3','factorial',6,2,[v('n3','n','int','3','0x300',4,{scope:'factorial'})],false),
     f('f2','factorial',6,3,[v('n2','n','int','2','0x400',4,{scope:'factorial'})],false),
     f('f1','factorial',6,4,[v('n1','n','int','1','0x500',4,{scope:'factorial'})],false),
     f('f0','factorial',5,5,[v('n0','n','int','0','0x600',4,{scope:'factorial'})],true,'1')], [], [],
    'factorial(0)=1 → BASE CASE! Return 1. Stack unwinds now!', 'n=0! Base case hit. Returning 1. Stack will now collapse!', 10),
  s('fc10', 6, 'return 1*1=1 → factorial(1)=1', 'return', 'green',
    [f('m','main',10,0,[],false), f('f4','factorial',6,1,[v('n4','n','int','4','0x200',4,{scope:'factorial'})],false),
     f('f3','factorial',6,2,[v('n3','n','int','3','0x300',4,{scope:'factorial'})],false),
     f('f2','factorial',6,3,[v('n2','n','int','2','0x400',4,{scope:'factorial'})],false),
     f('f1','factorial',6,4,[v('n1','n','int','1','0x500',4,{scope:'factorial'})],true,'1')], [], [],
    'factorial(1) = 1×1 = 1. Frame popped.', '1 × 1 = 1. Stack shrinks!', 11),
  s('fc11', 6, 'return 2*1=2 → factorial(2)=2', 'return', 'green',
    [f('m','main',10,0,[],false), f('f4','factorial',6,1,[v('n4','n','int','4','0x200',4,{scope:'factorial'})],false),
     f('f3','factorial',6,2,[v('n3','n','int','3','0x300',4,{scope:'factorial'})],false),
     f('f2','factorial',6,3,[v('n2','n','int','2','0x400',4,{scope:'factorial'})],true,'2')], [], [],
    'factorial(2) = 2×1 = 2. Frame popped.', '2 × 1 = 2. Stack shrinks more!', 12),
  s('fc12', 6, 'return 3*2=6 → factorial(3)=6', 'return', 'green',
    [f('m','main',10,0,[],false), f('f4','factorial',6,1,[v('n4','n','int','4','0x200',4,{scope:'factorial'})],false),
     f('f3','factorial',6,2,[v('n3','n','int','3','0x300',4,{scope:'factorial'})],true,'6')], [], [],
    'factorial(3) = 3×2 = 6. Frame popped.', '3 × 2 = 6. Almost done!', 13),
  s('fc13', 6, 'return 4*6=24 → factorial(4)=24', 'return', 'green',
    [f('m','main',10,0,[v('r','result','int','24','0x100',4,{scope:'main',isNew:true})],true)], [], [],
    'factorial(4) = 4×6 = 24. All frames popped. result=24.', '4 × 6 = 24. Stack fully collapsed! result=24 ✓', 14,[],['r']),
  s('fc14', 11, 'cout << "4! = 24"', 'output', 'cyan',
    [f('m','main',11,0,[v('r','result','int','24','0x100',4,{scope:'main'})],true)], [],
    ['4! = 24'],
    'Outputs "4! = 24" to console.', 'Printing the answer: 4! = 24 ✓', 15),
  s('fc15', 12, 'return 0;', 'return', 'blue',
    [f('m','main',12,0,[],true,'0')], [],
    ['4! = 24'],
    'Program exits with code 0.', 'Done! Program exits successfully.', 16),
];
