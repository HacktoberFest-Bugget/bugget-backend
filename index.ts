import express from 'express';
import { Request, Response } from 'express';
import { simpleGit, SimpleGitOptions } from "simple-git";
import path from "node:path";
import { OpenAI } from "openai";

const app = express();
const port = 3000;

app.get('/', async (req: Request, res: Response) => {
    const repoPath = path.resolve(__dirname);
    const git = simpleGit(repoPath);

    const response = await git.diff(['48740d46de3f437229669d9875aa6bfa36232556', '3cad67005109274371c8d56917bfcbd5619e03e9']);

    const openai = new OpenAI({
        apiKey: "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",
    });

    const result = await openai.responses.create({
        model: "gpt-5",
        input: `Write human readable changes for me in json. using this git difference: ${response}`,
        reasoning: { effort: "low" },
        text: { verbosity: "low" },
    });

    res.send(result.output_text);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});