const appConfig = process.env;

const configProvider = {
  provide: 'CONFIG',
  useFactory: () => {
    const options = {
      saltLength: appConfig.SALT_LENGTH ?? 10,
    };

    return options;
  },
};

export { configProvider };
