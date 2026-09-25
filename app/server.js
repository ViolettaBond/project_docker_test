import http from 'http';
import fs from 'fs/promises';

import { saveRequest } from './storage.js';
import { transferData } from './transfer.js';

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        try {
            const html = await fs.readFile('./public/index.html', 'utf-8');

            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8',
            });

            res.end(html);
        } catch (error) {
            console.error(error);

            res.writeHead(500);
            res.end('Internal Server Error');
        }

        return;
    }

    if (req.method === 'GET' && req.url === '/style.css') {
        try {
            const css = await fs.readFile('./public/style.css', 'utf-8');

            res.writeHead(200, {
                'Content-Type': 'text/css; charset=utf-8',
            });

            res.end(css);
        } catch (error) {
            console.error(error);

            res.writeHead(500);
            res.end('Internal Server Error');
        }

        return;
    }

    if (req.method === 'POST' && req.url === '/requests') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const newRequest = await saveRequest(data);

                await transferData(newRequest);

                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8',
                });

                res.end(
                    JSON.stringify({
                        message: 'Запрос успешно отправлен',
                    }),
                );
            } catch (error) {
                console.error(error);

                res.writeHead(500, {
                    'Content-Type': 'application/json; charset=utf-8',
                });

                res.end(
                    JSON.stringify({
                        message: 'Ошибка при отправке',
                    }),
                );
            }
        });

        return;
    }

    res.writeHead(404);
    res.end('Not Found');
});

server.listen(PORT, () => {
    console.log(`APP запущен на порту ${PORT}`);
});