class Logger {
    static error(message: string, error: Error | unknown) {
        console.error(`[ERROR] ${message}`, error);
    }
}

export default Logger;
