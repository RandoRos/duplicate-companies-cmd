# Company Duplicate Finder CLI

A command-line tool for finding potential duplicate company names in a sorted text file using various comparison algorithms and filtering techniques.

> **Note**  
> The accuracy of results depends on various factors, and there is no one-size-fits-all solution. Effectiveness largely depends on the algorithms and parameters you choose. For the highest accuracy, consider using AI-based semantic comparison methods along with high-quality datasets of global company names and relevant keywords.

## Features

- **Duplicate Detection**: Find potential duplicate company names in a list
- **Multiple Algorithms**:
  - Hash-based matching using company name prefixes
  - Levenshtein distance algorithm for fuzzy matching
  - Brand name comparison for companies with similar brands
- **Person Filter**: Automatically filters out individual person names
- **Business Term Normalization**: Removes common business terms (Inc, LLC, Corp, etc.) for better matching
- **Output Options**: Save results to JSON files

## Usage

### Basic Usage

```bash
# Using ts-node (development)
npm run cmd -- files/companies.txt

# Using the built version
npm start -- files/companies.txt
```

### Command Options

```bash
# Get help
npm run cmd -- --help

# Save output to a file
npm run cmd -- files/companies.txt -o results.json

# Use brand names for comparison
npm run cmd -- files/companies.txt --brands

# Configure brand frequency threshold
npm run cmd -- files/companies.txt --brands --bf 5

# Use Levenshtein distance algorithm
npm run cmd -- files/companies.txt -l

# Combine options
npm run cmd -- files/companies.txt --brands -l -o duplicates.json
```

## Command Arguments

```
Arguments:
  file                           Path to the file containing company names

Options:
  -o, --output <output>          Output file path
  --brands [frequency]           Use brand names for comparison with optional frequency (default: 4)
  -l, --levenshtein [threshold]  Use Levenshtein distance algorithm for comparison with optional threshold (default: 0.5)
  -h, --help                     Display help for command
  --version                      Display version information
```

## How It Works

1. **Input Processing**: Reads company names from the input file line by line
2. **Name Normalization**: Removes common business suffixes and normalizes text
3. **Duplicate Detection**:
   - Creates hash keys from company names for grouping
   - Optionally compares using brand names
   - Optionally uses Levenshtein distance for fuzzy matching
4. **Output**: Returns groups of potentially duplicate companies

## Examples

### Example Input File

```
Acme Inc.
ACME Corporation
Apex Systems
Apex Software Solutions
John Smith
```

### Output

```json
{
  "acme": ["Acme Inc.", "ACME Corporation"],
  "apex": ["Apex Systems", "Apex Software Solutions"]
}
```

## Dependencies

- [@commander-js/extra-typings](https://www.npmjs.com/package/@commander-js/extra-typings): TypeScript support for Commander.js
- [fastest-levenshtein](https://www.npmjs.com/package/fastest-levenshtein): Fast implementation of Levenshtein distance algorithm
- [@stdlib/datasets-female-first-names-en](https://www.npmjs.com/package/@stdlib/datasets-female-first-names-en): Dataset of English female first names
- [@stdlib/datasets-male-first-names-en](https://www.npmjs.com/package/@stdlib/datasets-male-first-names-en): Dataset of English male first names
- [string-comparison](https://www.npmjs.com/package/string-comparison): String comparison algorithms including Cosine similarity
