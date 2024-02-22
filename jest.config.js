module.exports = {
    // Indicates which environment to use for testing
    testEnvironment: 'jest-environment-jsdom',

    "preset": "ts-jest",
    "transform": {
        "^.+\\.tsx?$": "babel-jest"
    },

    // Specify patterns for Jest to look for test files
    testMatch: [
        '**/__tests__/**/*.ts',
        '**/?(*.)+(spec|test).ts',
    ],

    // Configure Jest to collect coverage information
    collectCoverage: true,

    // Specify the directory where coverage reports will be stored
    coverageDirectory: 'coverage',

    // Specify the threshold for coverage
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
};

