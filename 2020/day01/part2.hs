answer :: (Ord a, Num a) => [a] -> [a]
answer xs = [x * y * z | x <- xs, y <- xs, x > y, x + y < 2020, z <- xs, y > z, x + y + z == 2020]
