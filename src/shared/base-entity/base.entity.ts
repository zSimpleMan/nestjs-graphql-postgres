import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, BaseEntity as BaseEntityORM } from "typeorm";

@ObjectType()
export class BaseEntity extends BaseEntityORM {
  @Field()
  @Column()
  status: number

  @Field()
  @Column({
    name: 'created_at'
  })
  createdAt: Date

  @Field()
  @Column({
    name: 'modified_at'
  })
  modifiedAt: Date

  @Field()
  @Column({
    name: 'created_by'
  })
  createdBy: number

  @Field()
  @Column({
    name: 'modified_by'
  })
  modifiedBy: number

  @Field()
  @Column({
    name: 'is_deleted'
  })
  isDeleted: boolean
}