#!/usr/bin/env bash
if ! [[ -e $1/day$2 ]];then
    mkdir $1/day$2
fi
touch $1/day$2/test
touch $1/day$2/input
if ! [[ -e $1/day$2/part1.js ]];then
    cp ./.template.js $1/day$2/part1.js
fi

if ! [[ -e $1/day$2/part2.js ]];then
    cp ./.template.js $1/day$2/part2.js
fi