import { Body, Controller, Get, Query, Post, UseGuards, Req, UseInterceptors, Param, BadRequestException } from "@nestjs/common";
import { JwtAuth } from "src/authentication/jwt-authentication.guard";
// import { JwtAuth } from "src/authentication/jwt-authentication.guard";
import { TransactionInterceptor } from "src/middlewares/interceptor";
import { RequestItem } from "src/shared/decorators/request.decorator";
import { QueryRunner } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
  constructor (
    private readonly userService: UserService,
  ) {}

  @UseInterceptors(TransactionInterceptor)
  @Post()
  async create (@Body() user: CreateUserDto, @RequestItem('queryRunner') queryRunner: QueryRunner) {
    const dt = await this.userService.create(user, queryRunner)
    
    return dt
  }

  @Get('/email')
  async findByEmail (@Query('email') email) {
    return this.userService.getByEmail(email)
  }

  @Get()
  async findAll (@Param() params) {
    return this.userService.findAll({})
  }
}