React轮子模拟
====
[参考链接](https://github.com/hujiulong/blog/issues/4)

运行命令：
parcel index.html

[diff算法参考链接](https://blog.csdn.net/qq_26708777/article/details/78107577)
react diff算法的核心是同级比较
1.类型不同
如果类型不同，就会直接删除
如果类型相同，就会比较children和attributes一一更新。
2.辅助方法：key，shouldComponetUpdate
key相同就会比较key相同的两个节点
如果shouldComponetUpdate是false，就减少了一层更新。

key的作用
React官方文档提示我们应该使用key属性来解决上述问题。key是一个字符串，用来唯一标识同层级的兄弟元素。当React作diff时，只要子元素有key属性，便会去原v-dom树中相应位置（当前横向比较的层级）寻找是否有同key元素，比较它们是否完全相同，若是则复用该元素，免去不必要的操作。

React轮子模拟常用的方案：
1.实际的DOM元素和虚拟的DOM元素进行比对，对比过程中直接更新react。（preact）
2.也有用虚拟的DOM元素之间进行比较，得到patches，然后把patches更新到实际的DOM中。（inferno， react-lite）

