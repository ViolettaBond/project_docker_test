import fs from 'fs/promises';

const FILE = './temporary.json';

export async function saveRequest(data) {
    let requests = [];

    try {
        const file = await fs.readFile(FILE, 'utf-8');
        requests = JSON.parse(file);
    } catch {
        requests = [];
    }

   const newRequest = {
    fullName: data.fullName,
    phone: data.phone,
    email: data.email,
    message: data.message,
};

    requests.push(newRequest);

    await fs.writeFile(FILE, JSON.stringify(requests, null, 4));

    return newRequest;
}

export async function clearTemporary() {
    await fs.writeFile(FILE, JSON.stringify([], null, 4));
}