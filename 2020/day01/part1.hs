answer :: (Ord a, Num a) => [a] -> [a]
answer xs = [ x * y | x <- xs, y <- xs, x > y, x + y == 2020]
