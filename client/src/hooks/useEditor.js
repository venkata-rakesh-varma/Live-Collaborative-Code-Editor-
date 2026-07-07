import { useState, useCallback } from "react";

// Default code templates per language
export const DEFAULT_TEMPLATES = {
  javascript: `// Welcome to CodeSync — JavaScript
function main() {
  console.log("Hello, World!");
  
  // Try some JavaScript
  const nums = [1, 2, 3, 4, 5];
  const sum = nums.reduce((a, b) => a + b, 0);
  console.log("Sum:", sum);
}

main();
`,

  python: `# Welcome to CodeSync — Python
def main():
    print("Hello, World!")
    
    # Try some Python
    nums = [1, 2, 3, 4, 5]
    total = sum(nums)
    print(f"Sum: {total}")

if __name__ == "__main__":
    main()
`,

  java: `// Welcome to CodeSync — Java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Try some Java
        int[] nums = {1, 2, 3, 4, 5};
        int sum = 0;
        for (int n : nums) sum += n;
        System.out.println("Sum: " + sum);
    }
}
`,

  cpp: `// Welcome to CodeSync — C++
#include <iostream>
#include <vector>
#include <numeric>

int main() {
    std::cout << "Hello, World!" << std::endl;
    
    // Try some C++
    std::vector<int> nums = {1, 2, 3, 4, 5};
    int sum = std::accumulate(nums.begin(), nums.end(), 0);
    std::cout << "Sum: " << sum << std::endl;
    
    return 0;
}
`,
};

const useEditor = () => {
  const [language, setLanguageState] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_TEMPLATES["javascript"]);
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");

  const updateCode = useCallback((value) => {
    setCode(value || "");
  }, []);

  // When language changes: also update code to that language's default template
  const setLanguage = useCallback((newLang) => {
    setLanguageState(newLang);
    if (DEFAULT_TEMPLATES[newLang]) {
      setCode(DEFAULT_TEMPLATES[newLang]);
    }
  }, []);

  // Allow overriding code without changing language (e.g., socket sync)
  const setCodeOnly = useCallback((value) => {
    setCode(value || "");
  }, []);

  const clearOutput = () => setOutput("");

  return {
    code,
    language,
    output,
    input,
    setCode,
    setLanguage,       // changes language + resets code to template
    setLanguageState,  // changes language label ONLY (no code reset)
    setCodeOnly,       // updates code without changing language
    setOutput,
    setInput,
    updateCode,
    clearOutput,
  };
};

export default useEditor;