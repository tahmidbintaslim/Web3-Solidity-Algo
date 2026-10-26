import unittest

from task2_1 import solve


class SolveTest(unittest.TestCase):
    # The four examples from the brief.
    def test_example_1(self):
        self.assertIn(solve(["ab", "bc", "cd"], "abcd"), [("ab", "cd"), ("cd", "ab")])

    def test_example_2(self):
        self.assertIn(solve(["ab", "bc", "cd"], "cdab"), [("ab", "cd"), ("cd", "ab")])

    def test_example_3_no_pair(self):
        self.assertIsNone(solve(["ab", "bc", "cd"], "abab"))

    def test_example_4_same_word_twice(self):
        self.assertEqual(solve(["ab", "ba", "ab"], "abab"), ("ab", "ab"))

    # Behavior the README documents.
    def test_word_is_not_paired_with_itself(self):
        self.assertIsNone(solve(["ab"], "abab"))

    def test_order_matters(self):
        self.assertEqual(solve(["cd", "ab"], "abcd"), ("ab", "cd"))

    def test_empty_list(self):
        self.assertIsNone(solve([], "ab"))


if __name__ == "__main__":
    unittest.main()
