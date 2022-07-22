import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'nhathan',
        password: 'postgres',
        database: 'my_shop',
        entities: [
            __dirname + '/../**/entity/*.entity{.ts,.js}',
        ],
        logging: true,
        // synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];