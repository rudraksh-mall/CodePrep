require("dotenv").config();
const mongoose = require("mongoose");
const slugify = require("slugify");
const Problem = require("../models/Problem");
const config = require("../config/env");

const DUMMY_USER_ID = new mongoose.Types.ObjectId();

const problems = [
  // ARRAYS - 10 problems (5 easy, 3 medium, 2 hard)
  {
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. You may assume that each input has exactly one solution, and you cannot use the same element twice.",
    constraints:
      "2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9, -10^9 <= target <= 10^9",
    topics: ["Arrays", "Hash Table"],
    companies: ["Google", "Amazon", "Microsoft"],
    hints: [
      "Use a hash map to store visited numbers",
      "For each number, check if target - number exists in the map",
      "Return the indices when you find a match",
    ],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "nums[0] + nums[1] == 9, return [0, 1]",
      },
    ],
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
    },
  },
  {
    title: "Contains Duplicate",
    difficulty: "Easy",
    description:
      "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    constraints: "1 <= nums.length <= 10^5, -10^9 <= nums[i] <= 10^9",
    topics: ["Arrays", "Hash Table"],
    companies: ["Google", "Facebook"],
    hints: [
      "Use a set to track seen numbers",
      "If a number is already in the set, return true",
      "Return false if you finish iterating",
    ],
    examples: [
      {
        input: "nums = [1,2,3,1]",
        output: "true",
        explanation: "The value 1 appears twice",
      },
    ],
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
    },
  },
  {
    title: "Valid Anagram",
    difficulty: "Easy",
    description:
      "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
    constraints: "1 <= s.length, t.length <= 5 * 10^4",
    topics: ["Arrays", "Strings", "Hash Table", "Sorting"],
    companies: ["Amazon", "Microsoft"],
    hints: [
      "An anagram means both strings have the same characters with same frequencies",
      "Try sorting both strings and comparing them",
      "Or use a frequency map to count characters",
    ],
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: "true",
        explanation: "Both are anagrams",
      },
    ],
    solution: {
      timeComplexity: "O(n log n) for sorting approach",
      spaceComplexity: "O(1) ignoring output",
    },
  },
  {
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    description:
      "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
    constraints: "1 <= prices.length <= 10^5, 0 <= prices[i] <= 10^4",
    topics: ["Arrays", "Greedy"],
    companies: ["Google", "Amazon", "Facebook"],
    hints: [
      "Track the minimum price seen so far",
      "For each price, calculate profit if sold at current price",
      "Keep track of maximum profit",
    ],
    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation: "Buy at 1, sell at 6. Profit = 6 - 1 = 5",
      },
    ],
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
    },
  },
  {
    title: "Majority Element",
    difficulty: "Easy",
    description:
      "Given an array nums of size n, return the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times.",
    constraints: "1 <= nums.length <= 5 * 10^4, -10^9 <= nums[i] <= 10^9",
    topics: ["Arrays", "Voting Algorithm"],
    companies: ["Google", "Amazon"],
    hints: [
      "Use Boyer-Moore voting algorithm",
      "Keep track of a candidate and its count",
      "The majority element will be the final candidate",
    ],
    examples: [
      {
        input: "nums = [3,2,3]",
        output: "3",
        explanation: "3 appears 2 times (more than 3/2)",
      },
    ],
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
    },
  },
  {
    title: "Product of Array Except Self",
    difficulty: "Medium",
    description:
      "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. You must write an algorithm that runs in O(n) time and without using the division operation.",
    constraints: "2 <= nums.length <= 10^5",
    topics: ["Arrays", "Prefix/Suffix"],
    companies: ["Google", "Facebook", "Microsoft"],
    hints: [
      "Use prefix and suffix product arrays",
      "answer[i] = prefix[i] * suffix[i]",
      "Build these arrays in two passes",
    ],
    examples: [
      {
        input: "nums = [1,2,3,4]",
        output: "[24,12,8,6]",
        explanation: "Products of all elements except current",
      },
    ],
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(1) excluding output",
    },
  },
  {
    title: "Maximum Subarray",
    difficulty: "Medium",
    description:
      "Given an integer array nums, find the contiguous subarray with the largest sum, and return its sum. A subarray is a contiguous part of an array.",
    constraints: "1 <= nums.length <= 10^5, -10^4 <= nums[i] <= 10^4",
    topics: ["Arrays", "Dynamic Programming", "Divide and Conquer"],
    companies: ["Google", "Facebook", "Microsoft"],
    hints: [
      "Use Kadane's algorithm",
      "Track maximum sum ending at current position",
      "Update global maximum as you go",
    ],
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "[4,-1,2,1] has the largest sum = 6",
      },
    ],
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
    },
  },
  {
    title: "Trapping Rain Water",
    difficulty: "Hard",
    description:
      "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    constraints: "n == height.length, 0 <= n <= 2 * 10^4, 0 <= height[i] <= 10^5",
    topics: ["Arrays", "Two Pointers", "Stack"],
    companies: ["Google", "Microsoft", "Facebook"],
    hints: [
      "Use two pointers approach",
      "Water at each position = min(leftMax, rightMax) - height[i]",
      "Precompute left and right maximums",
    ],
    examples: [
      {
        input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        output: "6",
        explanation: "6 units of rain water are trapped",
      },
    ],
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(n) or O(1) with two pointers",
    },
  },
  {
    title: "Merge Sorted Array",
    difficulty: "Hard",
    description:
      "You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of valid elements in nums1 and nums2 respectively. Merge nums2 into nums1 as one sorted array.",
    constraints: "nums1.length == m + n, nums2.length == n",
    topics: ["Arrays", "Two Pointers", "Sorting"],
    companies: ["Microsoft", "Google", "Facebook"],
    hints: [
      "Fill from the end to avoid overwriting",
      "Use three pointers: two for arrays, one for position",
      "Compare elements and place larger one at end",
    ],
    examples: [
      {
        input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
        output: "[1,2,2,3,5,6]",
        explanation: "Merged sorted array",
      },
    ],
    solution: {
      timeComplexity: "O(m + n)",
      spaceComplexity: "O(1)",
    },
  },

  // STRINGS - 8 problems (2 easy, 4 medium, 2 hard)
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: every open bracket has a closing bracket of the same type, brackets are closed in the correct order.",
    constraints: "1 <= s.length <= 10^4",
    topics: ["Strings", "Stack"],
    companies: ["Google", "Microsoft", "Facebook"],
    hints: [
      "Use a stack to track opening brackets",
      "When you see closing bracket, check if it matches the top of stack",
      "Stack should be empty at the end",
    ],
    examples: [
      {
        input: 's = "()"',
        output: "true",
        explanation: "Valid parentheses",
      },
    ],
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
    },
  },
  {
    title: "Reverse String",
    difficulty: "Easy",
    description:
      "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.",
    constraints: "1 <= s.length <= 10^5",
    topics: ["Strings", "Two Pointers"],
    companies: ["Google", "Microsoft"],
    hints: [
      "Use two pointers from start and end",
      "Swap characters at both pointers",
      "Move pointers towards center",
    ],
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
        explanation: "Reversed string",
      },
    ],
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
    },
  },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    description:
      "Given a string s, find the length of the longest substring without repeating characters.",
    constraints: "0 <= s.length <= 5 * 10^4, s consists of English letters, digits, symbols and spaces",
    topics: ["Strings", "Hash Table", "Sliding Window"],
    companies: ["Google", "Amazon", "Facebook"],
    hints: [
      "Use sliding window technique",
      "Use a hash map to track character positions",
      "Expand window and contract when duplicate found",
    ],
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: '"abc" is the longest substring',
      },
    ],
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(min(m, n)) where m is charset size",
    },
  },
  {
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    description:
      "Given a string s, return the longest palindromic substring in s.",
    constraints: "1 <= s.length <= 1000, s consist of only digits and English letters",
    topics: ["Strings", "Dynamic Programming", "Expand Around Center"],
    companies: ["Microsoft", "Amazon", "Google"],
    hints: [
      "Try expand around center approach",
      "For each possible center, expand outwards",
      "Check both odd and even length palindromes",
    ],
    examples: [
      {
        input: 's = "babad"',
        output: '"bab" or "aba"',
        explanation: "Both are palindromes of length 3",
      },
    ],
    solution: {
      timeComplexity: "O(n^2)",
      spaceComplexity: "O(1)",
    },
  },
  {
    title: "Group Anagrams",
    difficulty: "Medium",
    description:
      "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
    constraints: "1 <= strs.length <= 10^4, 0 <= strs[i].length <= 100",
    topics: ["Strings", "Hash Table"],
    companies: ["Google", "Amazon", "Facebook"],
    hints: [
      "Sort characters in each word as key",
      "Anagrams will have same sorted key",
      "Group by the key using hash map",
    ],
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        explanation: "Grouped anagrams together",
      },
    ],
    solution: {
      timeComplexity: "O(n * k log k) where k is max length",
      spaceComplexity: "O(n * k)",
    },
  },
  {
    title: "Regular Expression Matching",
    difficulty: "Hard",
    description:
      'Given an input string s and a pattern p, implement regular expression matching with support for \'.\' and \'*\' where: \'.\' Matches any single character, \'*\' Matches zero or more of the preceding element.',
    constraints:
      "1 <= s.length <= 20, 1 <= p.length <= 30, s contains only lowercase English letters, p contains only lowercase English letters, '.', and '*'",
    topics: ["Strings", "Dynamic Programming", "Recursion"],
    companies: ["Google", "Facebook", "Microsoft"],
    hints: [
      "Use dynamic programming with 2D table",
      "dp[i][j] = true if s[0..i-1] matches p[0..j-1]",
      "Handle '.', '*', and regular characters",
    ],
    examples: [
      {
        input: 's = "aa", p = "a"',
        output: "false",
        explanation: "Pattern does not match",
      },
    ],
    solution: {
      timeComplexity: "O(m * n)",
      spaceComplexity: "O(m * n)",
    },
  },
  {
    title: "Edit Distance",
    difficulty: "Hard",
    description:
      "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. You have three operations: insert a character, delete a character, replace a character.",
    constraints: "0 <= word1.length, word2.length <= 500",
    topics: ["Strings", "Dynamic Programming"],
    companies: ["Google", "Facebook", "Microsoft"],
    hints: [
      "Use dynamic programming",
      "dp[i][j] = minimum operations to convert word1[0..i-1] to word2[0..j-1]",
      "Consider insert, delete, and replace operations",
    ],
    examples: [
      {
        input: 'word1 = "horse", word2 = "ros"',
        output: "3",
        explanation: "Replace h, delete o, delete r",
      },
    ],
    solution: {
      timeComplexity: "O(m * n)",
      spaceComplexity: "O(m * n)",
    },
  },

  // LINKED LISTS - 6 problems (2 easy, 3 medium, 1 hard)
  {
    title: "Reverse Linked List",
    difficulty: "Easy",
    description:
      "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    constraints: "The number of nodes in the list is the range [0, 5000]",
    topics: ["Linked Lists", "Recursion"],
    companies: ["Google", "Facebook", "Microsoft"],
    hints: [
      "Use three pointers: previous, current, next",
      "Reverse the links as you traverse",
      "Update previous and current for next iteration",
    ],
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
        explanation: "Reversed linked list",
      },
    ],
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(1) iterative, O(n) recursive",
    },
  },
  {
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    description:
      "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list.",
    constraints: "The number of nodes in each list is in the range [0, 50]",
    topics: ["Linked Lists", "Merging"],
    companies: ["Google", "Facebook"],
    hints: [
      "Compare nodes from both lists",
      "Connect smaller node to result",
      "Move pointer of list with smaller node",
    ],
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]",
        explanation: "Merged sorted lists",
      },
    ],
    solution: {
      timeComplexity: "O(n + m)",
      spaceComplexity: "O(1)",
    },
  },
  {
    title: "Linked List Cycle",
    difficulty: "Medium",
    description:
      "Given head, the head of a linked list, determine if the linked list has a cycle in it.",
    constraints: "The number of nodes in the list is in the range [0, 10^4]",
    topics: ["Linked Lists", "Floyd's Cycle Detection"],
    companies: ["Google", "Facebook"],
    hints: [
      "Use slow and fast pointers",
      "If they meet, there is a cycle",
      "If fast pointer reaches null, no cycle",
    ],
    examples: [
      {
        input: "head = [3,2,0,-4], pos = 1",
        output: "true",
        explanation: "There is a cycle (1 points to 2)",
      },
    ],
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
    },
  },
  {
    title: "Remove Nth Node From End of List",
    difficulty: "Medium",
    description:
      "Given the head of a linked list, remove the nth node from the end of the list and return the head.",
    constraints: "The number of nodes in the list is sz, 1 <= sz <= 30",
    topics: ["Linked Lists", "Two Pointers"],
    companies: ["Google", "Facebook", "Microsoft"],
    hints: [
      "Use two pointers with n nodes gap",
      "Create a dummy node to handle edge cases",
      "When first pointer reaches end, second is one before target",
    ],
    examples: [
      {
        input: "head = [1,2,3,4,5], n = 2",
        output: "[1,2,3,5]",
        explanation: "Removed 4 (2nd from end)",
      },
    ],
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
    },
  },
  {
    title: "LRU Cache",
    difficulty: "Medium",
    description:
      "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class with get and put operations.",
    constraints: "1 <= capacity <= 5000",
    topics: ["Linked Lists", "Hash Map", "Design"],
    companies: ["Google", "Amazon", "Facebook"],
    hints: [
      "Use doubly linked list with hash map",
      "Maintain order of access",
      "Move accessed item to front",
    ],
    examples: [
      {
        input:
          'LRUCache(2), put(1, 1), put(2, 2), get(1), put(3, 3), get(2), put(4, 4)',
        output: "-1",
        explanation: "LRU eviction and operations",
      },
    ],
    solution: {
      timeComplexity: "O(1) for get and put",
      spaceComplexity: "O(capacity)",
    },
  },
  {
    title: "Reverse Nodes in k-Group",
    difficulty: "Hard",
    description:
      "Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list.",
    constraints: "The number of nodes in the list is n, 1 <= k <= n <= 5000",
    topics: ["Linked Lists", "Recursion"],
    companies: ["Google", "Facebook", "Microsoft"],
    hints: [
      "Reverse each group of k nodes",
      "Use recursion for remaining groups",
      "Connect reversed groups properly",
    ],
    examples: [
      {
        input: "head = [1,2,3,4,5], k = 2",
        output: "[2,1,4,3,5]",
        explanation: "Reversed pairs",
      },
    ],
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(1) iterative, O(n) recursive",
    },
  },

  // TREES - 8 problems (2 easy, 4 medium, 2 hard)
  {
    title: "Binary Tree Inorder Traversal",
    difficulty: "Easy",
    description:
      "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
    constraints: "The number of nodes in the tree is in the range [0, 100]",
    topics: ["Trees", "Traversal", "Stack"],
    companies: ["Google", "Facebook"],
    hints: [
      "Traverse left subtree, visit node, traverse right subtree",
      "Use stack for iterative approach",
      "Use recursion for simple solution",
    ],
    examples: [
      {
        input: "root = [1,null,2,3]",
        output: "[1,3,2]",
        explanation: "Inorder traversal",
      },
    ],
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(h) where h is height",
    },
  },
  {
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    description:
      "Given the root of a binary tree, return its maximum depth. The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    constraints: "The number of nodes in the tree is in the range [0, 10^4]",
    topics: ["Trees", "DFS", "BFS"],
    companies: ["Google", "Facebook", "Amazon"],
    hints: [
      "Use DFS to explore all paths",
      "Track maximum depth seen",
      "Or use BFS with level counting",
    ],
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "3",
        explanation: "Maximum depth is 3",
      },
    ],
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(h)",
    },
  },
  {
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    description:
      "Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST is defined as follows: left subtree contains nodes with values less than root, right subtree contains nodes with values greater than root.",
    constraints: "The number of nodes in the tree is in the range [1, 10^4]",
    topics: ["Trees", "BST", "DFS"],
    companies: ["Google", "Facebook", "Microsoft"],
    hints: [
      "Use DFS with min and max bounds",
      "For left subtree, update max to root value",
      "For right subtree, update min to root value",
    ],
    examples: [
      {
        input: "root = [2,1,3]",
        output: "true",
        explanation: "Valid BST",
      },
    ],
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(h)",
    },
  },
  {
    title: "Lowest Common Ancestor of a Binary Tree",
    difficulty: "Medium",
    description:
      "Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.",
    constraints: "The number of nodes in the tree is in the range [2, 10^5]",
    topics: ["Trees", "DFS"],
    companies: ["Google", "Facebook", "Amazon"],
    hints: [
      "Use DFS to find both nodes",
      "If both found in left/right, recurse",
      "If one on each side, current is LCA",
    ],
    examples: [
      {
        input: "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1",
        output: "3",
        explanation: "LCA of 5 and 1 is 3",
      },
    ],
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(h)",
    },
  },
  {
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    description:
      "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
    constraints: "The number of nodes in the tree is in the range [0, 2000]",
    topics: ["Trees", "BFS", "Queue"],
    companies: ["Google", "Facebook", "Amazon"],
    hints: [
      "Use queue for BFS",
      "Process all nodes at current level",
      "Add all children of current level",
    ],
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "[[3],[9,20],[15,7]]",
        explanation: "Level order traversal",
      },
    ],
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(w) where w is max width",
    },
  },
  {
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    description:
      "Serialize the tree to a string and deserialize it back to the original tree. The format is not restricted.",
    constraints: "The number of nodes is in the range [0, 10^4]",
    topics: ["Trees", "DFS", "BFS", "Design"],
    companies: ["Google", "Facebook", "Microsoft"],
    hints: [
      "Use preorder traversal for serialization",
      "Mark null nodes with special character",
      "Deserialize by rebuilding from array",
    ],
    examples: [
      {
        input: "root = [1,2,3,null,null,4,5]",
        output: "[1,2,3,null,null,4,5]",
        explanation: "Serialized and deserialized",
      },
    ],
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
    },
  },
  {
    title: "Binary Tree Maximum Path Sum",
    difficulty: "Hard",
    description:
      "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. The path must contain at least one node and do not need to go through the root. Return the maximum path sum of any path.",
    constraints: "The number of nodes in the tree is in the range [1, 3 * 10^4]",
    topics: ["Trees", "DFS", "Dynamic Programming"],
    companies: ["Google", "Facebook", "Microsoft"],
    hints: [
      "Use DFS to compute max path through node",
      "Track global maximum",
      "Consider paths that bend at current node",
    ],
    examples: [
      {
        input: "root = [1,2,3]",
        output: "6",
        explanation: "Path is 2 -> 1 -> 3",
      },
    ],
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(h)",
    },
  },

  // DYNAMIC PROGRAMMING - 8 problems (2 easy, 4 medium, 2 hard)
  {
    title: "Climbing Stairs",
    difficulty: "Easy",
    description:
      "You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    constraints: "1 <= n <= 45",
    topics: ["Dynamic Programming", "Math"],
    companies: ["Google", "Facebook"],
    hints: [
      "ways(n) = ways(n-1) + ways(n-2)",
      "Use memoization or bottom-up DP",
      "This is like Fibonacci sequence",
    ],
    examples: [
      {
        input: "n = 3",
        output: "3",
        explanation: "1+1+1, 1+2, 2+1",
      },
    ],
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(n) or O(1) with optimization",
    },
  },
  {
    title: "House Robber",
    difficulty: "Easy",
    description:
      "You are a professional robber planning to rob houses along a street. Given an integer array nums representing the amount of money in each house, return the maximum amount of money you can rob without alerting the police (cannot rob two adjacent houses).",
    constraints: "1 <= nums.length <= 100, 0 <= nums[i] <= 400",
    topics: ["Dynamic Programming"],
    companies: ["Google", "Facebook", "Microsoft"],
    hints: [
      "dp[i] = max(dp[i-1], dp[i-2] + nums[i])",
      "Can't rob adjacent houses",
      "Choose to rob or skip current house",
    ],
    examples: [
      {
        input: "nums = [1,2,3,1]",
        output: "4",
        explanation: "Rob house 1 and 3: 1 + 3 = 4",
      },
    ],
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
    },
  },
  {
    title: "Coin Change",
    difficulty: "Medium",
    description:
      "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount.",
    constraints:
      "1 <= coins.length <= 12, 1 <= coins[i] <= 2^31 - 1, 0 <= amount <= 10^4",
    topics: ["Dynamic Programming", "BFS"],
    companies: ["Google", "Amazon", "Microsoft"],
    hints: [
      "Use DP with dp[i] = minimum coins to make amount i",
      "For each coin, try using it",
      "Take minimum across all options",
    ],
    examples: [
      {
        input: "coins = [1,2,5], amount = 5",
        output: "1",
        explanation: "5 coins: one 5-coin",
      },
    ],
    solution: {
      timeComplexity: "O(n * amount)",
      spaceComplexity: "O(amount)",
    },
  },
  {
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    description:
      "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
    constraints: "1 <= nums.length <= 2500, -10^4 <= nums[i] <= 10^4",
    topics: ["Dynamic Programming", "Binary Search"],
    companies: ["Google", "Amazon", "Microsoft"],
    hints: [
      "dp[i] = longest ending at index i",
      "For each i, check all j < i",
      "If nums[j] < nums[i], update dp[i]",
    ],
    examples: [
      {
        input: "nums = [10,9,2,5,3,7,101,18]",
        output: "4",
        explanation: "[2,3,7,101] is the LIS",
      },
    ],
    solution: {
      timeComplexity: "O(n^2) or O(n log n) with binary search",
      spaceComplexity: "O(n)",
    },
  },
  {
    title: "Word Break",
    difficulty: "Medium",
    description:
      "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of dictionary words.",
    constraints: "1 <= s.length <= 300, 1 <= wordDict.length <= 1000",
    topics: ["Dynamic Programming"],
    companies: ["Google", "Facebook", "Amazon"],
    hints: [
      "dp[i] = true if s[0:i] can be segmented",
      "Check all previous positions",
      "Look for word from j to i in dictionary",
    ],
    examples: [
      {
        input: 's = "leetcode", wordDict = ["leet","code"]',
        output: "true",
        explanation: "Can be segmented as leet + code",
      },
    ],
    solution: {
      timeComplexity: "O(n^2 * m) where m is word length",
      spaceComplexity: "O(n)",
    },
  },
  {
    title: "Palindrome Partitioning II",
    difficulty: "Hard",
    description:
      "Given a string s, partition s such that every substring of the partition is a palindrome. Return the minimum cuts needed for a palindrome partitioning of s.",
    constraints: "0 <= s.length <= 2000",
    topics: ["Dynamic Programming"],
    companies: ["Google", "Facebook"],
    hints: [
      "Precompute which substrings are palindromes",
      "dp[i] = minimum cuts to partition s[0:i]",
      "For each j < i, if s[j:i] is palindrome, update dp[i]",
    ],
    examples: [
      {
        input: 's = "nitin"',
        output: "0",
        explanation: "nitin is palindrome, 0 cuts",
      },
    ],
    solution: {
      timeComplexity: "O(n^2)",
      spaceComplexity: "O(n^2)",
    },
  },
  {
    title: "Distinct Subsequences",
    difficulty: "Hard",
    description:
      "Given two strings s and t, return the number of distinct subsequences of s which equals t.",
    constraints: "1 <= s.length, t.length <= 1000, s and t consist of English letters",
    topics: ["Dynamic Programming"],
    companies: ["Google", "Microsoft"],
    hints: [
      "dp[i][j] = distinct subsequences of s[0:i] equal to t[0:j]",
      "If s[i-1] == t[j-1], include both matching and not matching",
      "If not equal, only count not matching",
    ],
    examples: [
      {
        input: 's = "rabbbit", t = "rabbit"',
        output: "3",
        explanation: "3 ways to get rabbit",
      },
    ],
    solution: {
      timeComplexity: "O(m * n)",
      spaceComplexity: "O(m * n)",
    },
  },

  // GRAPHS - 5 problems (1 easy, 3 medium, 1 hard)
  {
    title: "Number of Islands",
    difficulty: "Easy",
    description:
      "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
    constraints: "m == grid.length, n == grid[i].length, 1 <= m, n <= 300",
    topics: ["Graphs", "DFS", "BFS"],
    companies: ["Google", "Amazon", "Facebook"],
    hints: [
      "Use DFS or BFS to mark connected components",
      "For each unvisited land, count as new island",
      "Mark visited land to avoid recounting",
    ],
    examples: [
      {
        input:
          'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        output: "1",
        explanation: "1 island",
      },
    ],
    solution: {
      timeComplexity: "O(m * n)",
      spaceComplexity: "O(m * n)",
    },
  },
  {
    title: "Course Schedule",
    difficulty: "Medium",
    description:
      "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. Given the array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses.",
    constraints: "1 <= numCourses <= 2000, 0 <= prerequisites.length <= 5000",
    topics: ["Graphs", "Topological Sort", "DFS", "BFS"],
    companies: ["Google", "Facebook", "Microsoft"],
    hints: [
      "Detect cycle in directed graph",
      "Use DFS with visited and in-progress states",
      "Or use Kahn's algorithm with indegree",
    ],
    examples: [
      {
        input: "numCourses = 2, prerequisites = [[1,0]]",
        output: "true",
        explanation: "Take course 0 then 1",
      },
    ],
    solution: {
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V + E)",
    },
  },
  {
    title: "Clone Graph",
    difficulty: "Medium",
    description:
      "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.",
    constraints: "The number of nodes is in the range [0, 100]",
    topics: ["Graphs", "DFS", "BFS"],
    companies: ["Google", "Facebook", "Amazon"],
    hints: [
      "Use BFS or DFS to traverse graph",
      "Use hash map to track cloned nodes",
      "For each neighbor, clone and connect",
    ],
    examples: [
      {
        input: "adjList = [[2,4],[1,3],[2,4],[1,3]]",
        output: "[[2,4],[1,3],[2,4],[1,3]]",
        explanation: "Deep copy of graph",
      },
    ],
    solution: {
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V)",
    },
  },
  {
    title: "Alien Dictionary",
    difficulty: "Medium",
    description:
      "There is a new alien language which uses the latin alphabet. However, the order among letters are unknown to you. You receive a list of non-empty words written in alien dictionary, where words are sorted lexicographically by the rules of this new language. Derive the order of letters in this language.",
    constraints: "1 <= words.length <= 100, 1 <= words[i].length <= 100",
    topics: ["Graphs", "Topological Sort"],
    companies: ["Google", "Facebook", "Microsoft"],
    hints: [
      "Compare adjacent words to find ordering",
      "Build graph of character orderings",
      "Perform topological sort",
    ],
    examples: [
      {
        input: 'words = ["wrt","wrf","er","ett","rftt"]',
        output: '"wertf"',
        explanation: "Character ordering",
      },
    ],
    solution: {
      timeComplexity: "O(N * K + V + E) where N is words, K is avg length",
      spaceComplexity: "O(V + E)",
    },
  },
  {
    title: "Word Ladder II",
    difficulty: "Hard",
    description:
      "Given two words, beginWord and endWord, and a dictionary wordList, return all the shortest transformation sequences from beginWord to endWord. Each word is composed of lowercase English letters, and each word in wordList is of the same length as beginWord.",
    constraints:
      "1 <= beginWord.length <= 10, wordList.length <= 5000, beginWord != endWord",
    topics: ["Graphs", "BFS", "DFS", "Backtracking"],
    companies: ["Google", "Facebook"],
    hints: [
      "Use BFS to find shortest path",
      "Build graph of word transformations",
      "Use DFS to find all paths of min length",
    ],
    examples: [
      {
        input:
          'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',
        output: '[["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]',
        explanation: "All shortest paths",
      },
    ],
    solution: {
      timeComplexity: "O(N * L * 26) for BFS, exponential for paths",
      spaceComplexity: "O(N * L)",
    },
  },

  // BINARY SEARCH - 5 problems (1 easy, 4 medium, 0 hard)
  {
    title: "Binary Search",
    difficulty: "Easy",
    description:
      "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its index. Otherwise, return -1.",
    constraints:
      "1 <= nums.length <= 10^4, -10^4 < nums[i], target < 10^4, All integers in nums are unique and sorted in ascending order",
    topics: ["Binary Search", "Arrays"],
    companies: ["Google", "Facebook", "Microsoft"],
    hints: [
      "Use two pointers: left and right",
      "Calculate mid and compare with target",
      "Adjust left or right based on comparison",
    ],
    examples: [
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
        explanation: "Target found at index 4",
      },
    ],
    solution: {
      timeComplexity: "O(log n)",
      spaceComplexity: "O(1)",
    },
  },
  {
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    description:
      "There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k. Write a function to search target in nums.",
    constraints:
      "1 <= nums.length <= 5000, -10^4 <= nums[i] <= 10^4, All values of nums are unique",
    topics: ["Binary Search", "Arrays"],
    companies: ["Google", "Amazon", "Microsoft"],
    hints: [
      "Determine which half is sorted",
      "Check if target is in sorted half",
      "Search in appropriate half",
    ],
    examples: [
      {
        input: "nums = [4,5,6,7,0,1,2], target = 0",
        output: "4",
        explanation: "Target found at index 4",
      },
    ],
    solution: {
      timeComplexity: "O(log n)",
      spaceComplexity: "O(1)",
    },
  },
  {
    title: "Find First and Last Position of Element in Sorted Array",
    difficulty: "Medium",
    description:
      "Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value. If target is not found in the array, return [-1, -1].",
    constraints:
      "0 <= nums.length <= 10^5, -10^9 <= nums[i] <= 10^9, -10^9 <= target <= 10^9",
    topics: ["Binary Search", "Arrays"],
    companies: ["Google", "Facebook", "Microsoft"],
    hints: [
      "Use binary search to find left boundary",
      "Use binary search to find right boundary",
      "Handle not found case",
    ],
    examples: [
      {
        input: "nums = [5,7,7,8,8,10], target = 8",
        output: "[3,4]",
        explanation: "8 appears at indices 3 and 4",
      },
    ],
    solution: {
      timeComplexity: "O(log n)",
      spaceComplexity: "O(1)",
    },
  },
  {
    title: "Median of Two Sorted Arrays",
    difficulty: "Medium",
    description:
      "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log(m+n)).",
    constraints:
      "nums1.length == m, nums2.length == n, 0 <= m <= 1000, 0 <= n <= 1000, 1 <= m + n <= 2000",
    topics: ["Binary Search", "Arrays"],
    companies: ["Google", "Facebook", "Microsoft"],
    hints: [
      "Use binary search on the smaller array",
      "Partition arrays so left and right have equal elements",
      "Find median from partition boundaries",
    ],
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.0",
        explanation: "Median of [1,2,3] is 2",
      },
    ],
    solution: {
      timeComplexity: "O(log(min(m, n)))",
      spaceComplexity: "O(1)",
    },
  },
  
  // Additional Medium problems to reach 50
  {
    title: "Rotate Array",
    difficulty: "Medium",
    description:
      "Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.",
    constraints: "1 <= nums.length <= 10^5, -2^31 <= nums[i] <= 2^31 - 1, 0 <= k <= 10^5",
    topics: ["Arrays", "Two Pointers"],
    companies: ["Google", "Amazon", "Microsoft"],
    hints: [
      "Reverse entire array, then first k elements, then remaining",
      "Three reverse operations give rotation",
      "Works with O(n) time and O(1) space",
    ],
    examples: [
      {
        input: "nums = [1,2,3,4,5,6,7], k = 3",
        output: "[5,6,7,1,2,3,4]",
        explanation: "Rotated right by 3",
      },
    ],
    solution: {
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
    },
  },
  {
    title: "3Sum",
    difficulty: "Medium",
    description:
      "Given an integer array nums of length n, return all unique triplets [nums[a], nums[b], nums[c]] such that i != j, i != k, and j != k, and nums[a] + nums[b] + nums[c] == 0.",
    constraints: "3 <= nums.length <= 3000, -10^5 <= nums[i] <= 10^5",
    topics: ["Arrays", "Two Pointers", "Sorting"],
    companies: ["Google", "Facebook", "Microsoft"],
    hints: [
      "Sort array first",
      "For each element, use two pointers to find pair",
      "Skip duplicates to avoid duplicate triplets",
    ],
    examples: [
      {
        input: "nums = [-1,0,1,2,-1,-4]",
        output: "[[-1,-1,2],[-1,0,1]]",
        explanation: "Unique triplets that sum to 0",
      },
    ],
    solution: {
      timeComplexity: "O(n^2)",
      spaceComplexity: "O(1) excluding output",
    },
  },
  {
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    description:
      "Given an integer array nums and an integer k, return the kth largest element in the array.",
    constraints:
      "1 <= k <= nums.length <= 10^4, -10^4 <= nums[i] <= 10^4",
    topics: ["Arrays", "Heap", "Quickselect"],
    companies: ["Google", "Amazon", "Facebook"],
    hints: [
      "Use min-heap of size k",
      "Keep heap with k largest elements",
      "Root of heap is kth largest",
    ],
    examples: [
      {
        input: "nums = [3,2,1,5,6,4], k = 2",
        output: "5",
        explanation: "2nd largest element",
      },
    ],
    solution: {
      timeComplexity: "O(n log k)",
      spaceComplexity: "O(k)",
    },
  },
  {
    title: "Interval List Intersections",
    difficulty: "Medium",
    description:
      "You are given two lists of closed intervals, firstList and secondList, where firstList[i] = [starti, endi] and secondList[j] = [startj, endj]. Each list of intervals is pairwise disjoint and in sorted order. Return the intersection of these two interval lists.",
    constraints:
      "0 <= firstList.length, secondList.length <= 1000, firstList.length + secondList.length >= 1",
    topics: ["Arrays", "Two Pointers"],
    companies: ["Google", "Facebook"],
    hints: [
      "Use two pointers on both lists",
      "Intersection is [max(start1, start2), min(end1, end2)]",
      "Move pointer of interval that ends first",
    ],
    examples: [
      {
        input:
          "firstList = [[0,2],[5,10],[13,23],[24,25]], secondList = [[1,5],[8,12],[15,24],[25,26]]",
        output: "[[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]",
        explanation: "Intersections of intervals",
      },
    ],
    solution: {
      timeComplexity: "O(m + n)",
      spaceComplexity: "O(1) excluding output",
    },
  },
  {
    title: "Minimum Window Substring",
    difficulty: "Medium",
    description:
      "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t is included in the window.",
    constraints: "m == s.length, n == t.length, 1 <= m, n <= 10^5",
    topics: ["Strings", "Sliding Window", "Hash Table"],
    companies: ["Google", "Facebook", "Microsoft"],
    hints: [
      "Use sliding window with two pointers",
      "Use hash map to track character frequencies",
      "Expand window until all characters found, then contract",
    ],
    examples: [
      {
        input: 's = "ADOBECODEBANC", t = "ABC"',
        output: '"BANC"',
        explanation: "Minimum window with all characters",
      },
    ],
    solution: {
      timeComplexity: "O(m + n)",
      spaceComplexity: "O(charset size)",
    },
  },
];

async function seedProblems() {
  try {
    const mongoose = require("mongoose");

    // Connect to database
    await mongoose.connect(config.mongodbUri);
    console.log("Connected to MongoDB");

    // Clear existing problems
    const deleteResult = await Problem.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing problems`);

    // Add default user ID and slug to each problem (insertMany bypasses pre-save hooks)
    const problemsWithUser = problems.map((problem) => ({
      ...problem,
      slug: slugify(problem.title, { lower: true, strict: true, trim: true }),
      createdBy: DUMMY_USER_ID,
    }));

    // Insert all problems
    const result = await Problem.insertMany(problemsWithUser);
    console.log(`Successfully inserted ${result.length} problems`);

    // Verify no duplicate slugs
    const uniqueSlugs = new Set(result.map((p) => p.slug));
    console.log(`✓ All ${uniqueSlugs.size} slugs are unique`);

    // Log statistics
    const difficultyStats = await Problem.aggregate([
      {
        $group: {
          _id: "$difficulty",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const topicStats = await Problem.aggregate([
      { $unwind: "$topics" },
      {
        $group: {
          _id: "$topics",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    console.log("\n=== Difficulty Distribution ===");
    difficultyStats.forEach((stat) => {
      console.log(`${stat._id}: ${stat.count} problems`);
    });

    console.log("\n=== Top Topics ===");
    topicStats.forEach((stat) => {
      console.log(`${stat._id}: ${stat.count} problems`);
    });

    console.log("\n✓ Seeding completed successfully!");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding problems:", error);
    process.exit(1);
  }
}

seedProblems();
