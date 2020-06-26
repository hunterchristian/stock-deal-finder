#!/bin/bash

# nasdaqlisted.txt is acquired from here: https://quant.stackexchange.com/a/1862
# awk command was built from here: https://www.gnu.org/software/gawk/manual/html_node/Printf-Examples.html
echo 'Parsing ticker symbols from nasdaqlisted.txt...'
awk -F '|' 'BEGIN { print "export default [" } { printf "\"%s\",\n", $1} END { print "];\n" }' nasdaqlisted.txt > tickersymbols.ts
echo 'Finished. Ticker symbols written to tickersymbols.ts'