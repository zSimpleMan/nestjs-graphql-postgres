import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from './role/role.module';
// import { UserRoleModule } from './user-role/user-role.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { TestModule } from './test/test.module';
import { TestModule as Test1Module} from './test1/test.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthenticationModule,
    ConfigModule.forRoot(),
    RoleModule,
    TestModule,
    Test1Module,
    // UserRoleModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: 'schema.gql',
      debug: true,
      playground: true,
      driver: ApolloDriver,
    }),
  ],
  controllers: [
    AppController,
  ],
  providers: [AppService],
})
export class AppModule {}
