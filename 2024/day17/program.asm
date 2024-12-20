bst a     // b = a % 8
bxl 3     // b ^= 3
cdv b     // c = a / 2^b
bxc       // b ^= c
adv 3     // a = a / 2^3
bxl 5     // b ^= 5
out b     // out b % 8
jnz 0     // goto 0 if a != 0

Need to output 2,4,1,3,7,5,4,7,0,3,1,5,5,5,3,0

b = (x % 8 xor 3) xor (x / 2 ^ (x % 8 xor 3)) xor 5 % 8


    a       b       c       out
    1241950 0       0
1           6
2           5
3                   38810
4           38815
5   155243    
6           38810
7                           2

    a       b       c       out
    708934  0       0
1           6
2           5
3                   38810
4           38815
5   155243    
6           38810
7                           2