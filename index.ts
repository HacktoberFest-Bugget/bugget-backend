import express from 'express';
import { Request, Response } from 'express';
import {LogOptions, simpleGit, SimpleGitOptions} from "simple-git";
import path from "node:path";
import { OpenAI } from "openai";
import * as fs from "node:fs";
import fsASync from 'node:fs/promises';

const app = express();
const port = 3000;

app.get('/', async (req: Request, res: Response) => {
    try {
        const repoPath = path.resolve(__dirname);
        const git = simpleGit(repoPath);

        const branch = req.query.branch;

        if (!branch) res.status(404).send('No branch found');

        const fileName = `${branch}.md`
        const filePath = `${repoPath}/docs/${fileName}`;

        if (!fs.existsSync(filePath)) {
            const response = await git.diff(['main', 'feature/prototype']);

            const openai = new OpenAI({
                apiKey: "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",
            });

            const result = await openai.responses.create({
                model: "gpt-5",
                input: `Write human readable changes for me. I want confluence like docs not just code difference docs. using this git difference: ${response}`,
                reasoning: { effort: "medium" },
                text: { verbosity: "medium" },
            });

            await fsASync.writeFile(filePath, result.output_text);

            res.setHeader('Content-Type', 'text/markdown');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        }

        res.send('Success');
    } catch (error) {
        res.status(400).send(` Something went wrong: ${error}`);
    }
});

app.get('/docs', async (req: Request, res: Response) => {
    try {
        const repoPath = path.resolve(__dirname);
        const folderPath = `${repoPath}/docs`;

        const result = await fsASync.readdir(folderPath);
        res.send(result);
    } catch (error) {
        res.status(400).send(` Something went wrong: ${error}`);
    }
})

app.get('/docs/:file', async (req: Request, res: Response) => {
   try {
       const repoPath = path.resolve(__dirname);
       const filePath = `${repoPath}/docs/${req.params.file}`;

       if (fs.existsSync(filePath)) {
           res.setHeader('Content-Type', 'text/markdown');
           res.setHeader('Content-Disposition', `attachment; filename="${req.params.file}"`);

           const stream = fs.createReadStream(filePath);
           stream.pipe(res)
       } else {
           res.status(404).send('No branch found');
       }
   } catch (error) {
       res.status(400).send(` Something went wrong: ${error}`);
   }
})


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});