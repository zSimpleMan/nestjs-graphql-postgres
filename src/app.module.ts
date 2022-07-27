import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { CompanyModule } from './company/company.module';
import { DepartmentModule } from './department/department.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthenticationModule,
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: 'schema.gql',
      debug: true,
      playground: true,
      driver: ApolloDriver,
    }),
    CompanyModule,
    DepartmentModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [AppService],
})
export class AppModule {}
