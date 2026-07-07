/**
 * LOCAL CODE EXECUTION ENGINE
 * Runs code directly on your machine using child_process.
 * No external API or API key needed.
 *
 * Requirements per language:
 *  - JavaScript : node  (already running — server is Node.js)
 *  - Python     : python or python3  (install from python.org)
 *  - Java       : javac + java  (install JDK from adoptium.net)
 *  - C++        : g++  (install MinGW on Windows: https://winlibs.com)
 */

const { spawn }  = require("child_process");
const fs         = require("fs");
const path       = require("path");
const os         = require("os");
const crypto     = require("crypto");

// ─── Configuration ───────────────────────────────────────────────────────────
const TIMEOUT_MS = 10000; // 10 second execution limit

// On Windows, Python is usually just "python". On Linux/Mac it's "python3".
const PYTHON_CMD = process.platform === "win32" ? "python" : "python3";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Run a process and capture stdout/stderr.
 * Returns { stdout, stderr, exitCode, timedOut }
 */
function runProcess(command, args, { cwd, stdinData = "", timeout = TIMEOUT_MS } = {}) {
  return new Promise((resolve) => {
    const isWindows = process.platform === "win32";

    const child = spawn(command, args, {
      cwd,
      stdio: "pipe",
      // shell:true lets Windows find commands on PATH (node, python, java, g++)
      shell: isWindows,
    });

    let stdout = "";
    let stderr = "";
    let killed = false;

    child.stdout.on("data", (d) => { stdout += d.toString(); });
    child.stderr.on("data", (d) => { stderr += d.toString(); });

    // Feed stdin if provided
    if (stdinData) {
      child.stdin.write(stdinData);
    }
    child.stdin.end();

    // Hard timeout
    const timer = setTimeout(() => {
      killed = true;
      child.kill("SIGKILL");
    }, timeout);

    child.on("close", (code) => {
      clearTimeout(timer);
      if (killed) {
        resolve({ stdout, stderr, exitCode: -1, timedOut: true });
      } else {
        resolve({ stdout, stderr, exitCode: code ?? 0 });
      }
    });

    child.on("error", (err) => {
      clearTimeout(timer);
      // "ENOENT" means the runtime executable wasn't found on PATH
      const msg = err.code === "ENOENT"
        ? `Runtime not found: "${command}" is not installed or not in PATH.\n` +
          runtimeInstallHint(command)
        : err.message;
      resolve({ stdout: "", stderr: msg, exitCode: -1 });
    });
  });
}

/** Human-friendly install hint when a runtime is missing */
function runtimeInstallHint(command) {
  const hints = {
    python:  "→ Install Python from https://python.org (check 'Add to PATH' during install)",
    python3: "→ Install Python from https://python.org",
    javac:   "→ Install JDK from https://adoptium.net (Temurin) and add to PATH",
    java:    "→ Install JDK from https://adoptium.net (Temurin) and add to PATH",
    "g++":   "→ Install MinGW-w64 from https://winlibs.com and add bin/ folder to PATH",
  };
  return hints[command] ?? "→ Make sure the runtime is installed and added to your system PATH.";
}

/** Ensure temp dir exists, return a unique sub-folder path */
function makeTmpDir() {
  const id  = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36);
  const dir = path.join(os.tmpdir(), `codesync_${id}`);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/** Remove a temp directory safely */
function cleanTmpDir(dir) {
  try { fs.rmSync(dir, { recursive: true, force: true }); } catch (_) {}
}

// ─── Execution Strategies ────────────────────────────────────────────────────

async function runJavaScript(source, stdinData, tmpDir) {
  const file = path.join(tmpDir, "main.js");
  fs.writeFileSync(file, source, "utf8");
  return runProcess("node", [file], { cwd: tmpDir, stdinData });
}

async function runPython(source, stdinData, tmpDir) {
  const file = path.join(tmpDir, "main.py");
  fs.writeFileSync(file, source, "utf8");
  return runProcess(PYTHON_CMD, [file], { cwd: tmpDir, stdinData });
}

async function runJava(source, stdinData, tmpDir) {
  // Java requires filename == public class name; normalise to "Main"
  const normalised = source.replace(
    /public\s+class\s+\w+/,
    "public class Main"
  );
  const file = path.join(tmpDir, "Main.java");
  fs.writeFileSync(file, normalised, "utf8");

  // Compile step
  const compile = await runProcess("javac", ["Main.java"], { cwd: tmpDir, stdinData: "" });
  if (compile.exitCode !== 0) {
    return { ...compile, compileError: true };
  }

  // Run step
  const run = await runProcess("java", ["Main"], { cwd: tmpDir, stdinData });
  return run;
}

async function runCpp(source, stdinData, tmpDir) {
  const srcFile = path.join(tmpDir, "main.cpp");
  const exeFile = path.join(tmpDir, process.platform === "win32" ? "main.exe" : "main");
  fs.writeFileSync(srcFile, source, "utf8");

  // Compile step
  const compile = await runProcess("g++", [srcFile, "-o", exeFile, "-std=c++17"], {
    cwd: tmpDir,
    stdinData: "",
  });
  if (compile.exitCode !== 0) {
    return { ...compile, compileError: true };
  }

  // Run step
  const run = await runProcess(exeFile, [], { cwd: tmpDir, stdinData });
  return run;
}

// ─── Controller ──────────────────────────────────────────────────────────────

const RUNNERS = {
  javascript: runJavaScript,
  python:     runPython,
  java:       runJava,
  cpp:        runCpp,
};

exports.executeCode = async (req, res) => {
  const { language, source, stdin = "" } = req.body;

  // Validation
  if (!language || !source) {
    return res.status(400).json({ success: false, message: "language and source are required" });
  }

  const runner = RUNNERS[language];
  if (!runner) {
    return res.status(400).json({ success: false, message: `Unsupported language: ${language}` });
  }

  const tmpDir = makeTmpDir();

  try {
    const result = await runner(source, stdin, tmpDir);

    // Handle compile errors (Java / C++)
    if (result.compileError) {
      return res.json({
        success: true,
        run: {
          output: `[Compile Error]\n${result.stderr}`,
          stdout: "",
          stderr: result.stderr,
          exitCode: result.exitCode,
        },
        compile: { stderr: result.stderr },
        language,
      });
    }

    // Handle timeout
    if (result.timedOut) {
      return res.json({
        success: true,
        run: {
          output: `[Timeout]\nExecution exceeded ${TIMEOUT_MS / 1000}s limit and was killed.`,
          stdout: result.stdout,
          stderr: result.stderr,
          exitCode: -1,
        },
        language,
      });
    }

    // Normal result
    let displayOutput = result.stdout;

    if (!displayOutput && result.stderr) {
      displayOutput = `[Runtime Error]\n${result.stderr}`;
    } else if (displayOutput && result.stderr && result.exitCode !== 0) {
      displayOutput = `${displayOutput}\n\n[stderr]\n${result.stderr}`;
    } else if (!displayOutput && !result.stderr) {
      displayOutput = "";  // empty — no output
    }

    return res.json({
      success: true,
      run: {
        output: displayOutput,
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode,
      },
      language,
    });
  } catch (err) {
    console.error("[LocalCompiler] Unexpected error:", err);
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    cleanTmpDir(tmpDir);
  }
};