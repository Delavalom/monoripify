import fetch from "node-fetch";
import fs from "fs/promises";
import path from "path";

const buildId = Date.now();
const status = "success";
const logsPath = path.resolve(__dirname, "build.log");

async function main() {
  const logs = await fs.readFile(logsPath, "utf8");

  const payload = {
    build_id: buildId,
    status: status,
    logs: logs,
  };

  try {
    await fetch(
      "https://7911-201-229-230-132.ngrok-free.app/api/build",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    console.log("succeed");
  } catch (err) {
    console.error(err);
  } finally {
    console.log("Process finish");
  }
}

main();
