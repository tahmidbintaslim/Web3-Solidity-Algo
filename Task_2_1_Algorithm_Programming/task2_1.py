# Take a list of words and a target word as input
def solve(wordList, target):
    for i in range(len(wordList)):
        for j in range(len(wordList)):
            # Ensure the two words are different
            if i != j:
                word1 = wordList[i]
                word2 = wordList[j]
                # Check if concatenating the two words forms the target
                if word1 + word2 == target:
                    return (word1, word2)
    # Return None if no pair is found
    return None

# Test Cases
print(solve(["ab", "bc", "cd"], "abcd"))   # Output: ('ab', 'cd') or ('cd', 'ab')
print(solve(["ab", "bc", "cd"], "cdab"))   # Output: ('cd', 'ab') or ('ab', 'cd')
print(solve(["ab", "bc", "cd"], "abab"))   # Output: None
print(solve(["ab", "ba", "ab"], "abab"))   # Output: ('ab', 'ab')
