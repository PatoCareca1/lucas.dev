const BASE_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:8000'}/api`;

export class HttpError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = 'HttpError';
        this.status = status;
    }
}

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
    const response = await fetch(`${BASE_URL}${path}`, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...init?.headers,
        },
    });

    if (!response.ok) {
        let detail = response.statusText;
        try {
            const body = await response.json();
            detail = body.detail ?? detail;
        } catch {
            // response had no JSON body — keep the status text
        }
        throw new HttpError(response.status, detail);
    }

    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
};

export const httpGet = <T>(path: string): Promise<T> => request<T>(path);

export const httpPost = <T>(path: string, body: unknown): Promise<T> =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) });
